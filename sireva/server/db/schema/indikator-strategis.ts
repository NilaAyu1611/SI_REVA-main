import { integer, serial, text, varchar } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const indikatorStrategis = appSchema.table("indikator_strategis", {
  id: serial("id").primaryKey().notNull(),
  sasaranStrategisId: integer("sasaran_strategis_id"),
  kode: varchar("kode"),
  nama: text("nama"),
  satuan: varchar("satuan"),
  deskripsi: text("deskripsi"),
  formula: text("formula"),
});
