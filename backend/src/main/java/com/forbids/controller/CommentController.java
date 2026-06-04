package com.forbids.controller;

import com.forbids.dto.CommentResponse;
import com.forbids.dto.CreateCommentRequest;
import com.forbids.service.AuthContextService;
import com.forbids.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final AuthContextService authContextService;

    public CommentController(CommentService commentService, AuthContextService authContextService) {
        this.commentService = commentService;
        this.authContextService = authContextService;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long productId) {
        return ResponseEntity.ok(commentService.getCommentsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long productId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        Long userId = authContextService.getCurrentUserId();
        return ResponseEntity.ok(commentService.createComment(productId, userId, request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long productId,
            @PathVariable Long commentId
    ) {
        Long userId = authContextService.getCurrentUserId();
        commentService.deleteComment(productId, commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
