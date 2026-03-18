package com.forbids.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.forbids.dto.FavoriteResponse;
import com.forbids.model.Bid;
import com.forbids.model.Favorite;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import com.forbids.repository.FavoriteRepository;
import com.forbids.repository.ProductRepository;
import com.forbids.repository.UserRepository;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final ProductService productService;

    public FavoriteService(FavoriteRepository favoriteRepository, 
                          UserRepository userRepository,
                          ProductRepository productRepository,
                          BidRepository bidRepository,
                          ProductService productService) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
        this.productService = productService;
    }

    @Transactional
    public void addFavorite(Long userId, Long productId) {
        // Verificar que el usuario existe
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el producto existe
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar que no sea un favorito duplicado
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Este producto ya está en favoritos");
        }

        // Crear y guardar el favorito
        Favorite favorite = new Favorite(user, product);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long productId) {
        Favorite favorite = favoriteRepository.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new RuntimeException("Favorito no encontrado"));

        favoriteRepository.delete(favorite);
    }

    @Transactional
    public List<FavoriteResponse> getUserFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findAllByUserId(userId);
        
        return favorites.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Transactional(readOnly = true)
    public long getFavoriteCount(Long productId) {
        return favoriteRepository.countByProductId(productId);
    }

    private FavoriteResponse toResponse(Favorite favorite) {
        if (favorite == null) {
            throw new RuntimeException("Favorito nulo");
        }
        
        Product product = favorite.getProduct();
        if (product == null) {
            throw new RuntimeException("Producto no encontrado para favorito");
        }

        product = productService.ensureAuctionState(product);
        
        User owner = product.getOwner();
        if (owner == null) {
            throw new RuntimeException("Propietario no encontrado para producto");
        }

        // Calcular el precio actual como la puja más alta o el precio inicial
        Optional<Bid> highestBid = bidRepository.findTopByProductOrderByAmountDesc(product);
        BigDecimal currentPrice = highestBid
            .map(Bid::getAmount)
            .orElse(product.getStartingPrice());

        return new FavoriteResponse(
            favorite.getId(),
            product.getId(),
            product.getTitle(),
            product.getDescription(),
            product.getImageUrl(),
            currentPrice.doubleValue(),
            Boolean.TRUE.equals(product.getClosed()),
            product.getEndAt(),
            owner.getUsername(),
            product.getCategory() != null ? product.getCategory().name() : null,
            favorite.getCreatedAt()
        );
    }
}
