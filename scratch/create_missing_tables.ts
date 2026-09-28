import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Creating Table sireva.laporan_sasaran_program...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."laporan_sasaran_program" (
        "id" serial PRIMARY KEY NOT NULL,
        "sasaran_id" integer NOT NULL,
        "indikator_id" integer NOT NULL,
        "realisasi" numeric NOT NULL,
        "realisasi_kik" numeric,
        "analisa_capaian" text NOT NULL,
        "analisa_permasalahan" text NOT NULL,
        "tindak_lanjut" text DEFAULT '' NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating Table sireva.laporan_sasaran_kegiatan...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."laporan_sasaran_kegiatan" (
        "id" serial PRIMARY KEY NOT NULL,
        "sasaran_id" integer NOT NULL,
        "indikator_id" integer NOT NULL,
        "realisasi" numeric NOT NULL,
        "realisasi_kik" numeric,
        "analisa_capaian" text NOT NULL,
        "analisa_permasalahan" text NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Adding constraints for laporan_sasaran_program...');
    try {
      await db.execute(sql`
        ALTER TABLE "sireva"."laporan_sasaran_program" 
        ADD CONSTRAINT "laporan_sp_sasaran_id_fkey" 
        FOREIGN KEY ("sasaran_id") REFERENCES "sireva"."sasaran_program"("id") ON DELETE cascade ON UPDATE no action;
      `);
      await db.execute(sql`
        ALTER TABLE "sireva"."laporan_sasaran_program" 
        ADD CONSTRAINT "laporan_sp_indikator_id_fkey" 
        FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_program"("id") ON DELETE cascade ON UPDATE no action;
      `);
    } catch (e: any) {
      console.log('Constraints for laporan_sasaran_program might already exist:', e.message);
    }

    console.log('Adding constraints for laporan_sasaran_kegiatan...');
    try {
      await db.execute(sql`
        ALTER TABLE "sireva"."laporan_sasaran_kegiatan" 
        ADD CONSTRAINT "laporan_sk_sasaran_id_fkey" 
        FOREIGN KEY ("sasaran_id") REFERENCES "sireva"."sasaran_kegiatan"("id") ON DELETE cascade ON UPDATE no action;
      `);
      await db.execute(sql`
        ALTER TABLE "sireva"."laporan_sasaran_kegiatan" 
        ADD CONSTRAINT "laporan_sk_indikator_id_fkey" 
        FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_kegiatan"("id") ON DELETE cascade ON UPDATE no action;
      `);
    } catch (e: any) {
      console.log('Constraints for laporan_sasaran_kegiatan might already exist:', e.message);
    }

    console.log('Tables and constraints checked/created successfully!');
  } catch (error) {
    console.error('Failed to create tables:', error);
  }
  process.exit(0);
}

main();
