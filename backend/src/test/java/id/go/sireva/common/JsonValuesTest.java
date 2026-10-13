package id.go.sireva.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class JsonValuesTest {
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void firstTextSkipsEmptyAndMissingValues() throws Exception {
        var body = mapper.readTree("{\"a\":\"\",\"b\":\"hasil\"}");

        assertEquals("hasil", JsonValues.firstText(body, "missing", "a", "b"));
        assertEquals("", JsonValues.firstText(body, "a"));
        assertNull(JsonValues.firstText(body, "missing"));
    }

    @Test
    void decimalAcceptsNumbersAndNumericStringsIncludingZero() throws Exception {
        var body = mapper.readTree("{\"a\":0,\"b\":\"12.50\",\"c\":\" \"}");

        assertEquals(0, new BigDecimal("0").compareTo(JsonValues.decimal(body, "a", "b")));
        assertEquals(new BigDecimal("12.50"), JsonValues.decimal(body, "b"));
        assertNull(JsonValues.decimal(body, "c"));
        assertEquals(BigDecimal.ZERO, JsonValues.decimalOrZero(body, "missing"));
    }

    @Test
    void decimalRejectsNonNumericText() throws Exception {
        var body = mapper.readTree("{\"a\":\"abc\"}");

        assertThrows(ResponseStatusException.class, () -> JsonValues.decimal(body, "a"));
    }

    @Test
    void camelCaseConvertsColumnLabels() {
        assertEquals("unitKerjaNama", JdbcRows.camelCase("unit_kerja_nama"));
        assertEquals("tw1", JdbcRows.camelCase("tw1"));
    }
}
