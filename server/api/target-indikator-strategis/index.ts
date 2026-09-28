import { db } from '../../db';
import { targetIndikatorStrategis } from '../../db/schema/target-indikator-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.indikatorId) {
      return await db.select().from(targetIndikatorStrategis)
        .where(eq(targetIndikatorStrategis.indikatorId, Number(query.indikatorId)));
    }
    return await db.select().from(targetIndikatorStrategis);
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      console.log('POST /api/target-indikator-strategis body:', body);
      const result = await db.insert(targetIndikatorStrategis)
        .values(body)
        .onConflictDoUpdate({
          target: [targetIndikatorStrategis.indikatorId, targetIndikatorStrategis.tahun],
          set: { target: body.target }
        })
        .returning();
      console.log('POST /api/target-indikator-strategis result:', result);
      return result;
    } catch (err: any) {
      console.error('POST /api/target-indikator-strategis error:', err);
      throw createError({ statusCode: 500, statusMessage: err.message });
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      const { id: _pkId, ...updateData } = body;
      console.log('PUT /api/target-indikator-strategis body:', { id: _pkId, ...updateData });
      const result = await db.update(targetIndikatorStrategis).set(updateData).where(eq(targetIndikatorStrategis.id, _pkId)).returning();
      console.log('PUT /api/target-indikator-strategis result:', result);
      return result;
    } catch (err: any) {
      console.error('PUT /api/target-indikator-strategis error:', err);
      throw createError({ statusCode: 500, statusMessage: err.message });
    }
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(targetIndikatorStrategis).where(eq(targetIndikatorStrategis.id, body.id)).returning();
  }
});
