package id.go.sireva.pemantauan;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import id.go.sireva.common.JdbcRows;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PemantauanKegiatanRepository {
    private static final String RETURNING = "id, sasaran_id, indikator_id, realisasi, realisasi_kik, "
            + "analisa_capaian, analisa_permasalahan, created_at::text AS created_at";
    private static final String TARGET = """
            COALESCE((SELECT tik.target_nilai FROM sireva.target_indikator_kegiatan tik
                      WHERE tik.id_iku = ik.id AND tik.tahun = 2026 LIMIT 1), 0)::text""";
    private static final String FROM = """
            FROM sireva.laporan_sasaran_kegiatan lsk
            LEFT JOIN sireva.sasaran_kegiatan sk ON lsk.sasaran_id = sk.id
            LEFT JOIN sireva.indikator_kinerja ik ON lsk.indikator_id = ik.id
            """;

    private final JdbcTemplate jdbcTemplate;

    public PemantauanKegiatanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.query("""
                SELECT lsk.id, sk.nama_sk AS sasaran_text, sk.kode_sk AS kode, ik.nama_iku AS indikator_nama,
                       lsk.realisasi, %s AS target_value, ik.satuan
                %s ORDER BY lsk.id""".formatted(TARGET, FROM), JdbcRows.CAMEL_MAP);
    }

    public Optional<Map<String, Object>> findById(long id) {
        return jdbcTemplate.query("""
                SELECT lsk.id, lsk.sasaran_id, lsk.indikator_id, lsk.realisasi, lsk.realisasi_kik,
                       lsk.analisa_capaian, lsk.analisa_permasalahan, sk.nama_sk AS sasaran_text,
                       sk.kode_sk AS kode, ik.nama_iku AS indikator_nama, sk.pengampu AS unit_kerja_nama,
                       %s AS target_value, ik.satuan
                %s WHERE lsk.id = ?""".formatted(TARGET, FROM), JdbcRows.CAMEL_MAP, id).stream().findFirst();
    }

    public Map<String, Object> insert(long sasaranId, long indikatorId, BigDecimal realisasi,
            BigDecimal realisasiKik, String analisaCapaian, String analisaPermasalahan) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.laporan_sasaran_kegiatan
                    (sasaran_id, indikator_id, realisasi, realisasi_kik, analisa_capaian, analisa_permasalahan)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, sasaranId, indikatorId, realisasi, realisasiKik,
                analisaCapaian, analisaPermasalahan).get(0);
    }

    public Optional<Map<String, Object>> update(long id, BigDecimal realisasi, BigDecimal realisasiKik,
            String analisaCapaian, String analisaPermasalahan) {
        return jdbcTemplate.query("""
                UPDATE sireva.laporan_sasaran_kegiatan
                SET realisasi = ?, realisasi_kik = ?, analisa_capaian = ?, analisa_permasalahan = ?
                WHERE id = ?
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, realisasi, realisasiKik, analisaCapaian,
                analisaPermasalahan, id).stream().findFirst();
    }

    public void deleteById(long id) {
        jdbcTemplate.update("DELETE FROM sireva.laporan_sasaran_kegiatan WHERE id = ?", id);
    }
}
