package com.forbids.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.forbids.model.Favorite;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId AND f.product.id = :productId")
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    
    @Query("SELECT f FROM Favorite f JOIN FETCH f.product p JOIN FETCH p.owner WHERE f.user.id = :userId ORDER BY f.createdAt DESC")
    List<Favorite> findAllByUserId(Long userId);
    
    @Query("SELECT COUNT(f) > 0 FROM Favorite f WHERE f.user.id = :userId AND f.product.id = :productId")
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.product.id = :productId")
    long countByProductId(Long productId);

    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.user = :user")
    long countByUser(com.forbids.model.User user);
}
