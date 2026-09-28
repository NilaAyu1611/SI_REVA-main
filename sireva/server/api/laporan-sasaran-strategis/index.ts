import { db } from '../../db';
import { laporanSasaranStrategis } from '../../db/schema/laporan-sasaran-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(laporanSasaranStrategis).where(eq(laporanSasaranStrategis.id, Number(query.id)));
    }
    return await db.select().from(laporanSasaranStrategis);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(laporanSasaranStrategis).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(laporanSasaranStrategis).set(updateData).where(eq(laporanSasaranStrategis.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(laporanSasaranStrategis).where(eq(laporanSasaranStrategis.id, body.id)).returning();
  }
});
