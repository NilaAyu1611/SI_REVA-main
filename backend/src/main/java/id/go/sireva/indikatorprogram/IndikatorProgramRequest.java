package id.go.sireva.indikatorprogram;

import com.fasterxml.jackson.annotation.JsonAlias;

public record IndikatorProgramRequest(
        Long id,
        @JsonAlias("sasaran_program_id") Integer sasaranProgramId,
        String kode,
        String nama,
        String satuan,
        String deskripsi,
        String formula
) {}