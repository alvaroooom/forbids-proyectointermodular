package com.forbids.controller;

import com.forbids.dto.AuthResponse;
import com.forbids.dto.LoginRequest;
import com.forbids.dto.RegisterRequest;
import com.forbids.dto.UpdateProfileRequest;
import com.forbids.model.User;
import com.forbids.service.AuthContextService;
import com.forbids.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthContextService authContextService;

    public AuthController(AuthService authService, AuthContextService authContextService) {
        this.authService = authService;
        this.authContextService = authContextService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        User user = authContextService.getCurrentUser();
        String token = authContextService.getCurrentBearerToken();
        AuthResponse response = authService.toAuthResponse(user, token, "Token válido");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        String token = authContextService.getCurrentBearerToken();
        AuthResponse response = authService.updateProfile(token, request);
        return ResponseEntity.ok(response);
    }
}
