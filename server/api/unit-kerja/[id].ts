import { db } from '../../db';
import { unitKerja } from '../../db/schema/unit-kerja';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const rawId = getRouterParam(event, 'id');
  const id = Number(rawId);

  if (!rawId || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Parameter "id" harus berupa angka.' });
  }

  // GET /api/unit-kerja/:id
  if (method === 'GET') {
    const [row] = await db
      .select()
      .from(unitKerja)
      .where(eq(unitKerja.id, id))
      .limit(1);

    if (!row) {
      throw createError({ statusCode: 404, statusMessage: 'Unit kerja tidak ditemukan.' });
    }

    return row;
  }

  // PUT /api/unit-kerja/:id
  if (method === 'PUT') {
    const body = await readBody(event);
    const { nama, level, parentId } = body ?? {};

    if (nama !== undefined && (typeof nama !== 'string' || nama.trim() === '')) {
      throw createError({ statusCode: 400, statusMessage: 'Field "nama" tidak boleh kosong.' });
    }

    if (level !== undefined && level !== null && typeof level !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Field "level" harus berupa angka.' });
    }

    if (parentId !== undefined && parentId !== null && typeof parentId !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Field "parentId" harus berupa angka.' });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (nama !== undefined) updateData.nama = nama.trim();
    if (level !== undefined) updateData.level = level ?? null;
    if (parentId !== undefined) updateData.parentId = parentId ?? null;

    const [updated] = await db
      .update(unitKerja)
      .set(updateData)
      .where(eq(unitKerja.id, id))
      .returning();

    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: 'Unit kerja tidak ditemukan.' });
    }

    return updated;
  }

  // DELETE /api/unit-kerja/:id
  if (method === 'DELETE') {
    const [deleted] = await db
      .delete(unitKerja)
      .where(eq(unitKerja.id, id))
      .returning();

    if (!deleted) {
      throw createError({ statusCode: 404, statusMessage: 'Unit kerja tidak ditemukan.' });
    }

    return { success: true, deleted };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
