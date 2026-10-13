package id.go.sireva.perjanjiankinerja;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import id.go.sireva.common.JdbcRows;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PerjanjianKinerjaRepository {
    private static final String RETURNING = "id, tahun, unit_kerja, sasaran_id, indikator_id, target, status, "
            + "created_at::text AS created_at";

    private final JdbcTemplate jdbcTemplate;

    public PerjanjianKinerjaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> find(Integer tahun, String unitKerja) {
        StringBuilder sql = new StringBuilder("""
                SELECT pk.id, pk.tahun, pk.target, pk.unit_kerja, pk.sasaran_id, pk.indikator_id,
                       ik.nama_iku AS indikator_name, sk.nama_sk AS sasaran_text
                FROM sireva.perjanjian_kinerja pk
                LEFT JOIN sireva.indikator_kinerja ik ON pk.indikator_id = ik.id
                LEFT JOIN sireva.sasaran_kegiatan sk ON ik.sk_id = sk.id
                """);
        List<Object> args = new ArrayList<>();
        if (tahun != null) {
            sql.append(" WHERE pk.tahun = ?");
            args.add(tahun);
            if (unitKerja != null && !unitKerja.isEmpty()) {
                sql.append(" AND pk.unit_kerja = ?");
                args.add(unitKerja);
            }
        }
        sql.append(" ORDER BY pk.id");
        return jdbcTemplate.query(sql.toString(), JdbcRows.CAMEL_MAP, args.toArray());
    }

    public boolean exists(int tahun, long indikatorId, String unitKerja) {
        Integer count = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM sireva.perjanjian_kinerja
                WHERE tahun = ? AND indikator_id = ? AND unit_kerja = ?
                """, Integer.class, tahun, indikatorId, unitKerja);
        return count != null && count > 0;
    }

    public Map<String, Object> insert(int tahun, String unitKerja, long sasaranId, long indikatorId,
            String target, String status) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.perjanjian_kinerja (tahun, unit_kerja, sasaran_id, indikator_id, target, status)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING\s""" + RETURNING, JdbcRows.CAMEL_MAP, tahun, unitKerja, sasaranId, indikatorId, target,
                status).get(0);
    }

    public List<Map<String, Object>> deleteById(long id) {
        return jdbcTemplate.query("DELETE FROM sireva.perjanjian_kinerja WHERE id = ? RETURNING " + RETURNING,
                JdbcRows.CAMEL_MAP, id);
    }
}
