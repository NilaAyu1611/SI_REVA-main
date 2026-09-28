import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { targetIndikatorStrategis } from '../../db/schema/target-indikator-strategis';
import { eq, and, isNull, sql, inArray } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, createError, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  if (!id || isNaN(id)) {
    event.node.res.statusCode = 400;
    return {
      success: false,
      message: 'ID tidak valid'
    };
  }

  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const result = await db.select()
        .from(sasaranStrategis)
        .where(
          and(
            eq(sasaranStrategis.id, id),
            isNull(sasaranStrategis.deletedAt)
          )
        );

      if (result.length === 0) {
        event.node.res.statusCode = 404;
        return {
          success: false,
          message: 'Data tidak ditemukan'
        };
      }

      const item = result[0];

      // Fetch indicators for this sasaran
      const ssIndikators = await db.select()
        .from(indikatorStrategis)
        .where(eq(indikatorStrategis.sasaranStrategisId, id));

      // Fetch targets for these indicators
      const indIds = ssIndikators.map(ind => ind.id);
      let ssTargets: any[] = [];
      if (indIds.length > 0) {
        ssTargets = await db.select()
          .from(targetIndikatorStrategis)
          .where(inArray(targetIndikatorStrategis.indikatorId, indIds));
      }

      // Group targets by indicator id
      const targetsByInd = new Map<number, { tahun: number; target: number }[]>();
      ssTargets.forEach((t) => {
        if (t.indikatorId && t.tahun !== null && t.target !== null) {
          const list = targetsByInd.get(t.indikatorId) || [];
          list.push({
            tahun: Number(t.tahun),
            target: Number(t.target)
          });
          targetsByInd.set(t.indikatorId, list);
        }
      });

      const formattedIndikators = ssIndikators.map((ind) => ({
        id: ind.id,
        nama: ind.nama,
        satuan: ind.satuan,
        targets: targetsByInd.get(ind.id) || []
      }));

      return {
        success: true,
        data: {
          id: item.id,
          tahun: item.tahun,
          nomor_urut: item.nomorUrut,
          kode_ss: item.kodeSs,
          nama_ss: item.namaSs,
          pengampu: item.pengampu,
          instansi_terkait: item.instansiTerkait
        },
        id: item.id,
        ssId: item.id,
        kode: item.kodeSs,
        kodeSs: item.kodeSs,
        sasaranText: item.namaSs,
        namaSs: item.namaSs,
        tahun: item.tahun,
        nomorUrut: item.nomorUrut,
        pengampu: item.pengampu,
        instansiTerkait: item.instansiTerkait,
        indikatorStrategis: formattedIndikators
      };
    } catch (error: any) {
      event.node.res.statusCode = error.statusCode || 500;
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);

      const existing = await db.select()
        .from(sasaranStrategis)
        .where(
          and(
            eq(sasaranStrategis.id, id),
            isNull(sasaranStrategis.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      const updateFields: any = {};
      const newNama = body.nama_ss !== undefined ? body.nama_ss : (body.sasaranText !== undefined ? body.sasaranText : body.namaSs);
      if (newNama !== undefined) updateFields.namaSs = newNama;

      const newKode = body.kode_ss !== undefined ? body.kode_ss : (body.kode !== undefined ? body.kode : body.kodeSs);
      if (newKode !== undefined) updateFields.kodeSs = newKode;

      if (body.pengampu !== undefined) updateFields.pengampu = body.pengampu;
      if (body.instansi_terkait !== undefined) updateFields.instansiTerkait = body.instansi_terkait;
      if (body.is_active !== undefined) updateFields.isActive = !!body.is_active;

      updateFields.updatedAt = new Date();

      const updated = await db.update(sasaranStrategis)
        .set(updateFields)
        .where(eq(sasaranStrategis.id, id))
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
          kode: first.kodeSs,
          nama: first.namaSs
        }
      };

    } catch (error: any) {
      console.error('Error in PUT /api/sasaran-strategis/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'DELETE') {
    try {
      const existing = await db.select()
        .from(sasaranStrategis)
        .where(
          and(
            eq(sasaranStrategis.id, id),
            isNull(sasaranStrategis.deletedAt)
          )
        );

      if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' });
      }

      // ON DELETE RESTRICT Check: Any active children?
      const children = await db.select({ count: sql`count(*)` })
        .from(sasaranProgram)
        .where(
          and(
            eq(sasaranProgram.ssId, id),
            isNull(sasaranProgram.deletedAt)
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
      await db.update(sasaranStrategis)
        .set({
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(sasaranStrategis.id, id));

      return {
        success: true,
        message: 'Data berhasil dihapus'
      };

    } catch (error: any) {
      console.error('Error in DELETE /api/sasaran-strategis/:id:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
