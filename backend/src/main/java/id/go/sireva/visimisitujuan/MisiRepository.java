package id.go.sireva.visimisitujuan;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class MisiRepository {
    private static final String COLUMNS = "id, visi_id, kode, misi_text";
    private static final RowMapper<Misi> ROW_MAPPER = (result, rowNumber) -> {
        int visiId = result.getInt("visi_id");
        Integer nullableVisiId = result.wasNull() ? null : visiId;
        return new Misi(result.getLong("id"), nullableVisiId, result.getString("kode"), result.getString("misi_text"));
    };

    private final JdbcTemplate jdbcTemplate;

    public MisiRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Misi> find(Long id) {
        String sql = "SELECT " + COLUMNS + " FROM sireva.misi" + (id == null ? "" : " WHERE id = ?");
        return id == null ? jdbcTemplate.query(sql, ROW_MAPPER) : jdbcTemplate.query(sql, ROW_MAPPER, id);
    }

    public List<Misi> save(MisiRequest request) {
        if (request.id() == null) {
            return jdbcTemplate.query("""
                    INSERT INTO sireva.misi (visi_id, kode, misi_text)
                    VALUES (?, ?, ?) RETURNING %s
                    """.formatted(COLUMNS), ROW_MAPPER, request.visiId(), request.kode(), request.misiText());
        }
        return jdbcTemplate.query("""
                UPDATE sireva.misi SET visi_id = ?, kode = ?, misi_text = ? WHERE id = ? RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER, request.visiId(), request.kode(), request.misiText(), request.id());
    }

    public List<Misi> delete(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.misi WHERE id = ? RETURNING " + COLUMNS, ROW_MAPPER, id);
    }
}