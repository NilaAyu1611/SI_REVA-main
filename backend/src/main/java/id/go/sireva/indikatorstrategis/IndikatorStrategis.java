package id.go.sireva.indikatorstrategis;

public record IndikatorStrategis(
        Long id,
        Integer sasaranStrategisId,
        String kode,
        String nama,
        String satuan,
        String deskripsi,
        String formula
) {}