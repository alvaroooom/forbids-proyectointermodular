package com.forbids.controller;

import com.forbids.dto.AdminUserResponse;
import com.forbids.dto.MessageResponse;
import com.forbids.model.Role;
import com.forbids.model.User;
import com.forbids.service.AdminService;
import com.forbids.service.AuthContextService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AuthContextService authContextService;

    public AdminController(AdminService adminService, AuthContextService authContextService) {
        this.adminService = adminService;
        this.authContextService = authContextService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> listUsers() {
        authContextService.getCurrentUser();
        return ResponseEntity.ok(adminService.listUsers());
    }

    @PatchMapping("/users/{userId}/ban")
    public ResponseEntity<AdminUserResponse> setBanned(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> body
    ) {
        User admin = authContextService.getCurrentUser();
        boolean banned = Boolean.TRUE.equals(body.get("banned"));
        return ResponseEntity.ok(adminService.setUserBanned(userId, banned, admin));
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<AdminUserResponse> setRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body
    ) {
        User admin = authContextService.getCurrentUser();
        Role role = Role.valueOf(body.get("role"));
        return ResponseEntity.ok(adminService.setUserRole(userId, role, admin));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable Long productId) {
        authContextService.getCurrentUser();
        adminService.deleteProduct(productId);
        return ResponseEntity.ok(new MessageResponse("Producto eliminado"));
    }

    @PostMapping("/products/{productId}/force-close")
    public ResponseEntity<MessageResponse> forceClose(@PathVariable Long productId) {
        authContextService.getCurrentUser();
        adminService.forceCloseProduct(productId);
        return ResponseEntity.ok(new MessageResponse("Subasta cerrada"));
    }
}
