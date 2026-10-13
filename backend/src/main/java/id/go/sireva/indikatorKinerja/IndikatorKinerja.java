package id.go.sireva.indikatorKinerja;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public record IndikatorKinerja(
        Long id,
        Integer skId,
        Integer nomorUrut,
        String kodeIku,
        String namaIku,
        String satuan,
        String target,
        String realisasi,
        Boolean isActive,
        LocalDateTime deletedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        @JsonProperty("target_1") String target1,
        @JsonProperty("target_2") String target2,
        @JsonProperty("target_3") String target3,
        @JsonProperty("target_4") String target4,
        @JsonProperty("target_5") String target5
) {}