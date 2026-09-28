import { db } from '../../db';
import { visi } from '../../db/schema/visi';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node?.req?.method || event.req?.method || 'GET';
  if (method === 'GET') {
    const data = await db.select().from(visi);
    return { data };
  }
  if (method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(visi).values(body).returning();
    return { data: inserted };
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    const { id, ...updateData } = body;
    if (!id) throw new Error('ID is required');
    const updated = await db.update(visi).set(updateData).where(eq(visi.id, id)).returning();
    return { data: updated };
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    const { id } = body;
    if (!id) throw new Error('ID is required');
    await db.delete(visi).where(eq(visi.id, id));
    return { success: true };
  }
  return { error: 'Method not allowed' };
});
