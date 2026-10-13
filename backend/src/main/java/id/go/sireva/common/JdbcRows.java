package id.go.sireva.common;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;


public final class JdbcRows {
    public static final RowMapper<Map<String, Object>> CAMEL_MAP = (result, rowNumber) -> {
        ResultSetMetaData meta = result.getMetaData();
        Map<String, Object> row = new LinkedHashMap<>();
        for (int i = 1; i <= meta.getColumnCount(); i++) {
            row.put(camelCase(meta.getColumnLabel(i)), value(result, i));
        }
        return row;
    };

    private JdbcRows() {
    }

    public static String camelCase(String snake) {
        StringBuilder out = new StringBuilder();
        boolean upperNext = false;
        for (char c : snake.toCharArray()) {
            if (c == '_') {
                upperNext = true;
            } else {
                out.append(upperNext ? Character.toUpperCase(c) : c);
                upperNext = false;
            }
        }
        return out.toString();
    }

    private static Object value(ResultSet result, int index) throws SQLException {
        Object value = result.getObject(index);
        if (value instanceof BigDecimal decimal) {
            return decimal.toPlainString();
        }
        if (value instanceof Timestamp) {
            return result.getString(index);
        }
        if (value instanceof java.sql.Array array) {
            return Arrays.asList((Object[]) array.getArray());
        }
        return value;
    }
}
