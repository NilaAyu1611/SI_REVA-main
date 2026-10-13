package id.go.sireva.sasaranstrategis;

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
public class SasaranStrategisRepository {
    private static final RowMapper<SasaranStrategis> ROW_MAPPER = thisRowMapper();
    private final JdbcTemplate jdbcTemplate;

    public SasaranStrategisRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static RowMapper<SasaranStrategis> thisRowMapper() {
        return (result, rowNumber) -> {
            int order = result.getInt("nomor_urut");
            boolean active = result.getBoolean("is_active");
            Boolean nullableActive = result.wasNull() ? null : active;
            Timestamp deletedAt = result.getTimestamp("deleted_at");
            Timestamp createdAt = result.getTimestamp("created_at");
            Timestamp updatedAt = result.getTimestamp("updated_at");
            return new SasaranStrategis(result.getLong("id"), result.getString("tahun"), order,
                    result.getString("kode_ss"), result.getString("nama_ss"), result.getString("pengampu"),
                    result.getString("instansi_terkait"), nullableActive,
                    deletedAt == null ? null : deletedAt.toLocalDateTime(),
                    createdAt == null ? null : createdAt.toLocalDateTime(),
                    updatedAt == null ? null : updatedAt.toLocalDateTime());
        };
    }

    public List<Map<String, Object>> findAllFlattened() {
        return jdbcTemplate.query("""
                SELECT ss.id, ss.kode_ss, ss.nama_ss, ss.nomor_urut, ss.pengampu, ss.tahun,
                       ik.id AS indikator_id, ik.kode AS indikator_kode, ik.nama AS indikator_nama,
                       ik.satuan AS indikator_satuan, tik.tahun AS target_tahun, tik.target AS target_value
                FROM sireva.sasaran_strategis ss
                LEFT JOIN sireva.indikator_strategis ik ON ik.sasaran_strategis_id = ss.id
                LEFT JOIN sireva.target_indikator_strategis tik ON tik.indikator_id = ik.id
                WHERE ss.deleted_at IS NULL
                ORDER BY ss.nomor_urut, ik.id, tik.tahun
                """,
                (org.springframework.jdbc.core.ResultSetExtractor<List<Map<String, Object>>>) result -> flattenRows(
                        result));
    }

    private List<Map<String, Object>> flattenRows(ResultSet result) throws SQLException {
        List<Map<String, Object>> flattened = new ArrayList<>();
        Map<Long, Map<Long, Map<String, Object>>> rowsBySasaran = new LinkedHashMap<>();
        while (result.next()) {
            long sasaranId = result.getLong("id");
            Long indicatorId = nullableLong(result, "indikator_id");
            Map<Long, Map<String, Object>> indicatorRows = rowsBySasaran.computeIfAbsent(sasaranId,
                    ignored -> new LinkedHashMap<>());
            if (indicatorId == null) {
                if (indicatorRows.isEmpty()) {
                    flattened.add(baseRow(result, sasaranId, null));
                }
                continue;
            }

            Map<String, Object> row = indicatorRows.get(indicatorId);
            if (row == null) {
                row = baseRow(result, sasaranId, indicatorId);
                row.put("indikatorId", indicatorId);
                row.put("indikatorKode", result.getString("indikator_kode"));
                row.put("indikatorNama", result.getString("indikator_nama"));
                row.put("indikatorSatuan", result.getString("indikator_satuan"));
                row.put("targets", new ArrayList<Map<String, Object>>());
                indicatorRows.put(indicatorId, row);
                flattened.add(row);
            }

            Integer targetYear = nullableInteger(result, "target_tahun");
            BigDecimal target = result.getBigDecimal("target_value");
            if (targetYear != null && target != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> targets = (List<Map<String, Object>>) row.get("targets");
                targets.add(Map.of("tahun", targetYear, "target", target));
            }
        }
        return flattened;
    }

    private Map<String, Object> baseRow(ResultSet result, long id, Long indicatorId) throws SQLException {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", indicatorId == null ? id : id + "-" + indicatorId);
        row.put("ssId", id);
        row.put("kodeSs", result.getString("kode_ss"));
        row.put("kode", result.getString("kode_ss"));
        row.put("namaSs", result.getString("nama_ss"));
        row.put("sasaranText", result.getString("nama_ss"));
        row.put("nomorUrut", result.getInt("nomor_urut"));
        row.put("pengampu", result.getString("pengampu"));
        row.put("tahun", result.getString("tahun"));
        if (indicatorId == null) {
            row.put("indikatorNama", null);
            row.put("indikatorSatuan", null);
            row.put("targets", List.of());
        }
        return row;
    }

