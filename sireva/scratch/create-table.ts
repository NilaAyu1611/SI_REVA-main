import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Creating table rencana_aksi...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."rencana_aksi" (
        "id" serial PRIMARY KEY NOT NULL,
        "indikator_id" integer NOT NULL,
        "nama_rencana_aksi" text NOT NULL,
        "target" numeric,
        "tw1" numeric,
        "tw2" numeric,
        "tw3" numeric,
        "tw4" numeric
      );
      
      DO $$ BEGIN
        ALTER TABLE "sireva"."rencana_aksi" ADD CONSTRAINT "rencana_aksi_indikator_id_fkey" FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_kinerja"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('Table created successfully!');
  } catch (error) {
    console.error('RAW ERROR:');
    console.error(error);
  }
  process.exit(0);
}
main();
