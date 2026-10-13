package id.go.sireva.dashboard;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {
    public record Report(String unit, double realisasi, double target) {
    }

    public record IkuRow(String iku, String unit, double target, double realisasi) {
    }

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long countSasaranStrategis() {
        return count("SELECT COUNT(*) FROM sireva.sasaran_strategis WHERE deleted_at IS NULL");
    }

    public long countSasaranProgram() {
        return count("SELECT COUNT(*) FROM sireva.sasaran_program WHERE deleted_at IS NULL");
    }

    public long countSasaranKegiatan() {
        return count("SELECT COUNT(*) FROM sireva.sasaran_kegiatan WHERE deleted_at IS NULL");
    }

    public long countIndikatorProgram() {
        return count("SELECT COUNT(*) FROM sireva.indikator_program");
    }

    public long countIndikatorKegiatan() {
        return count("SELECT COUNT(*) FROM sireva.indikator_kinerja WHERE is_active = true AND deleted_at IS NULL");
    }

    public List<Double> strategisCapaian() {
        return jdbcTemplate.query("""
                SELECT lss.capaian
                FROM sireva.laporan_sasaran_strategis lss
                JOIN sireva.sasaran_strategis ss ON ss.id = lss.sasaran_id
                WHERE ss.deleted_at IS NULL
                """, (result, rowNumber) -> result.getDouble("capaian"));
    }

    public List<Report> programReports() {
        return jdbcTemplate.query("""
                SELECT lsp.realisasi,
                       COALESCE((SELECT tip.target FROM sireva.target_indikator_program tip
                                 WHERE tip.indikator_id = lsp.indikator_id AND tip.tahun = 2026 LIMIT 1), 0) AS target,
                       sp.pengampu AS unit_name
                FROM sireva.laporan_sasaran_program lsp
                JOIN sireva.sasaran_program sp ON sp.id = lsp.sasaran_id
                """, (result, rowNumber) -> new Report(result.getString("unit_name"),
                result.getDouble("realisasi"), result.getDouble("target")));
    }

    public List<Report> kegiatanReports() {
        return jdbcTemplate.query("""
                SELECT lsk.realisasi,
                       COALESCE((SELECT tik.target_nilai FROM sireva.target_indikator_kegiatan tik
                                 WHERE tik.id_iku = lsk.indikator_id AND tik.tahun = 2026 LIMIT 1), 0) AS target,
                       sk.pengampu AS unit_name
                FROM sireva.laporan_sasaran_kegiatan lsk
                JOIN sireva.sasaran_kegiatan sk ON sk.id = lsk.sasaran_id
                """, (result, rowNumber) -> new Report(result.getString("unit_name"),
                result.getDouble("realisasi"), result.getDouble("target")));
    }

    public List<String> unitNames() {
        return jdbcTemplate.query("""
                SELECT DISTINCT nama FROM sireva.unit_kerja
                WHERE nama IS NOT NULL AND nama != 'Kepala LAN'
                ORDER BY nama
                """, (result, rowNumber) -> result.getString("nama"));
    }

    public List<IkuRow> programIkus() {
        return jdbcTemplate.query("""
                SELECT ip.nama AS iku, sp.pengampu AS unit,
                       COALESCE((SELECT tip.target FROM sireva.target_indikator_program tip
                                 WHERE tip.indikator_id = ip.id AND tip.tahun = 2026 LIMIT 1), 0) AS target,
                       COALESCE((SELECT lsp.realisasi FROM sireva.laporan_sasaran_program lsp
                                 WHERE lsp.indikator_id = ip.id ORDER BY lsp.created_at DESC LIMIT 1), 0) AS realisasi
                FROM sireva.indikator_program ip
                JOIN sireva.sasaran_program sp ON sp.id = ip.sasaran_program_id
                """, (result, rowNumber) -> new IkuRow(result.getString("iku"), result.getString("unit"),
                result.getDouble("target"), result.getDouble("realisasi")));
    }

    public List<IkuRow> kegiatanIkus() {
        return jdbcTemplate.query("""
                SELECT ik.nama_iku AS iku, sk.pengampu AS unit,
                       COALESCE((SELECT tik.target_nilai FROM sireva.target_indikator_kegiatan tik
                                 WHERE tik.id_iku = ik.id AND tik.tahun = 2026 LIMIT 1), 0) AS target,
                       COALESCE((SELECT lsk.realisasi FROM sireva.laporan_sasaran_kegiatan lsk
                                 WHERE lsk.indikator_id = ik.id ORDER BY lsk.created_at DESC LIMIT 1), 0) AS realisasi
                FROM sireva.indikator_kinerja ik
                JOIN sireva.sasaran_kegiatan sk ON sk.id = ik.sk_id
                WHERE ik.is_active = true AND ik.deleted_at IS NULL
                """, (result, rowNumber) -> new IkuRow(result.getString("iku"), result.getString("unit"),
                result.getDouble("target"), result.getDouble("realisasi")));
    }

    private long count(String sql) {
        Long value = jdbcTemplate.queryForObject(sql, Long.class);
        return value == null ? 0 : value;
    }
}
