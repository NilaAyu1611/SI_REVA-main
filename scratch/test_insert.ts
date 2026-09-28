import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testInsert() {
  const query = `
    insert into "sireva"."sasaran_program" 
    ("id_ss", "kode", "unit_kerja", "kode_iku", "sasaran_program_text", "satuan", "target_1", "target_2", "target_3", "target_4", "target_5") 
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
    returning "id"
  `;
  const params = [
    29, 
    'SP.TEST2', 
    'Direktorat Strategi Peningkatan Kualitas Kebijakan Administrasi Negara', 
    'Presentase instansi pemerintah yang menerapkan tata kelola kualitas kebijakan yang baik', 
    'nyoba', 
    'nilai', 
    '10', '10', '10', '10', '10'
  ];

  try {
    const res = await pool.query(query, params);
    console.log('Insert success! ID:', res.rows[0].id);
    process.exit(0);
  } catch (err: any) {
    console.error('Insert failed!');
    console.error('Error Name:', err.name);
    console.error('Error Code:', err.code);
    console.error('Error Detail:', err.detail);
    console.error('Error Message:', err.message);
    process.exit(1);
  }
}

testInsert();
