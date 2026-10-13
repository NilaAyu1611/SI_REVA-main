package id.go.sireva.indikatorprogram;

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
@RequestMapping("/api/indikator-program")
public class IndikatorProgramController {
    private final IndikatorProgramService service;

    public IndikatorProgramController(IndikatorProgramService service) {
        this.service = service;
    }

    @GetMapping
    public List<IndikatorProgram> find(@RequestParam(required = false) Integer sasaranProgramId) {
        return service.find(sasaranProgramId);
    }

    @PostMapping
    public List<IndikatorProgram> create(@RequestBody JsonNode body) {
        return service.create(body);
    }

    @PutMapping
    public List<IndikatorProgram> update(@RequestBody JsonNode body) {
        return service.update(body);
    }

    @DeleteMapping
    public List<IndikatorProgram> delete(@RequestBody JsonNode body) {
        return service.delete(body);
    }
}