package id.go.sireva.sasaranstrategis;

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
@RequestMapping("/api/sasaran-strategis")
public class SasaranStrategisController {
    private final SasaranStrategisService service;

    public SasaranStrategisController(SasaranStrategisService service) {
        this.service = service;
    }

    @GetMapping
    public Object find(@RequestParam(required = false) Long id) {
        return service.find(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody JsonNode body) {
        return ResponseEntity.ok(service.create(body));
    }

    @GetMapping("/{id}")
    public Object findById(@PathVariable Long id) {
        return service.find(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody JsonNode body) {
        return ResponseEntity.ok(service.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }
}