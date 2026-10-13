package id.go.sireva.unitkerja;

import java.time.LocalDateTime;

public record UnitKerja(
        Long id,
        String nama,
        Integer level,
        Integer parentId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}