package com.cozyletters.backend.dto;

import java.time.LocalDateTime;

public class NewLetterNotification {

    private Long letterRecipientId;
    private Long letterId;
    private String title;
    private String senderName;
    private LocalDateTime deliveredAt;

    public NewLetterNotification() {}

    public NewLetterNotification(Long letterRecipientId, Long letterId, String title, String senderName, LocalDateTime deliveredAt) {
        this.letterRecipientId = letterRecipientId;
        this.letterId = letterId;
        this.title = title;
        this.senderName = senderName;
        this.deliveredAt = deliveredAt;
    }

    public Long getLetterRecipientId() { return letterRecipientId; }
    public void setLetterRecipientId(Long letterRecipientId) { this.letterRecipientId = letterRecipientId; }

    public Long getLetterId() { return letterId; }
    public void setLetterId(Long letterId) { this.letterId = letterId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
}
