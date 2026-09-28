import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function createTable() {
  try {
    console.log('Creating perjanjian_kinerja table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sireva.perjanjian_kinerja (
        id SERIAL PRIMARY KEY,
        tahun INTEGER NOT NULL,
        unit_kerja VARCHAR(255) NOT NULL,
        sasaran_id INTEGER NOT NULL,
        indikator_id INTEGER NOT NULL,
        target VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table created successfully!');
  } catch (err) {
    console.error('Error creating table:', err);
  }
  process.exit(0);
}

createTable();
