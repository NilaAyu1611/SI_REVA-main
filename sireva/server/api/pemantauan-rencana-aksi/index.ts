import { db } from '../../db';
import { laporanRencanaAksi } from '../../db/schema/laporan-rencana-aksi';
import { rencanaAksi } from '../../db/schema/rencana-aksi';
import { indikatorKegiatan } from '../../db/schema/indikator-kegiatan';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);

  try {
    if (method === 'GET') {
      if (query.id) {
        const [res] = await db.select({
          id: laporanRencanaAksi.id,
          rencanaAksiId: laporanRencanaAksi.rencanaAksiId,
          capaian: laporanRencanaAksi.capaian,
          analisaCapaian: laporanRencanaAksi.analisaCapaian,
          analisaPermasalahan: laporanRencanaAksi.analisaPermasalahan,
          keteranganRencanaAksi: laporanRencanaAksi.keteranganRencanaAksi,
          rencanaAksiNama: rencanaAksi.namaRencanaAksi,
          indikatorNama: indikatorKegiatan.nama,
          targetValue: rencanaAksi.target,
        })
        .from(laporanRencanaAksi)
        .leftJoin(rencanaAksi, eq(laporanRencanaAksi.rencanaAksiId, rencanaAksi.id))
        .leftJoin(indikatorKegiatan, eq(rencanaAksi.indikatorId, indikatorKegiatan.id))
        .where(eq(laporanRencanaAksi.id, Number(query.id)));
        
        return res;
      }

      return await db.select({
        id: laporanRencanaAksi.id,
        rencanaAksiNama: rencanaAksi.namaRencanaAksi,
        indikatorNama: indikatorKegiatan.nama,
        realisasi: laporanRencanaAksi.capaian, // In schema RA it's named 'capaian' but used as realisasi
        targetValue: rencanaAksi.target,
      })
      .from(laporanRencanaAksi)
      .leftJoin(rencanaAksi, eq(laporanRencanaAksi.rencanaAksiId, rencanaAksi.id))
      .leftJoin(indikatorKegiatan, eq(rencanaAksi.indikatorId, indikatorKegiatan.id));
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const [res] = await db.insert(laporanRencanaAksi).values({
        rencanaAksiId: body.rencanaAksiId,
        capaian: String(body.realisasi || body.capaian),
        analisaCapaian: body.analisaPencapaian || body.analisaCapaian,
        analisaPermasalahan: body.analisaPermasalahan,
        keteranganRencanaAksi: body.keterangan
      }).returning();
      return res;
    }

    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      const [res] = await db.update(laporanRencanaAksi).set({
        capaian: String(body.realisasi || body.capaian),
        analisaCapaian: body.analisaPencapaian || body.analisaCapaian,
        analisaPermasalahan: body.analisaPermasalahan,
        keteranganRencanaAksi: body.keterangan
      }).where(eq(laporanRencanaAksi.id, body.id)).returning();
      return res;
    }

    if (method === 'DELETE') {
      const id = event.context.params?.id || query.id;
      if (!id) throw new Error('ID is required');
      await db.delete(laporanRencanaAksi).where(eq(laporanRencanaAksi.id, Number(id)));
      return { success: true };
    }
  } catch (error: any) {
    console.error('API Error [pemantauan-rencana-aksi]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
