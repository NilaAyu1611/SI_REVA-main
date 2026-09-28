import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ssId = query.ss_id ? Number(query.ss_id) : null;

  try {
    const conditions = [
      eq(sasaranProgram.isActive, true),
      isNull(sasaranProgram.deletedAt)
    ];

    if (ssId && !isNaN(ssId)) {
      conditions.push(eq(sasaranProgram.ssId, ssId));
    }

    const list = await db.select()
      .from(sasaranProgram)
      .where(and(...conditions))
      .orderBy(asc(sasaranProgram.nomorUrut));

    const formatted = list.map((item) => ({
      id: item.id,
      kode: item.kodeSp,
      nama: item.namaSp,
      label: `${item.kodeSp} - ${item.namaSp}`
    }));

    return {
      success: true,
      data: formatted
    };
  } catch (error: any) {
    console.error('Error fetching dropdown sasaran-program:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});
