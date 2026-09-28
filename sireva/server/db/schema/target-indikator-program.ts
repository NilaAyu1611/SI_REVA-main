import { integer, numeric, serial } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const targetIndikatorProgram = appSchema.table("target_indikator_program", {
  id: serial("id").primaryKey().notNull(),
  indikatorId: integer("indikator_id"),
  tahun: integer("tahun"),
  target: numeric("target"),
});
