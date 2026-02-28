package com.cozyletters.backend.controller;

import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.UserRepository;
import com.cozyletters.backend.service.SseService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sse")
public class SseController {

    private final SseService sseService;
    private final UserRepository userRepository;

    public SseController(SseService sseService, UserRepository userRepository) {
        this.sseService = sseService;
        this.userRepository = userRepository;
    }

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sseService.subscribe(user.getId());
    }
}
