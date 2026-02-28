package com.cozyletters.backend.service;

import com.cozyletters.backend.dto.InboxLetterResponse;
import com.cozyletters.backend.dto.LetterResponse;
import com.cozyletters.backend.dto.NewLetterNotification;
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
    private final SseService sseService;

    public LetterService(UserRepository userRepository, LetterRepository letterRepository,
                         LetterRecipientRepository letterRecipientRepository, SseService sseService) {
        this.userRepository = userRepository;
        this.letterRepository = letterRepository;
        this.letterRecipientRepository = letterRecipientRepository;
        this.sseService = sseService;
    }

    @Transactional
    public LetterResponse sendLetter(String senderEmail, String title, String content, Long recipientId) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found with email: " + senderEmail));

        Letter letter = new Letter();
        letter.setSender(sender);
        letter.setTitle(title);
        letter.setContent(content);

        if (recipientId != null) {
            User recipient = userRepository.findById(recipientId)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
            if (!recipient.isSearchable()) {
                throw new RuntimeException("This user is not available for direct messages.");
            }
            if (recipient.getId().equals(sender.getId())) {
                throw new RuntimeException("You cannot send a letter to yourself.");
            }
            LetterRecipient lr = new LetterRecipient();
            lr.setLetter(letter);
            lr.setRecipient(recipient);
            letter.getRecipients().add(lr);
        } else {
            List<User> randomRecipients = userRepository.findRandomUsersExcluding(sender.getId(), 5);
            if (randomRecipients.isEmpty()) {
                throw new RuntimeException("No recipients available. Try again later when more users have joined.");
            }
            for (User recipient : randomRecipients) {
                LetterRecipient lr = new LetterRecipient();
                lr.setLetter(letter);
                lr.setRecipient(recipient);
                letter.getRecipients().add(lr);
            }
        }

        Letter saved = letterRepository.save(letter);

        for (LetterRecipient lr : saved.getRecipients()) {
            NewLetterNotification notification = new NewLetterNotification(
                    lr.getId(),
                    saved.getId(),
                    saved.getTitle(),
                    sender.getDisplayName(),
                    lr.getDeliveredAt()
            );
            sseService.sendEvent(lr.getRecipient().getId(), "new_letter", notification);
        }

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
