package com.cozyletters.backend.dto;

public class AdminLetterResponse {

    private final Long id;
    private final String title;
    private final String content;
    private final String senderName;
    private final String senderEmail;
    private final int recipientCount;
    private final String createdAt;

    public AdminLetterResponse(Long id, String title, String content, String senderName,
                               String senderEmail, int recipientCount, String createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.recipientCount = recipientCount;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getSenderName() { return senderName; }
    public String getSenderEmail() { return senderEmail; }
    public int getRecipientCount() { return recipientCount; }
    public String getCreatedAt() { return createdAt; }
}
