package id.go.sireva.laporankinerjatriwulan;

import java.time.LocalDateTime;

public record LaporanKinerjaTriwulan(
        Long id,
        Integer tahun,
        String triwulan,
        String unitKerja,
        String ringkasanEksekutif,
        String kataPengantar,
        String rencanaTindakLanjut,
        String informasiTambahan,
        String lampiranUrl,
        String status,
        LocalDateTime createdAt
) {}