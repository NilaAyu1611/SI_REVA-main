package id.go.sireva.periode;

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
@RequestMapping("/api/periode")
public class PeriodeController {
    private final PeriodeService service;

    public PeriodeController(PeriodeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Periode> find(@RequestParam(required = false) Long id) {
        return service.find(id);
    }

    @PostMapping
    public List<Periode> create(@RequestBody PeriodeRequest request) {
        return service.save(request);
    }

    @PutMapping
    public List<Periode> update(@RequestBody PeriodeRequest request) {
        return service.save(request);
    }

    @DeleteMapping
    public List<Periode> delete(@RequestBody PeriodeRequest request) {
        return service.delete(request.id());
    }
}