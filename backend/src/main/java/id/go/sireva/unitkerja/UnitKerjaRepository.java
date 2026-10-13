package id.go.sireva.unitkerja;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UnitKerjaRepository {
    private static final String COLUMNS = "id, nama, level, parent_id, created_at, updated_at";
    private static final RowMapper<UnitKerja> ROW_MAPPER = (result, rowNumber) -> {
        int level = result.getInt("level");
        Integer nullableLevel = result.wasNull() ? null : level;
        int parentId = result.getInt("parent_id");
        Integer nullableParentId = result.wasNull() ? null : parentId;
        Timestamp createdAt = result.getTimestamp("created_at");
        Timestamp updatedAt = result.getTimestamp("updated_at");
        return new UnitKerja(
                result.getLong("id"),
                result.getString("nama"),
                nullableLevel,
                nullableParentId,
                createdAt == null ? null : createdAt.toLocalDateTime(),
                updatedAt == null ? null : updatedAt.toLocalDateTime());
    };

    private final JdbcTemplate jdbcTemplate;

    public UnitKerjaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<UnitKerja> findAll() {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.unit_kerja ORDER BY nama", ROW_MAPPER);
    }

    public List<UnitKerja> findAllForOrganization() {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.unit_kerja ORDER BY level, nama", ROW_MAPPER);
    }

    public Optional<UnitKerja> findById(Long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.unit_kerja WHERE id = ? LIMIT 1",
                ROW_MAPPER, id).stream().findFirst();
    }

    public Optional<UnitKerja> create(SaveUnitKerjaRequest request) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.unit_kerja (nama, level, parent_id, created_at, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER,
                request.nama().trim(), request.level(), request.parentId()).stream().findFirst();
    }

    public Optional<UnitKerja> update(Long id, SaveUnitKerjaRequest request) {
        return jdbcTemplate.query("""
                UPDATE sireva.unit_kerja
                SET nama = ?, level = ?, parent_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER,
                request.nama().trim(), request.level(), request.parentId(), id).stream().findFirst();
    }

    public Optional<UnitKerja> updatePartial(Long id, JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();

        if (body.has("nama")) {
            assignments.add("nama = ?");
            parameters.add(body.get("nama").asText().trim());
        }
        if (body.has("level")) {
            assignments.add("level = ?");
            parameters.add(body.get("level").isNull() ? null : body.get("level").intValue());
        }
        if (body.has("parentId")) {
            assignments.add("parent_id = ?");
            parameters.add(body.get("parentId").isNull() ? null : body.get("parentId").intValue());
        }
        assignments.add("updated_at = CURRENT_TIMESTAMP");
        parameters.add(id);

        return jdbcTemplate.query("""
                UPDATE sireva.unit_kerja
                SET %s
                WHERE id = ?
                RETURNING %s
                """.formatted(assignments, COLUMNS), ROW_MAPPER, parameters.toArray()).stream().findFirst();
    }

    public Optional<UnitKerja> deleteById(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.unit_kerja WHERE id = ? RETURNING " + COLUMNS,
                ROW_MAPPER, id).stream().findFirst();
    }
}