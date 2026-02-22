package com.cozyletters.backend.service;

import com.cozyletters.backend.dto.AdminLetterResponse;
import com.cozyletters.backend.dto.AdminUserResponse;
import com.cozyletters.backend.model.Letter;
import com.cozyletters.backend.model.Role;
import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.LetterRepository;
import com.cozyletters.backend.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final LetterRepository letterRepository;
    private final UserRepository userRepository;

    public AdminService(LetterRepository letterRepository, UserRepository userRepository) {
        this.letterRepository = letterRepository;
        this.userRepository = userRepository;
    }

    public List<AdminLetterResponse> getAllLetters() {
        List<Letter> letters = letterRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return letters.stream().map(letter -> new AdminLetterResponse(
                letter.getId(),
                letter.getTitle(),
                letter.getContent(),
                letter.getSender().getDisplayName(),
                letter.getSender().getEmail(),
                letter.getRecipients().size(),
                letter.getCreatedAt().toString()
        )).toList();
    }

    @Transactional
    public void deleteLetter(Long letterId) {
        Letter letter = letterRepository.findById(letterId)
                .orElseThrow(() -> new RuntimeException("Letter not found"));
        letterRepository.delete(letter);
    }

    public List<AdminUserResponse> getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return users.stream().map(user -> new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name(),
                user.getPasswordHash() != null,
                user.getCreatedAt().toString()
        )).toList();
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot delete an admin user");
        }
        userRepository.delete(user);
    }
}
