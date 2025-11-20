package com.resumeverifier.backend.repository;

import com.resumeverifier.backend.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ResumeRepository extends JpaRepository<Resume, UUID> {
}
