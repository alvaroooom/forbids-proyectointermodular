package com.forbids.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BidResponse {

    private Long id;
    private Long productId;
    private Long bidderId;
    private String bidderUsername;
    private BigDecimal amount;
    private String imageUrl;
    private LocalDateTime createdAt;

    public BidResponse() {
    }

    public BidResponse(
            Long id,
            Long productId,
            Long bidderId,
            String bidderUsername,
            BigDecimal amount,
            String imageUrl,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.productId = productId;
        this.bidderId = bidderId;
        this.bidderUsername = bidderUsername;
        this.amount = amount;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
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

    public Long getBidderId() {
        return bidderId;
    }

    public void setBidderId(Long bidderId) {
        this.bidderId = bidderId;
    }

    public String getBidderUsername() {
        return bidderUsername;
    }

    public void setBidderUsername(String bidderUsername) {
        this.bidderUsername = bidderUsername;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
