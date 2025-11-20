package com.resumeverifier.backend.model;

import jakarta.persistence.*;
import lombok.Data;
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
}
