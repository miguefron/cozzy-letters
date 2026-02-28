package com.cozyletters.backend.dto;

public class UserProfileResponse {

    private final String email;
    private final String displayName;
    private final boolean hasPassword;
    private final String createdAt;
    private final String role;
    private final boolean searchable;

    public UserProfileResponse(String email, String displayName, boolean hasPassword, String createdAt, String role, boolean searchable) {
        this.email = email;
        this.displayName = displayName;
        this.hasPassword = hasPassword;
        this.createdAt = createdAt;
        this.role = role;
        this.searchable = searchable;
    }

    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public boolean isHasPassword() { return hasPassword; }
    public String getCreatedAt() { return createdAt; }
    public String getRole() { return role; }
    public boolean isSearchable() { return searchable; }
}
