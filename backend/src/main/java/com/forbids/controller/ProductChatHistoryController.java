package com.forbids.controller;

import com.forbids.dto.ProductChatMessageResponse;
import com.forbids.model.Product;
import com.forbids.service.ProductChatService;
import com.forbids.service.ProductService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/{productId}/chat")
public class ProductChatHistoryController {

    private final ProductService productService;
    private final ProductChatService productChatService;

    public ProductChatHistoryController(ProductService productService, ProductChatService productChatService) {
        this.productService = productService;
        this.productChatService = productChatService;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ProductChatMessageResponse>> getMessages(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        return ResponseEntity.ok(productChatService.getMessages(product));
    }
}
