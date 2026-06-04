package com.forbids.service;

import com.forbids.exception.UnauthorizedException;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import com.forbids.security.AuthenticatedUser;
import com.forbids.security.UserPrincipalService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class AuthContextService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserPrincipalService userPrincipalService;

    public AuthContextService(
            JwtService jwtService,
            UserRepository userRepository,
            UserPrincipalService userPrincipalService
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userPrincipalService = userPrincipalService;
    }

    public String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Cabecera de autorización ausente o inválida");
        }

        String token = authorizationHeader.substring(7).trim();
        if (token.isBlank()) {
            throw new UnauthorizedException("Token ausente");
        }

        return token;
    }

    public String getCurrentBearerToken() {
        var attributes = RequestContextHolder.getRequestAttributes();
        if (attributes instanceof ServletRequestAttributes servletAttributes) {
            return extractBearerToken(servletAttributes.getRequest().getHeader("Authorization"));
        }

        throw new UnauthorizedException("Cabecera de autorización ausente o inválida");
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser principal) {
            return userPrincipalService.loadUserEntity(principal);
        }

        throw new UnauthorizedException("Cabecera de autorización ausente o inválida");
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public User getAuthenticatedUserFromToken(String token) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Token ausente");
        }

        if (!jwtService.isTokenValid(token)) {
            throw new UnauthorizedException("Token inválido o caducado");
        }

        String username = jwtService.extractUsername(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));
    }
}
