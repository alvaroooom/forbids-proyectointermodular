package com.forbids.controller;

import com.forbids.dto.FavoriteResponse;
import com.forbids.service.AuthContextService;
import com.forbids.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final AuthContextService authContextService;

    public FavoriteController(FavoriteService favoriteService, AuthContextService authContextService) {
        this.favoriteService = favoriteService;
        this.authContextService = authContextService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addFavorite(@PathVariable Long productId) {
        Long userId = authContextService.getCurrentUserId();
        favoriteService.addFavorite(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Producto añadido a favoritos"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFavorite(@PathVariable Long productId) {
        Long userId = authContextService.getCurrentUserId();
        favoriteService.removeFavorite(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado de favoritos"));
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getUserFavorites() {
        Long userId = authContextService.getCurrentUserId();
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Long productId) {
        Long userId = authContextService.getCurrentUserId();
        boolean isFavorite = favoriteService.isFavorite(userId, productId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping("/count/{productId}")
    public ResponseEntity<Map<String, Long>> getFavoriteCount(@PathVariable Long productId) {
        long count = favoriteService.getFavoriteCount(productId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
