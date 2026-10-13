package id.go.sireva.visimisitujuan;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class VisiRepository {
    private static final String COLUMNS = "id, periode_id, visi_text, created_at";
    private static final RowMapper<Visi> ROW_MAPPER = (result, rowNumber) -> {
        int periodeId = result.getInt("periode_id");
        Integer nullablePeriodeId = result.wasNull() ? null : periodeId;
        Timestamp createdAt = result.getTimestamp("created_at");
        return new Visi(result.getLong("id"), nullablePeriodeId, result.getString("visi_text"),
                createdAt == null ? null : createdAt.toLocalDateTime());
    };

    private final JdbcTemplate jdbcTemplate;

    public VisiRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Visi> find(Long id) {
        String sql = "SELECT " + COLUMNS + " FROM sireva.visi" + (id == null ? "" : " WHERE id = ?");
        return id == null ? jdbcTemplate.query(sql, ROW_MAPPER) : jdbcTemplate.query(sql, ROW_MAPPER, id);
    }

    public List<Visi> save(VisiRequest request) {
        if (request.id() == null) {
            return jdbcTemplate.query("""
                    INSERT INTO sireva.visi (periode_id, visi_text)
                    VALUES (?, ?) RETURNING %s
                    """.formatted(COLUMNS), ROW_MAPPER, request.periodeId(), request.visiText());
        }
        return jdbcTemplate.query("""
                UPDATE sireva.visi SET periode_id = ?, visi_text = ? WHERE id = ? RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, request.periodeId(), request.visiText(), request.id());
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM sireva.visi WHERE id = ?", id);
    }
}