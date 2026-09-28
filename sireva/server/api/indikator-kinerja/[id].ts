import { db } from '../../db';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { targetIndiaktorKegiatan } from '../../db/schema/target-indikator-kegiatan';
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
        .from(indikatorKinerja)
        .where(
          and(
            eq(indikatorKinerja.id, id),
            isNull(indikatorKinerja.deletedAt)
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
      if (body.kode_iku || body.nomor_urut || body.kodeIku || body.nomorUrut || body.sk_id || body.skId) {
        throw createError({ statusCode: 400, statusMessage: 'Kode, nomor_urut, dan sk_id tidak boleh diubah' });
      }

      const existing = await db.select()
        .from(indikatorKinerja)
        .where(
          and(
            eq(indikatorKinerja.id, id),
            isNull(indikatorKinerja.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      const updateFields: any = {};
      if (body.nama_iku !== undefined) updateFields.namaIku = body.nama_iku;
      if (body.satuan !== undefined) updateFields.satuan = body.satuan;
      if (body.target !== undefined) updateFields.target = body.target;
      if (body.realisasi !== undefined) updateFields.realisasi = body.realisasi;
      if (body.is_active !== undefined) updateFields.isActive = !!body.is_active;

      updateFields.updatedAt = new Date();

      if (body.targets && typeof body.targets === 'object') {
        for (const [yearStr, val] of Object.entries(body.targets)) {
          const year = Number(yearStr);
          const existingTarget = await db.select().from(targetIndiaktorKegiatan).where(
            and(eq(targetIndiaktorKegiatan.idIku, id), eq(targetIndiaktorKegiatan.tahun, year))
          );
          
          if (existingTarget.length > 0) {
            await db.update(targetIndiaktorKegiatan)
              .set({ targetNilai: String(val) })
              .where(eq(targetIndiaktorKegiatan.id, existingTarget[0].id));
          } else {
            await db.insert(targetIndiaktorKegiatan).values({ 
              idIku: id, 
              tahun: year, 
              targetNilai: String(val),
              createdAt: new Date()
            });
          }
        }
      }

      const updated = await db.update(indikatorKinerja)
        .set(updateFields)
        .where(eq(indikatorKinerja.id, id))
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
          kode: first.kodeIku,
          nama: first.namaIku
        }
      };

    } catch (error: any) {
      console.error('Error in PUT /api/indikator-kinerja/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'DELETE') {
    try {
      const existing = await db.select()
        .from(indikatorKinerja)
        .where(
          and(
            eq(indikatorKinerja.id, id),
            isNull(indikatorKinerja.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      // Soft delete
      await db.update(indikatorKinerja)
        .set({
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(indikatorKinerja.id, id));

      return {
        success: true,
        message: 'Data berhasil dihapus'
      };

    } catch (error: any) {
      console.error('Error in DELETE /api/indikator-kinerja/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
