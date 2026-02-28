package com.cozyletters.backend.dto;

public class UserSearchResponse {

    private Long id;
    private String displayName;

    public UserSearchResponse() {}

    public UserSearchResponse(Long id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
