import { db } from '../../db';
import { laporanSasaranKegiatan } from '../../db/schema/laporan-sasaran-kegiatan';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { unitKerja } from '../../db/schema/unit-kerja';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const query = getQuery(event);

  try {
    if (method === 'GET') {
      if (query.id) {
        const [res] = await db.select({
          id: laporanSasaranKegiatan.id,
          sasaranId: laporanSasaranKegiatan.sasaranId,
          indikatorId: laporanSasaranKegiatan.indikatorId,
          realisasi: laporanSasaranKegiatan.realisasi,
          realisasiKik: laporanSasaranKegiatan.realisasiKik,
          analisaCapaian: laporanSasaranKegiatan.analisaCapaian,
          analisaPermasalahan: laporanSasaranKegiatan.analisaPermasalahan,
          sasaranText: sasaranKegiatan.namaSk,
          kode: sasaranKegiatan.kodeSk,
          indikatorNama: indikatorKinerja.namaIku,
          unitKerjaNama: sasaranKegiatan.pengampu,
          targetValue: sql<number>`coalesce((select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2026 limit 1), 0)`,
          satuan: indikatorKinerja.satuan
        })
        .from(laporanSasaranKegiatan)
        .leftJoin(sasaranKegiatan, eq(laporanSasaranKegiatan.sasaranId, sasaranKegiatan.id))
        .leftJoin(indikatorKinerja, eq(laporanSasaranKegiatan.indikatorId, indikatorKinerja.id))
        .where(eq(laporanSasaranKegiatan.id, Number(query.id)));
        
        return res;
      }

      return await db.select({
        id: laporanSasaranKegiatan.id,
        sasaranText: sasaranKegiatan.namaSk,
        kode: sasaranKegiatan.kodeSk,
        indikatorNama: indikatorKinerja.namaIku,
        realisasi: laporanSasaranKegiatan.realisasi,
        targetValue: sql<number>`coalesce((select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2026 limit 1), 0)`,
        satuan: indikatorKinerja.satuan
      })
      .from(laporanSasaranKegiatan)
      .leftJoin(sasaranKegiatan, eq(laporanSasaranKegiatan.sasaranId, sasaranKegiatan.id))
      .leftJoin(indikatorKinerja, eq(laporanSasaranKegiatan.indikatorId, indikatorKinerja.id));
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const [res] = await db.insert(laporanSasaranKegiatan).values({
        sasaranId: body.sasaranKegiatanId || body.sasaranId,
        indikatorId: body.indikatorId,
        realisasi: String(body.realisasi),
        realisasiKik: body.realisasiKik ? String(body.realisasiKik) : null,
        analisaCapaian: body.analisaPencapaian || body.analisaCapaian,
        analisaPermasalahan: body.analisaPermasalahan
      }).returning();
      return res;
    }

    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      const [res] = await db.update(laporanSasaranKegiatan).set({
        realisasi: String(body.realisasi),
        realisasiKik: body.realisasiKik ? String(body.realisasiKik) : null,
        analisaCapaian: body.analisaPencapaian || body.analisaCapaian,
        analisaPermasalahan: body.analisaPermasalahan
      }).where(eq(laporanSasaranKegiatan.id, body.id)).returning();
      return res;
    }

    if (method === 'DELETE') {
      const id = event.context.params?.id || query.id;
      if (!id) throw new Error('ID is required');
      await db.delete(laporanSasaranKegiatan).where(eq(laporanSasaranKegiatan.id, Number(id)));
      return { success: true };
    }
  } catch (error: any) {
    console.error('API Error [pemantauan-kegiatan]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
