package id.go.sireva.tahun;

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
@RequestMapping("/api/tahun")
public class TahunController {
    private final TahunService service;

    public TahunController(TahunService service) {
        this.service = service;
    }

    @GetMapping
    public List<Tahun> find(@RequestParam(required = false) Long id) {
        return service.find(id);
    }

    @PostMapping
    public List<Tahun> create(@RequestBody TahunRequest request) {
        return service.save(request);
    }

    @PutMapping
    public List<Tahun> update(@RequestBody TahunRequest request) {
        return service.save(request);
    }

    @DeleteMapping
    public List<Tahun> delete(@RequestBody TahunRequest request) {
        return service.delete(request.id());
    }
}