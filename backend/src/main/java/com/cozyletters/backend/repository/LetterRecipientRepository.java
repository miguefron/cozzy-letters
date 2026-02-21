package com.cozyletters.backend.repository;

import com.cozyletters.backend.model.LetterRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LetterRecipientRepository extends JpaRepository<LetterRecipient, Long> {
}
