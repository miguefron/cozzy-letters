package com.cozyletters.backend.dto;

public class AuthResponse {

    private final String token;
    private final String email;
    private final String displayName;

    public AuthResponse(String token, String email, String displayName) {
        this.token = token;
        this.email = email;
        this.displayName = displayName;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
}
