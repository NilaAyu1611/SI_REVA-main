package id.go.sireva.indikatorprogram;

import com.fasterxml.jackson.annotation.JsonProperty;

public record IndikatorProgram(
        Long id,
        Integer sasaranProgramId,
        String kode,
        String nama,
        String satuan,
        String deskripsi,
        String formula,
        @JsonProperty("target_1") String target1,
        @JsonProperty("target_2") String target2,
        @JsonProperty("target_3") String target3,
        @JsonProperty("target_4") String target4,
        @JsonProperty("target_5") String target5
) {}