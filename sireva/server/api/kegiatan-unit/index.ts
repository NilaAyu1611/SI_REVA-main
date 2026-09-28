import { db } from '../../db';
import { kegiatanUnit } from '../../db/schema/kegiatan-unit';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(kegiatanUnit).where(eq(kegiatanUnit.id, Number(query.id)));
    }
    return await db.select().from(kegiatanUnit);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(kegiatanUnit).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(kegiatanUnit).set(updateData).where(eq(kegiatanUnit.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(kegiatanUnit).where(eq(kegiatanUnit.id, body.id)).returning();
  }
});
