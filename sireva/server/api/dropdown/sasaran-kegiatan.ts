import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const spId = query.sp_id ? Number(query.sp_id) : null;

  try {
    const conditions = [
      eq(sasaranKegiatan.isActive, true),
      isNull(sasaranKegiatan.deletedAt)
    ];

    if (spId && !isNaN(spId)) {
      conditions.push(eq(sasaranKegiatan.spId, spId));
    }

    const list = await db.select()
      .from(sasaranKegiatan)
      .where(and(...conditions))
      .orderBy(asc(sasaranKegiatan.nomorUrut));

    const formatted = list.map((item) => ({
      id: item.id,
      kode: item.kodeSk,
      nama: item.namaSk,
      label: `${item.kodeSk} - ${item.namaSk}`
    }));

    return {
      success: true,
      data: formatted
    };
  } catch (error: any) {
    console.error('Error fetching dropdown sasaran-kegiatan:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});
