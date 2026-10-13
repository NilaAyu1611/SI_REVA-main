package id.go.sireva.laporankinerjatriwulan;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/laporan-kinerja-triwulan")
public class LaporanKinerjaTriwulanController {
    private final LaporanKinerjaTriwulanService service;

    public LaporanKinerjaTriwulanController(LaporanKinerjaTriwulanService service) {
        this.service = service;
    }

    @GetMapping
    public Object find(@RequestParam(required = false) Long id,
            @RequestParam(required = false) Integer tahun,
            @RequestParam(required = false) String triwulan,
            @RequestParam(required = false) String unitKerja) {
        return service.find(id, tahun, triwulan, unitKerja);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody LaporanKinerjaTriwulan report) {
        return ResponseEntity.ok(service.save(report));
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> update(@RequestBody LaporanKinerjaTriwulan report) {
        return ResponseEntity.ok(service.update(report.id(), report));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> delete(@RequestParam(required = false) Long id,
            @RequestBody(required = false) Map<String, Object> body) {
        Long reportId = id;
        if (reportId == null && body != null && body.get("id") != null) {
            reportId = Long.valueOf(body.get("id").toString());
        }
        return ResponseEntity.ok(service.delete(reportId));
    }
}