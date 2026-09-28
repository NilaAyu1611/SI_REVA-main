import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' });
  }

  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const result = await db.select()
        .from(sasaranProgram)
        .where(
          and(
            eq(sasaranProgram.id, id),
            isNull(sasaranProgram.deletedAt)
          )
        );

      if (result.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      return result[0];
    } catch (error: any) {
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);

      // Validation: immutable properties
      if (body.kode_sp || body.nomor_urut || body.kodeSp || body.nomorUrut || body.ss_id || body.ssId) {
        throw createError({ statusCode: 400, statusMessage: 'Kode, nomor_urut, dan ss_id tidak boleh diubah' });
      }

      const existing = await db.select()
        .from(sasaranProgram)
        .where(
          and(
            eq(sasaranProgram.id, id),
            isNull(sasaranProgram.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      const updateFields: any = {};
      if (body.nama_sp !== undefined) updateFields.namaSp = body.nama_sp;
      if (body.pengampu !== undefined) updateFields.pengampu = body.pengampu;
      if (body.instansi_terkait !== undefined) updateFields.instansiTerkait = body.instansi_terkait;
      if (body.is_active !== undefined) updateFields.isActive = !!body.is_active;

      updateFields.updatedAt = new Date();

      const updated = await db.update(sasaranProgram)
        .set(updateFields)
        .where(eq(sasaranProgram.id, id))
        .returning();

      const first = updated?.[0];
      if (!first) {
        throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui data' });
      }

      return {
        success: true,
        message: 'Data berhasil diperbarui',
        data: {
          id: first.id,
          kode: first.kodeSp,
          nama: first.namaSp
        }
      };

    } catch (error: any) {
      console.error('Error in PUT /api/sasaran-program/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'DELETE') {
    try {
      const existing = await db.select()
        .from(sasaranProgram)
        .where(
          and(
            eq(sasaranProgram.id, id),
            isNull(sasaranProgram.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      // ON DELETE RESTRICT Check: Any active children?
      const children = await db.select({ count: sql`count(*)` })
        .from(sasaranKegiatan)
        .where(
          and(
            eq(sasaranKegiatan.spId, id),
            isNull(sasaranKegiatan.deletedAt)
          )
        );

      const childrenCount = Number(children[0]?.count || 0);
      if (childrenCount > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Tidak dapat menghapus data parent karena masih memiliki data turunan.'
        });
      }

      // Soft delete
      await db.update(sasaranProgram)
        .set({
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(sasaranProgram.id, id));

      return {
        success: true,
        message: 'Data berhasil dihapus'
      };

    } catch (error: any) {
      console.error('Error in DELETE /api/sasaran-program/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
