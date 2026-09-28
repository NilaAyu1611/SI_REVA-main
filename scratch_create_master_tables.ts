import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Creating sasaran_strategis table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."sasaran_strategis" (
        "id" serial PRIMARY KEY NOT NULL,
        "tahun" varchar(255) NOT NULL,
        "nomor_urut" integer NOT NULL,
        "kode_ss" varchar(255) NOT NULL,
        "nama_ss" text NOT NULL,
        "pengampu" text,
        "instansi_terkait" text,
        "is_active" boolean DEFAULT true,
        "deleted_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "sasaran_strategis_tahun_nomor_urut_uniq" UNIQUE("tahun","nomor_urut"),
        CONSTRAINT "sasaran_strategis_tahun_kode_ss_uniq" UNIQUE("tahun","kode_ss")
      )
    `);

    console.log('Creating sasaran_program table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."sasaran_program" (
        "id" serial PRIMARY KEY NOT NULL,
        "ss_id" integer NOT NULL,
        "nomor_urut" integer NOT NULL,
        "kode_sp" varchar(255) NOT NULL,
        "nama_sp" text NOT NULL,
        "pengampu" text,
        "instansi_terkait" text,
        "is_active" boolean DEFAULT true,
        "deleted_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "sasaran_program_ss_id_nomor_urut_uniq" UNIQUE("ss_id","nomor_urut"),
        CONSTRAINT "sasaran_program_ss_id_kode_sp_uniq" UNIQUE("ss_id","kode_sp")
      )
    `);

    console.log('Creating sasaran_kegiatan table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."sasaran_kegiatan" (
        "id" serial PRIMARY KEY NOT NULL,
        "sp_id" integer NOT NULL,
        "nomor_urut" integer NOT NULL,
        "kode_sk" varchar(255) NOT NULL,
        "nama_sk" text NOT NULL,
        "pengampu" text,
        "instansi_terkait" text,
        "is_active" boolean DEFAULT true,
        "deleted_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "sasaran_kegiatan_sp_id_nomor_urut_uniq" UNIQUE("sp_id","nomor_urut"),
        CONSTRAINT "sasaran_kegiatan_sp_id_kode_sk_uniq" UNIQUE("sp_id","kode_sk")
      )
    `);

    console.log('Creating indikator_kinerja table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sireva"."indikator_kinerja" (
        "id" serial PRIMARY KEY NOT NULL,
        "sk_id" integer NOT NULL,
        "nomor_urut" integer NOT NULL,
        "kode_iku" varchar(255) NOT NULL,
        "nama_iku" text NOT NULL,
        "satuan" varchar(255),
        "target" text,
        "realisasi" text,
        "is_active" boolean DEFAULT true,
        "deleted_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "indikator_kinerja_sk_id_nomor_urut_uniq" UNIQUE("sk_id","nomor_urut"),
        CONSTRAINT "indikator_kinerja_sk_id_kode_iku_uniq" UNIQUE("sk_id","kode_iku")
      )
    `);

    console.log('Applying foreign key constraints...');
    await db.execute(sql`
      ALTER TABLE "sireva"."indikator_kinerja" 
      ADD CONSTRAINT "indikator_kinerja_sk_id_fkey" 
      FOREIGN KEY ("sk_id") REFERENCES "sireva"."sasaran_kegiatan"("id") 
      ON DELETE restrict ON UPDATE no action
    `).catch(e => console.log('IK constraint already exists or error:', e.message));

    await db.execute(sql`
      ALTER TABLE "sireva"."sasaran_kegiatan" 
      ADD CONSTRAINT "sasaran_kegiatan_sp_id_fkey" 
      FOREIGN KEY ("sp_id") REFERENCES "sireva"."sasaran_program"("id") 
      ON DELETE restrict ON UPDATE no action
    `).catch(e => console.log('SK constraint already exists or error:', e.message));

    await db.execute(sql`
      ALTER TABLE "sireva"."sasaran_program" 
      ADD CONSTRAINT "sasaran_program_ss_id_fkey" 
      FOREIGN KEY ("ss_id") REFERENCES "sireva"."sasaran_strategis"("id") 
      ON DELETE restrict ON UPDATE no action
    `).catch(e => console.log('SP constraint already exists or error:', e.message));

    console.log('Database tables constructed successfully.');
  } catch (err: any) {
    console.error('Error creating database tables:', err);
  }
  process.exit(0);
}
main();
