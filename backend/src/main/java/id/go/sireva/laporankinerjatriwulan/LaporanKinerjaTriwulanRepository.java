package id.go.sireva.laporankinerjatriwulan;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class LaporanKinerjaTriwulanRepository {
    private static final String COLUMNS = "id, tahun, triwulan, unit_kerja, ringkasan_eksekutif, kata_pengantar, "
            + "rencana_tindak_lanjut, informasi_tambahan, lampiran_url, status, created_at";
    private static final RowMapper<LaporanKinerjaTriwulan> ROW_MAPPER = (result, rowNumber) -> {
        Timestamp createdAt = result.getTimestamp("created_at");
        return new LaporanKinerjaTriwulan(result.getLong("id"), result.getInt("tahun"),
                result.getString("triwulan"), result.getString("unit_kerja"),
                result.getString("ringkasan_eksekutif"), result.getString("kata_pengantar"),
                result.getString("rencana_tindak_lanjut"), result.getString("informasi_tambahan"),
                result.getString("lampiran_url"), result.getString("status"),
                createdAt == null ? null : createdAt.toLocalDateTime());
    };

    private final JdbcTemplate jdbcTemplate;

    public LaporanKinerjaTriwulanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<LaporanKinerjaTriwulan> findById(Long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.laporan_kinerja_triwulan WHERE id = ?",
                ROW_MAPPER, id);
    }

    public List<LaporanKinerjaTriwulan> findSummaries(Integer year, String quarter, String unit) {
        StringBuilder query = new StringBuilder("SELECT id, tahun, triwulan, unit_kerja, status "
                + "FROM sireva.laporan_kinerja_triwulan WHERE 1 = 1");
        List<Object> parameters = new ArrayList<>();
        if (year != null) {
            query.append(" AND tahun = ?");
            parameters.add(year);
        }
        if (quarter != null) {
            query.append(" AND triwulan = ?");
            parameters.add(quarter);
        }
        if (unit != null) {
            query.append(" AND unit_kerja = ?");
            parameters.add(unit);
        }
        query.append(" ORDER BY tahun DESC, triwulan, unit_kerja");
        return jdbcTemplate.query(query.toString(), (result, rowNumber) -> new LaporanKinerjaTriwulan(
                result.getLong("id"), result.getInt("tahun"), result.getString("triwulan"),
                result.getString("unit_kerja"), null, null, null, null, null, result.getString("status"), null),
                parameters.toArray());
    }

    public List<LaporanKinerjaTriwulan> findUnique(Integer year, String quarter, String unit) {
        return jdbcTemplate.query("""
                SELECT %s FROM sireva.laporan_kinerja_triwulan
                WHERE tahun = ? AND triwulan = ? AND unit_kerja = ?
                LIMIT 1
                """.formatted(COLUMNS), ROW_MAPPER, year, quarter, unit);
    }

    public List<LaporanKinerjaTriwulan> create(LaporanKinerjaTriwulan report) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.laporan_kinerja_triwulan
                    (tahun, triwulan, unit_kerja, ringkasan_eksekutif, kata_pengantar,
                     rencana_tindak_lanjut, informasi_tambahan, lampiran_url, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, report.tahun(), report.triwulan(), report.unitKerja(),
                report.ringkasanEksekutif(), report.kataPengantar(), report.rencanaTindakLanjut(),
                report.informasiTambahan(), report.lampiranUrl(), report.status());
    }

    public List<LaporanKinerjaTriwulan> update(Long id, LaporanKinerjaTriwulan report) {
        return jdbcTemplate.query("""
                UPDATE sireva.laporan_kinerja_triwulan
                SET ringkasan_eksekutif = ?, kata_pengantar = ?, rencana_tindak_lanjut = ?,
                    informasi_tambahan = ?, lampiran_url = ?, status = ?
                WHERE id = ?
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, report.ringkasanEksekutif(), report.kataPengantar(),
                report.rencanaTindakLanjut(), report.informasiTambahan(), report.lampiranUrl(), report.status(), id);
    }

    public int delete(Long id) {
        return jdbcTemplate.update("DELETE FROM sireva.laporan_kinerja_triwulan WHERE id = ?", id);
    }
}