package id.go.sireva.laporankinerjatriwulan;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LaporanKinerjaTriwulanService {
    private final LaporanKinerjaTriwulanRepository repository;

    public LaporanKinerjaTriwulanService(LaporanKinerjaTriwulanRepository repository) {
        this.repository = repository;
    }

    public Object find(Long id, Integer year, String quarter, String unit) {
        if (id != null) return repository.findById(id).stream().findFirst().orElse(null);
        return repository.findSummaries(year, quarter, unit);
    }

    @Transactional
    public Map<String, Object> save(LaporanKinerjaTriwulan report) {
        validateRequired(report);
        List<LaporanKinerjaTriwulan> existing = repository.findUnique(report.tahun(), report.triwulan(), report.unitKerja());
        List<LaporanKinerjaTriwulan> saved = existing.isEmpty()
                ? repository.create(withDefaults(report))
                : repository.update(existing.get(0).id(), withDefaults(report));
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("action", existing.isEmpty() ? "insert" : "update");
        response.put("data", saved.isEmpty() ? null : saved.get(0));
        return response;
    }

    public Map<String, Object> update(Long id, LaporanKinerjaTriwulan report) {
        if (id == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID laporan wajib disertakan.");
        List<LaporanKinerjaTriwulan> updated = repository.update(id, withDefaults(report));
        return Map.of("success", true, "data", updated.isEmpty() ? Map.of() : updated.get(0));
    }

    public Map<String, Object> delete(Long id) {
        if (id == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID wajib disertakan.");
        repository.delete(id);
        return Map.of("success", true);
    }

    private void validateRequired(LaporanKinerjaTriwulan report) {
        if (report.tahun() == null || report.tahun() == 0 || blank(report.triwulan()) || blank(report.unitKerja())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tahun, Triwulan, dan Unit Kerja wajib diisi.");
        }
    }

    private LaporanKinerjaTriwulan withDefaults(LaporanKinerjaTriwulan report) {
        return new LaporanKinerjaTriwulan(report.id(), report.tahun(), report.triwulan(), report.unitKerja(),
                report.ringkasanEksekutif() == null ? "" : report.ringkasanEksekutif(),
                report.kataPengantar() == null ? "" : report.kataPengantar(),
                report.rencanaTindakLanjut() == null ? "" : report.rencanaTindakLanjut(),
                report.informasiTambahan() == null ? "" : report.informasiTambahan(), report.lampiranUrl(),
                report.status() == null ? "Draft" : report.status(), report.createdAt());
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}