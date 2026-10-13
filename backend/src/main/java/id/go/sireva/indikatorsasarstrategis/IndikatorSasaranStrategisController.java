package id.go.sireva.indikatorsasarstrategis;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/indikator-sasaran-strategis")
public class IndikatorSasaranStrategisController {
    private final JdbcTemplate jdbcTemplate;

    public IndikatorSasaranStrategisController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<IndikatorSasaranStrategis> find(@RequestParam(required = false) Integer ssId) {
        String sql = """
                SELECT id, ss_id, kode_indikator, nama_indikator, satuan, target_1, target_2,
                       target_3, target_4, target_5, created_at
                FROM sireva.indikator_sasaran_strategis
                """ + (ssId == null ? "" : " WHERE ss_id = ?");
        var mapper = (org.springframework.jdbc.core.RowMapper<IndikatorSasaranStrategis>) (result, rowNumber) -> {
            var created = result.getTimestamp("created_at");
            int ss = result.getInt("ss_id");
            Integer nullableSsId = result.wasNull() ? null : ss;
            return new IndikatorSasaranStrategis(result.getLong("id"), nullableSsId,
                    result.getString("kode_indikator"), result.getString("nama_indikator"),
                    result.getString("satuan"), result.getBigDecimal("target_1"), result.getBigDecimal("target_2"),
                    result.getBigDecimal("target_3"), result.getBigDecimal("target_4"), result.getBigDecimal("target_5"),
                    created == null ? null : created.toLocalDateTime());
        };
        return ssId == null ? jdbcTemplate.query(sql, mapper) : jdbcTemplate.query(sql, mapper, ssId);
    }
}