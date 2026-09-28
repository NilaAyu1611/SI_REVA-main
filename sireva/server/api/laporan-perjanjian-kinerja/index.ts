import { db } from '../../db';
import { laporanPerjanjianKinerja } from '../../db/schema/laporan-perjanjian-kinerja';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(laporanPerjanjianKinerja).where(eq(laporanPerjanjianKinerja.id, Number(query.id)));
    }
    return await db.select().from(laporanPerjanjianKinerja);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(laporanPerjanjianKinerja).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(laporanPerjanjianKinerja).set(updateData).where(eq(laporanPerjanjianKinerja.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(laporanPerjanjianKinerja).where(eq(laporanPerjanjianKinerja.id, body.id)).returning();
  }
});
