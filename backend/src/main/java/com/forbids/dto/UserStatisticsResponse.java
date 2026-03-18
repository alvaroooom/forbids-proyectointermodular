package com.forbids.dto;

public class UserStatisticsResponse {
    private Long totalBids;
    private Long wonAuctions;
    private Double successRate;
    private Double totalSpent;
    private Long activeProducts;
    private Long closedProducts;
    private Long totalFavorites;
    private Long receivedBids;

    public UserStatisticsResponse() {
    }

    public UserStatisticsResponse(Long totalBids, Long wonAuctions, Double successRate,
                                 Double totalSpent, Long activeProducts, Long closedProducts,
                                 Long totalFavorites, Long receivedBids) {
        this.totalBids = totalBids;
        this.wonAuctions = wonAuctions;
        this.successRate = successRate;
        this.totalSpent = totalSpent;
        this.activeProducts = activeProducts;
        this.closedProducts = closedProducts;
        this.totalFavorites = totalFavorites;
        this.receivedBids = receivedBids;
    }

    // Getters and Setters
    public Long getTotalBids() {
        return totalBids;
    }

    public void setTotalBids(Long totalBids) {
        this.totalBids = totalBids;
    }

    public Long getWonAuctions() {
        return wonAuctions;
    }

    public void setWonAuctions(Long wonAuctions) {
        this.wonAuctions = wonAuctions;
    }

    public Double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Long getActiveProducts() {
        return activeProducts;
    }

    public void setActiveProducts(Long activeProducts) {
        this.activeProducts = activeProducts;
    }

    public Long getClosedProducts() {
        return closedProducts;
    }

    public void setClosedProducts(Long closedProducts) {
        this.closedProducts = closedProducts;
    }

    public Long getTotalFavorites() {
        return totalFavorites;
    }

    public void setTotalFavorites(Long totalFavorites) {
        this.totalFavorites = totalFavorites;
    }

    public Long getReceivedBids() {
        return receivedBids;
    }

    public void setReceivedBids(Long receivedBids) {
        this.receivedBids = receivedBids;
    }
}
