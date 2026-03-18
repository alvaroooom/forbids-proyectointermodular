package com.forbids.controller;

import com.forbids.dto.BidResponse;
import com.forbids.dto.CreateBidRequest;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import com.forbids.service.BidService;
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
@RequestMapping("/api/products/{productId}/bids")
@CrossOrigin(origins = "*")
public class BidController {

    private final BidService bidService;
    private final ProductService productService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public BidController(
            BidService bidService,
            ProductService productService,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.bidService = bidService;
        this.productService = productService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getBidsByProduct(@PathVariable Long productId) {
        try {
            Product product = productService.getProductById(productId);
            List<BidResponse> bids = bidService.getBidsByProduct(product);
            return ResponseEntity.ok(bids);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> placeBid(
            @PathVariable Long productId,
            @Valid @RequestBody CreateBidRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            Product product = productService.getProductById(productId);
            User authenticatedUser = getAuthenticatedUser(authorizationHeader);
            BidResponse response = bidService.placeBid(product, authenticatedUser, request.getAmount(), request.getImageUrl());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            HttpStatus status = switch (e.getMessage()) {
                case "Product not found" -> HttpStatus.NOT_FOUND;
                case "Missing or invalid Authorization header", "Missing token", "Invalid or expired token", "User not found" -> HttpStatus.UNAUTHORIZED;
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
