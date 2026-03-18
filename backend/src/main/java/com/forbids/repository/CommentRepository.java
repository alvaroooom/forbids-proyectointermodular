package com.forbids.repository;

import com.forbids.model.Comment;
import com.forbids.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN FETCH c.user LEFT JOIN FETCH c.parentComment WHERE c.product = :product ORDER BY c.createdAt DESC")
    List<Comment> findAllByProductOrderByCreatedAtDesc(Product product);

    long countByProduct(Product product);

    long countByParentComment(Comment parentComment);
}
