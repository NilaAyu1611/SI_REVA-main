import { db } from '../../db';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const skId = query.sk_id ? Number(query.sk_id) : null;

  try {
    const conditions = [
      eq(indikatorKinerja.isActive, true),
      isNull(indikatorKinerja.deletedAt)
    ];

    if (skId && !isNaN(skId)) {
      conditions.push(eq(indikatorKinerja.skId, skId));
    }

    const list = await db.select()
      .from(indikatorKinerja)
      .where(and(...conditions))
      .orderBy(asc(indikatorKinerja.nomorUrut));

    const formatted = list.map((item) => ({
      id: item.id,
      kode: item.kodeIku,
      nama: item.namaIku,
      label: `${item.kodeIku} - ${item.namaIku}`
    }));

    return {
      success: true,
      data: formatted
    };
  } catch (error: any) {
    console.error('Error fetching dropdown indikator-kinerja:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});
