package id.go.sireva.sasarankegiatan;

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
public class SasaranKegiatanRepository {
    private static final RowMapper<SasaranKegiatan> ROW_MAPPER = (result, rowNumber) -> {
        int spId = result.getInt("sp_id");
        Integer nullableSpId = result.wasNull() ? null : spId;
        int order = result.getInt("nomor_urut");
        boolean active = result.getBoolean("is_active");
        Boolean nullableActive = result.wasNull() ? null : active;
        Timestamp deletedAt = result.getTimestamp("deleted_at");
        Timestamp createdAt = result.getTimestamp("created_at");
        Timestamp updatedAt = result.getTimestamp("updated_at");
        return new SasaranKegiatan(result.getLong("id"), nullableSpId, order, result.getString("kode_sk"),
                result.getString("nama_sk"), result.getString("pengampu"), result.getString("instansi_terkait"),
                nullableActive, deletedAt == null ? null : deletedAt.toLocalDateTime(),
                createdAt == null ? null : createdAt.toLocalDateTime(),
                updatedAt == null ? null : updatedAt.toLocalDateTime());
    };

    private final JdbcTemplate jdbcTemplate;

    public SasaranKegiatanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findFlattened(Long id, Integer spId, Long indicatorId) {
        return jdbcTemplate.query("""
                SELECT sk.id, sk.sp_id, sk.nomor_urut, sk.kode_sk, sk.nama_sk, sk.pengampu,
                       sp.pengampu AS program_unit, sk.instansi_terkait,
                       iku.id AS indikator_id, iku.nama_iku, iku.satuan,
                       MAX(CASE WHEN tik.tahun = 2025 THEN tik.target_nilai::text END) AS target_1,
                       MAX(CASE WHEN tik.tahun = 2026 THEN tik.target_nilai::text END) AS target_2,
                       MAX(CASE WHEN tik.tahun = 2027 THEN tik.target_nilai::text END) AS target_3,
                       MAX(CASE WHEN tik.tahun = 2028 THEN tik.target_nilai::text END) AS target_4,
                       MAX(CASE WHEN tik.tahun = 2029 THEN tik.target_nilai::text END) AS target_5
                FROM sireva.sasaran_kegiatan sk
                LEFT JOIN sireva.indikator_kinerja iku
                       ON iku.sk_id = sk.id AND iku.deleted_at IS NULL
                LEFT JOIN sireva.sasaran_program sp
                       ON sp.id = sk.sp_id AND sp.deleted_at IS NULL
                LEFT JOIN sireva.target_indikator_kegiatan tik ON tik.id_iku = iku.id
                WHERE sk.deleted_at IS NULL
                  AND (CAST(? AS BIGINT) IS NULL OR sk.id = CAST(? AS BIGINT))
                  AND (CAST(? AS INTEGER) IS NULL OR sk.sp_id = CAST(? AS INTEGER))
                  AND (CAST(? AS BIGINT) IS NULL OR iku.id = CAST(? AS BIGINT))
                GROUP BY sk.id, sk.sp_id, sk.nomor_urut, sk.kode_sk, sk.nama_sk, sk.pengampu,
                         sp.pengampu, sk.instansi_terkait, iku.id, iku.nama_iku, iku.satuan
                ORDER BY sk.nomor_urut
                """,
                (org.springframework.jdbc.core.ResultSetExtractor<List<Map<String, Object>>>) result -> mapRows(result,
                        false),
                id, id, spId, spId, indicatorId, indicatorId);
    }

