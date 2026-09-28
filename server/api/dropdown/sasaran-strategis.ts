import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async () => {
  try {
    const list = await db.select()
      .from(sasaranStrategis)
      .where(
        and(
          eq(sasaranStrategis.isActive, true),
          isNull(sasaranStrategis.deletedAt)
        )
      )
      .orderBy(asc(sasaranStrategis.nomorUrut));

    const formatted = list.map((item) => ({
      id: item.id,
      kode: item.kodeSs,
      nama: item.namaSs,
      label: `${item.kodeSs} - ${item.namaSs}`
    }));

    return {
      success: true,
      data: formatted
    };
  } catch (error: any) {
    console.error('Error fetching dropdown sasaran-strategis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});
