import { db } from '../../db';
import { program } from '../../db/schema/program';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(program).where(eq(program.id, Number(query.id)));
    }
    return await db.select().from(program);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(program).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(program).set(updateData).where(eq(program.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(program).where(eq(program.id, body.id)).returning();
  }
});
