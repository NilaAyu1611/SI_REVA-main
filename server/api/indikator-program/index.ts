import { db } from '../../db';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    const conditions = [];
    if (query.sasaranProgramId) {
      conditions.push(eq(indikatorProgram.sasaranProgramId, Number(query.sasaranProgramId)));
    }

    return await db.select({
      id: indikatorProgram.id,
      sasaranProgramId: indikatorProgram.sasaranProgramId,
      kode: indikatorProgram.kode,
      nama: indikatorProgram.nama,
      satuan: indikatorProgram.satuan,
      deskripsi: indikatorProgram.deskripsi,
      formula: indikatorProgram.formula,
      target_1: sql<string>`MAX(CASE WHEN tip.tahun = 2025 THEN tip.target END)`,
      target_2: sql<string>`MAX(CASE WHEN tip.tahun = 2026 THEN tip.target END)`,
      target_3: sql<string>`MAX(CASE WHEN tip.tahun = 2027 THEN tip.target END)`,
      target_4: sql<string>`MAX(CASE WHEN tip.tahun = 2028 THEN tip.target END)`,
      target_5: sql<string>`MAX(CASE WHEN tip.tahun = 2029 THEN tip.target END)`,
    })
      .from(indikatorProgram)
      .leftJoin(
        sql`sireva.target_indikator_program tip`,
        sql`tip.indikator_id = ${indikatorProgram.id}`
      )
      .where(conditions.length > 0 ? eq(indikatorProgram.sasaranProgramId, Number(query.sasaranProgramId)) : undefined)
      .groupBy(
        indikatorProgram.id,
        indikatorProgram.sasaranProgramId,
        indikatorProgram.kode,
        indikatorProgram.nama,
        indikatorProgram.satuan,
        indikatorProgram.deskripsi,
        indikatorProgram.formula
      );
  }

  if (method === 'POST') {
    const body = await readBody(event);
    if (Array.isArray(body)) {
      const insertData = body.map(item => {
        const { id: _id, ...rest } = item;
        return rest;
      });
      return await db.insert(indikatorProgram).values(insertData).returning();
    } else {
      const { id: _id, ...insertData } = body;
      return await db.insert(indikatorProgram).values(insertData).returning();
    }
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    // Destructure id out so it does NOT appear in SET clause (can't update PK)
    const { id, ...updateData } = body;
    return await db.update(indikatorProgram).set(updateData).where(eq(indikatorProgram.id, id)).returning();
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(indikatorProgram).where(eq(indikatorProgram.id, body.id)).returning();
  }
});
