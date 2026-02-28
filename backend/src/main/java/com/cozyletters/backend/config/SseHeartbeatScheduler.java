package com.cozyletters.backend.config;

import com.cozyletters.backend.service.SseService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class SseHeartbeatScheduler {

    private final SseService sseService;

    public SseHeartbeatScheduler(SseService sseService) {
        this.sseService = sseService;
    }

    @Scheduled(fixedRate = 30000)
    public void heartbeat() {
        sseService.sendHeartbeat();
    }
}
