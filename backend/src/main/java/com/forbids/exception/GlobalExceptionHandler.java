package com.forbids.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(UnauthorizedException ex) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, String>> handleForbidden(ForbiddenException ex) {
        return error(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(BadRequestException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Validación fallida");
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        HttpStatus status = isAuthMessage(ex.getMessage()) ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST;
        return error(status, ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return error(mapRuntimeStatus(ex.getMessage()), ex.getMessage());
    }

    private HttpStatus mapRuntimeStatus(String message) {
        if (message == null) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return switch (message) {
            case "Cabecera de autorización ausente o inválida", "Token ausente", "Token inválido o caducado",
                 "Credenciales inválidas", "Usuario no encontrado", "Token de autorización inválido" -> HttpStatus.UNAUTHORIZED;
            case "Acceso denegado. Se requiere rol de administrador.", "Solo el propietario puede cerrar la subasta" -> HttpStatus.FORBIDDEN;
            case "Producto no encontrado", "Comentario no encontrado" -> HttpStatus.NOT_FOUND;
            case "El nombre de usuario ya existe", "El correo electrónico ya existe", "La contraseña actual es incorrecta",
                 "Debes indicar la contraseña actual para cambiarla", "La subasta está cerrada",
                 "No puedes pujar en tu propio producto", "La puja debe ser superior al precio actual" -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.BAD_REQUEST;
        };
    }

    private boolean isAuthMessage(String message) {
        return message != null && (
                message.contains("token de autorización") ||
                message.contains("WebSocket") ||
                message.contains("WebSocket no autorizado")
        );
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message != null ? message : "Error inesperado");
        return ResponseEntity.status(status).body(body);
    }
}
