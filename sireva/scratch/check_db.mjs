import postgres from 'postgres';
import fs from 'fs';

// Simple .env parser
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

async function testQuery() {
  const connectionString = env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env');
    return;
  }

  const sql = postgres(connectionString, {
    ssl: { rejectUnauthorized: false },
    onnotice: () => {}
  });

  try {
    console.log('Connected to database');
    
    // Set search path
    await sql`SET search_path TO sireva`;
    console.log('Search path set to sireva');

    try {
      // The query from the image
      const result = await sql`
        select "id", "created_at", "unit_kerja", "username", "password", "role_id", "alias", "role" 
        from "users" 
        where "username" = ${'Admin'}
      `;
      console.log('Query successful:', result);
    } catch (err) {
      console.error('Query failed with error:');
      console.error(err.message);
      
      console.log('\nChecking if schema "sireva" exists:');
      const schemaCheck = await sql`
        SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'sireva';
      `;
      console.log('Schema "sireva" exists:', schemaCheck.length > 0);

      console.log('\nChecking if table "users" exists in schema "sireva":');
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE  table_schema = 'sireva'
          AND    table_name   = 'users'
        );
      `;
      console.log('Table "users" exists:', tableCheck[0].exists);

      if (tableCheck[0].exists) {
        console.log('\nChecking columns for "sireva.users":');
        const columns = await sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'sireva' AND table_name = 'users'
        `;
        console.log(columns.map(c => `${c.column_name}: ${c.data_type}`));
      } else {
        console.log('\nChecking all tables in "sireva" schema:');
        const tables = await sql`
          SELECT table_name FROM information_schema.tables WHERE table_schema = 'sireva';
        `;
        console.log(tables);
      }
    }

  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await sql.end();
  }
}

testQuery();
