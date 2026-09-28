import { db } from '../db/index'
import { unitKerja } from '../db/schema/unit-kerja'
import { defineEventHandler, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'Database not initialized' })
  }
  try {
    const body = await readBody(event)
    const { id, nama, level, parentId } = body

    if (id) {
      // Edit Unit Kerja
      const updatedUnit = await db.update(unitKerja)
        .set({
          nama,
          level: level ? parseInt(level, 10) : null,
          parentId: parentId ? parseInt(parentId, 10) : null,
          updatedAt: new Date()
        })
        .where(eq(unitKerja.id, id))
        .returning()
      return updatedUnit[0]
    } else {
      // Create Unit Kerja
      const newUnit = await db.insert(unitKerja)
        .values({
          nama,
          level: level ? parseInt(level, 10) : null,
          parentId: parentId ? parseInt(parentId, 10) : null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()
      return newUnit[0]
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to save unit kerja' })
  }
})
