package id.go.sireva.targetkegiatan;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TargetIndikatorKegiatan(
        Long id,
        @JsonProperty("idIku") Integer idIku,
        Integer tahun,
        @JsonProperty("targetNilai") BigDecimal targetNilai,
        LocalDateTime createdAt
) {}