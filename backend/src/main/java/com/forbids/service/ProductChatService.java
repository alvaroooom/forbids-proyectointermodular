package com.forbids.service;

import com.forbids.dto.ProductChatMessageResponse;
import com.forbids.model.Product;
import com.forbids.model.ProductChatMessage;
import com.forbids.model.User;
import com.forbids.repository.ProductChatMessageRepository;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductChatService {

    private final ProductChatMessageRepository chatMessageRepository;

    public ProductChatService(ProductChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductChatMessageResponse> getMessages(Product product) {
        return chatMessageRepository.findTop100ByProductOrderByCreatedAtAsc(product)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProductChatMessageResponse saveMessage(Product product, User user, String senderUsername, String content) {
        ProductChatMessage entity = new ProductChatMessage();
        entity.setProduct(product);
        entity.setUser(user);
        entity.setSenderUsername(senderUsername);
        entity.setContent(content);
        entity.setCreatedAt(LocalDateTime.now());
        entity = chatMessageRepository.save(entity);
        return toResponse(entity);
    }

    public com.forbids.dto.ChatMessage toRealtimePayload(ProductChatMessageResponse saved) {
        com.forbids.dto.ChatMessage message = new com.forbids.dto.ChatMessage();
        message.setId(saved.getId());
        message.setProductId(saved.getProductId());
        message.setSenderUsername(saved.getSenderUsername());
        message.setContent(saved.getContent());
        message.setType("CHAT");
        message.setTimestamp(saved.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant());
        return message;
    }

    private ProductChatMessageResponse toResponse(ProductChatMessage message) {
        return new ProductChatMessageResponse(
                message.getId(),
                message.getProduct().getId(),
                message.getSenderUsername(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
