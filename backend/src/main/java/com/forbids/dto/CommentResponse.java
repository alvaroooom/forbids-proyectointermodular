package com.forbids.dto;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long userId;
    private Long parentCommentId;
    private String username;
    private String userProfileImageUrl;
    private String content;
    private LocalDateTime createdAt;

    public CommentResponse() {
    }

    public CommentResponse(Long id, Long userId, Long parentCommentId, String username, String userProfileImageUrl,
                          String content, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.parentCommentId = parentCommentId;
        this.username = username;
        this.userProfileImageUrl = userProfileImageUrl;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserProfileImageUrl() {
        return userProfileImageUrl;
    }

    public void setUserProfileImageUrl(String userProfileImageUrl) {
        this.userProfileImageUrl = userProfileImageUrl;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
