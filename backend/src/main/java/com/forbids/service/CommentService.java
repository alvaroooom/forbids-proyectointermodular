package com.forbids.service;

import com.forbids.dto.CommentResponse;
import com.forbids.dto.CreateCommentRequest;
import com.forbids.model.Comment;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.CommentRepository;
import com.forbids.repository.ProductRepository;
import com.forbids.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByProduct(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<Comment> comments = commentRepository.findAllByProductOrderByCreatedAtDesc(product);

        return comments.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(Long productId, Long userId, CreateCommentRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("El comentario no puede estar vacío");
        }

        if (request.getContent().length() > 1000) {
            throw new RuntimeException("El comentario no puede tener más de 1000 caracteres");
        }

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                .orElseThrow(() -> new RuntimeException("Comentario padre no encontrado"));

            if (!parentComment.getProduct().getId().equals(productId)) {
                throw new RuntimeException("Solo puedes responder comentarios del mismo producto");
            }
        }

        Comment comment = new Comment(product, user, request.getContent().trim(), parentComment);
        comment = commentRepository.save(comment);

        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permiso para eliminar este comentario");
        }

        if (commentRepository.countByParentComment(comment) > 0) {
            throw new RuntimeException("No puedes eliminar un comentario que tiene respuestas");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        User user = comment.getUser();
        return new CommentResponse(
            comment.getId(),
            user.getId(),
            comment.getParentComment() != null ? comment.getParentComment().getId() : null,
            user.getUsername(),
            user.getProfileImageUrl(),
            comment.getContent(),
            comment.getCreatedAt()
        );
    }
}
