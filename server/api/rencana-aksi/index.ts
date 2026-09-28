import { db } from '../../db';
import { rencanaAksi } from '../../db/schema/rencana-aksi';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';

/**
 * Handle CRUD operations for Rencana Aksi
 */
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const query = getQuery(event);

  try {
    // GET: Fetch plans with labels
    if (method === 'GET') {
      if (query.id) {
        return await db.select().from(rencanaAksi).where(eq(rencanaAksi.id, Number(query.id)));
      }

      return await db.select({
        id: rencanaAksi.id,
        indikatorId: rencanaAksi.indikatorId,
        rencanaAksi: rencanaAksi.namaRencanaAksi,
        namaRencanaAksi: rencanaAksi.namaRencanaAksi,
        target: rencanaAksi.target,
        anggaran: sql<string | null>`null`,
        indikator: sasaranKegiatan.namaSk,
        indikatorNama: sasaranKegiatan.namaSk,
        sasaran: sasaranProgram.namaSp,
        sasaranProgramId: sasaranProgram.id,
        unitKerja: sasaranKegiatan.pengampu,
        unitKerjaNama: sasaranKegiatan.pengampu,
        tahun: sasaranStrategis.tahun,
        tw1: rencanaAksi.tw1,
        tw2: rencanaAksi.tw2,
        tw3: rencanaAksi.tw3,
        tw4: rencanaAksi.tw4
      })
      .from(rencanaAksi)
      .leftJoin(sasaranKegiatan, eq(rencanaAksi.indikatorId, sasaranKegiatan.id))
      .leftJoin(sasaranProgram, eq(sasaranKegiatan.spId, sasaranProgram.id))
      .leftJoin(sasaranStrategis, eq(sasaranProgram.ssId, sasaranStrategis.id));
    }

    // POST: Create new plan
    if (method === 'POST') {
      const body = await readBody(event);
      const [res] = await db.insert(rencanaAksi).values({
        indikatorId: Number(body.indikatorId),
        namaRencanaAksi: body.namaAksi || body.namaRencanaAksi,
        target: String(body.target || 0),
        tw1: String(body.tw1 || 0),
        tw2: String(body.tw2 || 0),
        tw3: String(body.tw3 || 0),
        tw4: String(body.tw4 || 0),
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
        indikatorId: body.indikatorId !== undefined ? Number(body.indikatorId) : undefined,
        namaRencanaAksi: body.namaAksi || body.namaRencanaAksi,
        target: body.target !== undefined ? String(body.target) : undefined,
        tw1: body.tw1 !== undefined ? String(body.tw1) : undefined,
        tw2: body.tw2 !== undefined ? String(body.tw2) : undefined,
        tw3: body.tw3 !== undefined ? String(body.tw3) : undefined,
        tw4: body.tw4 !== undefined ? String(body.tw4) : undefined,
        b01: body.b01 !== undefined ? String(body.b01) : undefined,
        b02: body.b02 !== undefined ? String(body.b02) : undefined,
        b03: body.b03 !== undefined ? String(body.b03) : undefined,
        b04: body.b04 !== undefined ? String(body.b04) : undefined,
        b05: body.b05 !== undefined ? String(body.b05) : undefined,
        b06: body.b06 !== undefined ? String(body.b06) : undefined,
        b07: body.b07 !== undefined ? String(body.b07) : undefined,
        b08: body.b08 !== undefined ? String(body.b08) : undefined,
        b09: body.b09 !== undefined ? String(body.b09) : undefined,
        b10: body.b10 !== undefined ? String(body.b10) : undefined,
        b11: body.b11 !== undefined ? String(body.b11) : undefined,
        b12: body.b12 !== undefined ? String(body.b12) : undefined,
      }).where(eq(rencanaAksi.id, Number(body.id))).returning();
      
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
