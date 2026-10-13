package id.go.sireva.sasaranstrategis;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SasaranStrategisService {
    private final SasaranStrategisRepository repository;

    public SasaranStrategisService(SasaranStrategisRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id) {
        if (id == null) {
            return repository.findAllFlattened();
        }
        SasaranStrategis item = repository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
        List<Map<String, Object>> indicators = repository.findIndicatorsAndTargets(id);

        Map<String, Object> result = new LinkedHashMap<>();
        Map<String, Object> detail = new LinkedHashMap<>();
        detail.put("id", item.id());
        detail.put("tahun", item.tahun());
        detail.put("nomor_urut", item.nomorUrut());
        detail.put("kode_ss", item.kodeSs());
        detail.put("nama_ss", item.namaSs());
        detail.put("pengampu", item.pengampu());
        detail.put("instansi_terkait", item.instansiTerkait());
        result.put("success", true);
        result.put("data", detail);
        result.put("id", item.id());
        result.put("ssId", item.id());
        result.put("kode", item.kodeSs());
        result.put("kodeSs", item.kodeSs());
        result.put("sasaranText", item.namaSs());
        result.put("namaSs", item.namaSs());
        result.put("tahun", item.tahun());
        result.put("nomorUrut", item.nomorUrut());
        result.put("pengampu", item.pengampu());
        result.put("instansiTerkait", item.instansiTerkait());
        result.put("indikatorStrategis", indicators);
        return result;
    }

    @Transactional
    public Map<String, Object> create(JsonNode body) {
        String name = firstText(body, "nama_ss", "sasaranText", "nama");
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nama_ss atau sasaranText wajib diisi");
        }
        String year = body.hasNonNull("tahun") ? body.path("tahun").asText() : "2026";
        String code = firstText(body, "kode_ss", "kode", "kodeSs");
        repository.lockYear(year);
        int nextOrder = repository.maxOrderForYear(year) + 1;
        String generatedCode = String.format("SS-%02d", nextOrder);
        SasaranStrategis inserted = repository.create(year, nextOrder,
                code == null || code.isBlank() ? generatedCode : code, name,
                nullableText(body, "pengampu"), nullableText(body, "instansi_terkait"));
        return Map.of("success", true, "message", "Data berhasil ditambahkan",
                "data", Map.of("id", inserted.id(), "kode", inserted.kodeSs(), "nama", inserted.namaSs()));
    }

    @Transactional
    public Map<String, Object> update(Long id, JsonNode body) {
        SasaranStrategis updated = repository.update(id, body)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
        return Map.of("success", true, "message", "Data berhasil diperbarui",
                "data", Map.of("id", updated.id(), "kode", updated.kodeSs(), "nama", updated.namaSs()));
    }

    @Transactional
    public Map<String, Object> delete(Long id) {
        if (repository.findActiveById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        if (repository.countActiveChildren(id) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tidak dapat menghapus data parent karena masih memiliki data turunan.");
        }
        if (!repository.softDelete(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        return Map.of("success", true, "message", "Data berhasil dihapus");
    }

    private String firstText(JsonNode body, String... fields) {
        for (String field : fields) {
            JsonNode value = body.get(field);
            if (value != null && !value.isNull() && !value.asText().isBlank()) {
                return value.asText();
            }
        }
        return null;
    }

    private String nullableText(JsonNode body, String field) {
        JsonNode value = body.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }
}