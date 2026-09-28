import { integer, serial, varchar, text, timestamp, unique, foreignKey, boolean } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { sasaranKegiatan } from "./sasaran-kegiatan";

export const indikatorKinerja = appSchema.table("indikator_kinerja", {
  id: serial("id").primaryKey().notNull(),
  skId: integer("sk_id").notNull(),
  nomorUrut: integer("nomor_urut").notNull(),
  kodeIku: varchar("kode_iku", { length: 255 }).notNull(),
  namaIku: text("nama_iku").notNull(),
  satuan: varchar("satuan", { length: 255 }),
  target: text("target"),
  realisasi: text("realisasi"),
  isActive: boolean("is_active").default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.skId],
    foreignColumns: [sasaranKegiatan.id],
    name: "indikator_kinerja_sk_id_fkey"
  }).onDelete("restrict"),
  unique("indikator_kinerja_sk_id_nomor_urut_uniq").on(table.skId, table.nomorUrut),
  unique("indikator_kinerja_sk_id_kode_iku_uniq").on(table.skId, table.kodeIku),
]);
