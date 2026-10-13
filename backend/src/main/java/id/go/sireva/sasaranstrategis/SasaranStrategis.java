package id.go.sireva.sasaranstrategis;

import java.time.LocalDateTime;

public record SasaranStrategis(
        Long id,
        String tahun,
        Integer nomorUrut,
        String kodeSs,
        String namaSs,
        String pengampu,
        String instansiTerkait,
        Boolean isActive,
        LocalDateTime deletedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}