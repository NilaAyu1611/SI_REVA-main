import { integer, serial, text, varchar, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranProgram } from "./sasaran-program";

export const indikatorProgram = appSchema.table("indikator_program", {
  id: serial("id").primaryKey().notNull(),
  sasaranProgramId: integer("sasaran_program_id"),
  kode: varchar("kode"),
  nama: text("nama"),
  satuan: varchar("satuan"),
  deskripsi: text("deskripsi"),
  formula: text("formula"),
}, (table) => [
  foreignKey({
    columns: [table.sasaranProgramId],
    foreignColumns: [sasaranProgram.id],
    name: "indikator_program_sasaran_program_id_fkey"
  }).onDelete("cascade"),
]);
