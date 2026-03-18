package com.forbids.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal startingPrice;
    private String imageUrl;
    private String category;
    private BigDecimal currentPrice;
    private Long bidsCount;
    private Long favoritesCount;
    private Long commentsCount;
    private Boolean closed;
    private LocalDateTime closedAt;
    private LocalDateTime endAt;
    private Long ownerId;
    private String ownerUsername;
    private Long winnerId;
    private String winnerUsername;
    private LocalDateTime createdAt;

    public ProductResponse() {
    }

    public ProductResponse(
            Long id,
            String title,
            String description,
            BigDecimal startingPrice,
            String imageUrl,
            String category,
            BigDecimal currentPrice,
            Long bidsCount,
            Long favoritesCount,
            Long commentsCount,
            Boolean closed,
            LocalDateTime closedAt,
            LocalDateTime endAt,
            Long ownerId,
            String ownerUsername,
            Long winnerId,
            String winnerUsername,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startingPrice = startingPrice;
        this.imageUrl = imageUrl;
        this.category = category;
        this.currentPrice = currentPrice;
        this.bidsCount = bidsCount;
        this.favoritesCount = favoritesCount;
        this.commentsCount = commentsCount;
        this.closed = closed;
        this.closedAt = closedAt;
        this.endAt = endAt;
        this.ownerId = ownerId;
        this.ownerUsername = ownerUsername;
        this.winnerId = winnerId;
        this.winnerUsername = winnerUsername;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Long getBidsCount() {
        return bidsCount;
    }

    public void setBidsCount(Long bidsCount) {
        this.bidsCount = bidsCount;
    }

    public Long getFavoritesCount() {
        return favoritesCount;
    }

    public void setFavoritesCount(Long favoritesCount) {
        this.favoritesCount = favoritesCount;
    }

    public Long getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(Long commentsCount) {
        this.commentsCount = commentsCount;
    }

    public Boolean getClosed() {
        return closed;
    }

    public void setClosed(Boolean closed) {
        this.closed = closed;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public Long getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(Long winnerId) {
        this.winnerId = winnerId;
    }

    public String getWinnerUsername() {
        return winnerUsername;
    }

    public void setWinnerUsername(String winnerUsername) {
        this.winnerUsername = winnerUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
