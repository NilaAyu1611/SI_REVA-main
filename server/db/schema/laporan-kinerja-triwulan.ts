import { integer, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";

export const laporanKinerjaTriwulan = appSchema.table("laporan_kinerja_triwulan", {
  id: serial("id").primaryKey().notNull(),
  tahun: integer("tahun").notNull(),
  triwulan: varchar("triwulan", { length: 50 }).notNull(),
  unitKerja: varchar("unit_kerja", { length: 255 }).notNull(),
  ringkasanEksekutif: text("ringkasan_eksekutif").notNull(),
  kataPengantar: text("kata_pengantar").notNull(),
  rencanaTindakLanjut: text("rencana_tindak_lanjut").notNull(),
  informasiTambahan: text("informasi_tambahan"),
  lampiranUrl: text("lampiran_url"),
  status: varchar("status", { length: 50 }).default('Draft'),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
