import { integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const indikatorKegiatan = appSchema.table("indikator_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  idSk: integer("id_sk"),
  namaIku: text("nama_iku"),
  satuanPengukuran: varchar("satuan_pengukuran"),
  definisi: text("definisi"),
  formulaPenghitungan: text("formula_penghitungan"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
