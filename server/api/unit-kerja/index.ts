import { db } from '../../db';
import { unitKerja } from '../../db/schema/unit-kerja';
import { defineEventHandler, readBody, createError, getMethod } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  // GET /api/unit-kerja
  if (method === 'GET') {
    try {
      const data = await db.select().from(unitKerja).orderBy(unitKerja.nama);

      // Deduplicate by name to prevent doubles in UI
      const uniqueMap = new Map();
      data.forEach(item => {
        if (item.nama && !uniqueMap.has(item.nama)) {
          uniqueMap.set(item.nama, item);
        }
      });

      return Array.from(uniqueMap.values());
    } catch (error) {
      console.error('Error fetching unit-kerja:', error);
      return [];
    }
  }

  // POST /api/unit-kerja
  if (method === 'POST') {
    const body = await readBody(event);
    const { nama, level, parentId } = body ?? {};

    if (!nama || typeof nama !== 'string' || nama.trim() === '') {
      throw createError({ statusCode: 400, statusMessage: 'Field "nama" wajib diisi.' });
    }

    if (level !== undefined && level !== null && typeof level !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Field "level" harus berupa angka.' });
    }

    if (parentId !== undefined && parentId !== null && typeof parentId !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Field "parentId" harus berupa angka.' });
    }

    const now = new Date();

    const [inserted] = await db
      .insert(unitKerja)
      .values({
        nama: nama.trim(),
        level: level ?? null,
        parentId: parentId ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return inserted;
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
