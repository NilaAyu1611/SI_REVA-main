package id.go.sireva.indikatorstrategis;

import java.util.List;

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
@RequestMapping("/api/indikator-strategis")
public class IndikatorStrategisController {
    private final IndikatorStrategisService service;

    public IndikatorStrategisController(IndikatorStrategisService service) {
        this.service = service;
    }

    @GetMapping
    public List<IndikatorStrategis> find(@RequestParam(required = false) Integer sasaranStrategisId) {
        return service.find(sasaranStrategisId);
    }

    @PostMapping
    public List<IndikatorStrategis> create(@RequestBody JsonNode body) {
        return service.create(body);
    }

    @PutMapping
    public List<IndikatorStrategis> update(@RequestBody JsonNode body) {
        return service.update(body);
    }

    @DeleteMapping
    public List<IndikatorStrategis> delete(@RequestBody JsonNode body) {
        return service.delete(body);
    }
}