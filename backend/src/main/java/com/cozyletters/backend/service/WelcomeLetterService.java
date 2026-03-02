package com.cozyletters.backend.service;

import com.cozyletters.backend.model.*;
import com.cozyletters.backend.repository.LetterRepository;
import com.cozyletters.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class WelcomeLetterService {

    public static final String SYSTEM_USER_EMAIL = "hello@cozyletters.com";

    private final UserRepository userRepository;
    private final LetterRepository letterRepository;

    private User systemUser;

    public WelcomeLetterService(UserRepository userRepository, LetterRepository letterRepository) {
        this.userRepository = userRepository;
        this.letterRepository = letterRepository;
    }

    private User ensureSystemUser() {
        if (systemUser == null) {
            systemUser = userRepository.findByEmail(SYSTEM_USER_EMAIL)
                    .orElseGet(() -> {
                        User user = new User();
                        user.setEmail(SYSTEM_USER_EMAIL);
                        user.setDisplayName("CozyLetters");
                        user.setRole(Role.USER);
                        return userRepository.save(user);
                    });
        }
        return systemUser;
    }

    public void sendWelcomeLetter(User newUser) {
        User sender = ensureSystemUser();

        Letter letter = new Letter();
        letter.setSender(sender);
        letter.setTitle("Welcome to CozyLetters!");
        letter.setSignature("The CozyLetters Team");
        letter.setContent(
                "<h2>Hey " + newUser.getDisplayName() + ", welcome! 🎉</h2>"
                + "<p>We're so glad you're here.</p>"
                + "<p><strong>CozyLetters</strong> is a place where handwritten thoughts travel to unexpected places. "
                + "Every letter you write reaches <em>5 random people</em> — strangers who might just need your words today.</p>"
                + "<p>So grab a warm drink, settle in, and write your first letter whenever you're ready. ☕✉️</p>"
        );

        LetterRecipient recipient = new LetterRecipient();
        recipient.setLetter(letter);
        recipient.setRecipient(newUser);
        letter.getRecipients().add(recipient);

        letterRepository.save(letter);
    }
}
