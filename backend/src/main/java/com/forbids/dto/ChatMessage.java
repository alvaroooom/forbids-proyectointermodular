package com.forbids.dto;

import java.time.Instant;

public class ChatMessage {
    private Long id;
    private Long productId;
    private String senderUsername;
    private String content;
    private String type; // CHAT or BID
    private Instant timestamp;

    public ChatMessage() {}

    public ChatMessage(Long productId, String senderUsername, String content, String type) {
        this.productId = productId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.type = type;
        this.timestamp = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
