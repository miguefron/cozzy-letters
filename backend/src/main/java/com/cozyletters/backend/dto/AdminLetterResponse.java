package com.cozyletters.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AdminLetterResponse {

    private final Long id;
    private final String title;
    private final String content;
    private final String senderName;
    private final String senderEmail;
    private final int recipientCount;
    private final List<RecipientInfo> recipients;
    private final String createdAt;
    private final String signature;

    public AdminLetterResponse(Long id, String title, String content, String senderName,
                               String senderEmail, List<RecipientInfo> recipients, String createdAt, String signature) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.recipients = recipients;
        this.recipientCount = recipients.size();
        this.createdAt = createdAt;
        this.signature = signature;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getSenderName() { return senderName; }
    public String getSenderEmail() { return senderEmail; }
    public int getRecipientCount() { return recipientCount; }
    public List<RecipientInfo> getRecipients() { return recipients; }
    public String getCreatedAt() { return createdAt; }
    public String getSignature() { return signature; }

    public static class RecipientInfo {
        private final String displayName;
        private final String email;
        private final boolean isRead;

        public RecipientInfo(String displayName, String email, boolean isRead) {
            this.displayName = displayName;
            this.email = email;
            this.isRead = isRead;
        }

        public String getDisplayName() { return displayName; }
        public String getEmail() { return email; }

        @JsonProperty("isRead")
        public boolean isRead() { return isRead; }
    }
}
