package com.forbids.repository;

import com.forbids.model.Product;
import com.forbids.model.ProductChatMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ProductChatMessageRepository extends JpaRepository<ProductChatMessage, Long> {
    List<ProductChatMessage> findTop100ByProductOrderByCreatedAtAsc(Product product);

    @Modifying
    @Query("DELETE FROM ProductChatMessage m WHERE m.product.id = :productId")
    void deleteByProductId(Long productId);
}
