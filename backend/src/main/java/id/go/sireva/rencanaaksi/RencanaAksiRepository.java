package id.go.sireva.rencanaaksi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import id.go.sireva.common.JdbcRows;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RencanaAksiRepository {
    static final List<String> NUMERIC_COLUMNS = List.of("target", "tw1", "tw2", "tw3", "tw4",
            "b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08", "b09", "b10", "b11", "b12");
    private static final String COLUMNS = "id, indikator_id, nama_rencana_aksi, "
            + String.join(", ", NUMERIC_COLUMNS);

    private final JdbcTemplate jdbcTemplate;

    public RencanaAksiRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAllWithLabels() {
        return jdbcTemplate.query("""
                SELECT ra.id, ra.indikator_id, ra.nama_rencana_aksi AS rencana_aksi,
                       ra.nama_rencana_aksi, ra.target, NULL AS anggaran,
                       sk.nama_sk AS indikator, sk.nama_sk AS indikator_nama,
                       sp.nama_sp AS sasaran, sp.id AS sasaran_program_id,
                       sk.pengampu AS unit_kerja, sk.pengampu AS unit_kerja_nama,
                       ss.tahun, ra.tw1, ra.tw2, ra.tw3, ra.tw4
                FROM sireva.rencana_aksi ra
                LEFT JOIN sireva.sasaran_kegiatan sk ON ra.indikator_id = sk.id
                LEFT JOIN sireva.sasaran_program sp ON sk.sp_id = sp.id
                LEFT JOIN sireva.sasaran_strategis ss ON sp.ss_id = ss.id
                ORDER BY ra.id
                """, JdbcRows.CAMEL_MAP);
    }

    public Optional<Map<String, Object>> findById(long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.rencana_aksi WHERE id = ?",
                JdbcRows.CAMEL_MAP, id).stream().findFirst();
    }

    public Optional<Map<String, Object>> insert(long indikatorId, String nama, List<Object> numericValues) {
        List<Object> args = new ArrayList<>();
        args.add(indikatorId);
        args.add(nama);
        args.addAll(numericValues);
        String placeholders = String.join(", ", java.util.Collections.nCopies(args.size(), "?"));
        return jdbcTemplate.query("INSERT INTO sireva.rencana_aksi (indikator_id, nama_rencana_aksi, "
                + String.join(", ", NUMERIC_COLUMNS) + ") VALUES (" + placeholders + ") RETURNING " + COLUMNS,
                JdbcRows.CAMEL_MAP, args.toArray()).stream().findFirst();
    }

    /** Column names come from fixed constants, never from request data. */
    public Optional<Map<String, Object>> update(long id, List<String> columns, List<Object> values) {
        String assignments = String.join(", ", columns.stream().map(column -> column + " = ?").toList());
        List<Object> args = new ArrayList<>(values);
        args.add(id);
        return jdbcTemplate.query("UPDATE sireva.rencana_aksi SET " + assignments + " WHERE id = ? RETURNING "
                + COLUMNS, JdbcRows.CAMEL_MAP, args.toArray()).stream().findFirst();
    }

    public void deleteById(long id) {
        jdbcTemplate.update("DELETE FROM sireva.rencana_aksi WHERE id = ?", id);
    }
}
