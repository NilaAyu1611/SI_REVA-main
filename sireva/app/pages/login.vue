<template>
  <!-- Login Page -->
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
    <!-- Background Decoration (Blurred landing page effect) -->
    <div class="absolute inset-0 z-0 opacity-20">
      <div class="absolute top-0 left-0 w-full h-full bg-blue-900"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
    </div>

    <!-- Modal-like Card -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 border border-slate-200">
      <!-- Blue header banner -->
      <div class="bg-blue-600 px-8 pt-8 pb-6">
        <h1 class="text-2xl font-bold text-white">Login</h1>
        <p class="text-sm text-blue-100 mt-1">Masuk ke akun Sireva kamu</p>
      </div>

      <!-- Form -->
      <div class="px-8 pb-8 pt-6 space-y-4">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-full">
          <div class="flex flex-col gap-2">
            <div class="relative">
              <label class="text-sm font-semibold text-blue-700 mb-1 ml-1 flex items-center gap-1" for="login-username">
                <IconMail size="18" class="inline-block" />
                Username
              </label>
              <input
                id="login-username"
                v-model="usernameOrEmail"
                type="text"
                placeholder="username"
                :class="['transition-all duration-200 w-full py-2.5 pl-10 pr-3 rounded-lg border focus:outline-none', errors.usernameOrEmail ? 'border-red-400 focus:border-red-500' : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100']"
              />
              <span class="absolute left-3 top-9.5 text-blue-500 pointer-events-none">
                <IconMail size="20" />
              </span>
              <span v-if="errors.usernameOrEmail" class="text-xs text-red-500 mt-1 block">{{ errors.usernameOrEmail }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="relative">
              <label class="text-sm font-semibold text-blue-700 mb-1 ml-1 flex items-center gap-1" for="login-password">
                <IconLock size="18" class="inline-block" />
                Password
              </label>
              <input
                id="login-password"
                v-model="password"
                type="password"
                placeholder="Kata sandi"
                :class="['transition-all duration-200 w-full py-2.5 pl-10 pr-3 rounded-lg border focus:outline-none', errors.password ? 'border-red-400 focus:border-red-500' : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100']"
              />
              <span class="absolute left-3 top-9.5 text-blue-500 pointer-events-none">
                <IconLock size="20" />
              </span>
              <span v-if="errors.password" class="text-xs text-red-500 mt-1 block">{{ errors.password }}</span>
            </div>
            <button type="button" class="self-start text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-1">Lupa Password?</button>
            <span class="text-[11px] text-gray-400 mt-1 block ml-1 leading-tight">Jika Anda lupa kata sandi, silakan hubungi admin sireva.</span>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col gap-3 pt-4">
            <Button
              hierarchy="primary"
              type="submit"
              :loading="loading"
              :disabled="!isValid"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              Masuk
            </Button>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-px bg-gray-100"></div>
              <p class="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Atau</p>
              <div class="flex-1 h-px bg-gray-100"></div>
            </div>
            <Button 
              hierarchy="secondary" 
              type="button"
              @click="navigateTo('/')" 
              class="w-full border border-blue-100 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded-xl transition-colors"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useToast } from '#imports'
import { Button } from '@idds/vue'
import { IconMail, IconLock } from '@tabler/icons-vue'
import { useAuthUser } from '@/composables/useAuthUser'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const toast = useToast()
const { authUser, setAuthUser } = useAuthUser()
const route = useRoute()
const router = useRouter()

const usernameOrEmail = ref('')
const password = ref('')
const loading = ref(false)
const serverError = ref('')

const errors = ref({
  usernameOrEmail: '',
  password: ''
})

const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/

const resolveSlugFromUser = (user: any) => {
  const role = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : ''
  const safeRole = role
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')

  if (safeRole) return safeRole

  const roleId = Number(user?.role_id ?? 0)
  if (roleId === 1) return 'super_admin'
  if (roleId === 2) return 'admin'
  return 'user'
}

const getPostLoginPath = (user: any) => `/${resolveSlugFromUser(user)}/dashboard`

const redirectToPostLoginPath = async (user: any) => {
  const target = getPostLoginPath(user)

  if (route.path !== target) {
    try {
      await router.push(target)
    } catch (e) {
      console.warn('Router push failed, fallback to navigateTo:', e)
      await navigateTo(target, { replace: true })
    }
  }

  // Last fallback if navigation still does not happen on client
  if (process.client && window.location.pathname !== target) {
    window.location.assign(target)
  }
}

const isValid = computed(() => {
  if (usernameOrEmail.value && !usernameRegex.test(usernameOrEmail.value)) {
    errors.value.usernameOrEmail = 'Username tidak valid'
  } else {
    errors.value.usernameOrEmail = ''
  }
  
  errors.value.password = !password.value && password.value !== '' ? 'Password wajib diisi' : ''
  
  return usernameOrEmail.value && password.value && !errors.value.usernameOrEmail
})

const handleLogin = async () => {
  if (!isValid.value) return
  
  loading.value = true
  serverError.value = ''
  
  try {
    const data = await $fetch<any>('/api/auth/login', {
      method: 'POST',
      body: {
        usernameOrEmail: usernameOrEmail.value,
        password: password.value,
      },
    })
    
    if (data.success) {
      toast.success('Login berhasil!')
      setAuthUser(data.user ?? null)

      // Ensure cookie saved explicitly and log debug info
      const cookie = useCookie('sireva_user', {
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      cookie.value = data.user ?? null
      console.log('DEBUG: /api/auth/login response ->', data)
      console.log('DEBUG: authUser after setAuthUser ->', authUser.value)
      console.log('DEBUG: cookie value ->', cookie.value)

      // Redirect to role slug dashboard
      await redirectToPostLoginPath(data.user)
    } else {
      toast.error(data.message || 'Login gagal. Periksa kembali akun Anda.')
      serverError.value = data.message || 'Login gagal'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    const message = error.message || 'Gagal terhubung ke server.'
    toast.error(message)
    serverError.value = message
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(() => {
  console.log('DEBUG: onMounted authUser ->', authUser.value)
  if (authUser.value) {
    redirectToPostLoginPath(authUser.value)
  }
})
</script>

<style scoped>
/* Page specific styles */
</style>
