import { db } from '../../db';
import { targetIndiaktorKegiatan as targetIndikator } from '../../db/schema/target-indikator-kegiatan';
import { eq, and } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(targetIndikator).where(eq(targetIndikator.id, Number(query.id)));
    }
    if (query.id_iku) {
      return await db.select().from(targetIndikator).where(eq(targetIndikator.idIku, Number(query.id_iku)));
    }
    return await db.select().from(targetIndikator);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(targetIndikator).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(targetIndikator).set(updateData).where(eq(targetIndikator.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    // Support delete by primary key
    if (body.id) {
      return await db.delete(targetIndikator).where(eq(targetIndikator.id, body.id)).returning();
    }
    // Support delete by id_iku + tahun (year)
    if (body.id_iku && body.tahun) {
      return await db.delete(targetIndikator)
        .where(and(
          eq(targetIndikator.idIku, Number(body.id_iku)),
          eq(targetIndikator.tahun, Number(body.tahun))
        ))
        .returning();
    }
    throw new Error('ID atau (id_iku + tahun) wajib diisi untuk menghapus data');
  }
});
