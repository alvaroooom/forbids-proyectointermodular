package com.forbids.repository;

import com.forbids.model.Category;
import com.forbids.model.Product;
import com.forbids.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByCreatedAtDesc();

    List<Product> findAllByOwnerOrderByCreatedAtDesc(User owner);

    List<Product> findAllByOwnerAndClosedOrderByCreatedAtDesc(User owner, Boolean closed);

    long countByOwnerAndClosed(User owner, Boolean closed);

    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.id != :excludeId AND p.closed = false ORDER BY p.createdAt DESC")
    List<Product> findSimilarProducts(Category category, Long excludeId, Pageable pageable);
}
