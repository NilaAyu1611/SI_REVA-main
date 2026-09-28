import { integer, serial, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const unitKerja = appSchema.table("unit_kerja", {
  id: serial("id").primaryKey().notNull(),
  nama: text("nama"),
  level: integer("level"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (table) => [
  foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: "unit_kerja_parent_id_fkey"
  }),
]);