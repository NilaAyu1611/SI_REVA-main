import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { eq, and, isNull } from 'drizzle-orm';
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
        .from(sasaranKegiatan)
        .where(
          and(
            eq(sasaranKegiatan.id, id),
            isNull(sasaranKegiatan.deletedAt)
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

      // Validation: immutable fields
      if (body.kode_sk || body.nomor_urut || body.kodeSk || body.nomorUrut || body.sp_id || body.spId) {
        throw createError({ statusCode: 400, statusMessage: 'Kode, nomor_urut, dan sp_id tidak boleh diubah' });
      }

      const existing = await db.select()
        .from(sasaranKegiatan)
        .where(
          and(
            eq(sasaranKegiatan.id, id),
            isNull(sasaranKegiatan.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      const updateFields: any = {};
      if (body.nama_sk !== undefined) updateFields.namaSk = body.nama_sk;
      if (body.pengampu !== undefined) updateFields.pengampu = body.pengampu;
      if (body.instansi_terkait !== undefined) updateFields.instansiTerkait = body.instansi_terkait;
      if (body.is_active !== undefined) updateFields.isActive = !!body.is_active;

      updateFields.updatedAt = new Date();

      const updated = await db.update(sasaranKegiatan)
        .set(updateFields)
        .where(eq(sasaranKegiatan.id, id))
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
          kode: first.kodeSk,
          nama: first.namaSk
        }
      };

    } catch (error: any) {
      console.error('Error in PUT /api/sasaran-kegiatan/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'DELETE') {
    try {
      const existing = await db.select()
        .from(sasaranKegiatan)
        .where(
          and(
            eq(sasaranKegiatan.id, id),
            isNull(sasaranKegiatan.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      // Cascade soft-delete: hapus semua indikator kinerja terkait terlebih dahulu
      await db.update(indikatorKinerja)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(
          and(
            eq(indikatorKinerja.skId, id),
            isNull(indikatorKinerja.deletedAt)
          )
        );

      // Soft delete SK
      await db.update(sasaranKegiatan)
        .set({
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(sasaranKegiatan.id, id));

      return {
        success: true,
        message: 'Data berhasil dihapus'
      };

    } catch (error: any) {
      console.error('Error in DELETE /api/sasaran-kegiatan/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
