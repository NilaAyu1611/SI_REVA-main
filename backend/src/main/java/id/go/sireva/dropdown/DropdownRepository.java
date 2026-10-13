package id.go.sireva.dropdown;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DropdownRepository {
    private final JdbcTemplate jdbcTemplate;

    public DropdownRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> sasaranStrategis() {
        return query("SELECT id, kode_ss AS kode, nama_ss AS nama FROM sireva.sasaran_strategis "
                + "WHERE is_active = true AND deleted_at IS NULL ORDER BY nomor_urut");
    }

    public List<Map<String, Object>> sasaranProgram(Long ssId) {
        return query("SELECT id, kode_sp AS kode, nama_sp AS nama FROM sireva.sasaran_program "
                + "WHERE is_active = true AND deleted_at IS NULL AND (CAST(? AS BIGINT) IS NULL OR ss_id = CAST(? AS BIGINT)) "
                + "ORDER BY nomor_urut", ssId, ssId);
    }

    public List<Map<String, Object>> sasaranKegiatan(Long spId) {
        return query("SELECT id, kode_sk AS kode, nama_sk AS nama FROM sireva.sasaran_kegiatan "
                + "WHERE is_active = true AND deleted_at IS NULL AND (CAST(? AS BIGINT) IS NULL OR sp_id = CAST(? AS BIGINT)) "
                + "ORDER BY nomor_urut", spId, spId);
    }

    public List<Map<String, Object>> indikatorKinerja(Long skId) {
        return query("SELECT id, kode_iku AS kode, nama_iku AS nama FROM sireva.indikator_kinerja "
                + "WHERE is_active = true AND deleted_at IS NULL AND (CAST(? AS BIGINT) IS NULL OR sk_id = CAST(? AS BIGINT)) "
                + "ORDER BY nomor_urut", skId, skId);
    }

    private List<Map<String, Object>> query(String sql, Object... args) {
        return jdbcTemplate.query(sql, (result, rowNumber) -> {
            String kode = result.getString("kode");
            String nama = result.getString("nama");
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", result.getLong("id"));
            row.put("kode", kode);
            row.put("nama", nama);
            row.put("label", kode + " - " + nama);
            return row;
        }, args);
    }
}
