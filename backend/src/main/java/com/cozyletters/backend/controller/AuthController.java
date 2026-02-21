package com.cozyletters.backend.controller;

import com.cozyletters.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
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
}
