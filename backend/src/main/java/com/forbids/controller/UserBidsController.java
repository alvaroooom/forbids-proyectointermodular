package com.forbids.controller;

import com.forbids.dto.ProductResponse;
import com.forbids.model.Bid;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import com.forbids.service.AuthContextService;
import com.forbids.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bids")
public class UserBidsController {

    private final BidRepository bidRepository;
    private final ProductService productService;
    private final AuthContextService authContextService;

    public UserBidsController(
            BidRepository bidRepository,
            ProductService productService,
            AuthContextService authContextService
    ) {
        this.bidRepository = bidRepository;
        this.productService = productService;
        this.authContextService = authContextService;
    }

    @GetMapping("/my-bids")
    public ResponseEntity<List<ProductResponse>> getMyBids() {
        User authenticatedUser = authContextService.getCurrentUser();

        List<Bid> bids = bidRepository.findAllByBidderWithProductOrderByCreatedAtDesc(authenticatedUser);

        List<ProductResponse> responses = bids.stream()
                .map(Bid::getProduct)
                .collect(Collectors.toMap(
                        Product::getId,
                        product -> product,
                        (first, second) -> first,
                        LinkedHashMap::new
                ))
                .values()
                .stream()
                .map(productService::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }
}
