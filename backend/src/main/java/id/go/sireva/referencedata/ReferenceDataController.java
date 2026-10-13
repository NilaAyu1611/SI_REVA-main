package id.go.sireva.referencedata;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReferenceDataController {
    private static final String PATH = "/api/{resource:program|kegiatan|kegiatan-unit|sub-kegiatan"
            + "|laporan-rencana-aksi|laporan-perjanjian-kinerja|laporan-sasaran-strategis|realisasi-indikator"
            + "|master-program|master-kegiatan}";

    private final ReferenceDataService service;

    public ReferenceDataController(ReferenceDataService service) {
        this.service = service;
    }

    @GetMapping(PATH)
    public List<Map<String, Object>> find(@PathVariable String resource,
            @RequestParam(required = false) Long id) {
        return service.find(service.table(resource), id);
    }

    @PostMapping(PATH)
    public List<Map<String, Object>> create(@PathVariable String resource, @RequestBody JsonNode body) {
        return service.create(service.table(resource), body);
    }

    @PutMapping(PATH)
    public List<Map<String, Object>> update(@PathVariable String resource, @RequestBody JsonNode body) {
        return service.update(service.table(resource), body);
    }

    @DeleteMapping(PATH)
    public List<Map<String, Object>> delete(@PathVariable String resource, @RequestBody JsonNode body) {
        return service.delete(service.table(resource), body);
    }
}
