import { db } from '../../db';
import { realisasiIndikator } from '../../db/schema/realisasi-indikator';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(realisasiIndikator).where(eq(realisasiIndikator.id, Number(query.id)));
    }
    return await db.select().from(realisasiIndikator);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(realisasiIndikator).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(realisasiIndikator).set(updateData).where(eq(realisasiIndikator.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(realisasiIndikator).where(eq(realisasiIndikator.id, body.id)).returning();
  }
});
