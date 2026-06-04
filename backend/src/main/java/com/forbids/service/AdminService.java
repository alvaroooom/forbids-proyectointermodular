package com.forbids.service;

import com.forbids.dto.AdminUserResponse;
import com.forbids.exception.BadRequestException;
import com.forbids.exception.NotFoundException;
import com.forbids.model.Product;
import com.forbids.model.Role;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import com.forbids.repository.CommentRepository;
import com.forbids.repository.FavoriteRepository;
import com.forbids.repository.ProductChatMessageRepository;
import com.forbids.repository.ProductRepository;
import com.forbids.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final BidRepository bidRepository;
    private final CommentRepository commentRepository;
    private final FavoriteRepository favoriteRepository;
    private final ProductChatMessageRepository productChatMessageRepository;

    public AdminService(
            UserRepository userRepository,
            ProductRepository productRepository,
            ProductService productService,
            BidRepository bidRepository,
            CommentRepository commentRepository,
            FavoriteRepository favoriteRepository,
            ProductChatMessageRepository productChatMessageRepository
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.bidRepository = bidRepository;
        this.commentRepository = commentRepository;
        this.favoriteRepository = favoriteRepository;
        this.productChatMessageRepository = productChatMessageRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> listUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.isBanned()
                ))
                .toList();
    }

    @Transactional
    public AdminUserResponse setUserBanned(Long userId, boolean banned, User admin) {
        if (admin.getId().equals(userId)) {
            throw new BadRequestException("No puedes banearte a ti mismo");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        user.setBanned(banned);
        userRepository.save(user);

        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isBanned()
        );
    }

    @Transactional
    public AdminUserResponse setUserRole(Long userId, Role role, User admin) {
        if (admin.getId().equals(userId)) {
            throw new BadRequestException("No puedes cambiar tu propio rol");
        }
        if (role == null) {
            throw new BadRequestException("El rol es obligatorio");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        user.setRole(role);
        userRepository.save(user);

        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isBanned()
        );
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));

        bidRepository.deleteByProductId(productId);
        favoriteRepository.deleteByProductId(productId);
        productChatMessageRepository.deleteByProductId(productId);
        commentRepository.deleteRepliesByProductId(productId);
        commentRepository.deleteByProductId(productId);
        productRepository.delete(product);
    }

    @Transactional
    public void forceCloseProduct(Long productId) {
        productService.forceCloseAuction(productId);
    }
}
