import { db } from '../../db';
import { sumberDana } from '../../db/schema/sumber-dana';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(sumberDana).where(eq(sumberDana.id, Number(query.id)));
    }
    return await db.select().from(sumberDana);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(sumberDana).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(sumberDana).set(updateData).where(eq(sumberDana.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(sumberDana).where(eq(sumberDana.id, body.id)).returning();
  }
});
