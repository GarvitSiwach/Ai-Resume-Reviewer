package com.resumeverifier.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeverifier.backend.model.Resume;
import com.resumeverifier.backend.model.VerificationResult;
import com.resumeverifier.backend.repository.ResumeRepository;
import com.resumeverifier.backend.repository.VerificationResultRepository;
import com.resumeverifier.backend.service.AiClientService;
import com.resumeverifier.backend.service.PdfExtractionService;
import com.resumeverifier.backend.service.ScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow all origins for simplicity in dev
public class ResumeController {

    private final PdfExtractionService pdfExtractionService;
    private final AiClientService aiClientService;
    private final ScoringService scoringService;
    private final ResumeRepository resumeRepository;
    private final VerificationResultRepository verificationResultRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        String text = pdfExtractionService.extractText(file);

        Resume resume = new Resume();
        resume.setFilename(file.getOriginalFilename());
        resume.setExtractedText(text);
        // In a real app, we might extract entities here using OpenNLP or similar,
        // but for now we'll pass the text to the AI service later.
        resume.setExtractedEntitiesJson("{}");

        Resume savedResume = resumeRepository.save(resume);
        return ResponseEntity.ok(savedResume);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable UUID id) {
        return resumeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<VerificationResult> verifyResume(@PathVariable UUID id) {
        return resumeRepository.findById(id).map(resume -> {
            // Call AI Service
            Map aiResponse = aiClientService.verifyResume(resume.getExtractedText(), resume.getExtractedEntitiesJson())
                    .block();

            Double score = scoringService.calculateTruthScore(aiResponse);

            VerificationResult result = new VerificationResult();
            result.setResumeId(resume.getId());
            result.setTruthScore(score);

            try {
                result.setSuspiciousJson(objectMapper.writeValueAsString(aiResponse.get("suspiciousPoints")));
                result.setQuestionsJson(objectMapper.writeValueAsString(aiResponse.get("followupQuestions")));
            } catch (Exception e) {
                throw new RuntimeException("Error processing JSON", e);
            }

            return ResponseEntity.ok(verificationResultRepository.save(result));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<VerificationResult> getReport(@PathVariable UUID id) {
        return verificationResultRepository.findByResumeId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
