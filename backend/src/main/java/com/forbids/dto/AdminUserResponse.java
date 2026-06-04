package com.forbids.dto;

import com.forbids.model.Role;

public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean banned;

    public AdminUserResponse(
            Long id,
            String username,
            String email,
            Role role,
            boolean banned
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.banned = banned;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public boolean isBanned() {
        return banned;
    }
}
