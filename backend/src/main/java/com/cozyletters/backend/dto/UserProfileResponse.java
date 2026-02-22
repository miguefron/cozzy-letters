package com.cozyletters.backend.dto;

public class UserProfileResponse {

    private final String email;
    private final String displayName;
    private final boolean hasPassword;
    private final String createdAt;

    public UserProfileResponse(String email, String displayName, boolean hasPassword, String createdAt) {
        this.email = email;
        this.displayName = displayName;
        this.hasPassword = hasPassword;
        this.createdAt = createdAt;
    }

    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public boolean isHasPassword() { return hasPassword; }
    public String getCreatedAt() { return createdAt; }
}
