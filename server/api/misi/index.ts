import { db } from '../../db';
import { misi } from '../../db/schema/misi';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(misi).where(eq(misi.id, Number(query.id)));
    }
    return await db.select().from(misi);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(misi).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(misi).set(updateData).where(eq(misi.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(misi).where(eq(misi.id, body.id)).returning();
  }
});
