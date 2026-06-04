package com.forbids.service;

import com.forbids.exception.BadRequestException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final Path uploadRoot;
    private final String publicBaseUrl;

    public FileStorageService(
            @Value("${app.upload.dir:uploads}") String uploadDir,
            @Value("${app.upload.public-base-url:/uploads}") String publicBaseUrl
    ) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.publicBaseUrl = publicBaseUrl.startsWith("/") ? publicBaseUrl : "/" + publicBaseUrl;
    }

    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No se proporcionó ningún archivo");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Solo se permiten imágenes JPEG, PNG, WEBP o GIF");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("La imagen debe ser de 5 MB o menos");
        }

        String extension = switch (file.getContentType()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };

        try {
            Files.createDirectories(uploadRoot);
            String filename = UUID.randomUUID() + extension;
            Path target = uploadRoot.resolve(filename);
            file.transferTo(target.toFile());
            return publicBaseUrl + "/" + filename;
        } catch (IOException ex) {
            throw new BadRequestException("No se pudo guardar la imagen");
        }
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }
}
