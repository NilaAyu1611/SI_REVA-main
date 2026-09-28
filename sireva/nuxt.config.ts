// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

function parseDbUrl(url: string | undefined) {
  if (!url) return { host: 'localhost', port: 5432, user: undefined, password: undefined, database: undefined }
  try {
    const u = new URL(url)
    const isLocalhost = u.hostname === 'localhost' || u.hostname === '127.0.0.1'
    return {
      host: u.hostname,
      port: u.port ? Number(u.port) : 5432,
      user: u.username || undefined,
      password: u.password || undefined,
      database: u.pathname.replace(/^\\/, '') || undefined,
      ...(isLocalhost ? {} : { ssl: { rejectUnauthorized: false } })
    }
  } catch {
    return { host: 'localhost', port: 5432, user: undefined, password: undefined, database: undefined }
  }
}

export default defineNuxtConfig({
  // Improved DB validation - warn instead of crash
  hooks: {
    'nitro:init': () => {
      const dbUrl = process.env.DATABASE_URL
      console.log('DATABASE_URL:', dbUrl ? `${dbUrl.split('@')[0]}@***` : 'MISSING or empty!')
      if (!dbUrl) {
        console.warn('\n⚠️  WARNING: DATABASE_URL missing! DB features limited/disabled.')
        console.warn('1. Copy .env.example → .env (if exists)')
        console.warn('2. Set DATABASE_URL=postgresql://user:pass@host:port/dbname')
        console.warn('   Free: Supabase, Neon, Railway, or local Postgres')
        console.warn('3. Restart `pnpm dev`\n')
        // Fallback to prevent crash
        process.env.DATABASE_URL = 'postgresql://fallback@localhost:5432/sireva'
      } else if (!dbUrl.startsWith('postgres')) {
        console.warn('⚠️  DATABASE_URL should use PostgreSQL (postgres://...)')
      }
    }
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true  // Windows dev stability
      }
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    'nuxt-swiper',
    'nuxt-ollama',
    'nuxt-notify',
    'nuxt-nodemailer'
    // nuxt-users & nuxt-typed-router DISABLED - incompatible with Nuxt 4.4.2
    // Re-enable when stable (check https://nuxt.com/modules/nuxt-users)
  ]
})

