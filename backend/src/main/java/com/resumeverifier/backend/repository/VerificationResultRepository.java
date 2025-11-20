package com.resumeverifier.backend.repository;

import com.resumeverifier.backend.model.VerificationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface VerificationResultRepository extends JpaRepository<VerificationResult, UUID> {
    Optional<VerificationResult> findByResumeId(UUID resumeId);
}
