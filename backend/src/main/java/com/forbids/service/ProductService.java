package com.forbids.service;

import com.forbids.dto.CreateProductRequest;
import com.forbids.dto.ProductResponse;
import com.forbids.model.Bid;
import com.forbids.model.Category;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import com.forbids.repository.CommentRepository;
import com.forbids.repository.FavoriteRepository;
import com.forbids.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ProductService {

    private static final int DEFAULT_DURATION_MINUTES = 60;

    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final FavoriteRepository favoriteRepository;
    private final CommentRepository commentRepository;

    public ProductService(ProductRepository productRepository, BidRepository bidRepository, FavoriteRepository favoriteRepository, CommentRepository commentRepository) {
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
        this.favoriteRepository = favoriteRepository;
        this.commentRepository = commentRepository;
    }

    public ProductResponse createProduct(CreateProductRequest request, User owner) {
        int durationMinutes = request.getDurationMinutes() == null
            ? DEFAULT_DURATION_MINUTES
            : request.getDurationMinutes();

        LocalDateTime endAt = LocalDateTime.now().plusMinutes(Math.max(durationMinutes, 0));
        String resolvedImageUrl = resolveProductImageUrl(request.getImageUrl());

        Product product = new Product(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getStartingPrice(),
            resolvedImageUrl,
                owner
        );
        product.setEndAt(endAt);
        
        if (request.getCategory() != null && !request.getCategory().trim().isEmpty()) {
            try {
                Category category = Category.valueOf(request.getCategory().toUpperCase());
                product.setCategory(category);
            } catch (IllegalArgumentException e) {
                product.setCategory(Category.OTHER);
            }
        } else {
            product.setCategory(Category.OTHER);
        }

        Product savedProduct = productRepository.save(product);
        return toResponse(ensureAuctionState(savedProduct));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc()
                .stream()
            .map(this::ensureAuctionState)
            .filter(product -> !Boolean.TRUE.equals(product.getClosed())) // Solo productos activos
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getAllProductsIncludingClosed() {
        return productRepository.findAllByOrderByCreatedAtDesc()
                .stream()
            .map(this::ensureAuctionState)
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByOwner(User owner, String status) {
        String normalizedStatus = status == null ? "all" : status.trim().toLowerCase();

        List<Product> products = productRepository.findAllByOwnerOrderByCreatedAtDesc(owner)
            .stream()
            .map(this::ensureAuctionState)
            .toList();

        return switch (normalizedStatus) {
            case "open" -> products.stream()
                .filter(product -> !Boolean.TRUE.equals(product.getClosed()))
                .map(this::toResponse)
                .toList();
            case "closed" -> products.stream()
                .filter(product -> Boolean.TRUE.equals(product.getClosed()))
                .map(this::toResponse)
                .toList();
            default -> products.stream()
                .map(this::toResponse)
                .toList();
        };
    }

    public Product getProductById(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        return ensureAuctionState(product);
    }

    public ProductResponse getProductResponseById(Long productId) {
        return toResponse(getProductById(productId));
    }

    public ProductResponse closeAuction(Long productId, User requester) {
        Product product = getProductById(productId);

        if (!product.getOwner().getId().equals(requester.getId())) {
            throw new RuntimeException("Only owner can close auction");
        }

        if (Boolean.TRUE.equals(product.getClosed())) {
            throw new RuntimeException("Auction already closed");
        }

        Product savedProduct = closeAuctionInternal(product);
        return toResponse(savedProduct);
    }

    public Product ensureAuctionState(Product product) {
        if (Boolean.TRUE.equals(product.getClosed())) {
            return product;
        }

        if (product.getEndAt() == null) {
            return product;
        }

        if (LocalDateTime.now().isBefore(product.getEndAt())) {
            return product;
        }

        return closeAuctionInternal(product);
    }

    private Product closeAuctionInternal(Product product) {
        Optional<Bid> highestBid = bidRepository.findTopByProductOrderByAmountDesc(product);

        product.setClosed(true);
        product.setClosedAt(LocalDateTime.now());
        product.setWinner(highestBid.map(Bid::getBidder).orElse(null));

        return productRepository.save(product);
    }

    @Scheduled(fixedRate = 60000) // Cada 60 segund
    @Transactional
    public void closeExpiredAuctions() {
        LocalDateTime now = LocalDateTime.now();
        List<Product> expiredProducts = productRepository.findAll()
            .stream()
            .filter(p -> !Boolean.TRUE.equals(p.getClosed()))
            .filter(p -> p.getEndAt() != null)
            .filter(p -> !now.isBefore(p.getEndAt()))
            .toList();

        for (Product product : expiredProducts) {
            closeAuctionInternal(product);
        }

        if (!expiredProducts.isEmpty()) {
            System.out.println("Closed " + expiredProducts.size() + " expired auction(s)");
        }
    }

    public List<ProductResponse> getSimilarProducts(Long productId, int limit) {
        Product currentProduct = getProductById(productId);
        
        if (currentProduct.getCategory() == null) {
            return List.of();
        }

        int safeLimit = Math.min(Math.max(limit, 1), 20);
        
        List<Product> similarProducts = productRepository.findSimilarProducts(
            currentProduct.getCategory(),
            productId,
            PageRequest.of(0, safeLimit)
        );

        return similarProducts.stream()
            .map(this::ensureAuctionState)
            .map(this::toResponse)
            .toList();
    }

    private String resolveProductImageUrl(String imageUrl) {
        if (imageUrl != null && !imageUrl.isBlank()) {
            return imageUrl.trim();
        }

        int randomSeed = ThreadLocalRandom.current().nextInt(100_000, 1_000_000);
        return "https://picsum.photos/seed/forbids-" + randomSeed + "/900/700";
    }

    public ProductResponse toResponse(Product product) {
        Product updatedProduct = ensureAuctionState(product);
        Optional<Bid> highestBid = bidRepository.findTopByProductOrderByAmountDesc(updatedProduct);

        BigDecimal highestBidAmount = highestBid
                .map(Bid::getAmount)
            .orElse(updatedProduct.getStartingPrice());

        long bidsCount = bidRepository.countByProduct(updatedProduct);
        long favoritesCount = favoriteRepository.countByProductId(updatedProduct.getId());
        long commentsCount = commentRepository.countByProduct(updatedProduct);

        Long winnerId = updatedProduct.getWinner() != null ? updatedProduct.getWinner().getId() : null;
        String winnerUsername = updatedProduct.getWinner() != null ? updatedProduct.getWinner().getUsername() : null;

        return new ProductResponse(
            updatedProduct.getId(),
            updatedProduct.getTitle(),
            updatedProduct.getDescription(),
            updatedProduct.getStartingPrice(),
            updatedProduct.getImageUrl(),
            updatedProduct.getCategory() != null ? updatedProduct.getCategory().name() : null,
                highestBidAmount,
                bidsCount,
                favoritesCount,
                commentsCount,
            Boolean.TRUE.equals(updatedProduct.getClosed()),
            updatedProduct.getClosedAt(),
            updatedProduct.getEndAt(),
            updatedProduct.getOwner().getId(),
            updatedProduct.getOwner().getUsername(),
                winnerId,
                winnerUsername,
            updatedProduct.getCreatedAt()
        );
    }
}
