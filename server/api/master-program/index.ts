import { db } from '../../db'
import { masterProgram } from '../../db/schema/master-program'
import { eq } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	if (query.id) {
		return await db.select().from(masterProgram).where(eq(masterProgram.id, Number(query.id)))
	}
	return await db.select().from(masterProgram)
})
