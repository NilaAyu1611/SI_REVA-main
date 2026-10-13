package id.go.sireva.common;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


public final class JsonValues {
    private JsonValues() {
    }

    public static boolean present(JsonNode node) {
        return node != null && !node.isNull() && !node.isMissingNode();
    }

    
    public static String firstText(JsonNode body, String... keys) {
        boolean sawEmpty = false;
        for (String key : keys) {
            JsonNode node = body.get(key);
            if (!present(node)) {
                continue;
            }
            String text = node.asText();
            if (!text.isEmpty()) {
                return text;
            }
            sawEmpty = true;
        }
        return sawEmpty ? "" : null;
    }

    
    public static BigDecimal decimal(JsonNode body, String... keys) {
        for (String key : keys) {
            JsonNode node = body.get(key);
            if (!present(node)) {
                continue;
            }
            if (node.isNumber()) {
                return node.decimalValue();
            }
            String text = node.asText().trim();
            if (text.isEmpty()) {
                continue;
            }
            try {
                return new BigDecimal(text);
            } catch (NumberFormatException exception) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nilai " + key + " tidak valid.");
            }
        }
        return null;
    }

    public static BigDecimal decimalOrZero(JsonNode body, String key) {
        BigDecimal value = decimal(body, key);
        return value == null ? BigDecimal.ZERO : value;
    }

    public static Long longValue(JsonNode body, String key) {
        JsonNode node = body.get(key);
        if (!present(node)) {
            return null;
        }
        if (node.canConvertToLong()) {
            return node.asLong();
        }
        try {
            return Long.parseLong(node.asText().trim());
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nilai " + key + " tidak valid.");
        }
    }

    public static long requireLong(JsonNode body, String key, String message) {
        Long value = longValue(body, key);
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value;
    }

    public static String requireText(JsonNode body, String message, String... keys) {
        String value = firstText(body, keys);
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value;
    }
}
