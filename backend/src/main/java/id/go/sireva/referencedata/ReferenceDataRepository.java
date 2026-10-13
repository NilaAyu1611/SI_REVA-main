package id.go.sireva.referencedata;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import id.go.sireva.common.JdbcRows;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** Table and column names are interpolated only from the {@link ReferenceTable} whitelist. */
@Repository
public class ReferenceDataRepository {
    private final JdbcTemplate jdbcTemplate;

    public ReferenceDataRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAll(ReferenceTable table) {
        return jdbcTemplate.query("SELECT * FROM " + table.qualifiedName() + " ORDER BY id", JdbcRows.CAMEL_MAP);
    }

    public List<Map<String, Object>> findById(ReferenceTable table, long id) {
        return jdbcTemplate.query("SELECT * FROM " + table.qualifiedName() + " WHERE id = ?",
                JdbcRows.CAMEL_MAP, id);
    }

    public List<Map<String, Object>> insert(ReferenceTable table, List<ReferenceTable.Column> columns,
            List<Object> values) {
        if (columns.isEmpty()) {
            return jdbcTemplate.query("INSERT INTO " + table.qualifiedName() + " DEFAULT VALUES RETURNING *",
                    JdbcRows.CAMEL_MAP);
        }
        String names = String.join(", ", columns.stream().map(ReferenceTable.Column::name).toList());
        String placeholders = String.join(", ", java.util.Collections.nCopies(columns.size(), "?"));
        return jdbcTemplate.query("INSERT INTO " + table.qualifiedName() + " (" + names + ") VALUES ("
                + placeholders + ") RETURNING *", JdbcRows.CAMEL_MAP, values.toArray());
    }

    public List<Map<String, Object>> update(ReferenceTable table, long id, List<ReferenceTable.Column> columns,
            List<Object> values) {
        if (columns.isEmpty()) {
            return findById(table, id);
        }
        String assignments = String.join(", ", columns.stream().map(column -> column.name() + " = ?").toList());
        List<Object> args = new ArrayList<>(values);
        args.add(id);
        return jdbcTemplate.query("UPDATE " + table.qualifiedName() + " SET " + assignments
                + " WHERE id = ? RETURNING *", JdbcRows.CAMEL_MAP, args.toArray());
    }

    public List<Map<String, Object>> delete(ReferenceTable table, long id) {
        return jdbcTemplate.query("DELETE FROM " + table.qualifiedName() + " WHERE id = ? RETURNING *",
                JdbcRows.CAMEL_MAP, id);
    }
}
