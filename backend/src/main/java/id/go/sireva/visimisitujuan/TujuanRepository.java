package id.go.sireva.visimisitujuan;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TujuanRepository {
    private static final String COLUMNS = "id, misi_id, kode, tujuan_text";
    private static final RowMapper<Tujuan> ROW_MAPPER = (result, rowNumber) -> {
        int misiId = result.getInt("misi_id");
        Integer nullableMisiId = result.wasNull() ? null : misiId;
        return new Tujuan(result.getLong("id"), nullableMisiId, result.getString("kode"),
                result.getString("tujuan_text"));
    };

    private final JdbcTemplate jdbcTemplate;

    public TujuanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Tujuan> find(Long id) {
        String sql = "SELECT " + COLUMNS + " FROM sireva.tujuan" + (id == null ? "" : " WHERE id = ?");
        return id == null ? jdbcTemplate.query(sql, ROW_MAPPER) : jdbcTemplate.query(sql, ROW_MAPPER, id);
    }

    public List<Tujuan> save(TujuanRequest request) {
        if (request.id() == null) {
            return jdbcTemplate.query("""
                    INSERT INTO sireva.tujuan (misi_id, kode, tujuan_text)
                    VALUES (?, ?, ?) RETURNING %s
                    """.formatted(COLUMNS), ROW_MAPPER, request.misiId(), request.kode(), request.tujuanText());
        }
        return jdbcTemplate.query("""
                UPDATE sireva.tujuan SET misi_id = ?, kode = ?, tujuan_text = ? WHERE id = ? RETURNING %s
                """.formatted(COLUMNS), ROW_MAPPER,
                request.misiId(), request.kode(), request.tujuanText(), request.id());
    }

    public List<Tujuan> delete(Long id) {
        return jdbcTemplate.query("DELETE FROM sireva.tujuan WHERE id = ? RETURNING " + COLUMNS, ROW_MAPPER, id);
    }
}