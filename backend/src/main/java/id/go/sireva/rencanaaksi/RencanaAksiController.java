package id.go.sireva.rencanaaksi;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rencana-aksi")
public class RencanaAksiController {
    private final RencanaAksiService service;

    public RencanaAksiController(RencanaAksiService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> find(@RequestParam(required = false) Long id) {
        return service.find(id);
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody JsonNode body) {
        return service.create(body);
    }

    @PutMapping
    public Map<String, Object> update(@RequestBody JsonNode body) {
        return service.update(body);
    }

    @DeleteMapping
    public Map<String, Object> delete(@RequestBody JsonNode body) {
        return service.delete(body);
    }
}
