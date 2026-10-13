package id.go.sireva.sasaranprogram;

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
@RequestMapping("/api/sasaran-program")
public class SasaranProgramController {
    private final SasaranProgramService service;

    public SasaranProgramController(SasaranProgramService service) {
        this.service = service;
    }

    @GetMapping
    public Object find(@RequestParam(required = false) Long id,
            @RequestParam(name = "ss_id", required = false) Integer ssId,
            @RequestParam(name = "indId", required = false) Long indicatorId) {
        return service.find(id, ssId, indicatorId);
    }

    @GetMapping("/unit-kerja/{unitId}")
    public List<Map<String, Object>> findForUnit(@PathVariable Long unitId) {
        return service.findForUnit(unitId);
    }

    @GetMapping("/{id}")
    public SasaranProgram findByPath(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody JsonNode body) {
        return ResponseEntity.ok(service.create(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody JsonNode body) {
        return ResponseEntity.ok(service.update(id, body));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteCollection(@RequestBody JsonNode body) {
        return ResponseEntity.ok(service.deleteCollection(body.hasNonNull("id") ? body.path("id").asLong() : null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteByPath(@PathVariable Long id) {
        return ResponseEntity.ok(service.deleteById(id));
    }
}