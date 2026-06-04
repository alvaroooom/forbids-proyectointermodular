package com.forbids.controller;

import com.forbids.service.AuthContextService;
import com.forbids.service.FileStorageService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private final AuthContextService authContextService;

    public FileUploadController(FileStorageService fileStorageService, AuthContextService authContextService) {
        this.fileStorageService = fileStorageService;
        this.authContextService = authContextService;
    }

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        authContextService.getCurrentUser();
        String url = fileStorageService.storeImage(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
