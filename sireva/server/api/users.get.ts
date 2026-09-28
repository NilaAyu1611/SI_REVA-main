import { db } from '../db/index'
import { users } from '../db/schema/users'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'Database not initialized' })
  }
  try {
    const allUsers = await db.select().from(users)
    return allUsers
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch users', data: error })
  }
})
