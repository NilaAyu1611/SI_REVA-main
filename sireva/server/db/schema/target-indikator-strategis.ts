import { integer, numeric, serial } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const targetIndikatorStrategis = appSchema.table("target_indikator_strategis", {
  id: serial("id").primaryKey().notNull(),
  indikatorId: integer("indikator_id"),
  tahun: integer("tahun"),
  target: numeric("target"),
});
