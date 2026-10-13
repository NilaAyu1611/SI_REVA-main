package id.go.sireva.unitkerja;

public record SaveUnitKerjaRequest(
        Long id,
        String nama,
        Integer level,
        Integer parentId
) {}