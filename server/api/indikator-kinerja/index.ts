import { db } from '../../db';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';
import { generateKodeIKU } from '../../utils/kode-helper';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const skId = query.sk_id ? Number(query.sk_id) : null;
      const id = query.id ? Number(query.id) : null;

      if (id && !isNaN(id)) {
        const result = await db.select()
          .from(indikatorKinerja)
          .where(
            and(
              eq(indikatorKinerja.id, id),
              isNull(indikatorKinerja.deletedAt)
            )
          );
        return result[0] || null;
      }

      const conditions = [isNull(indikatorKinerja.deletedAt)];
      if (skId && !isNaN(skId)) {
        conditions.push(eq(indikatorKinerja.skId, skId));
      }

      // Optimized: replace 5 correlated subqueries with a single LEFT JOIN + conditional aggregation
      // Before: 5 subqueries × N rows = N*5 round trips
      // After: 1 JOIN query regardless of row count
      return await db.select({
        id: indikatorKinerja.id,
        skId: indikatorKinerja.skId,
        nomorUrut: indikatorKinerja.nomorUrut,
        kodeIku: indikatorKinerja.kodeIku,
        namaIku: indikatorKinerja.namaIku,
        satuan: indikatorKinerja.satuan,
        target_1: sql<string>`MAX(CASE WHEN tik.tahun = 2025 THEN tik.target_nilai END)`,
        target_2: sql<string>`MAX(CASE WHEN tik.tahun = 2026 THEN tik.target_nilai END)`,
        target_3: sql<string>`MAX(CASE WHEN tik.tahun = 2027 THEN tik.target_nilai END)`,
        target_4: sql<string>`MAX(CASE WHEN tik.tahun = 2028 THEN tik.target_nilai END)`,
        target_5: sql<string>`MAX(CASE WHEN tik.tahun = 2029 THEN tik.target_nilai END)`,
      })
        .from(indikatorKinerja)
        .leftJoin(
          sql`sireva.target_indikator_kegiatan tik`,
          sql`tik.id_iku = ${indikatorKinerja.id}`
        )
        .where(and(...conditions))
        .groupBy(
          indikatorKinerja.id,
          indikatorKinerja.skId,
          indikatorKinerja.nomorUrut,
          indikatorKinerja.kodeIku,
          indikatorKinerja.namaIku,
          indikatorKinerja.satuan
        )
        .orderBy(indikatorKinerja.nomorUrut);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);

      // Validation
      if (!body.sk_id) {
        throw createError({ statusCode: 400, statusMessage: 'sk_id wajib diisi' });
      }
      if (!body.nama_iku) {
        throw createError({ statusCode: 400, statusMessage: 'nama_iku wajib diisi' });
      }
      if (body.kode_iku || body.nomor_urut || body.kodeIku || body.nomorUrut) {
        throw createError({ statusCode: 400, statusMessage: 'Kode and nomor_urut tidak boleh dikirim dari frontend' });
      }

      const parentId = Number(body.sk_id);

      // Concurrency locking and code generation in a transaction
      const result = await db.transaction(async (tx) => {
        // SELECT ... FOR UPDATE on parent
        const parentResult = await tx.execute(
          sql`SELECT id, kode_sk FROM sireva.sasaran_kegiatan WHERE id = ${parentId} AND deleted_at IS NULL FOR UPDATE`
        );
        const parent = parentResult.rows[0];
        if (!parent) {
          throw createError({ statusCode: 404, statusMessage: 'Parent Sasaran Kegiatan tidak ditemukan' });
        }

        const kodeSk = parent.kode_sk;

        // Calculate MAX(nomor_urut) for this skId
        const maxResult = await tx.execute(
          sql`SELECT coalesce(max(nomor_urut), 0) as max_val FROM sireva.indikator_kinerja WHERE sk_id = ${parentId}`
        );
        const maxVal = Number(maxResult.rows[0]?.max_val || 0);
        const nextNomorUrut = maxVal + 1;
        const generatedCode = generateKodeIKU(kodeSk, nextNomorUrut);

        const inserted = await tx.insert(indikatorKinerja)
          .values({
            skId: parentId,
            nomorUrut: nextNomorUrut,
            kodeIku: generatedCode,
            namaIku: body.nama_iku,
            satuan: body.satuan || null,
            target: body.target || null,
            realisasi: body.realisasi || null,
          })
          .returning();

        return inserted[0];
      });

      return {
        success: true,
        message: 'Data berhasil ditambahkan',
        data: {
          id: result.id,
          kode: result.kodeIku,
          nama: result.namaIku
        }
      };

    } catch (error: any) {
      console.error('Error in POST /api/indikator-kinerja:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});