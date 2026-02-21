package com.cozyletters.backend.repository;

import com.cozyletters.backend.model.Letter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LetterRepository extends JpaRepository<Letter, Long> {
}
