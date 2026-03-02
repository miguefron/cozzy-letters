package com.cozyletters.backend.dto;

import java.time.LocalDateTime;

public class LetterResponse {

    private Long id;
    private String title;
    private String content;
    private String senderName;
    private int recipientCount;
    private LocalDateTime createdAt;
    private String signature;

    public LetterResponse() {}

    public LetterResponse(Long id, String title, String content, String senderName, int recipientCount, LocalDateTime createdAt, String signature) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.senderName = senderName;
        this.recipientCount = recipientCount;
        this.createdAt = createdAt;
        this.signature = signature;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public int getRecipientCount() { return recipientCount; }
    public void setRecipientCount(int recipientCount) { this.recipientCount = recipientCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
}
