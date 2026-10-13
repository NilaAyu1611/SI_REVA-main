package id.go.sireva.targetprogram;

import java.math.BigDecimal;

public record TargetIndikatorProgram(Long id, Integer indikatorId, Integer tahun, BigDecimal target) {}