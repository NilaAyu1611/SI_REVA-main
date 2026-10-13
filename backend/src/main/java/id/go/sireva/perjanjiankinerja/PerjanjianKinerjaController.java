package id.go.sireva.perjanjiankinerja;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/perjanjian-kinerja")
public class PerjanjianKinerjaController {
    private final PerjanjianKinerjaService service;

    public PerjanjianKinerjaController(PerjanjianKinerjaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> find(@RequestParam(required = false) Integer tahun,
            @RequestParam(required = false) String unitKerja) {
        return service.find(tahun, unitKerja);
    }

    @PostMapping
    public List<Map<String, Object>> create(@RequestBody JsonNode body) {
        return service.create(body);
    }

    @DeleteMapping
    public List<Map<String, Object>> delete(@RequestBody JsonNode body) {
        return service.delete(body);
    }
}