    public List<Map<String, Object>> findForUnit(Long unitId, Long sasaranId) {
        return jdbcTemplate.query("""
                SELECT sk.id, sk.sp_id, sk.nomor_urut, sk.kode_sk, sk.nama_sk,
                       sk.instansi_terkait, iku.id AS indikator_id, iku.nama_iku, iku.satuan,
                       (SELECT string_agg(uk.nama, ', ')
                        FROM sireva.sasaran_program_unit_kerja spuk
                        JOIN sireva.unit_kerja uk ON uk.id = spuk.unit_kerja_id
                        WHERE spuk.sasaran_program_id = sk.sp_id) AS unit_names,
                       MAX(CASE WHEN tik.tahun = 2025 THEN tik.target_nilai::text END) AS target_1,
                       MAX(CASE WHEN tik.tahun = 2026 THEN tik.target_nilai::text END) AS target_2,
                       MAX(CASE WHEN tik.tahun = 2027 THEN tik.target_nilai::text END) AS target_3,
                       MAX(CASE WHEN tik.tahun = 2028 THEN tik.target_nilai::text END) AS target_4,
                       MAX(CASE WHEN tik.tahun = 2029 THEN tik.target_nilai::text END) AS target_5
                FROM sireva.sasaran_kegiatan sk
                LEFT JOIN sireva.indikator_kinerja iku
                       ON iku.sk_id = sk.id AND iku.deleted_at IS NULL
                LEFT JOIN sireva.target_indikator_kegiatan tik ON tik.id_iku = iku.id
                WHERE sk.deleted_at IS NULL
                  AND EXISTS (
                      SELECT 1 FROM sireva.sasaran_program_unit_kerja spuk
                      WHERE spuk.sasaran_program_id = sk.sp_id
                        AND (spuk.unit_kerja_id = ? OR spuk.unit_kerja_id =
                             (SELECT parent_id FROM sireva.unit_kerja WHERE id = ?))
                  )
                  AND (CAST(? AS BIGINT) IS NULL OR sk.id = CAST(? AS BIGINT))
                GROUP BY sk.id, sk.sp_id, sk.nomor_urut, sk.kode_sk, sk.nama_sk,
                         sk.instansi_terkait, iku.id, iku.nama_iku, iku.satuan
                ORDER BY sk.id DESC
                """,
                (org.springframework.jdbc.core.ResultSetExtractor<List<Map<String, Object>>>) result -> mapRows(result,
                        true),
                unitId, unitId, sasaranId, sasaranId);
    }

