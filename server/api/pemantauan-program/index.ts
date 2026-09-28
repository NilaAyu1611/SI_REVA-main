import { db } from '../../db';
import { laporanSasaranProgram } from '../../db/schema/laporan-sasaran-program';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { sasaranProgramUnitKerja } from '../../db/schema/sasaran-program-unit-kerja';
import { unitKerja } from '../../db/schema/unit-kerja';
import { eq, and, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';
 
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const query = getQuery(event);
 
  try {
    if (method === 'GET') {
      if (query.id) {
        const [res] = await db.select({
          id: laporanSasaranProgram.id,
          sasaranId: laporanSasaranProgram.sasaranId,
          indikatorId: laporanSasaranProgram.indikatorId,
          realisasi: laporanSasaranProgram.realisasi,
          realisasiKik: laporanSasaranProgram.realisasiKik,
          analisaCapaian: laporanSasaranProgram.analisaCapaian,
          analisaPermasalahan: laporanSasaranProgram.analisaPermasalahan,
          tindakLanjut: laporanSasaranProgram.tindakLanjut,
          sasaranText: sasaranProgram.namaSp,
          indikatorNama: indikatorProgram.nama,
          unitKerjaNama: sql<string>`coalesce(string_agg(distinct ${unitKerja.nama}, ', '), '')`,
          unitKerjaIds: sql<number[]>`coalesce(array_agg(distinct ${unitKerja.id}) filter (where ${unitKerja.id} is not null), '{}'::integer[])`,
          targetValue: sql<number>`coalesce((select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2026 limit 1), 0)`,
          satuan: indikatorProgram.satuan
        })
        .from(laporanSasaranProgram)
        .leftJoin(sasaranProgram, eq(laporanSasaranProgram.sasaranId, sasaranProgram.id))
        .leftJoin(indikatorProgram, eq(laporanSasaranProgram.indikatorId, indikatorProgram.id))
        .leftJoin(sasaranProgramUnitKerja, eq(sasaranProgram.id, sasaranProgramUnitKerja.sasaranProgramId))
        .leftJoin(unitKerja, eq(sasaranProgramUnitKerja.unitKerjaId, unitKerja.id))
        .where(eq(laporanSasaranProgram.id, Number(query.id)))
        .groupBy(
          laporanSasaranProgram.id,
          laporanSasaranProgram.sasaranId,
          laporanSasaranProgram.indikatorId,
          laporanSasaranProgram.realisasi,
          laporanSasaranProgram.realisasiKik,
          laporanSasaranProgram.analisaCapaian,
          laporanSasaranProgram.analisaPermasalahan,
          laporanSasaranProgram.tindakLanjut,
          sasaranProgram.namaSp,
          indikatorProgram.id,
          indikatorProgram.nama
        );
        
        return res;
      }

      // Fetch list
      return await db.select({
        id: laporanSasaranProgram.id,
        sasaranText: sasaranProgram.namaSp,
        indikatorNama: indikatorProgram.nama,
        realisasi: laporanSasaranProgram.realisasi,
        targetValue: sql<number>`coalesce((select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2026 limit 1), 0)`,
        satuan: indikatorProgram.satuan
      })
      .from(laporanSasaranProgram)
      .leftJoin(sasaranProgram, eq(laporanSasaranProgram.sasaranId, sasaranProgram.id))
      .leftJoin(indikatorProgram, eq(laporanSasaranProgram.indikatorId, indikatorProgram.id));
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const [res] = await db.insert(laporanSasaranProgram).values({
        sasaranId: body.sasaranProgramId || body.sasaranId,
        indikatorId: body.indikatorId,
        realisasi: String(body.realisasi),
        realisasiKik: body.realisasiKik ? String(body.realisasiKik) : null,
        analisaCapaian: body.analisaPencapaian || body.analisaCapaian,
        analisaPermasalahan: body.analisaPermasalahan,
        tindakLanjut: body.tindakLanjut || body.keteranganRencanaAksi || ""
      }).returning();
      return res;
    }

    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      const [res] = await db.update(laporanSasaranProgram).set({
        realisasi: String(body.realisasi),
        realisasiKik: body.realisasiKik ? String(body.realisasiKik) : null,
        analisaCapaian: body.analisaPencapaian || body.analisaCapaian,
        analisaPermasalahan: body.analisaPermasalahan,
        tindakLanjut: body.tindakLanjut || body.keteranganRencanaAksi || ""
      }).where(eq(laporanSasaranProgram.id, body.id)).returning();
      return res;
    }

    if (method === 'DELETE') {
      const id = event.context.params?.id || query.id;
      if (!id) throw new Error('ID is required');
      await db.delete(laporanSasaranProgram).where(eq(laporanSasaranProgram.id, Number(id)));
      return { success: true };
    }
  } catch (error: any) {
    console.error('API Error [pemantauan-program]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
