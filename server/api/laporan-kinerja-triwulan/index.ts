import { db } from '../../db';
import { laporanKinerjaTriwulan } from '../../db/schema/laporan-kinerja-triwulan';
import { eq, and, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const query = getQuery(event);

  try {
    if (method === 'GET') {
      if (query.id) {
        const [res] = await db.select()
          .from(laporanKinerjaTriwulan)
          .where(eq(laporanKinerjaTriwulan.id, Number(query.id)));
        return res || null;
      }

      const { tahun, triwulan, unitKerja } = query;
      
      // Select only necessary fields for the list view to avoid loading heavy JSON/base64 columns
      let baseQuery = db.select({
        id: laporanKinerjaTriwulan.id,
        tahun: laporanKinerjaTriwulan.tahun,
        triwulan: laporanKinerjaTriwulan.triwulan,
        unitKerja: laporanKinerjaTriwulan.unitKerja,
        status: laporanKinerjaTriwulan.status
      }).from(laporanKinerjaTriwulan);

      const conditions: any[] = [];
      if (tahun) {
        conditions.push(eq(laporanKinerjaTriwulan.tahun, Number(tahun)));
      }
      if (triwulan) {
        conditions.push(eq(laporanKinerjaTriwulan.triwulan, String(triwulan)));
      }
      if (unitKerja) {
        conditions.push(eq(laporanKinerjaTriwulan.unitKerja, String(unitKerja)));
      }

      if (conditions.length > 0) {
        return await baseQuery.where(and(...conditions));
      }
      return await baseQuery;
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const { tahun, triwulan, unitKerja, ringkasanEksekutif, kataPengantar, rencanaTindakLanjut, informasiTambahan, lampiranUrl, status } = body;

      if (!tahun || !triwulan || !unitKerja) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Tahun, Triwulan, dan Unit Kerja wajib diisi.'
        });
      }

      // Check if entry already exists to perform an upsert (update if exists)
      const [existing] = await db.select()
        .from(laporanKinerjaTriwulan)
        .where(and(
          eq(laporanKinerjaTriwulan.tahun, Number(tahun)),
          eq(laporanKinerjaTriwulan.triwulan, String(triwulan)),
          eq(laporanKinerjaTriwulan.unitKerja, String(unitKerja))
        ));

      if (existing) {
        const [updated] = await db.update(laporanKinerjaTriwulan)
          .set({
            ringkasanEksekutif: ringkasanEksekutif ?? '',
            kataPengantar: kataPengantar ?? '',
            rencanaTindakLanjut: rencanaTindakLanjut ?? '',
            informasiTambahan: informasiTambahan ?? '',
            lampiranUrl: lampiranUrl ?? null,
            status: status ?? 'Draft'
          })
          .where(eq(laporanKinerjaTriwulan.id, existing.id))
          .returning();
        return { success: true, action: 'update', data: updated };
      } else {
        const [inserted] = await db.insert(laporanKinerjaTriwulan)
          .values({
            tahun: Number(tahun),
            triwulan: String(triwulan),
            unitKerja: String(unitKerja),
            ringkasanEksekutif: ringkasanEksekutif ?? '',
            kataPengantar: kataPengantar ?? '',
            rencanaTindakLanjut: rencanaTindakLanjut ?? '',
            informasiTambahan: informasiTambahan ?? '',
            lampiranUrl: lampiranUrl ?? null,
            status: status ?? 'Draft'
          })
          .returning();
        return { success: true, action: 'insert', data: inserted };
      }
    }

    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID laporan wajib disertakan.'
        });
      }

      const [updated] = await db.update(laporanKinerjaTriwulan)
        .set({
          ringkasanEksekutif: body.ringkasanEksekutif,
          kataPengantar: body.kataPengantar,
          rencanaTindakLanjut: body.rencanaTindakLanjut,
          informasiTambahan: body.informasiTambahan,
          lampiranUrl: body.lampiranUrl,
          status: body.status
        })
        .where(eq(laporanKinerjaTriwulan.id, Number(body.id)))
        .returning();
      
      return { success: true, data: updated };
    }

    if (method === 'DELETE') {
      const id = query.id || (await readBody(event)).id;
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID wajib disertakan.'
        });
      }
      await db.delete(laporanKinerjaTriwulan).where(eq(laporanKinerjaTriwulan.id, Number(id)));
      return { success: true };
    }
  } catch (error: any) {
    console.error('API Error [laporan-kinerja-triwulan]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});