    private List<Map<String, Object>> mapRows(ResultSet result, boolean unitFilter) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();
        while (result.next()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", result.getLong("id"));
            row.put("spId", nullableInteger(result, "sp_id"));
            row.put("nomorUrut", result.getInt("nomor_urut"));
            row.put("kode", result.getString("kode_sk"));
            row.put("sasaranText", result.getString("nama_sk"));
            row.put("sasaran_kegiatan_text", result.getString("nama_sk"));
            String unitName = unitFilter ? result.getString("unit_names") : result.getString("program_unit");
            row.put("unit_kerja", unitName);
            row.put("unitKerjaNama", unitName);
            if (!unitFilter) {
                row.put("programUnitKerja", result.getString("program_unit"));
                row.put("instansiTerkait", result.getString("instansi_terkait"));
            }
            row.put("indikatorId", nullableLong(result, "indikator_id"));
            row.put("indikatorNama", result.getString("nama_iku"));
            row.put("indikator_kinerja", result.getString("nama_iku"));
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

    public Optional<SasaranKegiatan> findActiveById(Long id) {
        return jdbcTemplate.query("""
                SELECT id, sp_id, nomor_urut, kode_sk, nama_sk, pengampu, instansi_terkait,
                       is_active, deleted_at, created_at, updated_at
                FROM sireva.sasaran_kegiatan WHERE id = ? AND deleted_at IS NULL
                """, ROW_MAPPER, id).stream().findFirst();
    }

    public String lockParentCode(Long parentId) {
        return jdbcTemplate.query("""
                SELECT kode_sp FROM sireva.sasaran_program
                WHERE id = ? AND deleted_at IS NULL FOR UPDATE
                """, result -> result.next() ? result.getString("kode_sp") : null, parentId);
    }

    public int maxOrderForParent(Long parentId) {
        Integer max = jdbcTemplate.queryForObject(
                "SELECT coalesce(max(nomor_urut), 0) FROM sireva.sasaran_kegiatan WHERE sp_id = ?",
                Integer.class, parentId);
        return max == null ? 0 : max;
    }

    public SasaranKegiatan create(Long parentId, int order, String code, String name, String owner, String related) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.sasaran_kegiatan (sp_id, nomor_urut, kode_sk, nama_sk, pengampu, instansi_terkait)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id, sp_id, nomor_urut, kode_sk, nama_sk, pengampu, instansi_terkait,
                          is_active, deleted_at, created_at, updated_at
                """, ROW_MAPPER, parentId, order, code, name, owner, related).get(0);
    }

    public Optional<SasaranKegiatan> update(Long id, JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();
        addUpdate(body, "nama_sk", "nama_sk", assignments, parameters);
        addUpdate(body, "pengampu", "pengampu", assignments, parameters);
        addUpdate(body, "instansi_terkait", "instansi_terkait", assignments, parameters);
        if (body.has("is_active")) {
            assignments.add("is_active = ?");
            parameters.add(body.get("is_active").isNull() ? null : body.get("is_active").asBoolean());
        }
        assignments.add("updated_at = CURRENT_TIMESTAMP");
        parameters.add(id);
        return jdbcTemplate.query("""
                UPDATE sireva.sasaran_kegiatan SET %s WHERE id = ? AND deleted_at IS NULL
                RETURNING id, sp_id, nomor_urut, kode_sk, nama_sk, pengampu, instansi_terkait,
                          is_active, deleted_at, created_at, updated_at
                """.formatted(assignments), ROW_MAPPER, parameters.toArray()).stream().findFirst();
    }

    public void softDeleteIndicators(Long id) {
        jdbcTemplate.update("""
                UPDATE sireva.indikator_kinerja
                SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE sk_id = ? AND deleted_at IS NULL
                """, id);
    }

    public boolean softDelete(Long id) {
        return jdbcTemplate.update("""
                UPDATE sireva.sasaran_kegiatan
                SET is_active = false, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND deleted_at IS NULL
                """, id) > 0;
    }

    public Optional<Map<String, Object>> findUnit(Long unitId) {
        return jdbcTemplate.query("SELECT id, nama, parent_id FROM sireva.unit_kerja WHERE id = ?", result -> {
            if (!result.next())
                return Optional.empty();
            Map<String, Object> unit = new LinkedHashMap<>();
            unit.put("id", result.getLong("id"));
            unit.put("nama", result.getString("nama"));
            unit.put("parentId", nullableInteger(result, "parent_id"));
            return Optional.of(unit);
        }, unitId);
    }

    public List<Map<String, Object>> upsertTarget(Long indicatorId, Integer year, String target) {
        List<Long> ids = jdbcTemplate.query("""
                SELECT id FROM sireva.target_indikator_kegiatan WHERE id_iku = ? AND tahun = ? LIMIT 1
                """, (result, rowNumber) -> result.getLong("id"), indicatorId, year);
        if (ids.isEmpty()) {
            return jdbcTemplate.query("""
                    INSERT INTO sireva.target_indikator_kegiatan (id_iku, tahun, target_nilai, created_at)
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    RETURNING id, id_iku, tahun, target_nilai, created_at
                    """, SasaranKegiatanRepository::targetRow, indicatorId, year, target);
        }
        return jdbcTemplate.query("""
                UPDATE sireva.target_indikator_kegiatan SET target_nilai = ? WHERE id = ?
                RETURNING id, id_iku, tahun, target_nilai, created_at
                """, SasaranKegiatanRepository::targetRow, target, ids.get(0));
    }

    private static Map<String, Object> targetRow(ResultSet result, int rowNumber) throws SQLException {
        Map<String, Object> target = new LinkedHashMap<>();
        target.put("id", result.getLong("id"));
        target.put("idIku", result.getLong("id_iku"));
        target.put("tahun", result.getInt("tahun"));
        target.put("targetNilai", result.getString("target_nilai"));
        Timestamp createdAt = result.getTimestamp("created_at");
        target.put("createdAt", createdAt == null ? null : createdAt.toLocalDateTime());
        return target;
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