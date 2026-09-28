import { integer, serial, varchar, text, timestamp, unique, foreignKey, boolean } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranProgram } from "./sasaran-program";

export const sasaranKegiatan = appSchema.table("sasaran_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  spId: integer("sp_id").notNull(),
  nomorUrut: integer("nomor_urut").notNull(),
  kodeSk: varchar("kode_sk", { length: 255 }).notNull(),
  namaSk: text("nama_sk").notNull(),
  pengampu: text("pengampu"),
  instansiTerkait: text("instansi_terkait"),
  isActive: boolean("is_active").default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.spId],
    foreignColumns: [sasaranProgram.id],
    name: "sasaran_kegiatan_sp_id_fkey"
  }).onDelete("restrict"),
  unique("sasaran_kegiatan_sp_id_nomor_urut_uniq").on(table.spId, table.nomorUrut),
  unique("sasaran_kegiatan_sp_id_kode_sk_uniq").on(table.spId, table.kodeSk),
]);