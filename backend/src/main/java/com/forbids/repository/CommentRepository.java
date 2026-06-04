package com.forbids.repository;

import com.forbids.model.Comment;
import com.forbids.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN FETCH c.user LEFT JOIN FETCH c.parentComment WHERE c.product = :product ORDER BY c.createdAt DESC")
    List<Comment> findAllByProductOrderByCreatedAtDesc(Product product);

    long countByProduct(Product product);

    long countByParentComment(Comment parentComment);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.product.id = :productId AND c.parentComment IS NOT NULL")
    void deleteRepliesByProductId(Long productId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.product.id = :productId")
    void deleteByProductId(Long productId);
}
