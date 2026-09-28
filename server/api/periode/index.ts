import { db } from '../../db';
import { periode } from '../../db/schema/periode';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(periode).where(eq(periode.id, Number(query.id)));
    }
    return await db.select().from(periode);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(periode).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(periode).set(updateData).where(eq(periode.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(periode).where(eq(periode.id, body.id)).returning();
  }
});
