package id.go.sireva.pemantauan;

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
@RequestMapping("/api/pemantauan-program")
public class PemantauanProgramController {
    private final PemantauanProgramService service;

    public PemantauanProgramController(PemantauanProgramService service) {
        this.service = service;
    }

    @GetMapping
    public Object find(@RequestParam(required = false) Long id) {
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
    public Map<String, Object> delete(@RequestParam(required = false) Long id) {
        return service.delete(id);
    }
}
