import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { laporanSasaranProgram } from '../../db/schema/laporan-sasaran-program';
import { laporanSasaranKegiatan } from '../../db/schema/laporan-sasaran-kegiatan';
import { laporanSasaranStrategis } from '../../db/schema/laporan-sasaran-strategis';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { unitKerja } from '../../db/schema/unit-kerja';
import { sql, isNull, and, eq, or } from 'drizzle-orm';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // 1. Fetch counts
    const ssCount = await db.select({ count: sql<number>`count(*)` })
      .from(sasaranStrategis)
      .where(isNull(sasaranStrategis.deletedAt));

    const spCount = await db.select({ count: sql<number>`count(*)` })
      .from(sasaranProgram)
      .where(isNull(sasaranProgram.deletedAt));

    const skCount = await db.select({ count: sql<number>`count(*)` })
      .from(sasaranKegiatan)
      .where(isNull(sasaranKegiatan.deletedAt));

    const programIkuCount = await db.select({ count: sql<number>`count(*)` })
      .from(indikatorProgram);

    const kegiatanIkuCount = await db.select({ count: sql<number>`count(*)` })
      .from(indikatorKinerja)
      .where(and(eq(indikatorKinerja.isActive, true), isNull(indikatorKinerja.deletedAt)));

    const totalIku = Number(programIkuCount[0]?.count || 0) + Number(kegiatanIkuCount[0]?.count || 0);

    // 2. Fetch reports for 2026
    const strategisReports = await db.execute(sql`
      select 
        lss.capaian
      from sireva.laporan_sasaran_strategis lss
      join sireva.sasaran_strategis ss on ss.id = lss.sasaran_id
      where ss.deleted_at is null
    `);

    const programReports = await db.execute(sql`
      select 
        lsp.realisasi,
        coalesce((select target from sireva.target_indikator_program tip where tip.indikator_id = lsp.indikator_id and tip.tahun = 2026 limit 1), 0) as target,
        sp.pengampu as unit_name
      from sireva.laporan_sasaran_program lsp
      join sireva.sasaran_program sp on sp.id = lsp.sasaran_id
    `);

    const kegiatanReports = await db.execute(sql`
      select 
        lsk.realisasi,
        coalesce((select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = lsk.indikator_id and tik.tahun = 2026 limit 1), 0) as target,
        sk.pengampu as unit_name
      from sireva.laporan_sasaran_kegiatan lsk
      join sireva.sasaran_kegiatan sk on sk.id = lsk.sasaran_id
    `);

    let totalCapaian = 0;
    let reportCount = 0;
    let belumTercapai = 0;

    let totalCapaianSp = 0;
    let reportCountSp = 0;

    let totalCapaianSk = 0;
    let reportCountSk = 0;

    // Track achievements by unit_name
    const unitMap = new Map<string, { total: number, count: number }>();

    const processProgramReport = (r: any) => {
      const real = parseFloat(r.realisasi || '0');
      const tar = parseFloat(r.target || '0');
      const unitName = r.unit_name || 'Lainnya';

      if (tar > 0) {
        const cap = Math.min((real / tar) * 100, 100);
        totalCapaian += cap;
        reportCount++;
        totalCapaianSp += cap;
        reportCountSp++;
        if (cap < 100) {
          belumTercapai++;
        }

        const current = unitMap.get(unitName) || { total: 0, count: 0 };
        unitMap.set(unitName, {
          total: current.total + cap,
          count: current.count + 1
        });
      }
    };

    const processKegiatanReport = (r: any) => {
      const real = parseFloat(r.realisasi || '0');
      const tar = parseFloat(r.target || '0');
      const unitName = r.unit_name || 'Lainnya';

      if (tar > 0) {
        const cap = Math.min((real / tar) * 100, 100);
        totalCapaian += cap;
        reportCount++;
        totalCapaianSk += cap;
        reportCountSk++;
        if (cap < 100) {
          belumTercapai++;
        }

        const current = unitMap.get(unitName) || { total: 0, count: 0 };
        unitMap.set(unitName, {
          total: current.total + cap,
          count: current.count + 1
        });
      }
    };

    programReports.rows.forEach(processProgramReport);
    kegiatanReports.rows.forEach(processKegiatanReport);

    let totalCapaianSs = 0;
    let reportCountSs = 0;
    strategisReports.rows.forEach((r: any) => {
      totalCapaianSs += parseFloat(r.capaian || '0');
      reportCountSs++;
    });

    const averageCapaian = reportCount > 0 ? parseFloat((totalCapaian / reportCount).toFixed(2)) : 0;
    const averageCapaianSs = reportCountSs > 0 ? parseFloat((totalCapaianSs / reportCountSs).toFixed(2)) : 0;
    const averageCapaianSp = reportCountSp > 0 ? parseFloat((totalCapaianSp / reportCountSp).toFixed(2)) : 0;
    const averageCapaianSk = reportCountSk > 0 ? parseFloat((totalCapaianSk / reportCountSk).toFixed(2)) : 0;


    // 3. Capaian per Unit Kerja
    let capaianUnit: any[] = [];
    try {
      const dbUnits = await db.execute(sql`
        SELECT DISTINCT nama 
        FROM sireva.unit_kerja 
        WHERE nama IS NOT NULL AND nama != 'Kepala LAN'
        ORDER BY nama
      `);
      
      capaianUnit = dbUnits.rows.map((u: any) => {
        const name = u.nama;
        const stats = unitMap.get(name);
        return {
          name: name,
          value: stats ? parseFloat((stats.total / stats.count).toFixed(2)) : 0
        };
      });
      
      // Sort from highest to lowest by default
      capaianUnit.sort((a, b) => b.value - a.value);
    } catch (dbError) {
      console.error('Error fetching unit_kerja in stats:', dbError);
      // Fallback in case of DB error
      if (unitMap.size > 0) {
        for (const [name, stats] of unitMap.entries()) {
          capaianUnit.push({
            name: name,
            value: parseFloat((stats.total / stats.count).toFixed(2))
          });
        }
        capaianUnit.sort((a, b) => b.value - a.value);
      }
    }

    // 4. IKU Prioritas / Perlu Perhatian
    let ikuPrioritas: any[] = [];
    
    // Program Level
    const progIkus = await db.execute(sql`
      select 
        ip.nama as iku,
        sp.pengampu as unit,
        coalesce((select target from sireva.target_indikator_program tip where tip.indikator_id = ip.id and tip.tahun = 2026 limit 1), 0) as target,
        coalesce((select lsp.realisasi from sireva.laporan_sasaran_program lsp where lsp.indikator_id = ip.id order by lsp.created_at desc limit 1), 0) as realisasi
      from sireva.indikator_program ip
      join sireva.sasaran_program sp on sp.id = ip.sasaran_program_id
    `);

    // Kegiatan Level
    const kegIkus = await db.execute(sql`
      select 
        ik.nama_iku as iku,
        sk.pengampu as unit,
        coalesce((select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ik.id and tik.tahun = 2026 limit 1), 0) as target,
        coalesce((select lsk.realisasi from sireva.laporan_sasaran_kegiatan lsk where lsk.indikator_id = ik.id order by lsk.created_at desc limit 1), 0) as realisasi
      from sireva.indikator_kinerja ik
      join sireva.sasaran_kegiatan sk on sk.id = ik.sk_id
      where ik.is_active = true and ik.deleted_at is null
    `);

    const allIkus: any[] = [];
    const processIku = (r: any) => {
      const tar = parseFloat(r.target || '0');
      const real = parseFloat(r.realisasi || '0');
      if (tar > 0) {
        const cap = Math.min((real / tar) * 100, 100);
        const dev = parseFloat((cap - 100).toFixed(2));
        allIkus.push({
          iku: r.iku,
          unit: r.unit || 'Lainnya',
          target: tar.toString(),
          realisasi: real.toString(),
          capaian: cap.toFixed(1) + '%',
          deviasi: dev.toFixed(1) + '%',
          capNum: cap,
          status: cap < 70 ? 'Belum Tercapai' : 'Perlu Perhatian'
        });
      }
    };

    progIkus.rows.forEach(processIku);
    kegIkus.rows.forEach(processIku);

    // Filter down-performing ones (capaian < 100%)
    ikuPrioritas = allIkus.filter(i => i.capNum < 100);
    
    // Sort by lowest achievement first
    ikuPrioritas.sort((a, b) => a.capNum - b.capNum);
    
    // Return all, no limit (frontend handles preview vs full list)
    ikuPrioritas = ikuPrioritas.map((item, idx) => ({
      no: idx + 1,
      iku: item.iku,
      unit: item.unit,
      target: item.target,
      realisasi: item.realisasi,
      capaian: item.capaian,
      deviasi: item.deviasi,
      capNum: item.capNum,
      status: item.status
    }));

    return {
      ss: Number(ssCount[0]?.count || 0),
      sp: Number(spCount[0]?.count || 0),
      sk: Number(skCount[0]?.count || 0),
      totalIku: totalIku,
      capaian: averageCapaian,
      capaianSs: averageCapaianSs,
      capaianSp: averageCapaianSp,
      capaianSk: averageCapaianSk,
      belumTercapai: reportCount > 0 ? belumTercapai : totalIku,
      capaianUnit,
      ikuPrioritas
    };
  } catch (error: any) {
    console.error('Dashboard Stats API Error:', error);
    return {
      ss: 0,
      sp: 0,
      sk: 0,
      totalIku: 0,
      capaian: 0,
      capaianSs: 0,
      capaianSp: 0,
      capaianSk: 0,
      belumTercapai: 0,
      capaianUnit: [],
      ikuPrioritas: []
    };
  }
});

