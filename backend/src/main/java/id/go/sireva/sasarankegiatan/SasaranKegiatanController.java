package id.go.sireva.sasarankegiatan;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sasaran-kegiatan")
public class SasaranKegiatanController {
    private final SasaranKegiatanService service;

    public SasaranKegiatanController(SasaranKegiatanService service) {
        this.service = service;
    }

    @GetMapping
    public Object find(@RequestParam(required = false) Long id,
            @RequestParam(name = "sp_id", required = false) Integer parentId,
            @RequestParam(name = "indId", required = false) Long indicatorId) {
        return service.find(id, parentId, indicatorId);
    }

    @GetMapping("/{id}")
    public SasaranKegiatan findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody JsonNode body) {
        return ResponseEntity.ok(service.create(body));
    }

    @PutMapping
    public ResponseEntity<Void> updateTargets(@RequestBody JsonNode body) {
        service.updateTarget(body);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody JsonNode body) {
        return ResponseEntity.ok(service.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }

    @GetMapping("/unit-kerja/{unitId}")
    public List<Map<String, Object>> findForUnit(@PathVariable Long unitId,
            @RequestParam(required = false) Long sasaranId) {
        return service.findForUnit(unitId, sasaranId);
    }

    @PostMapping("/target")
    public List<Map<String, Object>> upsertTarget(@RequestBody JsonNode body) {
        return service.upsertTarget(body);
    }
}