package id.go.sireva.periode;

public record Periode(
        Long id,
        String nama,
        Integer tahunMulai,
        Integer tahunSelesai,
        Boolean isActive
) {}