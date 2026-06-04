package com.forbids.controller;

import com.forbids.dto.BidResponse;
import com.forbids.dto.CreateBidRequest;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.service.AuthContextService;
import com.forbids.service.BidService;
import com.forbids.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/bids")
public class BidController {

    private final BidService bidService;
    private final ProductService productService;
    private final AuthContextService authContextService;
    private final SimpMessagingTemplate messagingTemplate;

    public BidController(
            BidService bidService,
            ProductService productService,
            AuthContextService authContextService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.bidService = bidService;
        this.productService = productService;
        this.authContextService = authContextService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public ResponseEntity<List<BidResponse>> getBidsByProduct(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        return ResponseEntity.ok(bidService.getBidsByProduct(product));
    }

    @PostMapping
    public ResponseEntity<BidResponse> placeBid(
            @PathVariable Long productId,
            @Valid @RequestBody CreateBidRequest request
    ) {
        Product product = productService.getProductById(productId);
        User authenticatedUser = authContextService.getCurrentUser();
        BidResponse response = bidService.placeBid(
                product,
                authenticatedUser,
                request.getAmount(),
                request.getImageUrl()
        );

        try {
            messagingTemplate.convertAndSend("/topic/products/" + productId + "/bids", response);
        } catch (Exception ex) {
            System.err.println("Failed to send bid notification: " + ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
