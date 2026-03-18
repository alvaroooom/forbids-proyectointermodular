package com.forbids.dto;

import com.forbids.model.Role;

public class AuthResponse {
    
    private Long id;
    private String username;
    private String email;
    private String profileImageUrl;
    private String token;
    private String message;
    private Role role;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String username, String email, String message) {
        this(id, username, email, null, null, null, message);
    }

    public AuthResponse(Long id, String username, String email, String token, String message) {
        this(id, username, email, null, token, null, message);
    }

    public AuthResponse(Long id, String username, String email, String profileImageUrl, String token, String message) {
        this(id, username, email, profileImageUrl, token, null, message);
    }

    public AuthResponse(Long id, String username, String email, String profileImageUrl, String token, Role role, String message) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.profileImageUrl = profileImageUrl;
        this.token = token;
        this.role = role;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
