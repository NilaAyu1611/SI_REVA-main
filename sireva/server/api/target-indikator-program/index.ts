import { db } from '../../db';
import { targetIndikatorProgram } from '../../db/schema/target-indikator-program';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.indikatorId) {
      return await db.select().from(targetIndikatorProgram)
        .where(eq(targetIndikatorProgram.indikatorId, Number(query.indikatorId)));
    }
    return await db.select().from(targetIndikatorProgram);
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(targetIndikatorProgram).values(body).returning();
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(targetIndikatorProgram).set(updateData).where(eq(targetIndikatorProgram.id, _pkId)).returning();
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(targetIndikatorProgram).where(eq(targetIndikatorProgram.id, body.id)).returning();
  }
});
