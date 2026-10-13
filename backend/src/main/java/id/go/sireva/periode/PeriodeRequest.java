package id.go.sireva.periode;

public record PeriodeRequest(
        Long id,
        String nama,
        Integer tahunMulai,
        Integer tahunSelesai,
        Boolean isActive
) {}
