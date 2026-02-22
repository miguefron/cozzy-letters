package com.cozyletters.backend.service;

import com.cozyletters.backend.dto.InboxLetterResponse;
import com.cozyletters.backend.dto.LetterResponse;
import com.cozyletters.backend.model.Letter;
import com.cozyletters.backend.model.LetterRecipient;
import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.LetterRecipientRepository;
import com.cozyletters.backend.repository.LetterRepository;
import com.cozyletters.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LetterService {

    private final UserRepository userRepository;
    private final LetterRepository letterRepository;
    private final LetterRecipientRepository letterRecipientRepository;

    public LetterService(UserRepository userRepository, LetterRepository letterRepository,
                         LetterRecipientRepository letterRecipientRepository) {
        this.userRepository = userRepository;
        this.letterRepository = letterRepository;
        this.letterRecipientRepository = letterRecipientRepository;
    }

    @Transactional
    public LetterResponse sendLetter(String senderEmail, String title, String content) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found with email: " + senderEmail));

        List<User> randomRecipients = userRepository.findRandomUsersExcluding(sender.getId(), 5);

        if (randomRecipients.isEmpty()) {
            throw new RuntimeException("No recipients available. Try again later when more users have joined.");
        }

        Letter letter = new Letter();
        letter.setSender(sender);
        letter.setTitle(title);
        letter.setContent(content);

        for (User recipient : randomRecipients) {
            LetterRecipient lr = new LetterRecipient();
            lr.setLetter(letter);
            lr.setRecipient(recipient);
            letter.getRecipients().add(lr);
        }

        Letter saved = letterRepository.save(letter);

        return new LetterResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getContent(),
                sender.getDisplayName(),
                saved.getRecipients().size(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<InboxLetterResponse> getInbox(String recipientEmail) {
        List<LetterRecipient> recipients =
                letterRecipientRepository.findByRecipientEmailOrderByDeliveredAtDesc(recipientEmail);
        return recipients.stream().map(InboxLetterResponse::new).toList();
    }

    @Transactional
    public void markAsRead(String recipientEmail, Long recipientId) {
        LetterRecipient lr = letterRecipientRepository.findByIdAndRecipientEmail(recipientId, recipientEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        lr.setRead(true);
        letterRecipientRepository.save(lr);
    }
}
