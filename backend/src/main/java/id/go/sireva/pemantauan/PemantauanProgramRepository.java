package id.go.sireva.pemantauan;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import id.go.sireva.common.JdbcRows;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PemantauanProgramRepository {
    private static final String RETURNING = "id, sasaran_id, indikator_id, realisasi, realisasi_kik, "
            + "analisa_capaian, analisa_permasalahan, tindak_lanjut, created_at::text AS created_at";
    private static final String TARGET = """
            COALESCE((SELECT tip.target FROM sireva.target_indikator_program tip
                      WHERE tip.indikator_id = ip.id AND tip.tahun = 2026 LIMIT 1), 0)::text""";

    private final JdbcTemplate jdbcTemplate;

    public PemantauanProgramRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.query("""
                SELECT lsp.id, sp.nama_sp AS sasaran_text, ip.nama AS indikator_nama, lsp.realisasi,
                       %s AS target_value, ip.satuan
                FROM sireva.laporan_sasaran_program lsp
                LEFT JOIN sireva.sasaran_program sp ON lsp.sasaran_id = sp.id
                LEFT JOIN sireva.indikator_program ip ON lsp.indikator_id = ip.id
                ORDER BY lsp.id""".formatted(TARGET), JdbcRows.CAMEL_MAP);
    }

    public Optional<Map<String, Object>> findById(long id) {
        return jdbcTemplate.query("""
                SELECT lsp.id, lsp.sasaran_id, lsp.indikator_id, lsp.realisasi, lsp.realisasi_kik,
                       lsp.analisa_capaian, lsp.analisa_permasalahan, lsp.tindak_lanjut,
                       sp.nama_sp AS sasaran_text, ip.nama AS indikator_nama,
                       COALESCE(string_agg(DISTINCT uk.nama, ', '), '') AS unit_kerja_nama,
                       COALESCE(array_agg(DISTINCT uk.id) FILTER (WHERE uk.id IS NOT NULL),
                                '{}'::integer[]) AS unit_kerja_ids,
                       %s AS target_value, ip.satuan
                FROM sireva.laporan_sasaran_program lsp
                LEFT JOIN sireva.sasaran_program sp ON lsp.sasaran_id = sp.id
                LEFT JOIN sireva.indikator_program ip ON lsp.indikator_id = ip.id
                LEFT JOIN sireva.sasaran_program_unit_kerja spuk ON sp.id = spuk.sasaran_program_id
                LEFT JOIN sireva.unit_kerja uk ON spuk.unit_kerja_id = uk.id
                WHERE lsp.id = ?
                GROUP BY lsp.id, lsp.sasaran_id, lsp.indikator_id, lsp.realisasi, lsp.realisasi_kik,
                         lsp.analisa_capaian, lsp.analisa_permasalahan, lsp.tindak_lanjut,
                         sp.nama_sp, ip.id, ip.nama, ip.satuan""".formatted(TARGET), JdbcRows.CAMEL_MAP, id)
                .stream().findFirst();
    }

    public Map<String, Object> insert(long sasaranId, long indikatorId, BigDecimal realisasi,
            BigDecimal realisasiKik, String analisaCapaian, String analisaPermasalahan, String tindakLanjut) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.laporan_sasaran_program
                    (sasaran_id, indikator_id, realisasi, realisasi_kik, analisa_capaian, analisa_permasalahan,
                     tindak_lanjut)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, sasaranId, indikatorId, realisasi, realisasiKik,
                analisaCapaian, analisaPermasalahan, tindakLanjut).get(0);
    }

    public Optional<Map<String, Object>> update(long id, BigDecimal realisasi, BigDecimal realisasiKik,
            String analisaCapaian, String analisaPermasalahan, String tindakLanjut) {
        return jdbcTemplate.query("""
                UPDATE sireva.laporan_sasaran_program
                SET realisasi = ?, realisasi_kik = ?, analisa_capaian = ?, analisa_permasalahan = ?,
                    tindak_lanjut = ?
                WHERE id = ?
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, realisasi, realisasiKik, analisaCapaian,
                analisaPermasalahan, tindakLanjut, id).stream().findFirst();
    }

    public void deleteById(long id) {
        jdbcTemplate.update("DELETE FROM sireva.laporan_sasaran_program WHERE id = ?", id);
    }
}
