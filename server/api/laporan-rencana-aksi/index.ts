import { db } from '../../db';
import { laporanRencanaAksi } from '../../db/schema/laporan-rencana-aksi';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(laporanRencanaAksi).where(eq(laporanRencanaAksi.id, Number(query.id)));
    }
    return await db.select().from(laporanRencanaAksi);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(laporanRencanaAksi).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    const { id: _pkId, ...updateData } = body;
    return await db.update(laporanRencanaAksi).set(updateData).where(eq(laporanRencanaAksi.id, _pkId)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(laporanRencanaAksi).where(eq(laporanRencanaAksi.id, body.id)).returning();
  }
});
