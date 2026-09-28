import { integer, serial, numeric, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";
import { sasaranStrategis } from "./sasaran-strategis";
import { indikatorKegiatan } from "./indikator-kegiatan";

export const laporanSasaranStrategis = appSchema.table("laporan_sasaran_strategis", {
  id: serial("id").primaryKey().notNull(),
  sasaranId: integer("sasaran_id").notNull(),
  indikatorId: integer("indikator_id").notNull(),
  capaian: numeric("capaian").notNull(),
  analisaCapaian: text("analisa_capaian").notNull(),
  analisaPermasalahan: text("analisa_permasalahan").notNull(),
  keteranganRencanaAksi: text("keterangan_rencana_aksi"),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  foreignKey({
    columns: [table.sasaranId],
    foreignColumns: [sasaranStrategis.id],
    name: "laporan_sasaran_strategis_sasaran_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.indikatorId],
    foreignColumns: [indikatorKegiatan.id],
    name: "laporan_sasaran_strategis_indikator_id_fkey"
  }).onDelete("cascade"),
]);
