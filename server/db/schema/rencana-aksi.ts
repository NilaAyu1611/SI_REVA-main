import { integer, serial, numeric, text, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranKegiatan } from "./sasaran-kegiatan";

export const rencanaAksi = appSchema.table("rencana_aksi", {
  id: serial("id").primaryKey().notNull(),
  indikatorId: integer("indikator_id").notNull(),
  namaRencanaAksi: text("nama_rencana_aksi").notNull(),
  target: numeric("target"),
  b01: numeric("b01"),
  b02: numeric("b02"),
  b03: numeric("b03"),
  b04: numeric("b04"),
  b05: numeric("b05"),
  b06: numeric("b06"),
  b07: numeric("b07"),
  b08: numeric("b08"),
  b09: numeric("b09"),
  b10: numeric("b10"),
  b11: numeric("b11"),
  b12: numeric("b12"),
  tw1: numeric("tw1"),
  tw2: numeric("tw2"),
  tw3: numeric("tw3"),
  tw4: numeric("tw4"),
}, (table) => [
  foreignKey({
    columns: [table.indikatorId],
    foreignColumns: [sasaranKegiatan.id],
    name: "rencana_aksi_indikator_id_fkey"
  }).onDelete("cascade"),
]);
