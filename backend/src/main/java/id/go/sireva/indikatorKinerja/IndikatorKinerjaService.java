package id.go.sireva.indikatorKinerja;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class IndikatorKinerjaService {
    private final IndikatorKinerjaRepository repository;

    public IndikatorKinerjaService(IndikatorKinerjaRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id, Integer skId) {
        if (id != null) {
            return repository.findActiveById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
        }
        return repository.findAll(skId);
    }

    @Transactional
    public Map<String, Object> create(JsonNode body) {
        if (!body.hasNonNull("sk_id") || !body.path("sk_id").canConvertToInt()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sk_id wajib diisi");
        }
        if (!body.hasNonNull("nama_iku") || body.path("nama_iku").asText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nama_iku wajib diisi");
        }
        if (body.hasNonNull("kode_iku") || body.hasNonNull("nomor_urut") || body.hasNonNull("kodeIku")
                || body.hasNonNull("nomorUrut")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Kode and nomor_urut tidak boleh dikirim dari frontend");
        }

        int skId = body.path("sk_id").asInt();
        String parentCode = repository.lockParentCode(skId);
        if (parentCode == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent Sasaran Kegiatan tidak ditemukan");
        }
        int nextOrder = repository.findMaxOrder(skId) + 1;
        String generatedCode = "IKU-" + parentCode.replaceFirst("^SK-", "") + "."
                + String.format("%02d", nextOrder);
        IndikatorKinerja created = repository.create(skId, nextOrder, generatedCode,
                body.path("nama_iku").asText(), nullableText(body, "satuan"), nullableText(body, "target"),
                nullableText(body, "realisasi"));

        return Map.of("success", true, "message", "Data berhasil ditambahkan",
                "data", Map.of("id", created.id(), "kode", created.kodeIku(), "nama", created.namaIku()));
    }

    @Transactional
    public Map<String, Object> update(Long id, JsonNode body) {
        if (body.hasNonNull("kode_iku") || body.hasNonNull("nomor_urut") || body.hasNonNull("kodeIku")
                || body.hasNonNull("nomorUrut") || body.hasNonNull("sk_id") || body.hasNonNull("skId")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kode, nomor_urut, dan sk_id tidak boleh diubah");
        }
        validateBoolean(body, "is_active");
        JsonNode targets = body.get("targets");
        if (targets != null && !targets.isNull() && !targets.isObject()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targets harus berupa object");
        }
        if (body.size() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tidak ada field yang diperbarui.");
        }

        if (targets != null && targets.isObject()) {
            targets.fields().forEachRemaining(entry -> {
                int year;
                try {
                    year = Integer.parseInt(entry.getKey());
                } catch (NumberFormatException exception) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tahun target tidak valid");
                }
                repository.upsertTarget(id, year, entry.getValue().isNull() ? null : entry.getValue().asText());
            });
        }

        IndikatorKinerja updated = repository.update(id, body)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan"));
        return Map.of("success", true, "message", "Data berhasil diperbarui",
                "data", Map.of("id", updated.id(), "kode", updated.kodeIku(), "nama", updated.namaIku()));
    }

    @Transactional
    public Map<String, Object> delete(Long id) {
        if (!repository.softDelete(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Data tidak ditemukan");
        }
        return Map.of("success", true, "message", "Data berhasil dihapus");
    }

    private String nullableText(JsonNode body, String field) {
        JsonNode value = body.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }

    private void validateBoolean(JsonNode body, String field) {
        JsonNode value = body.get(field);
        if (value != null && !value.isNull() && !value.isBoolean()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " harus berupa boolean");
        }
    }
}