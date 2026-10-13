package id.go.sireva.sumberdana;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sumber-dana")
public class SumberDanaController {
    private final SumberDanaService service;

    public SumberDanaController(SumberDanaService service) {
        this.service = service;
    }

    @GetMapping
    public List<SumberDana> find(@RequestParam(required = false) Long id) {
        return service.find(id);
    }

    @PostMapping
    public List<SumberDana> create(@RequestBody SumberDanaRequest request) {
        return service.save(request);
    }

    @PutMapping
    public List<SumberDana> update(@RequestBody SumberDanaRequest request) {
        return service.save(request);
    }

    @DeleteMapping
    public List<SumberDana> delete(@RequestBody SumberDanaRequest request) {
        return service.delete(request.id());
    }
}