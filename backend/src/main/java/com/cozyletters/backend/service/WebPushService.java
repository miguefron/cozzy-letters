package com.cozyletters.backend.service;

import com.cozyletters.backend.model.PushSubscription;
import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.PushSubscriptionRepository;
import com.cozyletters.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Security;
import java.util.List;
import java.util.Map;

@Service
public class WebPushService {

    private static final Logger log = LoggerFactory.getLogger(WebPushService.class);

    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.vapid.public-key:}")
    private String vapidPublicKey;

    @Value("${app.vapid.private-key:}")
    private String vapidPrivateKey;

    @Value("${app.vapid.subject:mailto:hello@cozyletters.com}")
    private String vapidSubject;

    private PushService pushService;
    private boolean enabled = false;

    public WebPushService(PushSubscriptionRepository pushSubscriptionRepository,
                          UserRepository userRepository,
                          ObjectMapper objectMapper) {
        this.pushSubscriptionRepository = pushSubscriptionRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        if (vapidPublicKey == null || vapidPublicKey.isBlank() ||
            vapidPrivateKey == null || vapidPrivateKey.isBlank()) {
            log.warn("VAPID keys not configured — Web Push disabled");
            return;
        }
        try {
            if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
            pushService = new PushService(vapidPublicKey, vapidPrivateKey, vapidSubject);
            enabled = true;
            log.info("Web Push service initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize Web Push service", e);
        }
    }

    @Transactional
    public void subscribe(String userEmail, String endpoint, String p256dh, String auth) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PushSubscription sub = pushSubscriptionRepository.findByEndpoint(endpoint)
                .orElseGet(PushSubscription::new);

        sub.setUser(user);
        sub.setEndpoint(endpoint);
        sub.setP256dh(p256dh);
        sub.setAuth(auth);
        pushSubscriptionRepository.save(sub);
    }

    @Transactional
    public void unsubscribe(String userEmail, String endpoint) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        pushSubscriptionRepository.deleteByUserIdAndEndpoint(user.getId(), endpoint);
    }

    @Transactional(readOnly = true)
    public void sendPushToUser(Long userId, String title, String body) {
        if (!enabled) {
            log.debug("Push not enabled, skipping for user {}", userId);
            return;
        }

        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByUserId(userId);
        log.info("Sending push to user {} — found {} subscription(s)", userId, subscriptions.size());
        for (PushSubscription sub : subscriptions) {
            try {
                String payload = objectMapper.writeValueAsString(
                    Map.of("title", title, "body", body, "url", "/inbox")
                );
                Notification notification = new Notification(
                    sub.getEndpoint(), sub.getP256dh(), sub.getAuth(), payload
                );
                var response = pushService.send(notification);
                int statusCode = response.getStatusLine().getStatusCode();
                log.info("Push sent to user {}, status: {}", userId, statusCode);
                if (statusCode == 410 || statusCode == 404) {
                    log.info("Push subscription expired ({}), removing: {}", statusCode, sub.getEndpoint());
                    pushSubscriptionRepository.delete(sub);
                }
            } catch (Exception e) {
                log.error("Failed to send push to endpoint: {}", sub.getEndpoint(), e);
            }
        }
    }
}
