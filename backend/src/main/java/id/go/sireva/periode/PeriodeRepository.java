package id.go.sireva.periode;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class PeriodeRepository {
    private static final String COLUMNS = "id, nama, tahun_mulai, tahun_selesai, is_active";
    private static final RowMapper<Periode> ROW_MAPPER = (result, rowNumber) -> {
        int start = result.getInt("tahun_mulai");
        Integer tahunMulai = result.wasNull() ? null : start;
        int end = result.getInt("tahun_selesai");
        Integer tahunSelesai = result.wasNull() ? null : end;
        boolean active = result.getBoolean("is_active");
        Boolean isActive = result.wasNull() ? null : active;
        return new Periode(result.getLong("id"), result.getString("nama"), tahunMulai, tahunSelesai, isActive);
    };

    private final JdbcTemplate jdbcTemplate;

    public PeriodeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Periode> findAll() {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.periode", ROW_MAPPER);
    }

    public List<Periode> findById(Long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.periode WHERE id = ?", ROW_MAPPER, id);
    }

    public Optional<Periode> create(PeriodeRequest request) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.periode (nama, tahun_mulai, tahun_selesai, is_active)
                VALUES (?, ?, ?, ?)
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER,
                request.nama(), request.tahunMulai(), request.tahunSelesai(), request.isActive()).stream().findFirst();
    }

    public Optional<Periode> update(PeriodeRequest request) {
        return jdbcTemplate.query("""
                UPDATE sireva.periode
                SET nama = ?, tahun_mulai = ?, tahun_selesai = ?, is_active = ?
                WHERE id = ?
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER,
                request.nama(), request.tahunMulai(), request.tahunSelesai(), request.isActive(), request.id())
                .stream().findFirst();
    }

    public List<Periode> deleteById(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.periode WHERE id = ? RETURNING " + COLUMNS,
                ROW_MAPPER, id);
    }
}