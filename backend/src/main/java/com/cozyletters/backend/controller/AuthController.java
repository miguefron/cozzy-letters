package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.*;
import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.UserRepository;
import com.cozyletters.backend.security.JwtService;
import com.cozyletters.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(JwtService jwtService, AuthService authService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/dev-token")
    public ResponseEntity<Map<String, String>> devToken(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "email is required"));
        }
        String token = jwtService.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
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
                user.getRole().name()));
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
                user.getRole().name()));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        String email = authentication.getName();
        authService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}
