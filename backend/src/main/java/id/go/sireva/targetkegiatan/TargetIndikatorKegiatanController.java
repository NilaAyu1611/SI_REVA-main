package id.go.sireva.targetkegiatan;

import java.sql.Timestamp;
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
@RequestMapping("/api/target-indikator")
public class TargetIndikatorKegiatanController {
    private final JdbcTemplate jdbcTemplate;

    public TargetIndikatorKegiatanController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<TargetIndikatorKegiatan> find(@RequestParam(required = false) Long id,
            @RequestParam(name = "id_iku", required = false) Integer indikatorId) {
        String sql = "SELECT id, id_iku, tahun, target_nilai, created_at FROM sireva.target_indikator_kegiatan";
        if (id != null) return jdbcTemplate.query(sql + " WHERE id = ?", this::map, id);
        if (indikatorId != null) return jdbcTemplate.query(sql + " WHERE id_iku = ?", this::map, indikatorId);
        return jdbcTemplate.query(sql, this::map);
    }

    @PostMapping
    public List<TargetIndikatorKegiatan> create(@RequestBody JsonNode body) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.target_indikator_kegiatan (id_iku, tahun, target_nilai, created_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                RETURNING id, id_iku, tahun, target_nilai, created_at
                """, this::map, body.path("idIku").asInt(), body.path("tahun").asInt(),
                body.hasNonNull("targetNilai") ? body.path("targetNilai").asText() : null);
    }

    @PutMapping
    public List<TargetIndikatorKegiatan> update(@RequestBody JsonNode body) {
        if (!body.hasNonNull("id")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        return jdbcTemplate.query("""
                UPDATE sireva.target_indikator_kegiatan SET id_iku = ?, tahun = ?, target_nilai = ? WHERE id = ?
                RETURNING id, id_iku, tahun, target_nilai, created_at
                """, this::map, body.path("idIku").asInt(), body.path("tahun").asInt(),
                body.hasNonNull("targetNilai") ? body.path("targetNilai").asText() : null, body.path("id").asLong());
    }

    @DeleteMapping
    public List<TargetIndikatorKegiatan> delete(@RequestBody JsonNode body) {
        if (body.hasNonNull("id")) {
            return jdbcTemplate.query("DELETE FROM sireva.target_indikator_kegiatan WHERE id = ? RETURNING id, id_iku, tahun, target_nilai, created_at",
                    this::map, body.path("id").asLong());
        }
        if (body.hasNonNull("id_iku") && body.hasNonNull("tahun")) {
            return jdbcTemplate.query("DELETE FROM sireva.target_indikator_kegiatan WHERE id_iku = ? AND tahun = ? RETURNING id, id_iku, tahun, target_nilai, created_at",
                    this::map, body.path("id_iku").asInt(), body.path("tahun").asInt());
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "ID atau (id_iku + tahun) wajib diisi untuk menghapus data");
    }

    private TargetIndikatorKegiatan map(java.sql.ResultSet result, int rowNumber) throws java.sql.SQLException {
        int indicatorId = result.getInt("id_iku");
        Integer nullableIndicatorId = result.wasNull() ? null : indicatorId;
        int year = result.getInt("tahun");
        Integer nullableYear = result.wasNull() ? null : year;
        Timestamp createdAt = result.getTimestamp("created_at");
        return new TargetIndikatorKegiatan(result.getLong("id"), nullableIndicatorId, nullableYear,
                result.getBigDecimal("target_nilai"), createdAt == null ? null : createdAt.toLocalDateTime());
    }
}