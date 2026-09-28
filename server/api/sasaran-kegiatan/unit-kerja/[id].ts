import { db } from '../../../db';
import { sasaranKegiatan } from '../../../db/schema/sasaran-kegiatan';
import { indikatorKinerja } from '../../../db/schema/indikator-kinerja';
import { unitKerja } from '../../../db/schema/unit-kerja';
import { eq, and, desc, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, getQuery, createError, type H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const unitKerjaId = Number(event.context.params?.id);
	if (!unitKerjaId || isNaN(unitKerjaId)) {
		throw createError({ statusCode: 400, statusMessage: 'id unit kerja harus berupa angka' });
	}

	const query = getQuery(event);

	try {
		const unit = await db.select().from(unitKerja).where(eq(unitKerja.id, unitKerjaId));
		const unitName = unit[0]?.nama;
		if (!unitName) return [];

		const conditions = [
			isNull(sasaranKegiatan.deletedAt),
			sql`exists (
				select 1 from sireva.sasaran_program_unit_kerja spuk
				where spuk.sasaran_program_id = ${sasaranKegiatan.spId}
					and (
						spuk.unit_kerja_id = ${unitKerjaId}
						or spuk.unit_kerja_id = (select parent_id from sireva.unit_kerja where id = ${unitKerjaId})
					)
			)`
		];

		if (query.sasaranId) {
			conditions.push(eq(sasaranKegiatan.id, Number(query.sasaranId)));
		}

		const selectFields = {
			id: sasaranKegiatan.id,
			spId: sasaranKegiatan.spId,
			nomorUrut: sasaranKegiatan.nomorUrut,
			kode: sasaranKegiatan.kodeSk,
			sasaranText: sasaranKegiatan.namaSk,
			sasaran_kegiatan_text: sasaranKegiatan.namaSk,
			unit_kerja: sql<string>`(select string_agg(uk.nama, ', ') from sireva.sasaran_program_unit_kerja spuk join sireva.unit_kerja uk on uk.id = spuk.unit_kerja_id where spuk.sasaran_program_id = ${sasaranKegiatan.spId})`,
			unitKerjaNama: sql<string>`(select string_agg(uk.nama, ', ') from sireva.sasaran_program_unit_kerja spuk join sireva.unit_kerja uk on uk.id = spuk.unit_kerja_id where spuk.sasaran_program_id = ${sasaranKegiatan.spId})`,
			indikatorId: indikatorKinerja.id,
			indikatorNama: indikatorKinerja.namaIku,
			indikator_kinerja: indikatorKinerja.namaIku,
			satuan: indikatorKinerja.satuan,
			indikatorSatuan: indikatorKinerja.satuan,
			target_1: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2025 limit 1)`,
			target_2: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2026 limit 1)`,
			target_3: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2027 limit 1)`,
			target_4: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2028 limit 1)`,
			target_5: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2029 limit 1)`,
		};

		return await db.select(selectFields)
			.from(sasaranKegiatan)
			.leftJoin(indikatorKinerja, and(eq(sasaranKegiatan.id, indikatorKinerja.skId), isNull(indikatorKinerja.deletedAt)))
			.where(and(...conditions))
			.orderBy(desc(sasaranKegiatan.id));
	} catch (error: any) {
		console.error('API Error [sasaran-kegiatan/unit-kerja/:id]:', error);
		throw createError({
			statusCode: 500,
			statusMessage: error.message || 'Internal Server Error',
		});
	}
});
