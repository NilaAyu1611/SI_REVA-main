import { db } from '../../db';
import { subKegiatan } from '../../db/schema/sub-kegiatan';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(subKegiatan).where(eq(subKegiatan.id, Number(query.id)));
    }
    return await db.select().from(subKegiatan);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(subKegiatan).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(subKegiatan).set(updateData).where(eq(subKegiatan.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(subKegiatan).where(eq(subKegiatan.id, body.id)).returning();
  }
});
