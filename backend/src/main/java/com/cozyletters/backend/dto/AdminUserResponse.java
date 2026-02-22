package com.cozyletters.backend.dto;

public class AdminUserResponse {

    private final Long id;
    private final String email;
    private final String displayName;
    private final String role;
    private final boolean hasPassword;
    private final String createdAt;

    public AdminUserResponse(Long id, String email, String displayName, String role,
                             boolean hasPassword, String createdAt) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.hasPassword = hasPassword;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getRole() { return role; }
    public boolean isHasPassword() { return hasPassword; }
    public String getCreatedAt() { return createdAt; }
}
