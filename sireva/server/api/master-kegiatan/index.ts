import { db } from '../../db'
import { masterKegiatan } from '../../db/schema/master-kegiatan'
import { eq } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	if (query.id) {
		return await db.select().from(masterKegiatan).where(eq(masterKegiatan.id, Number(query.id)))
	}
	return await db.select().from(masterKegiatan)
})
