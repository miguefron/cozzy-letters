package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.UserSearchResponse;
import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> searchUsers(
            Authentication authentication,
            @RequestParam("q") String query) {

        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.badRequest().build();
        }

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> results = userRepository.findByDisplayNameContainingIgnoreCaseAndSearchableTrueAndIdNot(
                query.trim(), currentUser.getId(), PageRequest.of(0, 10));

        List<UserSearchResponse> response = results.stream()
                .map(u -> new UserSearchResponse(u.getId(), u.getDisplayName()))
                .toList();

        return ResponseEntity.ok(response);
    }
}
