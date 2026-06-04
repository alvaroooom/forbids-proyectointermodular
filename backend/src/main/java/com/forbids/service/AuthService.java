package com.forbids.service;

import com.forbids.dto.AuthResponse;
import com.forbids.dto.LoginRequest;
import com.forbids.dto.RegisterRequest;
import com.forbids.exception.BadRequestException;
import com.forbids.exception.ForbiddenException;
import com.forbids.exception.UnauthorizedException;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("El nombre de usuario ya existe");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El correo electrónico ya existe");
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
            "Usuario registrado correctamente"
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();

        User user = userRepository.findByUsername(identifier)
            .or(() -> userRepository.findByEmail(identifier))
            .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        if (user.isBanned()) {
            throw new ForbiddenException("Cuenta suspendida");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl(),
            token,
            user.getRole(),
            "Inicio de sesión correcto"
        );
    }

    public AuthResponse updateProfile(String token, com.forbids.dto.UpdateProfileRequest request) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Token ausente");
        }

        if (!jwtService.isTokenValid(token)) {
            throw new UnauthorizedException("Token inválido o caducado");
        }

        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        boolean updated = false;

        // Actualizar username
        if (request.getUsername() != null && !request.getUsername().isBlank() 
            && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("El nombre de usuario ya existe");
            }
            user.setUsername(request.getUsername());
            updated = true;
        }

        // Actualizar email
        if (request.getEmail() != null && !request.getEmail().isBlank()
            && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("El correo electrónico ya existe");
            }
            user.setEmail(request.getEmail());
            updated = true;
        }

        // Actualizar contraseña
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BadRequestException("Debes indicar la contraseña actual para cambiarla");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("La contraseña actual es incorrecta");
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
            "Perfil actualizado correctamente"
        );
    }

    public AuthResponse toAuthResponse(User user, String token, String message) {
        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl(),
            token,
            user.getRole(),
            message
        );
    }
}
