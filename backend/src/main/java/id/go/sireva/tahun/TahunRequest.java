package id.go.sireva.tahun;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TahunRequest(
        Long id,
        Integer tahun,
        @JsonProperty("periodeId") Integer periodeId
) {}