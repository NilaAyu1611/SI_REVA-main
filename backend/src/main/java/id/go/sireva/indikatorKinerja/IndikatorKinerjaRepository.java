package id.go.sireva.indikatorKinerja;

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
public class IndikatorKinerjaRepository {
    private static final String COLUMNS = "id, sk_id, nomor_urut, kode_iku, nama_iku, satuan, target, realisasi, "
            + "is_active, deleted_at, created_at, updated_at";
    private static final String RESPONSE_COLUMNS = COLUMNS
            + ", NULL::text AS target_1, NULL::text AS target_2, NULL::text AS target_3, "
            + "NULL::text AS target_4, NULL::text AS target_5";
    private static final RowMapper<IndikatorKinerja> ROW_MAPPER = (result, rowNumber) -> {
        int skId = result.getInt("sk_id");
        int nomorUrut = result.getInt("nomor_urut");
        boolean isActive = result.getBoolean("is_active");
        Boolean nullableIsActive = result.wasNull() ? null : isActive;
        Timestamp deletedAt = result.getTimestamp("deleted_at");
        Timestamp createdAt = result.getTimestamp("created_at");
        Timestamp updatedAt = result.getTimestamp("updated_at");
        return new IndikatorKinerja(
                result.getLong("id"), skId, nomorUrut, result.getString("kode_iku"), result.getString("nama_iku"),
                result.getString("satuan"), result.getString("target"), result.getString("realisasi"),
                nullableIsActive,
                deletedAt == null ? null : deletedAt.toLocalDateTime(),
                createdAt == null ? null : createdAt.toLocalDateTime(),
                updatedAt == null ? null : updatedAt.toLocalDateTime(),
                result.getString("target_1"), result.getString("target_2"), result.getString("target_3"),
                result.getString("target_4"), result.getString("target_5"));
    };

    private final JdbcTemplate jdbcTemplate;

    public IndikatorKinerjaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<IndikatorKinerja> findAll(Integer skId) {
        return jdbcTemplate.query("""
                SELECT iku.id, iku.sk_id, iku.nomor_urut, iku.kode_iku, iku.nama_iku, iku.satuan, iku.target,
                       iku.realisasi, iku.is_active, iku.deleted_at, iku.created_at, iku.updated_at,
                       MAX(CASE WHEN tik.tahun = 2025 THEN tik.target_nilai::text END) AS target_1,
                       MAX(CASE WHEN tik.tahun = 2026 THEN tik.target_nilai::text END) AS target_2,
                       MAX(CASE WHEN tik.tahun = 2027 THEN tik.target_nilai::text END) AS target_3,
                       MAX(CASE WHEN tik.tahun = 2028 THEN tik.target_nilai::text END) AS target_4,
                       MAX(CASE WHEN tik.tahun = 2029 THEN tik.target_nilai::text END) AS target_5
                FROM sireva.indikator_kinerja iku
                LEFT JOIN sireva.target_indikator_kegiatan tik ON tik.id_iku = iku.id
                                WHERE iku.deleted_at IS NULL
                                    AND (CAST(? AS INTEGER) IS NULL OR iku.sk_id = CAST(? AS INTEGER))
                GROUP BY iku.id, iku.sk_id, iku.nomor_urut, iku.kode_iku, iku.nama_iku, iku.satuan,
                         iku.target, iku.realisasi, iku.is_active, iku.deleted_at, iku.created_at, iku.updated_at
                ORDER BY iku.nomor_urut
                """, ROW_MAPPER, skId, skId);
    }

    public Optional<IndikatorKinerja> findActiveById(Long id) {
        return jdbcTemplate.query("""
                SELECT %s FROM sireva.indikator_kinerja
                WHERE id = ? AND deleted_at IS NULL
                """.formatted(RESPONSE_COLUMNS), ROW_MAPPER, id).stream().findFirst();
    }

    public String lockParentCode(Integer skId) {
        List<String> codes = jdbcTemplate.query("""
                SELECT kode_sk FROM sireva.sasaran_kegiatan
                WHERE id = ? AND deleted_at IS NULL FOR UPDATE
                """, (result, rowNumber) -> result.getString("kode_sk"), skId);
        return codes.stream().findFirst().orElse(null);
    }

    public int findMaxOrder(Integer skId) {
        Integer max = jdbcTemplate.queryForObject(
                "SELECT coalesce(max(nomor_urut), 0) FROM sireva.indikator_kinerja WHERE sk_id = ?", Integer.class, skId);
        return max == null ? 0 : max;
    }

    public IndikatorKinerja create(Integer skId, Integer nomorUrut, String kodeIku, String namaIku,
            String satuan, String target, String realisasi) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.indikator_kinerja
                    (sk_id, nomor_urut, kode_iku, nama_iku, satuan, target, realisasi)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING %s
                """.formatted(RESPONSE_COLUMNS), ROW_MAPPER,
                skId, nomorUrut, kodeIku, namaIku, satuan, target, realisasi).get(0);
    }

    public Optional<IndikatorKinerja> update(Long id, JsonNode body) {
        StringJoiner assignments = new StringJoiner(", ");
        List<Object> parameters = new ArrayList<>();
        addUpdate(body, "nama_iku", "nama_iku", assignments, parameters);
        addUpdate(body, "satuan", "satuan", assignments, parameters);
        addUpdate(body, "target", "target", assignments, parameters);
        addUpdate(body, "realisasi", "realisasi", assignments, parameters);
        if (body.has("is_active")) {
            assignments.add("is_active = ?");
            parameters.add(body.get("is_active").isNull() ? null : body.get("is_active").asBoolean());
        }
        assignments.add("updated_at = CURRENT_TIMESTAMP");
        parameters.add(id);
        return jdbcTemplate.query("""
                UPDATE sireva.indikator_kinerja SET %s WHERE id = ? AND deleted_at IS NULL
                RETURNING %s
                """.formatted(assignments, RESPONSE_COLUMNS), ROW_MAPPER, parameters.toArray()).stream().findFirst();
    }

    public void upsertTarget(Long id, Integer year, String value) {
        List<Long> targetIds = jdbcTemplate.query("""
                SELECT id FROM sireva.target_indikator_kegiatan WHERE id_iku = ? AND tahun = ? LIMIT 1
                """, (result, rowNumber) -> result.getLong("id"), id, year);
        if (targetIds.isEmpty()) {
            jdbcTemplate.update("""
                    INSERT INTO sireva.target_indikator_kegiatan (id_iku, tahun, target_nilai, created_at)
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    """, id, year, value);
        } else {
            jdbcTemplate.update("UPDATE sireva.target_indikator_kegiatan SET target_nilai = ? WHERE id = ?",
                    value, targetIds.get(0));
        }
    }

    public boolean softDelete(Long id) {
        return jdbcTemplate.update("""
                UPDATE sireva.indikator_kinerja
                SET is_active = false, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND deleted_at IS NULL
                """, id) > 0;
    }

    private void addUpdate(JsonNode body, String jsonName, String column, StringJoiner assignments,
            List<Object> parameters) {
        if (body.has(jsonName)) {
            assignments.add(column + " = ?");
            JsonNode value = body.get(jsonName);
            parameters.add(value == null || value.isNull() ? null : value.asText());
        }
    }
}