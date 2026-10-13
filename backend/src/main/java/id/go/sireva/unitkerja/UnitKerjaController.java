package id.go.sireva.unitkerja;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/unit-kerja")
public class UnitKerjaController {
    private final UnitKerjaService service;

    public UnitKerjaController(UnitKerjaService service) {
        this.service = service;
    }

    @GetMapping
    public List<UnitKerja> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public UnitKerja findById(@PathVariable @Positive Long id) {
        return service.findById(id);
    }

    @PostMapping
    public UnitKerja save(@RequestBody SaveUnitKerjaRequest request) {
        return service.save(request);
    }

    @PutMapping("/{id}")
    public UnitKerja update(@PathVariable @Positive Long id, @RequestBody JsonNode body) {
        return service.update(id, body);
    }

    @DeleteMapping
    public UnitKerja delete(@Valid @RequestBody DeleteUnitKerjaRequest request) {
        return service.delete(request.id());
    }

    @DeleteMapping("/{id}")
    public Object deleteByPath(@PathVariable @Positive Long id) {
        return new DeleteUnitKerjaResponse(true, service.delete(id));
    }

    public record DeleteUnitKerjaResponse(boolean success, UnitKerja deleted) {}
}