    public Optional<SasaranStrategis> findActiveById(Long id) {
        return jdbcTemplate.query("""
                SELECT id, tahun, nomor_urut, kode_ss, nama_ss, pengampu, instansi_terkait,
                       is_active, deleted_at, created_at, updated_at
                FROM sireva.sasaran_strategis WHERE id = ? AND deleted_at IS NULL
                """, ROW_MAPPER, id).stream().findFirst();
    }

    public List<Map<String, Object>> findIndicatorsAndTargets(Long sasaranId) {
        return jdbcTemplate.query("""
                SELECT ik.id, ik.nama, ik.satuan, tik.tahun, tik.target
                FROM sireva.indikator_strategis ik
                LEFT JOIN sireva.target_indikator_strategis tik ON tik.indikator_id = ik.id
                WHERE ik.sasaran_strategis_id = ?
                ORDER BY ik.id, tik.tahun
                """, result -> {
            Map<Long, Map<String, Object>> indicators = new LinkedHashMap<>();
            while (result.next()) {
                long id = result.getLong("id");
                Map<String, Object> indicator = indicators.computeIfAbsent(id, ignored -> {
                    Map<String, Object> value = new LinkedHashMap<>();
                    value.put("id", id);
                    try {
                        value.put("nama", result.getString("nama"));
                        value.put("satuan", result.getString("satuan"));
                    } catch (SQLException exception) {
                        throw new IllegalStateException(exception);
                    }
                    value.put("targets", new ArrayList<Map<String, Object>>());
                    return value;
                });
                Integer year = nullableInteger(result, "tahun");
                BigDecimal target = result.getBigDecimal("target");
                if (year != null && target != null) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> targets = (List<Map<String, Object>>) indicator.get("targets");
                    targets.add(Map.of("tahun", year, "target", target));
                }
            }
            return new ArrayList<>(indicators.values());
        });
    }

    public void lockYear(String year) {
        long lockId = Math.abs((long) year.hashCode());
        jdbcTemplate.query("SELECT pg_advisory_xact_lock(?)", result -> null, lockId);
    }

    public int maxOrderForYear(String year) {
        Integer max = jdbcTemplate.queryForObject(
                "SELECT coalesce(max(nomor_urut), 0) FROM sireva.sasaran_strategis WHERE tahun = ?",
                Integer.class, year);
        return max == null ? 0 : max;
    }

    public SasaranStrategis create(String year, int order, String code, String name, String owner, String related) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.sasaran_strategis (tahun, nomor_urut, kode_ss, nama_ss, pengampu, instansi_terkait)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id, tahun, nomor_urut, kode_ss, nama_ss, pengampu, instansi_terkait,
                          is_active, deleted_at, created_at, updated_at
                """, ROW_MAPPER, year, order, code, name, owner, related).get(0);
    }

    public Optional<SasaranStrategis> update(Long id, JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();
        addUpdate(body, "nama_ss", "nama_ss", assignments, parameters);
        addUpdate(body, "sasaranText", "nama_ss", assignments, parameters);
        addUpdate(body, "namaSs", "nama_ss", assignments, parameters);
        addUpdate(body, "kode_ss", "kode_ss", assignments, parameters);
        addUpdate(body, "kode", "kode_ss", assignments, parameters);
        addUpdate(body, "kodeSs", "kode_ss", assignments, parameters);
        addUpdate(body, "pengampu", "pengampu", assignments, parameters);
        addUpdate(body, "instansi_terkait", "instansi_terkait", assignments, parameters);
        addUpdate(body, "instansiTerkait", "instansi_terkait", assignments, parameters);
        if (body.has("is_active")) {
            assignments.add("is_active = ?");
            parameters.add(body.get("is_active").isNull() ? null : body.get("is_active").asBoolean());
        }
        assignments.add("updated_at = CURRENT_TIMESTAMP");
        parameters.add(id);
        return jdbcTemplate.query("""
                UPDATE sireva.sasaran_strategis SET %s WHERE id = ? AND deleted_at IS NULL
                RETURNING id, tahun, nomor_urut, kode_ss, nama_ss, pengampu, instansi_terkait,
                          is_active, deleted_at, created_at, updated_at
                """.formatted(assignments), ROW_MAPPER, parameters.toArray()).stream().findFirst();
    }

    public int countActiveChildren(Long id) {
        Integer count = jdbcTemplate.queryForObject("""
                SELECT count(*) FROM sireva.sasaran_program WHERE ss_id = ? AND deleted_at IS NULL
                """, Integer.class, id);
        return count == null ? 0 : count;
    }

    public boolean softDelete(Long id) {
        return jdbcTemplate.update("""
                UPDATE sireva.sasaran_strategis
                SET is_active = false, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND deleted_at IS NULL
                """, id) > 0;
    }

    private Integer nullableInteger(ResultSet result, String column) throws SQLException {
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
            parameters.add(value == null || value.isNull() ? null : value.asText());
        }
    }
}