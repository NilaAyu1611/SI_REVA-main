package id.go.sireva.indikatorKinerja;

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
@RequestMapping("/api/indikator-kinerja")
public class IndikatorKinerjaController {
    private final IndikatorKinerjaService service;

    public IndikatorKinerjaController(IndikatorKinerjaService service) {
        this.service = service;
    }

    @GetMapping
    public Object find(@RequestParam(required = false) Long id,
            @RequestParam(name = "sk_id", required = false) Integer skId) {
        return service.find(id, skId);
    }

    @GetMapping("/{id}")
    public Object findByPath(@PathVariable Long id) {
        return service.find(id, null);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody JsonNode body) {
        return ResponseEntity.ok(service.create(body));
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