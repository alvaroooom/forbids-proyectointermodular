package com.forbids.service;

import com.forbids.dto.AuthResponse;
import com.forbids.dto.LoginRequest;
import com.forbids.dto.RegisterRequest;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
            request.getUsername(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword())
        );

        user = userRepository.save(user);
        String token = jwtService.generateToken(user);

        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl(),
            token,
            user.getRole(),
            "User registered successfully"
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();

        User user = userRepository.findByUsername(identifier)
            .or(() -> userRepository.findByEmail(identifier))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl(),
            token,
            user.getRole(),
            "Login successful"
        );
    }

    public AuthResponse validateTokenAndGetUser(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Missing token");
        }

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String username = jwtService.extractUsername(token);

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl(),
            token,
            user.getRole(),
            "Token valid"
        );
    }

    public AuthResponse updateProfile(String token, com.forbids.dto.UpdateProfileRequest request) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Missing token");
        }

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        boolean updated = false;

        // Actualizar username
        if (request.getUsername() != null && !request.getUsername().isBlank() 
            && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(request.getUsername());
            updated = true;
        }

        // Actualizar email
        if (request.getEmail() != null && !request.getEmail().isBlank()
            && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
            updated = true;
        }

        // Actualizar contraseña
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new RuntimeException("Current password is required to change password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            updated = true;
        }

        // Actualizar imagen de perfil
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl().isBlank() ? null : request.getProfileImageUrl());
            updated = true;
        }

        if (updated) {
            user = userRepository.save(user);
        }

        // Generar nuevo token si cambió el username
        String newToken = request.getUsername() != null && !request.getUsername().isBlank()
            ? jwtService.generateToken(user)
            : token;

        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl(),
            newToken,
            user.getRole(),
            "Profile updated successfully"
        );
    }
}
