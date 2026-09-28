import { db } from '../../../db';
import { sasaranProgram } from '../../../db/schema/sasaran-program';
import { indikatorProgram } from '../../../db/schema/indikator-program';
import { unitKerja } from '../../../db/schema/unit-kerja';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, createError, type H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const unitKerjaId = Number(event.context.params?.id);
  if (!unitKerjaId || isNaN(unitKerjaId)) {
    throw createError({ statusCode: 400, statusMessage: 'id unit kerja harus berupa angka' });
  }

  try {
    const conditions = [
      isNull(sasaranProgram.deletedAt),
      sql`exists (
        select 1 from sireva.sasaran_program_unit_kerja spuk
        where spuk.sasaran_program_id = ${sasaranProgram.id}
          and spuk.unit_kerja_id = ${unitKerjaId}
      )`
    ];

    const selectFields = {
      id: sasaranProgram.id,
      ssId: sasaranProgram.ssId,
      nomorUrut: sasaranProgram.nomorUrut,
      kode: sasaranProgram.kodeSp,
      sasaran_program_text: sasaranProgram.namaSp,
      unit_kerja: sql<string>`
        (
          select string_agg(uk.nama, ', ')
          from sireva.sasaran_program_unit_kerja spuk
          join sireva.unit_kerja uk on uk.id = spuk.unit_kerja_id
          where spuk.sasaran_program_id = ${sasaranProgram.id}
        )
      `,
      unitKerjaNama: sql<string>`
        (
          select string_agg(uk.nama, ', ')
          from sireva.sasaran_program_unit_kerja spuk
          join sireva.unit_kerja uk on uk.id = spuk.unit_kerja_id
          where spuk.sasaran_program_id = ${sasaranProgram.id}
        )
      `,
      indikatorId: indikatorProgram.id,
      kode_iku: indikatorProgram.kode,
      indikatorNama: indikatorProgram.nama,
      satuan: indikatorProgram.satuan,
      indikatorSatuan: indikatorProgram.satuan,
      target_1: sql<string>`(select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2025 limit 1)`,
      target_2: sql<string>`(select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2026 limit 1)`,
      target_3: sql<string>`(select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2027 limit 1)`,
      target_4: sql<string>`(select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2028 limit 1)`,
      target_5: sql<string>`(select target from sireva.target_indikator_program tip where tip.indikator_id = ${indikatorProgram.id} and tip.tahun = 2029 limit 1)`,
    };

    const rows = await db.select(selectFields)
      .from(sasaranProgram)
      .leftJoin(indikatorProgram, eq(sasaranProgram.id, indikatorProgram.sasaranProgramId))
      .where(and(...conditions))
      .orderBy(sasaranProgram.nomorUrut);

    return rows;
  } catch (error: any) {
    console.error('API Error [sasaran-program/unit-kerja/:id]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
