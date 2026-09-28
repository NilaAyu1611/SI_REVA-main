import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."laporan_sasaran_strategis" (
        "id" serial PRIMARY KEY NOT NULL,
        "sasaran_id" integer NOT NULL,
        "indikator_id" integer NOT NULL,
        "capaian" numeric NOT NULL,
        "analisa_capaian" text NOT NULL,
        "analisa_permasalahan" text NOT NULL,
        "keterangan_rencana_aksi" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."laporan_perjanjian_kinerja" (
        "id" serial PRIMARY KEY NOT NULL,
        "indikator_id" integer NOT NULL,
        "capaian" numeric NOT NULL,
        "analisa_capaian" text NOT NULL,
        "analisa_permasalahan" text NOT NULL,
        "keterangan_rencana_aksi" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."laporan_rencana_aksi" (
        "id" serial PRIMARY KEY NOT NULL,
        "rencana_aksi_id" integer NOT NULL,
        "capaian" numeric NOT NULL,
        "analisa_capaian" text NOT NULL,
        "analisa_permasalahan" text NOT NULL,
        "keterangan_rencana_aksi" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Tables created successfully");
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}
main();
