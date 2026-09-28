import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';
import { generateKodeSP } from '../../utils/kode-helper';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const ssId = query.ss_id ? Number(query.ss_id) : null;
      const id = query.id ? Number(query.id) : null;

      const selectFields = {
        id: sasaranProgram.id,
        ssId: sasaranProgram.ssId,
        nomorUrut: sasaranProgram.nomorUrut,
        kode: sasaranProgram.kodeSp,
        sasaran_program_text: sasaranProgram.namaSp,
        unit_kerja: sasaranProgram.pengampu,
        unitKerjaNama: sasaranProgram.pengampu,
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

      if (id && !isNaN(id)) {
        const result = await db.select(selectFields)
          .from(sasaranProgram)
          .leftJoin(indikatorProgram, eq(sasaranProgram.id, indikatorProgram.sasaranProgramId))
          .where(
            and(
              eq(sasaranProgram.id, id),
              isNull(sasaranProgram.deletedAt)
            )
          );
        return result[0] || null;
      }

      const conditions = [isNull(sasaranProgram.deletedAt)];
      if (ssId && !isNaN(ssId)) {
        conditions.push(eq(sasaranProgram.ssId, ssId));
      }

      return await db.select(selectFields)
        .from(sasaranProgram)
        .leftJoin(indikatorProgram, eq(sasaranProgram.id, indikatorProgram.sasaranProgramId))
        .where(and(...conditions))
        .orderBy(sasaranProgram.nomorUrut);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);

      // Validation
      if (!body.ss_id) {
        throw createError({ statusCode: 400, statusMessage: 'ss_id wajib diisi' });
      }
      if (!body.nama_sp) {
        throw createError({ statusCode: 400, statusMessage: 'nama_sp wajib diisi' });
      }
      if (body.kode_sp || body.nomor_urut || body.kodeSp || body.nomorUrut) {
        throw createError({ statusCode: 400, statusMessage: 'Kode and nomor_urut tidak boleh dikirim dari frontend' });
      }

      const parentId = Number(body.ss_id);

      // Concurrency locking and code generation in a transaction
      const result = await db.transaction(async (tx) => {
        // SELECT ... FOR UPDATE on parent to make it transaction-safe
        const parentResult = await tx.execute(
          sql`SELECT id, kode_ss FROM sireva.sasaran_strategis WHERE id = ${parentId} AND deleted_at IS NULL FOR UPDATE`
        );
        const parent = parentResult.rows[0];
        if (!parent) {
          throw createError({ statusCode: 404, statusMessage: 'Parent Sasaran Strategis tidak ditemukan' });
        }

        const kodeSs = parent.kode_ss as string;
 
         // Calculate MAX(nomor_urut) for this ssId
         const maxResult = await tx.execute(
           sql`SELECT coalesce(max(nomor_urut), 0) as max_val FROM sireva.sasaran_program WHERE ss_id = ${parentId}`
         );
         const maxVal = Number(maxResult.rows[0]?.max_val || 0);
         const nextNomorUrut = maxVal + 1;
         const generatedCode = generateKodeSP(kodeSs, nextNomorUrut);
 
         const inserted = await tx.insert(sasaranProgram)
           .values({
             ssId: parentId,
             nomorUrut: nextNomorUrut,
             kodeSp: generatedCode,
             namaSp: body.nama_sp,
             pengampu: body.pengampu || null,
             instansiTerkait: body.instansi_terkait || null,
           })
           .returning();
 
         return inserted[0];
       });
 
       if (!result) {
         throw createError({ statusCode: 500, statusMessage: 'Gagal menambahkan data' });
       }
 
       return {
         success: true,
         message: 'Data berhasil ditambahkan',
         data: {
           id: result.id,
           kode: result.kodeSp,
           nama: result.namaSp
         }
       };

    } catch (error: any) {
      console.error('Error in POST /api/sasaran-program:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'DELETE') {
    try {
      const body = await readBody(event);
      const id = Number(body.id);
      if (!id || isNaN(id)) {
        throw createError({ statusCode: 400, statusMessage: 'id wajib diisi' });
      }

      // Soft delete
      const result = await db
        .update(sasaranProgram)
        .set({ deletedAt: new Date() })
        .where(eq(sasaranProgram.id, id))
        .returning();

      if (!result.length) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      return { success: true, message: 'Data berhasil dihapus' };
    } catch (error: any) {
      console.error('Error in DELETE /api/sasaran-program:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || error.message || 'Gagal menghapus data'
      });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});