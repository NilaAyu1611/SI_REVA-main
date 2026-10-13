package id.go.sireva.sasarankegiatan;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SasaranKegiatanService {
    private final SasaranKegiatanRepository repository;

    public SasaranKegiatanService(SasaranKegiatanRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id, Integer parentId, Long indicatorId) {
        if (id == null)
            return repository.findFlattened(null, parentId, null);
        return repository.findFlattened(id, null, indicatorId).stream().findFirst().orElse(null);
    }

    public SasaranKegiatan findById(Long id) {
        return repository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
    }

    @Transactional
    public Map<String, Object> create(JsonNode body) {
        if (!body.hasNonNull("sp_id") || !body.path("sp_id").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sp_id wajib diisi");
        }
        if (!body.hasNonNull("nama_sk") || body.path("nama_sk").asText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nama_sk wajib diisi");
        }
        if (body.hasNonNull("kode_sk") || body.hasNonNull("nomor_urut") || body.hasNonNull("kodeSk")
                || body.hasNonNull("nomorUrut")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Kode and nomor_urut tidak boleh dikirim dari frontend");
        }
        long parentId = body.path("sp_id").asLong();
        String parentCode = repository.lockParentCode(parentId);
        if (parentCode == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent Sasaran Program tidak ditemukan");
        }
        int order = repository.maxOrderForParent(parentId) + 1;
        String code = "SK-" + parentCode.replaceFirst("^SP-", "") + "." + String.format("%02d", order);
        SasaranKegiatan created = repository.create(parentId, order, code, body.path("nama_sk").asText(),
                nullableText(body, "pengampu"), nullableText(body, "instansi_terkait"));
        return Map.of("success", true, "message", "Data berhasil ditambahkan",
                "data", Map.of("id", created.id(), "kode", created.kodeSk(), "nama", created.namaSk()));
    }

    @Transactional
    public Map<String, Object> update(Long id, JsonNode body) {
        if (body.hasNonNull("kode_sk") || body.hasNonNull("nomor_urut") || body.hasNonNull("kodeSk")
                || body.hasNonNull("nomorUrut") || body.hasNonNull("sp_id") || body.hasNonNull("spId")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kode, nomor_urut, dan sp_id tidak boleh diubah");
        }
        SasaranKegiatan updated = repository.update(id, body)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
        return Map.of("success", true, "message", "Data berhasil diperbarui",
                "data", Map.of("id", updated.id(), "kode", updated.kodeSk(), "nama", updated.namaSk()));
    }

    @Transactional
    public Map<String, Object> delete(Long id) {
        if (repository.findActiveById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        repository.softDeleteIndicators(id);
        if (!repository.softDelete(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        return Map.of("success", true, "message", "Data berhasil dihapus");
    }

    public List<Map<String, Object>> findForUnit(Long unitId, Long sasaranId) {
        Map<String, Object> unit = repository.findUnit(unitId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit kerja tidak ditemukan"));
        if (unit.get("nama") == null)
            return List.of();
        return repository.findForUnit(unitId, sasaranId);
    }

    @Transactional
    public List<Map<String, Object>> upsertTarget(JsonNode body) {
        if (!body.hasNonNull("idIku") || !body.path("idIku").canConvertToLong()
                || !body.hasNonNull("tahun") || !body.path("tahun").canConvertToInt()
                || !body.has("targetNilai")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idIku, tahun, dan targetNilai wajib diisi");
        }
        return repository.upsertTarget(body.path("idIku").asLong(), body.path("tahun").asInt(),
                body.get("targetNilai").isNull() ? null : body.get("targetNilai").asText());
    }

    @Transactional
    public void updateTarget(JsonNode body) {
        if (!body.hasNonNull("indikatorId") || !body.path("indikatorId").canConvertToLong()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "indikatorId wajib diisi");
        }
        for (int index = 1; index <= 5; index++) {
            String field = "target_" + index;
            if (body.has(field)) {
                repository.upsertTarget(body.path("indikatorId").asLong(), 2024 + index,
                        body.get(field).isNull() ? null : body.get(field).asText());
            }
        }
    }

    private String nullableText(JsonNode body, String field) {
        JsonNode value = body.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }
}