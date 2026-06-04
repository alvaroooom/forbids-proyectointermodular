package com.forbids.security;

import com.forbids.exception.ForbiddenException;
import com.forbids.exception.UnauthorizedException;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserPrincipalService {

    private final UserRepository userRepository;

    public UserPrincipalService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthenticatedUser loadByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        if (user.isBanned()) {
            throw new ForbiddenException("Cuenta suspendida");
        }

        return new AuthenticatedUser(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    public User loadUserEntity(AuthenticatedUser principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));
        if (user.isBanned()) {
            throw new ForbiddenException("Cuenta suspendida");
        }
        return user;
    }
}
