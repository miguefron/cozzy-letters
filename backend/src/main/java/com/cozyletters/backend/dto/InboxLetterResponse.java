package com.cozyletters.backend.dto;

import com.cozyletters.backend.model.LetterRecipient;

import java.time.LocalDateTime;

public class InboxLetterResponse {

    private Long id;
    private Long letterId;
    private String title;
    private String content;
    private String senderName;
    private boolean isRead;
    private LocalDateTime deliveredAt;

    public InboxLetterResponse() {}

    public InboxLetterResponse(LetterRecipient lr) {
        this.id = lr.getId();
        this.letterId = lr.getLetter().getId();
        this.title = lr.getLetter().getTitle();
        this.content = lr.getLetter().getContent();
        this.senderName = lr.getLetter().getSender().getDisplayName();
        this.isRead = lr.isRead();
        this.deliveredAt = lr.getDeliveredAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLetterId() { return letterId; }
    public void setLetterId(Long letterId) { this.letterId = letterId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
}
