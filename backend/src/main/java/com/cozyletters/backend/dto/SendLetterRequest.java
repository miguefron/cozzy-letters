package com.cozyletters.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SendLetterRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    public SendLetterRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    private String signature;

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }

    private Long recipientId;

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
}
