<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[92vh] overflow-y-auto z-10">
          <button
            class="absolute top-4 right-4 text-slate-500 hover:text-slate-700 z-20 transition-colors"
            type="button"
            @click="$emit('update:modelValue', false)"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <div class="p-3 sm:p-4 md:p-6">
            <div class="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-4 md:gap-6 items-center">
              <div class="bg-slate-50 rounded-xl p-4 md:p-5 flex flex-col items-center text-center gap-3">
                <img :src="illustrasiImage" class="max-w-45 sm:max-w-55 md:max-w-65 w-full" alt="Login illustration" />
                <p class="text-xs text-slate-500">Sistem Informasi Rencana dan Evaluasi Kinerja</p>
              </div>

              <div class="space-y-3 md:space-y-4">
                <div class="space-y-1.5">
                  <h1 class="text-xl font-bold text-slate-900">Login</h1>
                  <p class="text-sm text-slate-600">Disini kamu bisa login ke akun kamu</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-3 md:space-y-4">
                  <div class="flex flex-col gap-2 md:gap-4 w-full">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-semibold text-slate-800" for="login-username">Email / Username</label>
                      <input
                        id="login-username"
                        v-model="usernameOrEmail"
                        type="text"
                        placeholder="Enter text..."
                        :class="[
                          'transition-all duration-200 w-full py-2 px-3 rounded-lg border focus:outline-none',
                          errors.usernameOrEmail
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        ]"
                      />
                      <span v-if="errors.usernameOrEmail" class="text-xs text-red-500">{{ errors.usernameOrEmail }}</span>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-slate-800" for="login-password">Password</label>
                        <input
                          id="login-password"
                          v-model="password"
                          type="password"
                          placeholder="Enter text..."
                          :class="[
                            'transition-all duration-200 w-full py-2 px-3 rounded-lg border focus:outline-none',
                            errors.password
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          ]"
                        />
                        <span v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</span>
                      </div>

                      <Button hierarchy="link" class="self-start text-xs text-blue-600 hover:text-blue-700">Forgot Password</Button>
                      <span class="text-xs text-slate-500">Jika Anda lupa kata sandi, silakan hubungi admin sireva.</span>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2.5 md:gap-4 w-full pt-1">
                    <Button
                      hierarchy="primary"
                      type="submit"
                      :loading="loading"
                      :disabled="!isValid"
                      class="w-full bg-[#1F4F85]! border-[#1F4F85]! text-white! hover:bg-[#183d68]!"
                    >
                      Masuk
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { navigateTo } from '#app'
import { useToast } from '#imports'
import { Button } from '@idds/vue'
import { useAuthUser } from '@/composables/useAuthUser'
import { useRoute, useRouter } from 'vue-router'

const illustrasiImage = '/LANRI-ORG.png'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const toast = useToast()
const { setAuthUser } = useAuthUser()
const route = useRoute()
const router = useRouter()

const usernameOrEmail = ref('')
const password = ref('')
const loading = ref(false)
const serverError = ref('')

const errors = ref({ usernameOrEmail: '', password: '' })

const usernameRegex = /^[a-zA-Z0-9_.-]{2,}$/

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
  if (!usernameOrEmail.value) {
    errors.value.usernameOrEmail = 'Username wajib diisi'
  } else if (!usernameRegex.test(usernameOrEmail.value)) {
    errors.value.usernameOrEmail = 'Username minimal 2 karakter, hanya huruf, angka, titik, underscore, atau strip'
  } else {
    errors.value.usernameOrEmail = ''
  }
  errors.value.password = !password.value ? 'Password wajib diisi' : ''
  return !errors.value.usernameOrEmail && !errors.value.password && usernameOrEmail.value && password.value
})

const resetForm = () => {
  usernameOrEmail.value = ''
  password.value = ''
  serverError.value = ''
  errors.value = { usernameOrEmail: '', password: '' }
}

// Reset form when modal closes
watch(() => props.modelValue, (val) => {
  if (!val) resetForm()
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

      const cookie = useCookie('sireva_user', {
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      cookie.value = data.user ?? null

      // Redirect ke dashboard role/slug
      await redirectToPostLoginPath(data.user)
      emit('update:modelValue', false)
      resetForm()
    } else {
      toast.error(data.message || 'Login gagal')
      serverError.value = data.message || 'Login gagal'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    const message = error.message || 'Login gagal. Coba lagi.'
    toast.error(message)
    serverError.value = message
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
