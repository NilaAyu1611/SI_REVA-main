package id.go.sireva.sumberdana;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class SumberDanaRepository {
    private static final String COLUMNS = "id, nama";
    private static final RowMapper<SumberDana> ROW_MAPPER =
            (result, rowNumber) -> new SumberDana(result.getLong("id"), result.getString("nama"));

    private final JdbcTemplate jdbcTemplate;

    public SumberDanaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<SumberDana> findAll() {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.sumber_dana", ROW_MAPPER);
    }

    public List<SumberDana> findById(Long id) {
        return jdbcTemplate.query("SELECT " + COLUMNS + " FROM sireva.sumber_dana WHERE id = ?", ROW_MAPPER, id);
    }

    public List<SumberDana> save(SumberDanaRequest request) {
        if (request.id() == null) {
            return jdbcTemplate.query("""
                    INSERT INTO sireva.sumber_dana (nama) VALUES (?) RETURNING %s
                    """.formatted(COLUMNS), ROW_MAPPER, request.nama());
        }
        return jdbcTemplate.query("""
                UPDATE sireva.sumber_dana SET nama = ? WHERE id = ? RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, request.nama(), request.id());
    }

    public List<SumberDana> deleteById(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.sumber_dana WHERE id = ? RETURNING " + COLUMNS,
                ROW_MAPPER, id);
    }
}