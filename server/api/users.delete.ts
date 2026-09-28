import { db } from '../db/index'
import { users } from '../db/schema/users'
import { defineEventHandler, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'Database not initialized' })
  }
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required for deletion' })
    }

    const deletedUser = await db.delete(users).where(eq(users.id, id)).returning()
    
    return deletedUser[0]
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to delete user' })
  }
})
