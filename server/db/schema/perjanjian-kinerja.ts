import { integer, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { appSchema } from "./base";

export const perjanjianKinerja = appSchema.table("perjanjian_kinerja", {
  id: serial("id").primaryKey().notNull(),
  tahun: integer("tahun").notNull(),
  unitKerja: varchar("unit_kerja", { length: 255 }).notNull(),
  sasaranId: integer("sasaran_id").notNull(),
  indikatorId: integer("indikator_id").notNull(),
  target: varchar("target", { length: 255 }),
  status: varchar("status", { length: 50 }).default('Draft'),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
