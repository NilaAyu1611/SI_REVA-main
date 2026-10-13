package id.go.sireva.common;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;


@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException exception) {
        return body(HttpStatus.valueOf(exception.getStatusCode().value()), exception.getReason());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleIntegrity(DataIntegrityViolationException exception) {
        LOGGER.warn("Data integrity violation: {}", exception.getMostSpecificCause().getMessage());
        return body(HttpStatus.CONFLICT, "Data tidak valid atau masih digunakan oleh data lain.");
    }

    private ResponseEntity<Map<String, Object>> body(HttpStatus status, String message) {
        String text = message == null ? status.getReasonPhrase() : message;
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("statusCode", status.value());
        body.put("statusMessage", text);
        body.put("message", text);
        return ResponseEntity.status(status).body(body);
    }
}
