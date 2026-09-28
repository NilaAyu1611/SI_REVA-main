import { db } from '../../db';
import { laporanRencanaAksi } from '../../db/schema/laporan-rencana-aksi';
import { rencanaAksi } from '../../db/schema/rencana-aksi';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
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
          indikatorNama: indikatorKinerja.namaIku,
          targetValue: rencanaAksi.target,
          unitKerjaNama: sasaranKegiatan.pengampu,
          sasaranText: sasaranKegiatan.namaSk,
          programUnitKerja: sasaranProgram.pengampu,
        })
        .from(laporanRencanaAksi)
        .leftJoin(rencanaAksi, eq(laporanRencanaAksi.rencanaAksiId, rencanaAksi.id))
        .leftJoin(sasaranKegiatan, eq(rencanaAksi.indikatorId, sasaranKegiatan.id))
        .leftJoin(indikatorKinerja, eq(sasaranKegiatan.id, indikatorKinerja.skId))
        .leftJoin(sasaranProgram, eq(sasaranKegiatan.spId, sasaranProgram.id))
        .where(eq(laporanRencanaAksi.id, Number(query.id)));
        
        return res;
      }

      return await db.select({
        id: laporanRencanaAksi.id,
        rencanaAksiNama: rencanaAksi.namaRencanaAksi,
        indikatorNama: indikatorKinerja.namaIku,
        realisasi: laporanRencanaAksi.capaian, // In schema RA it's named 'capaian' but used as realisasi
        targetValue: rencanaAksi.target,
        unitKerja: sasaranKegiatan.pengampu,
        programUnitKerja: sasaranProgram.pengampu,
        keterangan: laporanRencanaAksi.keteranganRencanaAksi,
      })
      .from(laporanRencanaAksi)
      .leftJoin(rencanaAksi, eq(laporanRencanaAksi.rencanaAksiId, rencanaAksi.id))
      .leftJoin(sasaranKegiatan, eq(rencanaAksi.indikatorId, sasaranKegiatan.id))
      .leftJoin(indikatorKinerja, eq(sasaranKegiatan.id, indikatorKinerja.skId))
      .leftJoin(sasaranProgram, eq(sasaranKegiatan.spId, sasaranProgram.id));
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
