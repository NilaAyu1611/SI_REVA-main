package id.go.sireva.targetstrategis;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/target-indikator-strategis")
public class TargetIndikatorStrategisController {
    private final JdbcTemplate jdbcTemplate;

    public TargetIndikatorStrategisController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<TargetIndikatorStrategis> find(@RequestParam(required = false) Integer indikatorId) {
        String sql = "SELECT id, indikator_id, tahun, target FROM sireva.target_indikator_strategis"
                + (indikatorId == null ? "" : " WHERE indikator_id = ?");
        var mapper = (org.springframework.jdbc.core.RowMapper<TargetIndikatorStrategis>) (result, rowNumber) -> {
            int indicator = result.getInt("indikator_id");
            Integer nullableIndicator = result.wasNull() ? null : indicator;
            int year = result.getInt("tahun");
            Integer nullableYear = result.wasNull() ? null : year;
            return new TargetIndikatorStrategis(result.getLong("id"), nullableIndicator, nullableYear,
                    result.getBigDecimal("target"));
        };
        return indikatorId == null ? jdbcTemplate.query(sql, mapper) : jdbcTemplate.query(sql, mapper, indikatorId);
    }

    @PostMapping
    public List<TargetIndikatorStrategis> save(@RequestBody JsonNode body) {
        int indicatorId = requiredInt(body, "indikatorId");
        int year = requiredInt(body, "tahun");
        String target = body.hasNonNull("target") ? body.path("target").asText() : null;
        return jdbcTemplate.query("""
                INSERT INTO sireva.target_indikator_strategis (indikator_id, tahun, target)
                VALUES (?, ?, ?)
                ON CONFLICT (indikator_id, tahun) DO UPDATE SET target = EXCLUDED.target
                RETURNING id, indikator_id, tahun, target
                """, (result, rowNumber) -> new TargetIndikatorStrategis(result.getLong("id"),
                result.getInt("indikator_id"), result.getInt("tahun"), result.getBigDecimal("target")),
                indicatorId, year, target);
    }

    @PutMapping
    public List<TargetIndikatorStrategis> update(@RequestBody JsonNode body) {
        long id = requiredLong(body, "id");
        return jdbcTemplate.query("""
                UPDATE sireva.target_indikator_strategis SET indikator_id = ?, tahun = ?, target = ? WHERE id = ?
                RETURNING id, indikator_id, tahun, target
                """, (result, rowNumber) -> new TargetIndikatorStrategis(result.getLong("id"),
                result.getInt("indikator_id"), result.getInt("tahun"), result.getBigDecimal("target")),
                body.path("indikatorId").asInt(), body.path("tahun").asInt(),
                body.hasNonNull("target") ? body.path("target").asText() : null, id);
    }

    @DeleteMapping
    public List<TargetIndikatorStrategis> delete(@RequestBody JsonNode body) {
        long id = requiredLong(body, "id");
        return jdbcTemplate.query("DELETE FROM sireva.target_indikator_strategis WHERE id = ? RETURNING id, indikator_id, tahun, target",
                (result, rowNumber) -> new TargetIndikatorStrategis(result.getLong("id"),
                        result.getInt("indikator_id"), result.getInt("tahun"), result.getBigDecimal("target")), id);
    }

    private int requiredInt(JsonNode body, String field) {
        if (!body.hasNonNull(field) || !body.path(field).canConvertToInt()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " wajib diisi");
        }
        return body.path(field).asInt();
    }

    private long requiredLong(JsonNode body, String field) {
        if (!body.hasNonNull(field) || !body.path(field).canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        return body.path(field).asLong();
    }
}