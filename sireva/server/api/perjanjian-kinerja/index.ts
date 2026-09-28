import { db } from '../../db';
import { perjanjianKinerja } from '../../db/schema/perjanjian-kinerja';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === 'GET') {
    const query = getQuery(event);
    const { tahun, unitKerja } = query;

    const { indikatorKegiatan: indikatorKinerja } = await import('../../db/schema/indikator-kegiatan');
    const { sasaranKegiatan } = await import('../../db/schema/sasaran-kegiatan');

    let baseQuery = db.select({
      id: perjanjianKinerja.id,
      tahun: perjanjianKinerja.tahun,
      target: perjanjianKinerja.target,
      unitKerja: perjanjianKinerja.unitKerja,
      indikatorId: perjanjianKinerja.indikatorId,
      indikatorName: indikatorKinerja.namaIku,
      sasaranText: sasaranKegiatan.sasaranText
    })
    .from(perjanjianKinerja)
    .leftJoin(indikatorKinerja, eq(perjanjianKinerja.indikatorId, indikatorKinerja.id))
    .leftJoin(sasaranKegiatan, eq(indikatorKinerja.idSk, sasaranKegiatan.id));

    if (tahun && unitKerja && unitKerja !== 'Semua Unit Kerja') {
      return await baseQuery.where(and(
        eq(perjanjianKinerja.tahun, Number(tahun)),
        eq(perjanjianKinerja.unitKerja, String(unitKerja))
      ));
    } else if (tahun) {
      return await baseQuery.where(eq(perjanjianKinerja.tahun, Number(tahun)));
    }
    
    return await baseQuery;
  }

  if (method === 'POST') {
    const body = await readBody(event);
    
    // Validasi duplikasi
    const existing = await db.select().from(perjanjianKinerja).where(and(
      eq(perjanjianKinerja.tahun, body.tahun),
      eq(perjanjianKinerja.indikatorId, body.indikatorId),
      eq(perjanjianKinerja.unitKerja, body.unitKerja)
    ));

    if (existing.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Indikator ini sudah terdaftar dalam PK tahun tersebut untuk unit kerja ini.'
      });
    }

    return await db.insert(perjanjianKinerja).values(body).returning();
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    return await db.delete(perjanjianKinerja).where(eq(perjanjianKinerja.id, body.id)).returning();
  }
});
