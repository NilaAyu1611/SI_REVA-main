package id.go.sireva.pemantauan;

import java.math.BigDecimal;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import id.go.sireva.common.JsonValues;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PemantauanKegiatanService {
    private final PemantauanKegiatanRepository repository;

    public PemantauanKegiatanService(PemantauanKegiatanRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id) {
        if (id == null) {
            return repository.findAll();
        }
        return repository.findById(id).orElse(null);
    }

    public Map<String, Object> create(JsonNode body) {
        Long sasaranId = JsonValues.longValue(body, "sasaranKegiatanId");
        if (sasaranId == null) {
            sasaranId = JsonValues.longValue(body, "sasaranId");
        }
        if (sasaranId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sasaranKegiatanId wajib diisi.");
        }
        long indikatorId = JsonValues.requireLong(body, "indikatorId", "indikatorId wajib diisi.");
        return repository.insert(sasaranId, indikatorId, realisasi(body), JsonValues.decimal(body, "realisasiKik"),
                analisaCapaian(body), analisaPermasalahan(body));
    }

    public Map<String, Object> update(JsonNode body) {
        long id = JsonValues.requireLong(body, "id", "ID is required");
        return repository.update(id, realisasi(body), JsonValues.decimal(body, "realisasiKik"),
                analisaCapaian(body), analisaPermasalahan(body)).orElse(null);
    }

    public Map<String, Object> delete(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        repository.deleteById(id);
        return Map.of("success", true);
    }

    private BigDecimal realisasi(JsonNode body) {
        BigDecimal value = JsonValues.decimal(body, "realisasi");
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field realisasi wajib diisi.");
        }
        return value;
    }

    private String analisaCapaian(JsonNode body) {
        return required(JsonValues.firstText(body, "analisaPencapaian", "analisaCapaian"), "analisaPencapaian");
    }

    private String analisaPermasalahan(JsonNode body) {
        return required(JsonValues.firstText(body, "analisaPermasalahan"), "analisaPermasalahan");
    }

    private String required(String value, String field) {
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field " + field + " wajib diisi.");
        }
        return value;
    }
}
