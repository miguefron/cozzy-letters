package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.*;
import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.UserRepository;
import com.cozyletters.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthService.AuthResult result = authService.register(
                request.getEmail(), request.getPassword(), request.getDisplayName());
        return ResponseEntity.ok(new AuthResponse(result.token(), result.email(), result.displayName(), result.role()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthResult result = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(result.token(), result.email(), result.displayName(), result.role()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserProfileResponse(
                user.getEmail(),
                user.getDisplayName(),
                user.getPasswordHash() != null,
                user.getCreatedAt().toString(),
                user.getRole().name(),
                user.isSearchable()));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        User user = authService.updateDisplayName(email, request.getDisplayName());
        return ResponseEntity.ok(new UserProfileResponse(
                user.getEmail(),
                user.getDisplayName(),
                user.getPasswordHash() != null,
                user.getCreatedAt().toString(),
                user.getRole().name(),
                user.isSearchable()));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        String email = authentication.getName();
        authService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me/searchable")
    public ResponseEntity<UserProfileResponse> updateSearchable(
            Authentication authentication,
            @RequestBody Map<String, Boolean> request) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Boolean searchable = request.get("searchable");
        if (searchable != null) {
            user.setSearchable(searchable);
            userRepository.save(user);
        }
        return ResponseEntity.ok(new UserProfileResponse(
                user.getEmail(),
                user.getDisplayName(),
                user.getPasswordHash() != null,
                user.getCreatedAt().toString(),
                user.getRole().name(),
                user.isSearchable()));
    }
}
