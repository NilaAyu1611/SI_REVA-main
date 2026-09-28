const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.dtjrketxxozstcwvotzh:PAAYphUUf7KYz-2@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
pool.query(`select "sireva"."sasaran_kegiatan"."id", "sireva"."sasaran_kegiatan"."id_sp", "sireva"."sasaran_kegiatan"."kode", "sireva"."sasaran_kegiatan"."sasaran_text", "sireva"."sasaran_kegiatan"."unit_kerja_id", "sireva"."unit_kerja"."nama_unit", "sireva"."indikator_kegiatan"."id", "sireva"."indikator_kegiatan"."nama_iku", "sireva"."indikator_kegiatan"."satuan_pengukuran", "sireva"."indikator_kegiatan"."definisi", "sireva"."indikator_kegiatan"."formula_penghitungan" from "sireva"."sasaran_kegiatan" left join "sireva"."unit_kerja" on "sireva"."sasaran_kegiatan"."unit_kerja_id" = "sireva"."unit_kerja"."id" left join "sireva"."indikator_kegiatan" on "sireva"."sasaran_kegiatan"."id" = "sireva"."indikator_kegiatan"."id_sk"`)
  .then(res => console.log('Success:', res.rows.length))
  .catch(err => console.error('Error:', err.message))
  .finally(() => pool.end());
