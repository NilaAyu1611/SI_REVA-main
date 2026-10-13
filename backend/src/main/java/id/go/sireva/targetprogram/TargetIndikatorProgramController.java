package id.go.sireva.targetprogram;

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
@RequestMapping("/api/target-indikator-program")
public class TargetIndikatorProgramController {
    private final JdbcTemplate jdbcTemplate;

    public TargetIndikatorProgramController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<TargetIndikatorProgram> find(@RequestParam(required = false) Integer indikatorId) {
        String sql = "SELECT id, indikator_id, tahun, target FROM sireva.target_indikator_program"
                + (indikatorId == null ? "" : " WHERE indikator_id = ?");
        var mapper = (org.springframework.jdbc.core.RowMapper<TargetIndikatorProgram>) (result, rowNumber) -> {
            int indicator = result.getInt("indikator_id");
            Integer nullableIndicator = result.wasNull() ? null : indicator;
            int year = result.getInt("tahun");
            Integer nullableYear = result.wasNull() ? null : year;
            return new TargetIndikatorProgram(result.getLong("id"), nullableIndicator, nullableYear,
                    result.getBigDecimal("target"));
        };
        return indikatorId == null ? jdbcTemplate.query(sql, mapper) : jdbcTemplate.query(sql, mapper, indikatorId);
    }

    @PostMapping
    public List<TargetIndikatorProgram> create(@RequestBody JsonNode body) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.target_indikator_program (indikator_id, tahun, target)
                VALUES (?, ?, ?) RETURNING id, indikator_id, tahun, target
                """, (result, rowNumber) -> new TargetIndikatorProgram(result.getLong("id"),
                result.getInt("indikator_id"), result.getInt("tahun"), result.getBigDecimal("target")),
                body.path("indikatorId").asInt(), body.path("tahun").asInt(),
                body.hasNonNull("target") ? body.path("target").asText() : null);
    }

    @PutMapping
    public List<TargetIndikatorProgram> update(@RequestBody JsonNode body) {
        if (!body.hasNonNull("id")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        return jdbcTemplate.query("""
                UPDATE sireva.target_indikator_program SET indikator_id = ?, tahun = ?, target = ? WHERE id = ?
                RETURNING id, indikator_id, tahun, target
                """, (result, rowNumber) -> new TargetIndikatorProgram(result.getLong("id"),
                result.getInt("indikator_id"), result.getInt("tahun"), result.getBigDecimal("target")),
                body.path("indikatorId").asInt(), body.path("tahun").asInt(),
                body.hasNonNull("target") ? body.path("target").asText() : null, body.path("id").asLong());
    }

    @DeleteMapping
    public List<TargetIndikatorProgram> delete(@RequestBody JsonNode body) {
        if (!body.hasNonNull("id")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        return jdbcTemplate.query("DELETE FROM sireva.target_indikator_program WHERE id = ? RETURNING id, indikator_id, tahun, target",
                (result, rowNumber) -> new TargetIndikatorProgram(result.getLong("id"),
                        result.getInt("indikator_id"), result.getInt("tahun"), result.getBigDecimal("target")),
                body.path("id").asLong());
    }
}