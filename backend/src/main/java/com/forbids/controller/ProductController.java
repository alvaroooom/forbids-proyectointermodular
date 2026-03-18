package com.forbids.controller;

import com.forbids.dto.CreateProductRequest;
import com.forbids.dto.ProductResponse;
import com.forbids.model.Role;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import com.forbids.service.JwtService;
import com.forbids.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public ProductController(ProductService productService, JwtService jwtService, UserRepository userRepository) {
        this.productService = productService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllProductsForAdmin(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            User authenticatedUser = getAuthenticatedUser(authorizationHeader);
            
            // Verificar que el usuario sea administrador
            if (authenticatedUser.getRole() != Role.ADMIN) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Access denied. Admin role required.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }
            
            List<ProductResponse> response = productService.getAllProductsIncludingClosed();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            HttpStatus statusCode = switch (e.getMessage()) {
                case "Missing or invalid Authorization header", "Missing token", "Invalid or expired token", "User not found" -> HttpStatus.UNAUTHORIZED;
                default -> HttpStatus.BAD_REQUEST;
            };

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(statusCode).body(errorResponse);
        }
    }

    @GetMapping("/mine")
    public ResponseEntity<?> getMyProducts(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam(value = "status", defaultValue = "all") String status
    ) {
        try {
            User authenticatedUser = getAuthenticatedUser(authorizationHeader);
            List<ProductResponse> response = productService.getProductsByOwner(authenticatedUser, status);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            HttpStatus statusCode = switch (e.getMessage()) {
                case "Missing or invalid Authorization header", "Missing token", "Invalid or expired token", "User not found" -> HttpStatus.UNAUTHORIZED;
                default -> HttpStatus.BAD_REQUEST;
            };

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(statusCode).body(errorResponse);
        }
    }

    @GetMapping("/{productId:\\d+}")
    public ResponseEntity<?> getProductById(@PathVariable Long productId) {
        try {
            ProductResponse response = productService.getProductResponseById(productId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/{productId:\\d+}/similar")
    public ResponseEntity<?> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(value = "limit", defaultValue = "6") int limit
    ) {
        try {
            List<ProductResponse> response = productService.getSimilarProducts(productId, limit);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            User authenticatedUser = getAuthenticatedUser(authorizationHeader);
            ProductResponse response = productService.createProduct(request, authenticatedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            HttpStatus status = switch (e.getMessage()) {
                case "Missing or invalid Authorization header", "Missing token", "Invalid or expired token", "User not found" -> HttpStatus.UNAUTHORIZED;
                default -> HttpStatus.BAD_REQUEST;
            };

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(status).body(errorResponse);
        }
    }

        @PostMapping("/{productId:\\d+}/close")
    public ResponseEntity<?> closeAuction(
            @PathVariable Long productId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            User authenticatedUser = getAuthenticatedUser(authorizationHeader);
            ProductResponse response = productService.closeAuction(productId, authenticatedUser);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            HttpStatus status = switch (e.getMessage()) {
                case "Product not found" -> HttpStatus.NOT_FOUND;
                case "Missing or invalid Authorization header", "Missing token", "Invalid or expired token", "User not found" -> HttpStatus.UNAUTHORIZED;
                case "Only owner can close auction" -> HttpStatus.FORBIDDEN;
                default -> HttpStatus.BAD_REQUEST;
            };

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(status).body(errorResponse);
        }
    }

    private User getAuthenticatedUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authorizationHeader.substring(7).trim();
        if (token.isBlank()) {
            throw new RuntimeException("Missing token");
        }

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String username = jwtService.extractUsername(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
