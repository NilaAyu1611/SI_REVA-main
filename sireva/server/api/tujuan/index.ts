import { db } from '../../db';
import { tujuan } from '../../db/schema/tujuan';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(tujuan).where(eq(tujuan.id, Number(query.id)));
    }
    return await db.select().from(tujuan);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(tujuan).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(tujuan).set(updateData).where(eq(tujuan.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(tujuan).where(eq(tujuan.id, body.id)).returning();
  }
});
