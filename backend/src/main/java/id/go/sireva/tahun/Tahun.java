package id.go.sireva.tahun;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Tahun(
        Long id,
        Integer tahun,
        @JsonProperty("periodeId") Integer periodeId
) {}