package com.cozyletters.backend.dto;

public class UserProfileResponse {

    private final String email;
    private final String displayName;

    public UserProfileResponse(String email, String displayName) {
        this.email = email;
        this.displayName = displayName;
    }

    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
}
