package id.go.sireva.sasaranprogram;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.StringJoiner;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class SasaranProgramRepository {
    private static final RowMapper<SasaranProgram> ROW_MAPPER = (result, rowNumber) -> {
        int ssId = result.getInt("ss_id");
        Integer nullableSsId = result.wasNull() ? null : ssId;
        int order = result.getInt("nomor_urut");
        int ikssId = result.getInt("ikss_id");
        Integer nullableIkssId = result.wasNull() ? null : ikssId;
        boolean active = result.getBoolean("is_active");
        Boolean nullableActive = result.wasNull() ? null : active;
        Timestamp deletedAt = result.getTimestamp("deleted_at");
        Timestamp createdAt = result.getTimestamp("created_at");
        Timestamp updatedAt = result.getTimestamp("updated_at");
        return new SasaranProgram(result.getLong("id"), nullableSsId, order, result.getString("kode_sp"),
                result.getString("nama_sp"), result.getString("pengampu"), result.getString("instansi_terkait"),
                nullableIkssId, nullableActive, deletedAt == null ? null : deletedAt.toLocalDateTime(),
                createdAt == null ? null : createdAt.toLocalDateTime(),
                updatedAt == null ? null : updatedAt.toLocalDateTime());
    };

    private final JdbcTemplate jdbcTemplate;

    public SasaranProgramRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findFlattened(Long id, Integer ssId, Long indicatorId) {
        return jdbcTemplate.query("""
                SELECT sp.id, sp.ss_id, sp.ikss_id, isg.nama AS is_nama, sp.nomor_urut, sp.kode_sp,
                       sp.nama_sp, sp.pengampu, ip.id AS indikator_id, ip.kode AS kode_iku,
                       ip.nama AS indikator_nama, ip.satuan,
                       MAX(CASE WHEN tip.tahun = 2025 THEN tip.target::text END) AS target_1,
                       MAX(CASE WHEN tip.tahun = 2026 THEN tip.target::text END) AS target_2,
                       MAX(CASE WHEN tip.tahun = 2027 THEN tip.target::text END) AS target_3,
                       MAX(CASE WHEN tip.tahun = 2028 THEN tip.target::text END) AS target_4,
                       MAX(CASE WHEN tip.tahun = 2029 THEN tip.target::text END) AS target_5
                FROM sireva.sasaran_program sp
                LEFT JOIN sireva.indikator_program ip ON ip.sasaran_program_id = sp.id
                LEFT JOIN sireva.indikator_strategis isg ON isg.id = sp.ikss_id
                LEFT JOIN sireva.target_indikator_program tip ON tip.indikator_id = ip.id
                                WHERE sp.deleted_at IS NULL
                                    AND (CAST(? AS BIGINT) IS NULL OR sp.id = CAST(? AS BIGINT))
                                    AND (CAST(? AS INTEGER) IS NULL OR sp.ss_id = CAST(? AS INTEGER))
                                    AND (CAST(? AS BIGINT) IS NULL OR ip.id = CAST(? AS BIGINT))
                GROUP BY sp.id, sp.ss_id, sp.ikss_id, isg.nama, sp.nomor_urut, sp.kode_sp,
                         sp.nama_sp, sp.pengampu, ip.id, ip.kode, ip.nama, ip.satuan
                ORDER BY sp.nomor_urut, ip.id
                """, (org.springframework.jdbc.core.ResultSetExtractor<List<Map<String, Object>>>) result -> flattened(
                result), id, id, ssId, ssId, indicatorId, indicatorId);
    }

    private List<Map<String, Object>> flattened(ResultSet result) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();
        while (result.next()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", result.getLong("id"));
            row.put("ssId", nullableInt(result, "ss_id"));
            row.put("ikssId", nullableInt(result, "ikss_id"));
            row.put("isNama", result.getString("is_nama"));
            row.put("nomorUrut", result.getInt("nomor_urut"));
            row.put("kode", result.getString("kode_sp"));
            row.put("sasaran_program_text", result.getString("nama_sp"));
            row.put("unit_kerja", result.getString("pengampu"));
            row.put("unitKerjaNama", result.getString("pengampu"));
            row.put("indikatorId", nullableLong(result, "indikator_id"));
            row.put("kode_iku", result.getString("kode_iku"));
            row.put("indikatorNama", result.getString("indikator_nama"));
            row.put("satuan", result.getString("satuan"));
            row.put("indikatorSatuan", result.getString("satuan"));
            row.put("target_1", result.getString("target_1"));
            row.put("target_2", result.getString("target_2"));
            row.put("target_3", result.getString("target_3"));
            row.put("target_4", result.getString("target_4"));
            row.put("target_5", result.getString("target_5"));
            rows.add(row);
        }
        return rows;
    }

    public List<Map<String, Object>> findForUnit(Long unitId) {
        return jdbcTemplate.query("""
                SELECT sp.id, sp.ss_id, sp.nomor_urut, sp.kode_sp, sp.nama_sp,
                       (SELECT string_agg(uk.nama, ', ')
                        FROM sireva.sasaran_program_unit_kerja spuk
                        JOIN sireva.unit_kerja uk ON uk.id = spuk.unit_kerja_id
                        WHERE spuk.sasaran_program_id = sp.id) AS unit_names,
                       ip.id AS indikator_id, ip.kode AS kode_iku, ip.nama AS indikator_nama, ip.satuan,
                       (SELECT tip.target::text FROM sireva.target_indikator_program tip
                        WHERE tip.indikator_id = ip.id AND tip.tahun = 2025 LIMIT 1) AS target_1,
                       (SELECT tip.target::text FROM sireva.target_indikator_program tip
                        WHERE tip.indikator_id = ip.id AND tip.tahun = 2026 LIMIT 1) AS target_2,
                       (SELECT tip.target::text FROM sireva.target_indikator_program tip
                        WHERE tip.indikator_id = ip.id AND tip.tahun = 2027 LIMIT 1) AS target_3,
                       (SELECT tip.target::text FROM sireva.target_indikator_program tip
                        WHERE tip.indikator_id = ip.id AND tip.tahun = 2028 LIMIT 1) AS target_4,
                       (SELECT tip.target::text FROM sireva.target_indikator_program tip
                        WHERE tip.indikator_id = ip.id AND tip.tahun = 2029 LIMIT 1) AS target_5
                FROM sireva.sasaran_program sp
                LEFT JOIN sireva.indikator_program ip ON ip.sasaran_program_id = sp.id
                WHERE sp.deleted_at IS NULL
                  AND EXISTS (
                      SELECT 1 FROM sireva.sasaran_program_unit_kerja spuk
                      WHERE spuk.sasaran_program_id = sp.id
                        AND (spuk.unit_kerja_id = ? OR spuk.unit_kerja_id =
                             (SELECT parent_id FROM sireva.unit_kerja WHERE id = ?))
                  )
                ORDER BY sp.nomor_urut, ip.id
                """, (result, rowNumber) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", result.getLong("id"));
            row.put("ssId", nullableInt(result, "ss_id"));
            row.put("nomorUrut", result.getInt("nomor_urut"));
            row.put("kode", result.getString("kode_sp"));
            row.put("sasaran_program_text", result.getString("nama_sp"));
            row.put("unit_kerja", result.getString("unit_names"));
            row.put("unitKerjaNama", result.getString("unit_names"));
            row.put("indikatorId", nullableLong(result, "indikator_id"));
            row.put("kode_iku", result.getString("kode_iku"));
            row.put("indikatorNama", result.getString("indikator_nama"));
            row.put("satuan", result.getString("satuan"));
            row.put("indikatorSatuan", result.getString("satuan"));
            for (int year = 1; year <= 5; year++) {
                row.put("target_" + year, result.getString("target_" + year));
            }
            return row;
        }, unitId, unitId);
    }

    public Optional<SasaranProgram> findActiveById(Long id) {
        return jdbcTemplate.query("""
                SELECT id, ss_id, nomor_urut, kode_sp, nama_sp, pengampu, instansi_terkait, ikss_id,
                       is_active, deleted_at, created_at, updated_at
                FROM sireva.sasaran_program WHERE id = ? AND deleted_at IS NULL
                """, ROW_MAPPER, id).stream().findFirst();
    }

    public String lockParentCode(Long ssId) {
        return jdbcTemplate.query("""
                SELECT kode_ss FROM sireva.sasaran_strategis
                WHERE id = ? AND deleted_at IS NULL FOR UPDATE
                """, result -> result.next() ? result.getString("kode_ss") : null, ssId);
    }

    public int maxOrderForParent(Long ssId) {
        Integer max = jdbcTemplate.queryForObject(
                "SELECT coalesce(max(nomor_urut), 0) FROM sireva.sasaran_program WHERE ss_id = ?",
                Integer.class, ssId);
        return max == null ? 0 : max;
    }

    public SasaranProgram create(Long ssId, Integer ikssId, int order, String code, String name,
            String owner, String related) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.sasaran_program
                    (ss_id, ikss_id, nomor_urut, kode_sp, nama_sp, pengampu, instansi_terkait)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING id, ss_id, nomor_urut, kode_sp, nama_sp, pengampu, instansi_terkait,
                          ikss_id, is_active, deleted_at, created_at, updated_at
                """, ROW_MAPPER, ssId, ikssId, order, code, name, owner, related).get(0);
    }

    public Optional<SasaranProgram> update(Long id, JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();
        addUpdate(body, "nama_sp", "nama_sp", assignments, parameters);
        addUpdate(body, "pengampu", "pengampu", assignments, parameters);
        addUpdate(body, "instansi_terkait", "instansi_terkait", assignments, parameters);
        addUpdate(body, "is_id", "ikss_id", assignments, parameters);
        addUpdate(body, "is_active", "is_active", assignments, parameters);
        assignments.add("updated_at = CURRENT_TIMESTAMP");
        parameters.add(id);
        return jdbcTemplate.query("""
                UPDATE sireva.sasaran_program SET %s WHERE id = ? AND deleted_at IS NULL
                RETURNING id, ss_id, nomor_urut, kode_sp, nama_sp, pengampu, instansi_terkait,
                          ikss_id, is_active, deleted_at, created_at, updated_at
                """.formatted(assignments), ROW_MAPPER, parameters.toArray()).stream().findFirst();
    }

    public int countActiveChildren(Long id) {
        Integer count = jdbcTemplate.queryForObject("""
                SELECT count(*) FROM sireva.sasaran_kegiatan WHERE sp_id = ? AND deleted_at IS NULL
                """, Integer.class, id);
        return count == null ? 0 : count;
    }

    public boolean softDelete(Long id, boolean deactivate) {
        String sql = deactivate
                ? "UPDATE sireva.sasaran_program SET is_active = false, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL"
                : "UPDATE sireva.sasaran_program SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL";
        return jdbcTemplate.update(sql, id) > 0;
    }

    private Integer nullableInt(ResultSet result, String column) throws SQLException {
        int value = result.getInt(column);
        return result.wasNull() ? null : value;
    }

    private Long nullableLong(ResultSet result, String column) throws SQLException {
        long value = result.getLong(column);
        return result.wasNull() ? null : value;
    }

    private void addUpdate(JsonNode body, String field, String column, StringJoiner assignments,
            List<Object> parameters) {
        if (body.has(field)) {
            assignments.add(column + " = ?");
            JsonNode value = body.get(field);
            if (value == null || value.isNull()) {
                parameters.add(null);
            } else if ("is_active".equals(field)) {
                parameters.add(value.asBoolean());
            } else if ("is_id".equals(field)) {
                parameters.add(value.asInt());
            } else {
                parameters.add(value.asText());
            }
        }
    }
}