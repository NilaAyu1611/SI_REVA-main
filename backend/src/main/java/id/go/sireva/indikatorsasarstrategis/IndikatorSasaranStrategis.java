package id.go.sireva.indikatorsasarstrategis;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public record IndikatorSasaranStrategis(
        Long id,
        Integer ssId,
        @JsonProperty("kodeIndikator") String kodeIndikator,
        @JsonProperty("namaIndikator") String namaIndikator,
        String satuan,
        @JsonProperty("target1") BigDecimal target1,
        @JsonProperty("target2") BigDecimal target2,
        @JsonProperty("target3") BigDecimal target3,
        @JsonProperty("target4") BigDecimal target4,
        @JsonProperty("target5") BigDecimal target5,
        LocalDateTime createdAt
) {}