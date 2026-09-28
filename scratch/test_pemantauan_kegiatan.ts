async function run() {
  try {
    console.log('Fetching /api/pemantauan-kegiatan...');
    const res = await fetch('http://localhost:3000/api/pemantauan-kegiatan');
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error('Fetch Error:', err.message);
  }
  process.exit(0);
}

run();
