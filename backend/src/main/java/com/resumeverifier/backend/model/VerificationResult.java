package com.resumeverifier.backend.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "verification_results")
public class VerificationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID resumeId;

    private Double truthScore;

    @Column(columnDefinition = "TEXT")
    private String suspiciousJson;

    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public List<String> getSuspiciousPoints() {
        try {
            return objectMapper.readValue(suspiciousJson, new TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return List.of();
        }
    }

    public List<String> getFollowUpQuestions() {
        try {
            return objectMapper.readValue(questionsJson, new TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return List.of();
        }
    }
}
