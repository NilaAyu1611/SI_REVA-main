import { integer, bigserial, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranProgram } from "./sasaran-program";
import { unitKerja } from "./unit-kerja";

export const sasaranProgramUnitKerja = appSchema.table("sasaran_program_unit_kerja", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  sasaranProgramId: integer("sasaran_program_id"),
  unitKerjaId: integer("unit_kerja_id"),
}, (table) => [
  foreignKey({
    columns: [table.sasaranProgramId],
    foreignColumns: [sasaranProgram.id],
    name: "sasaran_program_unit_kerja_sasaran_program_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.unitKerjaId],
    foreignColumns: [unitKerja.id],
    name: "sasaran_program_unit_kerja_unit_kerja_id_fkey"
  }).onDelete("cascade"),
]);
