package id.go.sireva.referencedata;

import java.util.List;
import java.util.Optional;

import id.go.sireva.common.JdbcRows;

public enum ReferenceTable {
    PROGRAM("program", "sireva.program", true,
            col("sasaran_id", Type.INT), col("kode", Type.TEXT), col("nama_program", Type.TEXT)),
    KEGIATAN("kegiatan", "sireva.kegiatan", true,
            col("program_id", Type.INT), col("kode", Type.TEXT), col("nama_kegiatan", Type.TEXT)),
    KEGIATAN_UNIT("kegiatan-unit", "sireva.kegiatan_unit", true,
            col("kegiatan_id", Type.INT), col("unit_id", Type.INT)),
    SUB_KEGIATAN("sub-kegiatan", "sireva.sub_kegiatan", true,
            col("kegiatan_id", Type.INT), col("kode", Type.TEXT), col("nama_sub_kegiatan", Type.TEXT),
            col("output", Type.TEXT)),
    LAPORAN_RENCANA_AKSI("laporan-rencana-aksi", "sireva.laporan_rencana_aksi", true,
            col("rencana_aksi_id", Type.INT), col("capaian", Type.DECIMAL), col("analisa_capaian", Type.TEXT),
            col("analisa_permasalahan", Type.TEXT), col("keterangan_rencana_aksi", Type.TEXT)),
    LAPORAN_PERJANJIAN_KINERJA("laporan-perjanjian-kinerja", "sireva.laporan_perjanjian_kinerja", true,
            col("indikator_id", Type.INT), col("capaian", Type.DECIMAL), col("analisa_capaian", Type.TEXT),
            col("analisa_permasalahan", Type.TEXT), col("keterangan_rencana_aksi", Type.TEXT)),
    LAPORAN_SASARAN_STRATEGIS("laporan-sasaran-strategis", "sireva.laporan_sasaran_strategis", true,
            col("sasaran_id", Type.INT), col("indikator_id", Type.INT), col("capaian", Type.DECIMAL),
            col("analisa_capaian", Type.TEXT), col("analisa_permasalahan", Type.TEXT),
            col("keterangan_rencana_aksi", Type.TEXT)),
    REALISASI_INDIKATOR("realisasi-indikator", "sireva.realisasi_indikator", true,
            col("indikator_kode", Type.TEXT), col("unit_id", Type.INT), col("tahun", Type.INT),
            col("bulan", Type.INT), col("triwulan", Type.INT), col("target", Type.DECIMAL),
            col("realisasi", Type.DECIMAL)),
    MASTER_PROGRAM("master-program", "keuangan.master_program", false),
    MASTER_KEGIATAN("master-kegiatan", "keuangan.master_kegiatan", false);

    public enum Type {
        INT, TEXT, DECIMAL
    }

    public record Column(String name, Type type) {
        public String jsonKey() {
            return JdbcRows.camelCase(name);
        }
    }

    private final String path;
    private final String qualifiedName;
    private final boolean writable;
    private final List<Column> columns;

    ReferenceTable(String path, String qualifiedName, boolean writable, Column... columns) {
        this.path = path;
        this.qualifiedName = qualifiedName;
        this.writable = writable;
        this.columns = List.of(columns);
    }

    private static Column col(String name, Type type) {
        return new Column(name, type);
    }

    public String qualifiedName() {
        return qualifiedName;
    }

    public boolean writable() {
        return writable;
    }

    public List<Column> columns() {
        return columns;
    }

    public static Optional<ReferenceTable> forPath(String path) {
        for (ReferenceTable table : values()) {
            if (table.path.equals(path)) {
                return Optional.of(table);
            }
        }
        return Optional.empty();
    }
}
