package id.go.sireva.rencanaaksi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import id.go.sireva.common.JsonValues;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RencanaAksiService {
    private final RencanaAksiRepository repository;

    public RencanaAksiService(RencanaAksiRepository repository) {
        this.repository = repository;
    }

    public List<Map<String, Object>> find(Long id) {
        if (id == null) {
            return repository.findAllWithLabels();
        }
        return repository.findById(id).map(List::of).orElseGet(List::of);
    }

    public Map<String, Object> create(JsonNode body) {
        long indikatorId = JsonValues.requireLong(body, "indikatorId", "indikatorId wajib diisi.");
        String nama = JsonValues.requireText(body, "Nama rencana aksi wajib diisi.", "namaAksi", "namaRencanaAksi");
        List<Object> numbers = new ArrayList<>();
        for (String column : RencanaAksiRepository.NUMERIC_COLUMNS) {
            numbers.add(JsonValues.decimalOrZero(body, column));
        }
        return repository.insert(indikatorId, nama, numbers)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Gagal menyimpan Rencana Aksi."));
    }

    public Map<String, Object> update(JsonNode body) {
        long id = JsonValues.requireLong(body, "id", "ID is required");
        List<String> columns = new ArrayList<>();
        List<Object> values = new ArrayList<>();

        Long indikatorId = JsonValues.longValue(body, "indikatorId");
        if (indikatorId != null) {
            columns.add("indikator_id");
            values.add(indikatorId);
        }
        String nama = JsonValues.firstText(body, "namaAksi", "namaRencanaAksi");
        if (nama != null && !nama.isBlank()) {
            columns.add("nama_rencana_aksi");
            values.add(nama);
        }
        for (String column : RencanaAksiRepository.NUMERIC_COLUMNS) {
            var value = JsonValues.decimal(body, column);
            if (value != null) {
                columns.add(column);
                values.add(value);
            }
        }

        var updated = columns.isEmpty() ? repository.findById(id) : repository.update(id, columns, values);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", updated.orElse(null));
        return response;
    }

    public Map<String, Object> delete(JsonNode body) {
        repository.deleteById(JsonValues.requireLong(body, "id", "ID is required"));
        return Map.of("success", true);
    }
}
