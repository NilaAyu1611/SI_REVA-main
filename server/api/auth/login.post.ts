import { defineEventHandler, readBody, setCookie } from 'h3'
import { getUserByUsernameOrEmail } from '../../db/users'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { usernameOrEmail, password } = body || {}

  if (!usernameOrEmail || !password) {
    return {
      success: false,
      message: 'Username/email dan password wajib diisi',
    }
  }

  // Cari user berdasarkan username/email
  const user = await getUserByUsernameOrEmail(usernameOrEmail)
  if (!user) {
    return {
      success: false,
      message: 'User tidak ditemukan',
    }
  }

  // Cek password
  const passwordMatch = await bcrypt.compare(password, user.password || '')
  if (!passwordMatch) {
    return {
      success: false,
      message: 'Password salah',
    }
  }

  // TODO: Generate JWT/token session di sini
  // Untuk sekarang, return user info tanpa password
  const { password: _, ...userInfo } = user
  // Set cookie server-side so SSR and subsequent requests see auth
  try {
    setCookie(event, 'sireva_user', JSON.stringify(userInfo), {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
  } catch (e) {
    // non-blocking: log and continue
    console.warn('Failed to set cookie on login:', e)
  }
  return {
    success: true,
    user: userInfo,
    message: 'Login berhasil',
  }
})
