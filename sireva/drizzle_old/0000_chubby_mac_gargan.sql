CREATE SCHEMA "sireva";
--> statement-breakpoint
CREATE TABLE "sireva"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"alias" varchar(255),
	"unit_kerja" text,
	"role_id" integer,
	"role" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "sireva"."indikator_kinerja" (
	"id" serial PRIMARY KEY NOT NULL,
	"sasaran_id" integer,
	"kode" varchar(20),
	"nama_indikator" text NOT NULL,
	"satuan" varchar(50),
	"jenis" varchar(50),
	"baseline" numeric,
	"unit_kerja" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "sireva"."kegiatan_unit" (
	"id" serial PRIMARY KEY NOT NULL,
	"kegiatan_id" integer,
	"unit_id" integer
);
--> statement-breakpoint
CREATE TABLE "sireva"."kegiatan" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer,
	"kode" varchar(20),
	"nama_kegiatan" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."misi" (
	"id" serial PRIMARY KEY NOT NULL,
	"visi_id" integer,
	"kode" varchar(10),
	"misi_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."pendanaan" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer,
	"kegiatan_id" integer,
	"tahun_id" integer,
	"sumber_dana" varchar(50),
	"pagu" numeric,
	"realisasi" numeric,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "sireva"."periode" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(20),
	"tahun_mulai" integer,
	"tahun_selesai" integer,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "sireva"."program" (
	"id" serial PRIMARY KEY NOT NULL,
	"sasaran_id" integer,
	"kode" varchar(20),
	"nama_program" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."realisasi_indikator" (
	"id" serial PRIMARY KEY NOT NULL,
	"indikator_kode" varchar(50),
	"unit_id" integer,
	"tahun" integer,
	"bulan" integer,
	"triwulan" integer,
	"target" numeric,
	"realisasi" numeric,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "sireva"."sasaran_kegiatan" (
	"id" serial PRIMARY KEY NOT NULL,
	"kegiatan_id" integer,
	"kode" varchar(20),
	"sasaran_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."sasaran_program" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer,
	"kode" varchar(20),
	"sasaran_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."sasaran_strategis" (
	"id" serial PRIMARY KEY NOT NULL,
	"tujuan_id" integer,
	"kode" varchar(10),
	"sasaran_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."sub_kegiatan" (
	"id" serial PRIMARY KEY NOT NULL,
	"kegiatan_id" integer,
	"kode" varchar(20),
	"nama_sub_kegiatan" text,
	"output" text
);
--> statement-breakpoint
CREATE TABLE "sireva"."sumber_dana" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "sireva"."tahun" (
	"id" serial PRIMARY KEY NOT NULL,
	"tahun" integer NOT NULL,
	"periode_id" integer
);
--> statement-breakpoint
CREATE TABLE "sireva"."target_indikator" (
	"id" serial PRIMARY KEY NOT NULL,
	"indikator_id" integer,
	"tahun_id" integer,
	"target" numeric,
	"realisasi" numeric,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "target_indikator_indikator_id_tahun_id_key" UNIQUE("indikator_id","tahun_id")
);
--> statement-breakpoint
CREATE TABLE "sireva"."tujuan" (
	"id" serial PRIMARY KEY NOT NULL,
	"misi_id" integer,
	"kode" varchar(10),
	"tujuan_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sireva"."visi" (
	"id" serial PRIMARY KEY NOT NULL,
	"periode_id" integer,
	"visi_text" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "keuangan"."master_program" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_program" varchar,
	"nama_program" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"total" numeric
);
--> statement-breakpoint
CREATE TABLE "keuangan"."master_kegiatan" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode_kegiatan" varchar,
	"nama_kegiatan" text,
	"program_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"total" numeric
);
--> statement-breakpoint
CREATE TABLE "sireva"."roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_role" varchar(50) NOT NULL,
	"deskripsi" text,
	CONSTRAINT "roles_nama_role_key" UNIQUE("nama_role")
);
--> statement-breakpoint
CREATE TABLE "sireva"."unit_kerja" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_unit" varchar(255),
	"parent_id" integer
);
--> statement-breakpoint
CREATE TABLE "sireva"."rencana_aksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"indikator_id" integer NOT NULL,
	"nama_rencana_aksi" text NOT NULL,
	"target" numeric,
	"tw1" numeric,
	"tw2" numeric,
	"tw3" numeric,
	"tw4" numeric
);
--> statement-breakpoint
CREATE TABLE "sireva"."laporan_sasaran_strategis" (
	"id" serial PRIMARY KEY NOT NULL,
	"sasaran_id" integer NOT NULL,
	"indikator_id" integer NOT NULL,
	"capaian" numeric NOT NULL,
	"analisa_capaian" text NOT NULL,
	"analisa_permasalahan" text NOT NULL,
	"keterangan_rencana_aksi" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "sireva"."laporan_perjanjian_kinerja" (
	"id" serial PRIMARY KEY NOT NULL,
	"indikator_id" integer NOT NULL,
	"capaian" numeric NOT NULL,
	"analisa_capaian" text NOT NULL,
	"analisa_permasalahan" text NOT NULL,
	"keterangan_rencana_aksi" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "sireva"."laporan_rencana_aksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"rencana_aksi_id" integer NOT NULL,
	"capaian" numeric NOT NULL,
	"analisa_capaian" text NOT NULL,
	"analisa_permasalahan" text NOT NULL,
	"keterangan_rencana_aksi" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "sireva"."indikator_kinerja" ADD CONSTRAINT "indikator_kinerja_sasaran_id_fkey" FOREIGN KEY ("sasaran_id") REFERENCES "sireva"."sasaran_strategis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."kegiatan_unit" ADD CONSTRAINT "kegiatan_unit_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "sireva"."kegiatan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."kegiatan_unit" ADD CONSTRAINT "kegiatan_unit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "sireva"."unit_kerja"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."kegiatan" ADD CONSTRAINT "kegiatan_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "sireva"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."misi" ADD CONSTRAINT "misi_visi_id_fkey" FOREIGN KEY ("visi_id") REFERENCES "sireva"."visi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."pendanaan" ADD CONSTRAINT "pendanaan_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "sireva"."kegiatan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."pendanaan" ADD CONSTRAINT "pendanaan_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "sireva"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."pendanaan" ADD CONSTRAINT "pendanaan_tahun_id_fkey" FOREIGN KEY ("tahun_id") REFERENCES "sireva"."tahun"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."program" ADD CONSTRAINT "program_sasaran_id_fkey" FOREIGN KEY ("sasaran_id") REFERENCES "sireva"."sasaran_strategis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."realisasi_indikator" ADD CONSTRAINT "realisasi_indikator_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "sireva"."unit_kerja"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."sasaran_kegiatan" ADD CONSTRAINT "sasaran_kegiatan_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "sireva"."kegiatan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."sasaran_program" ADD CONSTRAINT "sasaran_program_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "sireva"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."sasaran_strategis" ADD CONSTRAINT "sasaran_strategis_tujuan_id_fkey" FOREIGN KEY ("tujuan_id") REFERENCES "sireva"."tujuan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."sub_kegiatan" ADD CONSTRAINT "sub_kegiatan_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "sireva"."kegiatan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."tahun" ADD CONSTRAINT "tahun_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "sireva"."periode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."target_indikator" ADD CONSTRAINT "target_indikator_indikator_id_fkey" FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_kinerja"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."target_indikator" ADD CONSTRAINT "target_indikator_tahun_id_fkey" FOREIGN KEY ("tahun_id") REFERENCES "sireva"."tahun"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."tujuan" ADD CONSTRAINT "tujuan_misi_id_fkey" FOREIGN KEY ("misi_id") REFERENCES "sireva"."misi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."visi" ADD CONSTRAINT "visi_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "sireva"."periode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keuangan"."master_kegiatan" ADD CONSTRAINT "master_kegiatan_program_id_master_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "keuangan"."master_program"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."unit_kerja" ADD CONSTRAINT "unit_kerja_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sireva"."unit_kerja"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."rencana_aksi" ADD CONSTRAINT "rencana_aksi_indikator_id_fkey" FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_kinerja"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."laporan_sasaran_strategis" ADD CONSTRAINT "laporan_sasaran_strategis_sasaran_id_fkey" FOREIGN KEY ("sasaran_id") REFERENCES "sireva"."sasaran_strategis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."laporan_sasaran_strategis" ADD CONSTRAINT "laporan_sasaran_strategis_indikator_id_fkey" FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_kinerja"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."laporan_perjanjian_kinerja" ADD CONSTRAINT "laporan_pk_indikator_id_fkey" FOREIGN KEY ("indikator_id") REFERENCES "sireva"."indikator_kinerja"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sireva"."laporan_rencana_aksi" ADD CONSTRAINT "laporan_ra_rencana_aksi_id_fkey" FOREIGN KEY ("rencana_aksi_id") REFERENCES "sireva"."rencana_aksi"("id") ON DELETE cascade ON UPDATE no action;