import { integer, serial, numeric, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";
import { sasaranProgram } from "./sasaran-program";
import { indikatorProgram } from "./indikator-program";

export const laporanSasaranProgram = appSchema.table("laporan_sasaran_program", {
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
    foreignColumns: [sasaranProgram.id],
    name: "laporan_sp_sasaran_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.indikatorId],
    foreignColumns: [indikatorProgram.id],
    name: "laporan_sp_indikator_id_fkey"
  }).onDelete("cascade"),
]);
