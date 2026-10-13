package id.go.sireva.capaiankinerja;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/capaian-kinerja")
public class CapaianKinerjaController {
    private static final List<String> ROMAN = List.of("I", "II", "III", "IV");

    private final JdbcTemplate jdbcTemplate;

    public CapaianKinerjaController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> find(@RequestParam String unitKerja, @RequestParam String triwulan) {
        int quarter = ROMAN.indexOf(triwulan.replaceAll("(?i)triwulan", "").trim().toUpperCase()) + 1;
        if (quarter == 0) {
            return List.of();
        }
        return jdbcTemplate.queryForList("""
                SELECT DISTINCT ON (r.indikator_kode)
                       COALESCE(ik.nama_iku, r.indikator_kode) AS "indikatorName",
                       r.target AS "target",
                       r.realisasi AS "capaian"
                FROM sireva.realisasi_indikator r
                JOIN sireva.unit_kerja u ON u.id = r.unit_id
                LEFT JOIN sireva.indikator_kinerja ik ON ik.kode_iku = r.indikator_kode
                WHERE LOWER(TRIM(u.nama)) = LOWER(TRIM(?)) AND r.triwulan = ?
                ORDER BY r.indikator_kode, r.bulan DESC NULLS LAST, r.id DESC
                """, unitKerja, quarter);
    }
}
