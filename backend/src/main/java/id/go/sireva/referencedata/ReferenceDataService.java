package id.go.sireva.referencedata;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import id.go.sireva.common.JsonValues;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReferenceDataService {
    private final ReferenceDataRepository repository;

    public ReferenceDataService(ReferenceDataRepository repository) {
        this.repository = repository;
    }

    public ReferenceTable table(String path) {
        return ReferenceTable.forPath(path)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource tidak ditemukan"));
    }

    public List<Map<String, Object>> find(ReferenceTable table, Long id) {
        return id == null ? repository.findAll(table) : repository.findById(table, id);
    }

    public List<Map<String, Object>> create(ReferenceTable table, JsonNode body) {
        requireWritable(table);
        List<ReferenceTable.Column> columns = new ArrayList<>();
        List<Object> values = new ArrayList<>();
        collect(table, body, columns, values);
        return repository.insert(table, columns, values);
    }

    public List<Map<String, Object>> update(ReferenceTable table, JsonNode body) {
        requireWritable(table);
        long id = JsonValues.requireLong(body, "id", "ID is required");
        List<ReferenceTable.Column> columns = new ArrayList<>();
        List<Object> values = new ArrayList<>();
        collect(table, body, columns, values);
        return repository.update(table, id, columns, values);
    }

    public List<Map<String, Object>> delete(ReferenceTable table, JsonNode body) {
        requireWritable(table);
        return repository.delete(table, JsonValues.requireLong(body, "id", "ID is required"));
    }

    private void requireWritable(ReferenceTable table) {
        if (!table.writable()) {
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed");
        }
    }

    private void collect(ReferenceTable table, JsonNode body, List<ReferenceTable.Column> columns,
            List<Object> values) {
        for (ReferenceTable.Column column : table.columns()) {
            if (!body.has(column.jsonKey())) {
                continue;
            }
            columns.add(column);
            values.add(convert(column, body));
        }
    }

    private Object convert(ReferenceTable.Column column, JsonNode body) {
        JsonNode node = body.get(column.jsonKey());
        if (!JsonValues.present(node)) {
            return null;
        }
        return switch (column.type()) {
            case INT -> JsonValues.longValue(body, column.jsonKey());
            case DECIMAL -> {
                BigDecimal value = JsonValues.decimal(body, column.jsonKey());
                yield value;
            }
            case TEXT -> node.asText();
        };
    }
}
