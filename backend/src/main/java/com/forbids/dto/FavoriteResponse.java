package com.forbids.dto;

import java.time.LocalDateTime;

public class FavoriteResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productDescription;
    private String productImageUrl;
    private Double productCurrentPrice;
    private Boolean productClosed;
    private LocalDateTime productEndAt;
    private String productOwnerUsername;
    private String productCategory;
    private LocalDateTime createdAt;

    public FavoriteResponse() {
    }

    public FavoriteResponse(Long id, Long productId, String productTitle, String productDescription,
                           String productImageUrl, Double productCurrentPrice, Boolean productClosed,
                           LocalDateTime productEndAt, String productOwnerUsername, String productCategory, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.productImageUrl = productImageUrl;
        this.productCurrentPrice = productCurrentPrice;
        this.productClosed = productClosed;
        this.productEndAt = productEndAt;
        this.productOwnerUsername = productOwnerUsername;
        this.productCategory = productCategory;
        this.createdAt = createdAt;
    }

    // Getters y setters
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

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public Double getProductCurrentPrice() {
        return productCurrentPrice;
    }

    public void setProductCurrentPrice(Double productCurrentPrice) {
        this.productCurrentPrice = productCurrentPrice;
    }

    public Boolean getProductClosed() {
        return productClosed;
    }

    public void setProductClosed(Boolean productClosed) {
        this.productClosed = productClosed;
    }

    public LocalDateTime getProductEndAt() {
        return productEndAt;
    }

    public void setProductEndAt(LocalDateTime productEndAt) {
        this.productEndAt = productEndAt;
    }

    public String getProductOwnerUsername() {
        return productOwnerUsername;
    }

    public void setProductOwnerUsername(String productOwnerUsername) {
        this.productOwnerUsername = productOwnerUsername;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
