package com.forbids.controller;

import com.forbids.dto.ChatMessage;
import com.forbids.dto.ProductChatMessageResponse;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import com.forbids.service.ProductChatService;
import com.forbids.service.ProductService;
import java.security.Principal;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private static final int MAX_MESSAGE_LENGTH = 1000;
    private static final Duration MIN_MESSAGE_INTERVAL = Duration.ofMillis(400);

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, Instant> lastMessageByUserAndProduct = new ConcurrentHashMap<>();
    private final ProductService productService;
    private final ProductChatService productChatService;
    private final UserRepository userRepository;

    public ChatController(
            SimpMessagingTemplate messagingTemplate,
            ProductService productService,
            ProductChatService productChatService,
            UserRepository userRepository
    ) {
        this.messagingTemplate = messagingTemplate;
        this.productService = productService;
        this.productChatService = productChatService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat/{productId}")
    public void handleChatMessage(
            @DestinationVariable Long productId,
            @Payload ChatMessage message,
            Principal principal
    ) {
        if (principal == null) {
            throw new IllegalArgumentException("Usuario de WebSocket no autorizado");
        }

        if (message == null || message.getContent() == null || message.getContent().trim().isEmpty()) {
            return;
        }

        if (productId == null || productId <= 0) {
            return;
        }

        String rateLimitKey = principal.getName() + ":" + productId;
        Instant now = Instant.now();
        Instant previous = lastMessageByUserAndProduct.get(rateLimitKey);
        if (previous != null && Duration.between(previous, now).compareTo(MIN_MESSAGE_INTERVAL) < 0) {
            return;
        }
        lastMessageByUserAndProduct.put(rateLimitKey, now);

        String normalizedContent = message.getContent().trim();
        if (normalizedContent.length() > MAX_MESSAGE_LENGTH) {
            normalizedContent = normalizedContent.substring(0, MAX_MESSAGE_LENGTH);
        }

        Product product = productService.getProductById(productId);
        User user = userRepository.findByUsername(principal.getName()).orElse(null);

        ProductChatMessageResponse saved = productChatService.saveMessage(
                product,
                user,
                principal.getName(),
                normalizedContent
        );

        ChatMessage outbound = productChatService.toRealtimePayload(saved);
        messagingTemplate.convertAndSend("/topic/products/" + productId + "/chat", outbound);
    }
}
