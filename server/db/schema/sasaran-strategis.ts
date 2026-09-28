import { serial, text, varchar, integer, timestamp, unique, boolean } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranStrategis = appSchema.table("sasaran_strategis", {
  id: serial("id").primaryKey().notNull(),
  tahun: varchar("tahun", { length: 255 }).notNull(),
  nomorUrut: integer("nomor_urut").notNull(),
  kodeSs: varchar("kode_ss", { length: 255 }).notNull(),
  namaSs: text("nama_ss").notNull(),
  pengampu: text("pengampu"),
  instansiTerkait: text("instansi_terkait"),
  isActive: boolean("is_active").default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("sasaran_strategis_tahun_nomor_urut_uniq").on(table.tahun, table.nomorUrut),
  unique("sasaran_strategis_tahun_kode_ss_uniq").on(table.tahun, table.kodeSs),
]);