package id.go.sireva.dashboard;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DashboardService.class);

    private final DashboardRepository repository;

    public DashboardService(DashboardRepository repository) {
        this.repository = repository;
    }

    private static final class Average {
        double total;
        int count;

        void add(double value) {
            total += value;
            count++;
        }

        double mean() {
            return count == 0 ? 0 : round2(total / count);
        }
    }

    public Map<String, Object> stats() {
        try {
            return compute();
        } catch (RuntimeException exception) {
            LOGGER.error("Dashboard stats failed", exception);
            return emptyStats();
        }
    }

    private Map<String, Object> compute() {
        long totalIku = repository.countIndikatorProgram() + repository.countIndikatorKegiatan();

        Average overall = new Average();
        Average program = new Average();
        Average kegiatan = new Average();
        Average strategis = new Average();
        int belumTercapai = 0;
        Map<String, Average> byUnit = new LinkedHashMap<>();

        for (var report : repository.programReports()) {
            belumTercapai += collect(report, overall, program, byUnit);
        }
        for (var report : repository.kegiatanReports()) {
            belumTercapai += collect(report, overall, kegiatan, byUnit);
        }
        repository.strategisCapaian().forEach(strategis::add);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ss", repository.countSasaranStrategis());
        result.put("sp", repository.countSasaranProgram());
        result.put("sk", repository.countSasaranKegiatan());
        result.put("totalIku", totalIku);
        result.put("capaian", overall.mean());
        result.put("capaianSs", strategis.mean());
        result.put("capaianSp", program.mean());
        result.put("capaianSk", kegiatan.mean());
        result.put("belumTercapai", overall.count > 0 ? belumTercapai : totalIku);
        result.put("capaianUnit", capaianUnit(byUnit));
        result.put("ikuPrioritas", ikuPrioritas());
        return result;
    }

    /** Returns 1 when the report has a target and is below 100%, otherwise 0. */
    private int collect(DashboardRepository.Report report, Average overall, Average level,
            Map<String, Average> byUnit) {
        if (report.target() <= 0) {
            return 0;
        }
        double capaian = Math.min(report.realisasi() / report.target() * 100, 100);
        overall.add(capaian);
        level.add(capaian);
        String unit = report.unit() == null || report.unit().isEmpty() ? "Lainnya" : report.unit();
        byUnit.computeIfAbsent(unit, key -> new Average()).add(capaian);
        return capaian < 100 ? 1 : 0;
    }

    private List<Map<String, Object>> capaianUnit(Map<String, Average> byUnit) {
        List<Map<String, Object>> rows = new ArrayList<>();
        try {
            for (String name : repository.unitNames()) {
                Average stats = byUnit.get(name);
                rows.add(unitRow(name, stats == null ? 0 : stats.mean()));
            }
        } catch (RuntimeException exception) {
            LOGGER.error("Failed to load unit_kerja for dashboard stats", exception);
            rows.clear();
            byUnit.forEach((name, stats) -> rows.add(unitRow(name, stats.mean())));
        }
        rows.sort(Comparator.comparingDouble((Map<String, Object> row) -> (double) row.get("value")).reversed());
        return rows;
    }

    private Map<String, Object> unitRow(String name, double value) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("name", name);
        row.put("value", value);
        return row;
    }

    private List<Map<String, Object>> ikuPrioritas() {
        List<DashboardRepository.IkuRow> rows = new ArrayList<>(repository.programIkus());
        rows.addAll(repository.kegiatanIkus());

        List<Map<String, Object>> items = new ArrayList<>();
        for (var row : rows) {
            if (row.target() <= 0) {
                continue;
            }
            double capaian = Math.min(row.realisasi() / row.target() * 100, 100);
            if (capaian >= 100) {
                continue;
            }
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("iku", row.iku());
            item.put("unit", row.unit() == null || row.unit().isEmpty() ? "Lainnya" : row.unit());
            item.put("target", plain(row.target()));
            item.put("realisasi", plain(row.realisasi()));
            item.put("capaian", String.format(Locale.ROOT, "%.1f%%", capaian));
            item.put("deviasi", String.format(Locale.ROOT, "%.1f%%", round2(capaian - 100)));
            item.put("capNum", capaian);
            item.put("status", capaian < 70 ? "Belum Tercapai" : "Perlu Perhatian");
            items.add(item);
        }
        items.sort(Comparator.comparingDouble(item -> (double) item.get("capNum")));
        for (int i = 0; i < items.size(); i++) {
            Map<String, Object> numbered = new LinkedHashMap<>();
            numbered.put("no", i + 1);
            numbered.putAll(items.get(i));
            items.set(i, numbered);
        }
        return items;
    }

    private Map<String, Object> emptyStats() {
        Map<String, Object> result = new LinkedHashMap<>();
        for (String key : List.of("ss", "sp", "sk", "totalIku", "capaian", "capaianSs", "capaianSp", "capaianSk",
                "belumTercapai")) {
            result.put(key, 0);
        }
        result.put("capaianUnit", List.of());
        result.put("ikuPrioritas", List.of());
        return result;
    }

    private static double round2(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private static String plain(double value) {
        return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
    }
}
