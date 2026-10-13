// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

// Dev only: forwards /api to the Spring Boot backend. In production Nginx does this.
const devApiTarget = (process.env.API_PROXY_TARGET || 'http://localhost:8081').replace(/\/+$/, '')
const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  // Static SPA for production (`nuxt generate`, served by Nginx). Dev keeps SSR: ssr:false breaks `nuxt dev` on Nuxt 4.4.5.
  ssr: !isProduction,
  ignore: [
    'sireva/**',
    'scratch/**',
    'sireva'
  ],
  watchers: {
    chokidar: {
      usePolling: true,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.nuxt/**',
        '**/sireva/**',
        '**/scratch/**'
      ]
    }
  },
  routeRules: isProduction ? {} : {
    '/api/**': { proxy: `${devApiTarget}/api/**` }
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
    'nuxt-notify'
    // nuxt-users & nuxt-typed-router DISABLED - incompatible with Nuxt 4.4.2
    // Re-enable when stable (check https://nuxt.com/modules/nuxt-users)
  ]
})

