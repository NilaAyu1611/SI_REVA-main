package id.go.sireva.sasaranprogram;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SasaranProgramService {
    private final SasaranProgramRepository repository;

    public SasaranProgramService(SasaranProgramRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id, Integer ssId, Long indicatorId) {
        if (id == null) {
            return repository.findFlattened(null, ssId, null);
        }
        if (indicatorId != null) {
            List<Map<String, Object>> rows = repository.findFlattened(id, null, indicatorId);
            return rows.isEmpty() ? null : rows.get(0);
        }
        return repository.findFlattened(id, null, null).stream().findFirst().orElse(null);
    }

    public List<Map<String, Object>> findForUnit(Long unitId) {
        return repository.findForUnit(unitId);
    }

    public SasaranProgram findById(Long id) {
        return repository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
    }

    @Transactional
    public Map<String, Object> create(JsonNode body) {
        if (!body.hasNonNull("ss_id") || !body.path("ss_id").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ss_id wajib diisi");
        }
        if (!body.hasNonNull("nama_sp") || body.path("nama_sp").asText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nama_sp wajib diisi");
        }
        if (body.hasNonNull("kode_sp") || body.hasNonNull("nomor_urut") || body.hasNonNull("kodeSp")
                || body.hasNonNull("nomorUrut")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Kode and nomor_urut tidak boleh dikirim dari frontend");
        }

        long parentId = body.path("ss_id").asLong();
        String parentCode = repository.lockParentCode(parentId);
        if (parentCode == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent Sasaran Strategis tidak ditemukan");
        }
        int order = repository.maxOrderForParent(parentId) + 1;
        String code = "SP-" + parentCode.replaceFirst("^SS-", "") + "." + String.format("%02d", order);
        Integer indicatorId = body.hasNonNull("is_id") ? body.path("is_id").asInt() : null;
        SasaranProgram created = repository.create(parentId, indicatorId, order, code,
                body.path("nama_sp").asText(), nullableText(body, "pengampu"), nullableText(body, "instansi_terkait"));
        return Map.of("success", true, "message", "Data berhasil ditambahkan",
                "data", Map.of("id", created.id(), "kode", created.kodeSp(), "nama", created.namaSp()));
    }

    @Transactional
    public Map<String, Object> update(Long id, JsonNode body) {
        if (body.hasNonNull("kode_sp") || body.hasNonNull("nomor_urut") || body.hasNonNull("kodeSp")
                || body.hasNonNull("nomorUrut") || body.hasNonNull("ss_id") || body.hasNonNull("ssId")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kode, nomor_urut, dan ss_id tidak boleh diubah");
        }
        SasaranProgram updated = repository.update(id, body)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
        return Map.of("success", true, "message", "Data berhasil diperbarui",
                "data", Map.of("id", updated.id(), "kode", updated.kodeSp(), "nama", updated.namaSp()));
    }

    @Transactional
    public Map<String, Object> deleteCollection(Long id) {
        requireId(id);
        if (!repository.softDelete(id, false)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        return Map.of("success", true, "message", "Data berhasil dihapus");
    }

    @Transactional
    public Map<String, Object> deleteById(Long id) {
        if (repository.findActiveById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        if (repository.countActiveChildren(id) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tidak dapat menghapus data parent karena masih memiliki data turunan.");
        }
        if (!repository.softDelete(id, true)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        return Map.of("success", true, "message", "Data berhasil dihapus");
    }

    private void requireId(Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id wajib diisi");
        }
    }

    private String nullableText(JsonNode body, String field) {
        JsonNode value = body.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }
}