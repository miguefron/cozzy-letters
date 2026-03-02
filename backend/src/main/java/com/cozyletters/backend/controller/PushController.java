package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.PushSubscribeRequest;
import com.cozyletters.backend.service.WebPushService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/push")
public class PushController {

    private final WebPushService webPushService;

    public PushController(WebPushService webPushService) {
        this.webPushService = webPushService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@Valid @RequestBody PushSubscribeRequest request,
                                           Authentication auth) {
        webPushService.subscribe(auth.getName(), request.endpoint(), request.p256dh(), request.auth());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/subscribe")
    public ResponseEntity<Void> unsubscribe(@RequestParam String endpoint,
                                             Authentication auth) {
        webPushService.unsubscribe(auth.getName(), endpoint);
        return ResponseEntity.ok().build();
    }
}
