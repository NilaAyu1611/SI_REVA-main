package id.go.sireva.indikatorprogram;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class IndikatorProgramService {
    private final IndikatorProgramRepository repository;

    public IndikatorProgramService(IndikatorProgramRepository repository) {
        this.repository = repository;
    }

    public List<IndikatorProgram> find(Integer sasaranProgramId) {
        return repository.find(sasaranProgramId);
    }

    @Transactional
    public List<IndikatorProgram> create(JsonNode body) {
        List<JsonNode> rows = new ArrayList<>();
        if (body.isArray()) {
            body.forEach(rows::add);
        } else {
            rows.add(body);
        }
        List<IndikatorProgramRequest> requests = rows.stream().map(this::toRequest).toList();
        return repository.createBatch(requests);
    }

    public List<IndikatorProgram> update(JsonNode body) {
        if (!body.hasNonNull("id") || !body.path("id").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        if (body.size() <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tidak ada field yang diperbarui.");
        }
        return repository.update(body);
    }

    public List<IndikatorProgram> delete(JsonNode body) {
        if (!body.hasNonNull("id") || !body.path("id").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        return repository.delete(body.path("id").asLong());
    }

    private IndikatorProgramRequest toRequest(JsonNode row) {
        JsonNode sasaranId = row.has("sasaranProgramId") ? row.get("sasaranProgramId") : row.get("sasaran_program_id");
        return new IndikatorProgramRequest(
                row.hasNonNull("id") ? row.path("id").asLong() : null,
                sasaranId == null || sasaranId.isNull() ? null : sasaranId.asInt(),
                text(row, "kode"), text(row, "nama"), text(row, "satuan"), text(row, "deskripsi"), text(row, "formula"));
    }

    private String text(JsonNode row, String field) {
        JsonNode value = row.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }
}