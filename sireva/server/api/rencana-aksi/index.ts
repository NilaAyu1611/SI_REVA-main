import { db } from '../../db';
import { rencanaAksi } from '../../db/schema/rencana-aksi';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery, createError } from 'h3';

/**
 * Handle CRUD operations for Rencana Aksi
 */
export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);

  try {
    // GET: Fetch plans with labels
    if (method === 'GET') {
      if (query.id) {
        return await db.select().from(rencanaAksi).where(eq(rencanaAksi.id, Number(query.id)));
      }
      
      const { sasaranKegiatan } = await import('../../db/schema/sasaran-kegiatan');
      const { sasaranProgram } = await import('../../db/schema/sasaran-program');

      return await db.select({
        id: rencanaAksi.id,
        indikatorId: rencanaAksi.indikatorId,
        rencanaAksi: rencanaAksi.namaRencanaAksi,
        target: rencanaAksi.target,
        anggaran: sql<string | null>`null`,
        indikator: sasaranKegiatan.sasaranText,
        sasaran: sasaranProgram.sasaranText,
        unitKerja: sasaranKegiatan.unitKerjaId
      })
      .from(rencanaAksi)
      .leftJoin(sasaranKegiatan, eq(rencanaAksi.indikatorId, sasaranKegiatan.id))
      .leftJoin(sasaranProgram, eq(sasaranKegiatan.idSp, sasaranProgram.id));
    }

    // POST: Create new plan
    if (method === 'POST') {
      const body = await readBody(event);
      const [res] = await db.insert(rencanaAksi).values({
        indikatorId: Number(body.indikatorId),
        namaRencanaAksi: body.namaAksi || body.namaRencanaAksi,
        target: String(body.target || 0),
        b01: String(body.b01 || 0), b02: String(body.b02 || 0), b03: String(body.b03 || 0), b04: String(body.b04 || 0),
        b05: String(body.b05 || 0), b06: String(body.b06 || 0), b07: String(body.b07 || 0), b08: String(body.b08 || 0),
        b09: String(body.b09 || 0), b10: String(body.b10 || 0), b11: String(body.b11 || 0), b12: String(body.b12 || 0)
      }).returning();
      return res;
    }

    // PUT: Update plan
    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      
      const [res] = await db.update(rencanaAksi).set({
        indikatorId: body.indikatorId,
        namaRencanaAksi: body.namaAksi,
        target: body.target,
        b01: body.b01, b02: body.b02, b03: body.b03, b04: body.b04,
        b05: body.b05, b06: body.b06, b07: body.b07, b08: body.b08,
        b09: body.b09, b10: body.b10, b11: body.b11, b12: body.b12
      }).where(eq(rencanaAksi.id, body.id)).returning();
      
      return { success: true, data: res };
    }

    // DELETE: Delete plan
    if (method === 'DELETE') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      
      await db.delete(rencanaAksi).where(eq(rencanaAksi.id, body.id));
      return { success: true };
    }
  } catch (error: any) {
    console.error('API Error [rencana-aksi]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Terjadi kesalahan saat memproses Rencana Aksi'
    });
  }
});
