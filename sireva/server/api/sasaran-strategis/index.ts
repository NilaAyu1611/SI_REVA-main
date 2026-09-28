import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { targetIndikatorStrategis } from '../../db/schema/target-indikator-strategis';
import { eq, and, isNull, sql, inArray } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';
import { generateKodeSS, getStringHash } from '../../utils/kode-helper';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const id = query.id ? Number(query.id) : null;

      if (id && !isNaN(id)) {
        const result = await db.select()
          .from(sasaranStrategis)
          .where(
            and(
              eq(sasaranStrategis.id, id),
              isNull(sasaranStrategis.deletedAt)
            )
          );
        return result[0] || null;
      }

      // Fetch all sasaran strategis
      const rows = await db.select({
        id: sasaranStrategis.id,
        ssId: sasaranStrategis.id,
        kodeSs: sasaranStrategis.kodeSs,
        kode: sasaranStrategis.kodeSs,
        namaSs: sasaranStrategis.namaSs,
        sasaranText: sasaranStrategis.namaSs,
        nomorUrut: sasaranStrategis.nomorUrut,
        pengampu: sasaranStrategis.pengampu,
        tahun: sasaranStrategis.tahun,
      })
        .from(sasaranStrategis)
        .where(isNull(sasaranStrategis.deletedAt))
        .orderBy(sasaranStrategis.nomorUrut);

      if (rows.length === 0) return [];

      // Fetch all indikator_strategis for these SS rows (avoid N+1)
      const ssIds = rows.map((r) => r.id);
      const allIndikators = await db.select({
        id: indikatorStrategis.id,
        sasaranStrategisId: indikatorStrategis.sasaranStrategisId,
        nama: indikatorStrategis.nama,
        satuan: indikatorStrategis.satuan,
      })
        .from(indikatorStrategis)
        .where(inArray(indikatorStrategis.sasaranStrategisId, ssIds));

      // Fetch all targets for those indikators
      const indIds = allIndikators.map((i) => i.id);
      let allTargets: { indikatorId: number | null; tahun: number | null; target: string | null }[] = [];
      if (indIds.length > 0) {
        allTargets = await db.select({
          indikatorId: targetIndikatorStrategis.indikatorId,
          tahun: targetIndikatorStrategis.tahun,
          target: targetIndikatorStrategis.target,
        })
          .from(targetIndikatorStrategis)
          .where(inArray(targetIndikatorStrategis.indikatorId, indIds));
      }

      // Group targets by indikator id
      const targetsByIndId = new Map<number, { tahun: number; target: number }[]>();
      allTargets.forEach((t) => {
        if (t.indikatorId == null || t.tahun == null) return;
        const list = targetsByIndId.get(t.indikatorId) || [];
        list.push({ tahun: Number(t.tahun), target: Number(t.target) });
        targetsByIndId.set(t.indikatorId, list);
      });

      // Group indikators by SS id
      const indikatorsBySsId = new Map<number, typeof allIndikators>();
      allIndikators.forEach((ind) => {
        if (ind.sasaranStrategisId == null) return;
        const list = indikatorsBySsId.get(ind.sasaranStrategisId) || [];
        list.push(ind);
        indikatorsBySsId.set(ind.sasaranStrategisId, list);
      });

      const flattenedRows: any[] = [];
      for (const row of rows) {
        const indikators = indikatorsBySsId.get(row.id) || [];
        if (indikators.length === 0) {
          flattenedRows.push({
            ...row,
            indikatorNama: null,
            indikatorSatuan: null,
            targets: [],
          });
        } else {
          for (const ind of indikators) {
            flattenedRows.push({
              ...row,
              id: `${row.id}-${ind.id}`, // Unique ID for table row key
              indikatorNama: ind.nama,
              indikatorSatuan: ind.satuan,
              targets: targetsByIndId.get(ind.id) || [],
            });
          }
        }
      }

      return flattenedRows;
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

      // Support either nama_ss or sasaranText or nama
      const namaSs = body.nama_ss || body.sasaranText || body.nama;
      const tahun = body.tahun || '2026';
      const providedCode = body.kode_ss || body.kode || body.kodeSs || null;

      // Validation Rules
      if (!namaSs) {
        throw createError({ statusCode: 400, statusMessage: 'nama_ss atau sasaranText wajib diisi' });
      }

      // Execute transaction with Advisory Lock
      const result = await db.transaction(async (tx) => {
        // Hashing tahun string to an integer for pg_advisory_xact_lock
        const lockId = getStringHash(tahun.toString());
        await tx.execute(sql`SELECT pg_advisory_xact_lock(${lockId})`);

        // Calculate MAX(nomor_urut) including soft-deleted ones so numbers are not reused
        const maxResult = await tx.execute(
          sql`SELECT coalesce(max(nomor_urut), 0) as max_val FROM sireva.sasaran_strategis WHERE tahun = ${tahun}`
        );
        const maxVal = Number(maxResult.rows[0]?.max_val || 0);
        const nextNomorUrut = maxVal + 1;
        const generatedCode = generateKodeSS(nextNomorUrut);

        const inserted = await tx.insert(sasaranStrategis)
          .values({
            tahun: tahun.toString(),
            nomorUrut: nextNomorUrut,
            kodeSs: providedCode || generatedCode,
            namaSs: namaSs,
            pengampu: body.pengampu || null,
            instansiTerkait: body.instansi_terkait || null,
          })
          .returning();

        return inserted[0];
      });

      return {
        success: true,
        message: 'Data berhasil ditambahkan',
        data: {
          id: result.id,
          kode: result.kodeSs,
          nama: result.namaSs
        }
      };

    } catch (error: any) {
      console.error('Error in POST /api/sasaran-strategis:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});