package id.go.sireva.sasaranprogram;

import java.time.LocalDateTime;

public record SasaranProgram(
        Long id,
        Integer ssId,
        Integer nomorUrut,
        String kodeSp,
        String namaSp,
        String pengampu,
        String instansiTerkait,
        Integer ikssId,
        Boolean isActive,
        LocalDateTime deletedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}