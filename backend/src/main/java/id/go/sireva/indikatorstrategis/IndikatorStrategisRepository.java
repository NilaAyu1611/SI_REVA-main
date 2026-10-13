package id.go.sireva.indikatorstrategis;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class IndikatorStrategisRepository {
    private static final String COLUMNS = "id, sasaran_strategis_id, kode, nama, satuan, deskripsi, formula";
    private static final RowMapper<IndikatorStrategis> ROW_MAPPER = (result, rowNumber) -> {
        int sasaranId = result.getInt("sasaran_strategis_id");
        Integer nullableSasaranId = result.wasNull() ? null : sasaranId;
        return new IndikatorStrategis(result.getLong("id"), nullableSasaranId, result.getString("kode"),
                result.getString("nama"), result.getString("satuan"), result.getString("deskripsi"),
                result.getString("formula"));
    };

    private final JdbcTemplate jdbcTemplate;

    public IndikatorStrategisRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<IndikatorStrategis> find(Integer sasaranId) {
        if (sasaranId == null) {
            return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.indikator_strategis", ROW_MAPPER);
        }
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.indikator_strategis WHERE sasaran_strategis_id = ?",
                ROW_MAPPER, sasaranId);
    }

    public List<IndikatorStrategis> createBatch(List<IndikatorStrategis> indicators) {
        List<IndikatorStrategis> created = new ArrayList<>();
        for (IndikatorStrategis indicator : indicators) {
            created.addAll(jdbcTemplate.query("""
                    INSERT INTO sireva.indikator_strategis
                        (sasaran_strategis_id, kode, nama, satuan, deskripsi, formula)
                    VALUES (?, ?, ?, ?, ?, ?)
                    RETURNING %s
                    """.formatted(COLUMNS), ROW_MAPPER, indicator.sasaranStrategisId(), indicator.kode(),
                    indicator.nama(), indicator.satuan(), indicator.deskripsi(), indicator.formula()));
        }
        return created;
    }

    public List<IndikatorStrategis> update(JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();
        addUpdate(body, "sasaranStrategisId", "sasaran_strategis_id", assignments, parameters);
        addUpdate(body, "kode", "kode", assignments, parameters);
        addUpdate(body, "nama", "nama", assignments, parameters);
        addUpdate(body, "satuan", "satuan", assignments, parameters);
        addUpdate(body, "deskripsi", "deskripsi", assignments, parameters);
        addUpdate(body, "formula", "formula", assignments, parameters);
        parameters.add(body.path("id").asLong());
        return jdbcTemplate.query("UPDATE sireva.indikator_strategis SET " + assignments
                + " WHERE id = ? RETURNING " + COLUMNS, ROW_MAPPER, parameters.toArray());
    }

    public List<IndikatorStrategis> delete(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.indikator_strategis WHERE id = ? RETURNING " + COLUMNS,
                ROW_MAPPER, id);
    }

    public Optional<IndikatorStrategis> findById(Long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.indikator_strategis WHERE id = ?",
                ROW_MAPPER, id).stream().findFirst();
    }

    private void addUpdate(JsonNode body, String field, String column, StringJoiner assignments,
            List<Object> parameters) {
        if (body.has(field)) {
            assignments.add(column + " = ?");
            JsonNode value = body.get(field);
            parameters.add(value == null || value.isNull() ? null : value.isNumber() ? value.numberValue() : value.asText());
        }
    }
}