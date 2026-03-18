package com.forbids.controller;

import com.forbids.dto.ProductResponse;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import com.forbids.repository.UserRepository;
import com.forbids.service.JwtService;
import com.forbids.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
public class UserBidsController {

    private final BidRepository bidRepository;
    private final ProductService productService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public UserBidsController(
            BidRepository bidRepository,
            ProductService productService,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.bidRepository = bidRepository;
        this.productService = productService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/my-bids")
    public ResponseEntity<?> getMyBids(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            User authenticatedUser = getAuthenticatedUser(authorizationHeader);
            
            List<Product> products = bidRepository.findDistinctProductsByBidder(authenticatedUser);
            
            List<ProductResponse> responses = products.stream()
                    .map(productService::toResponse)
                    .toList();
            
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            HttpStatus status = switch (e.getMessage()) {
                case "Missing or invalid Authorization header", "Missing token", "Invalid or expired token", "User not found" -> HttpStatus.UNAUTHORIZED;
                default -> HttpStatus.INTERNAL_SERVER_ERROR;
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
