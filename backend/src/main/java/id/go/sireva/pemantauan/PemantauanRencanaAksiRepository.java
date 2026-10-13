package id.go.sireva.pemantauan;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import id.go.sireva.common.JdbcRows;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PemantauanRencanaAksiRepository {
    private static final String RETURNING = "id, rencana_aksi_id, capaian, analisa_capaian, analisa_permasalahan, "
            + "keterangan_rencana_aksi, created_at::text AS created_at";
    private static final String FROM = """
            FROM sireva.laporan_rencana_aksi lra
            LEFT JOIN sireva.rencana_aksi ra ON lra.rencana_aksi_id = ra.id
            LEFT JOIN sireva.sasaran_kegiatan sk ON ra.indikator_id = sk.id
            LEFT JOIN sireva.indikator_kinerja ik ON sk.id = ik.sk_id
            LEFT JOIN sireva.sasaran_program sp ON sk.sp_id = sp.id
            """;

    private final JdbcTemplate jdbcTemplate;

    public PemantauanRencanaAksiRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.query("""
                SELECT lra.id, ra.nama_rencana_aksi AS rencana_aksi_nama, ik.nama_iku AS indikator_nama,
                       lra.capaian AS realisasi, ra.target AS target_value, sk.pengampu AS unit_kerja,
                       sp.pengampu AS program_unit_kerja, lra.keterangan_rencana_aksi AS keterangan
                """ + FROM + " ORDER BY lra.id", JdbcRows.CAMEL_MAP);
    }

    public Optional<Map<String, Object>> findById(long id) {
        return jdbcTemplate.query("""
                SELECT lra.id, lra.rencana_aksi_id, lra.capaian, lra.analisa_capaian, lra.analisa_permasalahan,
                       lra.keterangan_rencana_aksi, ra.nama_rencana_aksi AS rencana_aksi_nama,
                       ik.nama_iku AS indikator_nama, ra.target AS target_value,
                       sk.pengampu AS unit_kerja_nama, sk.nama_sk AS sasaran_text,
                       sp.pengampu AS program_unit_kerja
                """ + FROM + " WHERE lra.id = ? ORDER BY lra.id", JdbcRows.CAMEL_MAP, id).stream().findFirst();
    }

    public Map<String, Object> insert(long rencanaAksiId, BigDecimal capaian, String analisaCapaian,
            String analisaPermasalahan, String keterangan) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.laporan_rencana_aksi
                    (rencana_aksi_id, capaian, analisa_capaian, analisa_permasalahan, keterangan_rencana_aksi)
                VALUES (?, ?, ?, ?, ?)
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, rencanaAksiId, capaian, analisaCapaian,
                analisaPermasalahan, keterangan).get(0);
    }

    public Optional<Map<String, Object>> update(long id, BigDecimal capaian, String analisaCapaian,
            String analisaPermasalahan, String keterangan) {
        return jdbcTemplate.query("""
                UPDATE sireva.laporan_rencana_aksi
                SET capaian = ?, analisa_capaian = ?, analisa_permasalahan = ?, keterangan_rencana_aksi = ?
                WHERE id = ?
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, capaian, analisaCapaian, analisaPermasalahan,
                keterangan, id).stream().findFirst();
    }

    public void deleteById(long id) {
        jdbcTemplate.update("DELETE FROM sireva.laporan_rencana_aksi WHERE id = ?", id);
    }
}
