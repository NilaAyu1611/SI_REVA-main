import { db } from '../../db';
import { visi } from '../../db/schema/visi';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    const data = await db.select().from(visi);
    return { data };
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(visi).values(body).returning();
    return { data: inserted };
  }
  if (event.req.method === 'PUT') {
    const body = await readBody(event);
    const { id, ...updateData } = body;
    const updated = await db.update(visi).set(updateData).where(visi.id.eq(id)).returning();
    return { data: updated };
  }
  if (event.req.method === 'DELETE') {
    const { id } = await readBody(event);
    await db.delete(visi).where(visi.id.eq(id));
    return { success: true };
  }
  return { error: 'Method not allowed' };
});
