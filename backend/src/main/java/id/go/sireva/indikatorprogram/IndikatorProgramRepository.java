package id.go.sireva.indikatorprogram;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class IndikatorProgramRepository {
    private static final RowMapper<IndikatorProgram> ROW_MAPPER = (result, rowNumber) -> {
        int sasaranId = result.getInt("sasaran_program_id");
        Integer nullableSasaranId = result.wasNull() ? null : sasaranId;
        return new IndikatorProgram(
                result.getLong("id"), nullableSasaranId, result.getString("kode"), result.getString("nama"),
                result.getString("satuan"), result.getString("deskripsi"), result.getString("formula"),
                result.getString("target_1"), result.getString("target_2"), result.getString("target_3"),
                result.getString("target_4"), result.getString("target_5"));
    };

    private final JdbcTemplate jdbcTemplate;

    public IndikatorProgramRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<IndikatorProgram> find(Integer sasaranProgramId) {
        return jdbcTemplate.query("""
                SELECT ip.id, ip.sasaran_program_id, ip.kode, ip.nama, ip.satuan, ip.deskripsi, ip.formula,
                       MAX(CASE WHEN tip.tahun = 2025 THEN tip.target::text END) AS target_1,
                       MAX(CASE WHEN tip.tahun = 2026 THEN tip.target::text END) AS target_2,
                       MAX(CASE WHEN tip.tahun = 2027 THEN tip.target::text END) AS target_3,
                       MAX(CASE WHEN tip.tahun = 2028 THEN tip.target::text END) AS target_4,
                       MAX(CASE WHEN tip.tahun = 2029 THEN tip.target::text END) AS target_5
                FROM sireva.indikator_program ip
                LEFT JOIN sireva.target_indikator_program tip ON tip.indikator_id = ip.id
                WHERE (CAST(? AS INTEGER) IS NULL OR ip.sasaran_program_id = CAST(? AS INTEGER))
                GROUP BY ip.id, ip.sasaran_program_id, ip.kode, ip.nama, ip.satuan, ip.deskripsi, ip.formula
                ORDER BY ip.id
                """, ROW_MAPPER, sasaranProgramId, sasaranProgramId);
    }

    public List<IndikatorProgram> createBatch(List<IndikatorProgramRequest> requests) {
        List<IndikatorProgram> created = new ArrayList<>();
        for (IndikatorProgramRequest request : requests) {
            created.addAll(jdbcTemplate.query("""
                    INSERT INTO sireva.indikator_program (sasaran_program_id, kode, nama, satuan, deskripsi, formula)
                    VALUES (?, ?, ?, ?, ?, ?)
                    RETURNING id, sasaran_program_id, kode, nama, satuan, deskripsi, formula,
                              NULL::text AS target_1, NULL::text AS target_2, NULL::text AS target_3,
                              NULL::text AS target_4, NULL::text AS target_5
                    """, ROW_MAPPER, request.sasaranProgramId(), request.kode(), request.nama(), request.satuan(),
                    request.deskripsi(), request.formula()));
        }
        return created;
    }

    public List<IndikatorProgram> update(JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();
        addUpdate(body, "sasaranProgramId", "sasaran_program_id", assignments, parameters);
        addUpdate(body, "sasaran_program_id", "sasaran_program_id", assignments, parameters);
        addUpdate(body, "kode", "kode", assignments, parameters);
        addUpdate(body, "nama", "nama", assignments, parameters);
        addUpdate(body, "satuan", "satuan", assignments, parameters);
        addUpdate(body, "deskripsi", "deskripsi", assignments, parameters);
        addUpdate(body, "formula", "formula", assignments, parameters);
        parameters.add(body.path("id").asLong());
        return jdbcTemplate.query("""
                UPDATE sireva.indikator_program SET %s WHERE id = ?
                RETURNING id, sasaran_program_id, kode, nama, satuan, deskripsi, formula,
                          NULL::text AS target_1, NULL::text AS target_2, NULL::text AS target_3,
                          NULL::text AS target_4, NULL::text AS target_5
                """.formatted(assignments), ROW_MAPPER, parameters.toArray());
    }

    public List<IndikatorProgram> delete(Long id) {
        return jdbcTemplate.query("""
                DELETE FROM sireva.indikator_program WHERE id = ?
                RETURNING id, sasaran_program_id, kode, nama, satuan, deskripsi, formula,
                          NULL::text AS target_1, NULL::text AS target_2, NULL::text AS target_3,
                          NULL::text AS target_4, NULL::text AS target_5
                """, ROW_MAPPER, id);
    }

    private void addUpdate(JsonNode body, String jsonName, String column, StringJoiner assignments,
            List<Object> parameters) {
        if (body.has(jsonName)) {
            assignments.add(column + " = ?");
            JsonNode value = body.get(jsonName);
            parameters.add(value == null || value.isNull() ? null : value.isNumber() ? value.numberValue() : value.asText());
        }
    }
}