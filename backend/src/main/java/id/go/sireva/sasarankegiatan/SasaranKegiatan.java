package id.go.sireva.sasarankegiatan;

import java.time.LocalDateTime;

public record SasaranKegiatan(
        Long id,
        Integer spId,
        Integer nomorUrut,
        String kodeSk,
        String namaSk,
        String pengampu,
        String instansiTerkait,
        Boolean isActive,
        LocalDateTime deletedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}