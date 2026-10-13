package id.go.sireva.indikatorstrategis;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class IndikatorStrategisService {
    private final IndikatorStrategisRepository repository;

    public IndikatorStrategisService(IndikatorStrategisRepository repository) {
        this.repository = repository;
    }

    public List<IndikatorStrategis> find(Integer sasaranId) {
        return repository.find(sasaranId);
    }

    @Transactional
    public List<IndikatorStrategis> create(JsonNode body) {
        List<IndikatorStrategis> indicators = new ArrayList<>();
        if (body.isArray()) body.forEach(row -> indicators.add(toIndicator(row)));
        else indicators.add(toIndicator(body));
        return repository.createBatch(indicators);
    }

    public List<IndikatorStrategis> update(JsonNode body) {
        if (!body.hasNonNull("id") || !body.path("id").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        if (body.size() <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tidak ada field yang diperbarui.");
        }
        return repository.update(body);
    }

    public List<IndikatorStrategis> delete(JsonNode body) {
        if (!body.hasNonNull("id") || !body.path("id").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        return repository.delete(body.path("id").asLong());
    }

    private IndikatorStrategis toIndicator(JsonNode row) {
        JsonNode sasaranId = row.get("sasaranStrategisId");
        return new IndikatorStrategis(row.hasNonNull("id") ? row.path("id").asLong() : null,
                sasaranId == null || sasaranId.isNull() ? null : sasaranId.asInt(),
                text(row, "kode"), text(row, "nama"), text(row, "satuan"), text(row, "deskripsi"), text(row, "formula"));
    }

    private String text(JsonNode row, String field) {
        JsonNode value = row.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }
}