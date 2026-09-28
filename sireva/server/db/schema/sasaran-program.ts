import { integer, serial, varchar, text, timestamp, unique, foreignKey, boolean } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranStrategis } from "./sasaran-strategis";

export const sasaranProgram = appSchema.table("sasaran_program", {
  id: serial("id").primaryKey().notNull(),
  ssId: integer("ss_id").notNull(),
  nomorUrut: integer("nomor_urut").notNull(),
  kodeSp: varchar("kode_sp", { length: 255 }).notNull(),
  namaSp: text("nama_sp").notNull(),
  pengampu: text("pengampu"),
  instansiTerkait: text("instansi_terkait"),
  isActive: boolean("is_active").default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.ssId],
    foreignColumns: [sasaranStrategis.id],
    name: "sasaran_program_ss_id_fkey"
  }).onDelete("restrict"),
  unique("sasaran_program_ss_id_nomor_urut_uniq").on(table.ssId, table.nomorUrut),
  unique("sasaran_program_ss_id_kode_sp_uniq").on(table.ssId, table.kodeSp),
]);