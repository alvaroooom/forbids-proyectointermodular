package com.forbids.dto;

import java.time.LocalDateTime;

public class ProductChatMessageResponse {

    private Long id;
    private Long productId;
    private String senderUsername;
    private String content;
    private LocalDateTime createdAt;

    public ProductChatMessageResponse(
            Long id,
            Long productId,
            String senderUsername,
            String content,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.productId = productId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
