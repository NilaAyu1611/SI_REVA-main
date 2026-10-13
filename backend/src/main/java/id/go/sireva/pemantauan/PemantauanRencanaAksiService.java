package id.go.sireva.pemantauan;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import id.go.sireva.common.JsonValues;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PemantauanRencanaAksiService {
    private final PemantauanRencanaAksiRepository repository;

    public PemantauanRencanaAksiService(PemantauanRencanaAksiRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id) {
        if (id == null) {
            return repository.findAll();
        }
        return repository.findById(id).orElse(null);
    }

    public Map<String, Object> create(JsonNode body) {
        long rencanaAksiId = JsonValues.requireLong(body, "rencanaAksiId", "rencanaAksiId wajib diisi.");
        return repository.insert(rencanaAksiId, capaian(body), analisaCapaian(body), analisaPermasalahan(body),
                JsonValues.firstText(body, "keterangan"));
    }

    public Map<String, Object> update(JsonNode body) {
        long id = JsonValues.requireLong(body, "id", "ID is required");
        return repository.update(id, capaian(body), analisaCapaian(body), analisaPermasalahan(body),
                JsonValues.firstText(body, "keterangan")).orElse(null);
    }

    public Map<String, Object> delete(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        repository.deleteById(id);
        return Map.of("success", true);
    }

    private BigDecimal capaian(JsonNode body) {
        BigDecimal value = JsonValues.decimal(body, "realisasi", "capaian");
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
