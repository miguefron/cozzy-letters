package com.cozyletters.backend.repository;

import com.cozyletters.backend.model.LetterRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LetterRecipientRepository extends JpaRepository<LetterRecipient, Long> {

    List<LetterRecipient> findByRecipientEmailOrderByDeliveredAtDesc(String email);

    Optional<LetterRecipient> findByIdAndRecipientEmail(Long id, String email);
}
