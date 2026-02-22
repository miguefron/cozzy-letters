package com.cozyletters.backend.dto;

public class AuthResponse {

    private final String token;
    private final String email;
    private final String displayName;
    private final String role;

    public AuthResponse(String token, String email, String displayName, String role) {
        this.token = token;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getRole() { return role; }
}
