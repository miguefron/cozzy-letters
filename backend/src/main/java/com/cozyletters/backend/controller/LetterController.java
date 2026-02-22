package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.InboxLetterResponse;
import com.cozyletters.backend.dto.LetterResponse;
import com.cozyletters.backend.dto.SendLetterRequest;
import com.cozyletters.backend.service.LetterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/inbox")
    public ResponseEntity<List<InboxLetterResponse>> getInbox(Authentication authentication) {
        String email = authentication.getName();
        List<InboxLetterResponse> inbox = letterService.getInbox(email);
        return ResponseEntity.ok(inbox);
    }

    @PatchMapping("/inbox/{id}/read")
    public ResponseEntity<Void> markAsRead(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        letterService.markAsRead(email, id);
        return ResponseEntity.noContent().build();
    }
}
