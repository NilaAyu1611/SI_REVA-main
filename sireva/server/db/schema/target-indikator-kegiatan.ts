import { integer, numeric, serial, timestamp } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const targetIndiaktorKegiatan = appSchema.table("target_indikator_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  idIku: integer("id_iku"),
  tahun: integer("tahun"),
  targetNilai: numeric("target_nilai"),
  createdAt: timestamp("created_at"),
});
