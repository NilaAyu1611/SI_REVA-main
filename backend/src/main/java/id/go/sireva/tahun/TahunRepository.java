package id.go.sireva.tahun;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TahunRepository {
    private static final String COLUMNS = "id, tahun, periode_id";
    private static final RowMapper<Tahun> ROW_MAPPER = (result, rowNumber) -> {
        int periodeId = result.getInt("periode_id");
        Integer nullablePeriodeId = result.wasNull() ? null : periodeId;
        return new Tahun(result.getLong("id"), result.getInt("tahun"), nullablePeriodeId);
    };

    private final JdbcTemplate jdbcTemplate;

    public TahunRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Tahun> findAll() {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.tahun ORDER BY tahun", ROW_MAPPER);
    }

    public Optional<Tahun> findById(Long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.tahun WHERE id = ?", ROW_MAPPER, id)
                .stream().findFirst();
    }

    public Optional<Tahun> create(TahunRequest request) {
        return jdbcTemplate.query("""
                INSERT INTO sireva.tahun (tahun, periode_id)
                VALUES (?, ?)
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, request.tahun(), request.periodeId()).stream().findFirst();
    }

    public Optional<Tahun> update(TahunRequest request) {
        return jdbcTemplate.query("""
                UPDATE sireva.tahun
                SET tahun = ?, periode_id = ?
                WHERE id = ?
                RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, request.tahun(), request.periodeId(), request.id())
                .stream().findFirst();
    }

    public Optional<Tahun> deleteById(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.tahun WHERE id = ? RETURNING " + COLUMNS,
                ROW_MAPPER, id).stream().findFirst();
    }
}