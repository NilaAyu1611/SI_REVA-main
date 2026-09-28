import { db } from '../../db';
import { kegiatan } from '../../db/schema/kegiatan';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(kegiatan).where(eq(kegiatan.id, Number(query.id)));
    }
    return await db.select().from(kegiatan);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(kegiatan).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(kegiatan).set(updateData).where(eq(kegiatan.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(kegiatan).where(eq(kegiatan.id, body.id)).returning();
  }
});
