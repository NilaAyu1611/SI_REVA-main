import { integer, serial, numeric, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";
import { rencanaAksi } from "./rencana-aksi";

export const laporanRencanaAksi = appSchema.table("laporan_rencana_aksi", {
  id: serial("id").primaryKey().notNull(),
  rencanaAksiId: integer("rencana_aksi_id").notNull(),
  capaian: numeric("capaian").notNull(),
  analisaCapaian: text("analisa_capaian").notNull(),
  analisaPermasalahan: text("analisa_permasalahan").notNull(),
  keteranganRencanaAksi: text("keterangan_rencana_aksi"),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  foreignKey({
    columns: [table.rencanaAksiId],
    foreignColumns: [rencanaAksi.id],
    name: "laporan_ra_rencana_aksi_id_fkey"
  }).onDelete("cascade"),
]);
