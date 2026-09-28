import { integer, serial, varchar, text, numeric, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranStrategis } from "./sasaran-strategis";

export const indikatorSasaranStrategis = appSchema.table("indikator_sasaran_strategis", {
  id: serial("id").primaryKey().notNull(),
  ssId: integer("ss_id"),
  kodeIndikator: varchar("kode_indikator", { length: 255 }),
  namaIndikator: text("nama_indikator"),
  satuan: varchar("satuan", { length: 255 }),
  target1: numeric("target_1").default("0"),
  target2: numeric("target_2").default("0"),
  target3: numeric("target_3").default("0"),
  target4: numeric("target_4").default("0"),
  target5: numeric("target_5").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.ssId],
    foreignColumns: [sasaranStrategis.id],
    name: "indikator_sasaran_strategis_ss_id_fkey"
  }).onDelete("cascade"),
]);
