import { integer, serial, numeric, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";
import { indikatorKegiatan } from "./indikator-kegiatan";

export const laporanPerjanjianKinerja = appSchema.table("laporan_perjanjian_kinerja", {
  id: serial("id").primaryKey().notNull(),
  indikatorId: integer("indikator_id").notNull(),
  capaian: numeric("capaian").notNull(),
  analisaCapaian: text("analisa_capaian").notNull(),
  analisaPermasalahan: text("analisa_permasalahan").notNull(),
  keteranganRencanaAksi: text("keterangan_rencana_aksi"),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  foreignKey({
    columns: [table.indikatorId],
    foreignColumns: [indikatorKegiatan.id],
    name: "laporan_pk_indikator_id_fkey"
  }).onDelete("cascade"),
]);
