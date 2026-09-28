import { db } from '../../db';
import { indikatorSasaranStrategis } from '../../db/schema/indikator-sasaran-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.ssId) {
      return await db.select()
        .from(indikatorSasaranStrategis)
        .where(eq(indikatorSasaranStrategis.ssId, Number(query.ssId)));
    }
    return await db.select().from(indikatorSasaranStrategis);
  }
});
