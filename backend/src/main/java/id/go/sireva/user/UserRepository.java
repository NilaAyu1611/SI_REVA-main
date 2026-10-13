package id.go.sireva.user;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    private static final String USER_COLUMNS = "id, username, password, alias, unit_kerja, role_id, role, created_at";
    private static final RowMapper<StoredUser> USER_ROW_MAPPER = (result, rowNumber) -> {
        int roleId = result.getInt("role_id");
        Integer nullableRoleId = result.wasNull() ? null : roleId;
        Timestamp createdAt = result.getTimestamp("created_at");
        return new StoredUser(
                result.getLong("id"),
                result.getString("username"),
                result.getString("password"),
                result.getString("alias"),
                result.getString("unit_kerja"),
                nullableRoleId,
                result.getString("role"),
                createdAt == null ? null : createdAt.toLocalDateTime());
    };

    private static final String FIND_BY_USERNAME = """
            SELECT %s
            FROM sireva.users
            WHERE username = ?
            LIMIT 1
            """.formatted(USER_COLUMNS);

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<StoredUser> findAll() {
        return jdbcTemplate.query("SELECT " + USER_COLUMNS + " FROM sireva.users ORDER BY id", USER_ROW_MAPPER);
    }

    public Optional<StoredUser> findByUsername(String username) {
        List<StoredUser> matches = jdbcTemplate.query(FIND_BY_USERNAME, USER_ROW_MAPPER, username);

        return matches.stream().findFirst();
    }

    public Optional<StoredUser> create(String username, String passwordHash, String alias, String unitKerja,
            Integer roleId, String role) {
        List<StoredUser> created = jdbcTemplate.query("""
                INSERT INTO sireva.users (username, password, alias, unit_kerja, role_id, role)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING %s
                """.formatted(USER_COLUMNS), USER_ROW_MAPPER,
                username, passwordHash, alias, unitKerja, roleId, role);
        return created.stream().findFirst();
    }

    public Optional<StoredUser> update(Long id, String username, String passwordHash, String alias, String unitKerja,
            Integer roleId, String role) {
        List<StoredUser> updated = jdbcTemplate.query("""
                UPDATE sireva.users
                SET username = ?, password = COALESCE(?, password), alias = ?, unit_kerja = ?, role_id = ?, role = ?
                WHERE id = ?
                RETURNING %s
                """.formatted(USER_COLUMNS), USER_ROW_MAPPER,
                username, passwordHash, alias, unitKerja, roleId, role, id);
        return updated.stream().findFirst();
    }

    public Optional<String> findRoleName(Integer roleId) {
        return jdbcTemplate.queryForList("SELECT nama_role FROM sireva.roles WHERE id = ?", String.class, roleId)
                .stream().findFirst();
    }

    public Optional<StoredUser> deleteById(Long id) {
        List<StoredUser> matches = jdbcTemplate.query(
                "SELECT " + USER_COLUMNS + " FROM sireva.users WHERE id = ?", USER_ROW_MAPPER, id);
        if (matches.isEmpty()) {
            return Optional.empty();
        }

        jdbcTemplate.update("DELETE FROM sireva.users WHERE id = ?", id);
        return matches.stream().findFirst();
    }
}