package com.forbids.controller;

import com.forbids.dto.CreateProductRequest;
import com.forbids.dto.ProductResponse;
import com.forbids.model.User;
import com.forbids.service.AuthContextService;
import com.forbids.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final AuthContextService authContextService;

    public ProductController(ProductService productService, AuthContextService authContextService) {
        this.productService = productService;
        this.authContextService = authContextService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(value = "status", defaultValue = "open") String status
    ) {
        return ResponseEntity.ok(productService.getAllProducts(status));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<ProductResponse>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.getAllProductsIncludingClosed());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @RequestParam(value = "status", defaultValue = "all") String status
    ) {
        User authenticatedUser = authContextService.getCurrentUser();
        return ResponseEntity.ok(productService.getProductsByOwner(authenticatedUser, status));
    }

    @GetMapping("/{productId:\\d+}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductResponseById(productId));
    }

    @GetMapping("/{productId:\\d+}/similar")
    public ResponseEntity<List<ProductResponse>> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(value = "limit", defaultValue = "6") int limit
    ) {
        return ResponseEntity.ok(productService.getSimilarProducts(productId, limit));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        User authenticatedUser = authContextService.getCurrentUser();
        ProductResponse response = productService.createProduct(request, authenticatedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{productId:\\d+}/close")
    public ResponseEntity<ProductResponse> closeAuction(@PathVariable Long productId) {
        User authenticatedUser = authContextService.getCurrentUser();
        return ResponseEntity.ok(productService.closeAuction(productId, authenticatedUser));
    }
}
