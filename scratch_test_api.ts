import { db } from './server/db';
import { sql } from 'drizzle-orm';


const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING MASTER DATA INTEGRATION TESTS ===\n');

  try {
    console.log('Cleaning up tables for a clean test run...');
    await db.execute(sql`TRUNCATE sireva.sasaran_strategis CASCADE`);
    console.log('Tables cleared.');

    // 1. Create Sasaran Strategis 1
    console.log('\n1. Creating first Sasaran Strategis...');
    const resSS1 = await fetch(`${BASE_URL}/api/sasaran-strategis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tahun: '2026',
        nama_ss: 'Peningkatan Kualitas Layanan Organisasi',
        pengampu: 'Unit IT',
        instansi_terkait: 'Kementerian PANRB'
      })
    });
    const dataSS1 = await resSS1.json() as any;
    console.log('Response:', JSON.stringify(dataSS1, null, 2));

    if (!dataSS1.success || dataSS1.data.kode !== 'SS-01') {
      throw new Error('Test failed: SS-01 was not generated correctly');
    }
    const ss1Id = dataSS1.data.id;

    // 2. Create Sasaran Strategis 2
    console.log('\n2. Creating second Sasaran Strategis...');
    const resSS2 = await fetch(`${BASE_URL}/api/sasaran-strategis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tahun: '2026',
        nama_ss: 'Optimalisasi Manajemen Aset dan Keuangan',
        pengampu: 'Unit Keuangan',
        instansi_terkait: 'Kementerian Keuangan'
      })
    });
    const dataSS2 = await resSS2.json() as any;
    console.log('Response:', JSON.stringify(dataSS2, null, 2));

    if (!dataSS2.success || dataSS2.data.kode !== 'SS-02') {
      throw new Error('Test failed: SS-02 was not generated correctly');
    }

    // 3. Create Sasaran Program under SS-01
    console.log('\n3. Creating first Sasaran Program under SS-01 (should be SP-01.01)...');
    const resSP1 = await fetch(`${BASE_URL}/api/sasaran-program`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ss_id: ss1Id,
        nama_sp: 'Pengembangan Infrastruktur Aplikasi Pintar',
        pengampu: 'Divisi IT Development',
        instansi_terkait: 'Bappenas'
      })
    });
    const dataSP1 = await resSP1.json() as any;
    console.log('Response:', JSON.stringify(dataSP1, null, 2));

    if (!dataSP1.success || dataSP1.data.kode !== 'SP-01.01') {
      throw new Error('Test failed: SP-01.01 was not generated correctly');
    }
    const sp1Id = dataSP1.data.id;

    // 4. Create Sasaran Program 2 under SS-01
    console.log('\n4. Creating second Sasaran Program under SS-01 (should be SP-01.02)...');
    const resSP2 = await fetch(`${BASE_URL}/api/sasaran-program`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ss_id: ss1Id,
        nama_sp: 'Peningkatan Kompetensi SDM Digital',
        pengampu: 'HRD',
        instansi_terkait: 'Kemenkominfo'
      })
    });
    const dataSP2 = await resSP2.json() as any;
    console.log('Response:', JSON.stringify(dataSP2, null, 2));

    if (!dataSP2.success || dataSP2.data.kode !== 'SP-01.02') {
      throw new Error('Test failed: SP-01.02 was not generated correctly');
    }

    // 5. Create Sasaran Kegiatan under SP-01.01
    console.log('\n5. Creating Sasaran Kegiatan under SP-01.01 (should be SK-01.01.01)...');
    const resSK1 = await fetch(`${BASE_URL}/api/sasaran-kegiatan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sp_id: sp1Id,
        nama_sk: 'Implementasi Cloud Server Sireva v2',
        pengampu: 'Sub-Divisi Cloud',
        instansi_terkait: 'AWS'
      })
    });
    const dataSK1 = await resSK1.json() as any;
    console.log('Response:', JSON.stringify(dataSK1, null, 2));

    if (!dataSK1.success || dataSK1.data.kode !== 'SK-01.01.01') {
      throw new Error('Test failed: SK-01.01.01 was not generated correctly');
    }
    const sk1Id = dataSK1.data.id;

    // 6. Create Indikator Kinerja under SK-01.01.01
    console.log('\n6. Creating Indikator Kinerja under SK-01.01.01 (should be IKU-01.01.01.01)...');
    const resIKU1 = await fetch(`${BASE_URL}/api/indikator-kinerja`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sk_id: sk1Id,
        nama_iku: 'Persentase Ketersediaan Sistem (Uptime)',
        satuan: '%',
        target: '99.9',
        realisasi: '0.0'
      })
    });
    const dataIKU1 = await resIKU1.json() as any;
    console.log('Response:', JSON.stringify(dataIKU1, null, 2));

    if (!dataIKU1.success || dataIKU1.data.kode !== 'IKU-01.01.01.01') {
      throw new Error('Test failed: IKU-01.01.01.01 was not generated correctly');
    }
    const iku1Id = dataIKU1.data.id;

    // 7. Validation Test: Try sending kode from client
    console.log('\n7. Validation: Sending kode from client during POST...');
    const resVal1 = await fetch(`${BASE_URL}/api/sasaran-program`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ss_id: ss1Id,
        nama_sp: 'Salah input kode',
        kode_sp: 'SP-99.99'
      })
    });
    const dataVal1 = await resVal1.json() as any;
    console.log('Response (Expected error):', JSON.stringify(dataVal1, null, 2));
    if (dataVal1.success) {
      throw new Error('Validation failed: Allowed client-defined code on insert');
    }

    // 8. Validation Test: Try updating immutable fields
    console.log('\n8. Validation: Updating immutable field (ss_id)...');
    const resVal2 = await fetch(`${BASE_URL}/api/sasaran-program/${sp1Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ss_id: 9999
      })
    });
    const dataVal2 = await resVal2.json() as any;
    console.log('Response (Expected error):', JSON.stringify(dataVal2, null, 2));
    if (dataVal2.success) {
      throw new Error('Validation failed: Allowed client to update ss_id');
    }

    // 9. Cascade RESTRICT test: Deleting SS-01 while SP-01.01 exists
    console.log('\n9. Deleting parent Sasaran Strategis while children exist (should fail)...');
    const resDel1 = await fetch(`${BASE_URL}/api/sasaran-strategis/${ss1Id}`, {
      method: 'DELETE'
    });
    const dataDel1 = await resDel1.json() as any;
    console.log('Response (Expected error):', JSON.stringify(dataDel1, null, 2));
    if (dataDel1.success || !dataDel1.message.includes('data parent')) {
      throw new Error('Test failed: parent delete cascade check did not restrict');
    }

    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
  } catch (error: any) {
    console.error('\n❌ TEST RUN ENCOUNTERED AN ERROR:', error.message);
  }
  process.exit(0);
}

runTests();
