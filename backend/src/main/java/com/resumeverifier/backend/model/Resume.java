package com.resumeverifier.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String filename;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @Column(columnDefinition = "TEXT") // Storing JSON as text for simplicity in this setup
    private String extractedEntitiesJson;
}
