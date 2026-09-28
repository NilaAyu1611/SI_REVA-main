import { db } from '../../db';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.sasaranStrategisId) {
      return await db.select().from(indikatorStrategis)
        .where(eq(indikatorStrategis.sasaranStrategisId, Number(query.sasaranStrategisId)));
    }
    return await db.select().from(indikatorStrategis);
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      console.log('POST /api/indikator-strategis body:', body);
      const result = await db.insert(indikatorStrategis).values(body).returning();
      console.log('POST /api/indikator-strategis result:', result);
      return result;
    } catch (err: any) {
      console.error('POST /api/indikator-strategis error:', err);
      throw createError({ statusCode: 500, statusMessage: err.message });
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      // Destructure id out so it does NOT appear in SET clause (can't update PK)
      const { id, ...updateData } = body;
      console.log('PUT /api/indikator-strategis body:', { id, ...updateData });
      const result = await db.update(indikatorStrategis).set(updateData).where(eq(indikatorStrategis.id, id)).returning();
      console.log('PUT /api/indikator-strategis result:', result);
      return result;
    } catch (err: any) {
      console.error('PUT /api/indikator-strategis error:', err);
      throw createError({ statusCode: 500, statusMessage: err.message });
    }
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(indikatorStrategis).where(eq(indikatorStrategis.id, body.id)).returning();
  }
});
