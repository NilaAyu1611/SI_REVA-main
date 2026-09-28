import { integer, serial, numeric, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";
import { sasaranKegiatan } from "./sasaran-kegiatan";
import { indikatorKegiatan } from "./indikator-kegiatan";

export const laporanSasaranKegiatan = appSchema.table("laporan_sasaran_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  sasaranId: integer("sasaran_id").notNull(),
  indikatorId: integer("indikator_id").notNull(),
  realisasi: numeric("realisasi").notNull(),
  realisasiKik: numeric("realisasi_kik"),
  analisaCapaian: text("analisa_capaian").notNull(),
  analisaPermasalahan: text("analisa_permasalahan").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  foreignKey({
    columns: [table.sasaranId],
    foreignColumns: [sasaranKegiatan.id],
    name: "laporan_sk_sasaran_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.indikatorId],
    foreignColumns: [indikatorKegiatan.id],
    name: "laporan_sk_indikator_id_fkey"
  }).onDelete("cascade"),
]);
