package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.LetterResponse;
import com.cozyletters.backend.dto.SendLetterRequest;
import com.cozyletters.backend.service.LetterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/letters")
public class LetterController {

    private final LetterService letterService;

    public LetterController(LetterService letterService) {
        this.letterService = letterService;
    }

    @PostMapping
    public ResponseEntity<LetterResponse> sendLetter(
            Authentication authentication,
            @Valid @RequestBody SendLetterRequest request) {

        String email = authentication.getName();
        LetterResponse response = letterService.sendLetter(email, request.getTitle(), request.getContent());
        return ResponseEntity.ok(response);
    }
}
