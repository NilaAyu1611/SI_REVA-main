package id.go.sireva.perjanjiankinerja;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import id.go.sireva.common.JsonValues;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PerjanjianKinerjaService {
    private static final String ALL_UNITS = "Semua Unit Kerja";

    private final PerjanjianKinerjaRepository repository;

    public PerjanjianKinerjaService(PerjanjianKinerjaRepository repository) {
        this.repository = repository;
    }

    public List<Map<String, Object>> find(Integer tahun, String unitKerja) {
        String unit = ALL_UNITS.equals(unitKerja) ? null : unitKerja;
        return repository.find(tahun, unit);
    }

    public List<Map<String, Object>> create(JsonNode body) {
        int tahun = (int) JsonValues.requireLong(body, "tahun", "Field tahun wajib diisi.");
        String unitKerja = JsonValues.requireText(body, "Field unitKerja wajib diisi.", "unitKerja");
        long sasaranId = JsonValues.requireLong(body, "sasaranId", "Field sasaranId wajib diisi.");
        long indikatorId = JsonValues.requireLong(body, "indikatorId", "Field indikatorId wajib diisi.");

        if (repository.exists(tahun, indikatorId, unitKerja)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Indikator ini sudah terdaftar dalam PK tahun tersebut untuk unit kerja ini.");
        }

        String target = JsonValues.firstText(body, "target");
        String status = JsonValues.firstText(body, "status");
        return List.of(repository.insert(tahun, unitKerja, sasaranId, indikatorId, target,
                status == null || status.isBlank() ? "Draft" : status));
    }

    public List<Map<String, Object>> delete(JsonNode body) {
        return repository.deleteById(JsonValues.requireLong(body, "id", "ID is required"));
    }
}
