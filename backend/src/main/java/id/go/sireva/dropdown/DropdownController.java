package id.go.sireva.dropdown;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dropdown")
public class DropdownController {
    private final DropdownRepository repository;

    public DropdownController(DropdownRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/sasaran-strategis")
    public Map<String, Object> sasaranStrategis() {
        return wrap(repository.sasaranStrategis());
    }

    @GetMapping("/sasaran-program")
    public Map<String, Object> sasaranProgram(@RequestParam(name = "ss_id", required = false) Long ssId) {
        return wrap(repository.sasaranProgram(ssId));
    }

    @GetMapping("/sasaran-kegiatan")
    public Map<String, Object> sasaranKegiatan(@RequestParam(name = "sp_id", required = false) Long spId) {
        return wrap(repository.sasaranKegiatan(spId));
    }

    @GetMapping("/indikator-kinerja")
    public Map<String, Object> indikatorKinerja(@RequestParam(name = "sk_id", required = false) Long skId) {
        return wrap(repository.indikatorKinerja(skId));
    }

    private Map<String, Object> wrap(List<Map<String, Object>> data) {
        return Map.of("success", true, "data", data);
    }
}
