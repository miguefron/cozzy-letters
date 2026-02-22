package com.cozyletters.backend.config;

import com.cozyletters.backend.model.User;
import com.cozyletters.backend.repository.UserRepository;
import com.cozyletters.backend.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Find or create user
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setDisplayName(name);
                // No password for OAuth2 users
                return userRepository.save(newUser);
            });

        // Generate JWT
        String token = jwtService.generateToken(email);

        // Redirect to frontend callback with token info
        String redirectUrl = String.format(
            frontendUrl + "/auth/callback?token=%s&email=%s&displayName=%s",
            URLEncoder.encode(token, StandardCharsets.UTF_8),
            URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8),
            URLEncoder.encode(user.getDisplayName(), StandardCharsets.UTF_8)
        );

        response.sendRedirect(redirectUrl);
    }
}
