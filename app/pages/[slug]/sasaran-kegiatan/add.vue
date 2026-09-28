<template>
  <div class="max-w-4xl mx-auto pb-10 space-y-6 mt-4">
    <div class="flex items-center gap-3 mb-2">
      <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
        <IconClipboardList :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Form Perencanaan Kinerja</h1>
        <p class="text-sm text-slate-500 mt-1">Silakan lengkapi form di bawah ini untuk menambahkan data sasaran kegiatan dan rencana aksi.</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
        <IconTarget :size="20" class="text-blue-600" />
        <h2 class="text-sm font-bold text-blue-700">Perencanaan - Sasaran Kegiatan</h2>
      </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Unit Kerja (Hanya Super Admin) -->
          <div v-if="isSuperAdmin" class="space-y-2">
            <label for="unitKerjaId" class="block text-sm font-semibold text-slate-700">Unit Kerja <span class="text-red-500">*</span></label>
            <select id="unitKerjaId" v-model="form.unitKerjaId" required class="field-input">
              <option :value="null" disabled>-- Pilih Unit Kerja --</option>
              <option v-for="u in unitList" :key="u.id" :value="u.id">
                {{ u.nama }}
              </option>
            </select>
          </div>

          <!-- Unit Kerja (User - Read Only) -->
          <div v-else-if="isUserOnly" class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Unit Kerja</label>
            <div class="field-input bg-slate-50 text-slate-500 font-medium cursor-not-allowed">
              {{ loggedUnitKerjaName || 'Unit kerja tidak terdeteksi' }}
            </div>
          </div>

          <!-- Sasaran Kegiatan -->
          <div class="space-y-2">
            <label for="sasaranId" class="block text-sm font-semibold text-slate-700">Sasaran Kegiatan <span class="text-red-500">*</span></label>
            <select 
              id="sasaranId" 
              v-model="form.sasaranId" 
              required 
              class="field-input"
              :disabled="isSuperAdmin && !form.unitKerjaId"
            >
              <option :value="null" disabled>-- Pilih Sasaran Kegiatan --</option>
              <option v-for="s in sasaranOptions" :key="s.id" :value="s.id">
                {{ s.kode ? `${s.kode} - ${s.sasaranText}` : s.sasaranText }}
              </option>
            </select>
            <p v-if="isSuperAdmin && !form.unitKerjaId" class="text-[11px] text-amber-600 font-bold ml-1 italic">
              * Silakan pilih Unit Kerja terlebih dahulu
            </p>
          </div>

        <!-- Indikator Kinerja -->
        <div class="space-y-2">
          <label for="indikatorId" class="block text-sm font-semibold text-slate-700">Indikator Kinerja <span class="text-red-500">*</span></label>
          <select id="indikatorId" v-model="form.indikatorId" required class="field-input" :disabled="!form.sasaranId">
            <option :value="null" disabled>-- Pilih Indikator Kinerja --</option>
            <option v-for="i in indikatorOptions" :key="i.id" :value="i.id">
              {{ i.nama }}
            </option>
          </select>
        </div>

        <!-- Target Capaian -->
        <div class="space-y-2">
          <label for="target" class="block text-sm font-semibold text-slate-700">Target Capaian <span class="text-red-500">*</span></label>
          <div class="flex items-center gap-3">
            <input
              id="target"
              v-model="form.target"
              type="text"
              required
              class="field-input flex-1"
              placeholder="Masukkan nilai target (contoh: 100, Baik, dsb.)"
            />
            <div class="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
              <IconCalendar :size="18" />
              Tahun {{ currentYear }}
            </div>
          </div>
          <p class="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <IconInfoCircle :size="14" />
            Sesuai ketentuan, nilai target akan otomatis dicatat untuk tahun berjalan.
          </p>
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
            class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting || !isValid"
            class="px-5 py-2.5 rounded-xl bg-[#2663A3] text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'dashboard',
  middleware: [
    function (to, from) {
      const { role } = useAuthUser()
      const roleName = String(role.value || '').toLowerCase().replace(/\s+/g, '_')
      if (roleName === 'admin') {
        return navigateTo(`/${to.params.slug}/sasaran-kegiatan`)
      }
    }
  ]
})

import { ref, computed, watch, onMounted, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconClipboardList, IconTarget, IconCalendar, IconInfoCircle } from '@tabler/icons-vue'
import { useToast, useAuthUser } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { authUser, role } = useAuthUser()

const submitting = ref(false)
const currentYear = new Date().getFullYear()

const { data: unitList } = useFetch('/api/unit-kerja', { default: () => [] })
const { data: sasaranRaw } = useFetch('/api/sasaran-kegiatan', { default: () => [] })

// Role & Unit Logic
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))

// RE-PROTECT (Fail-safe redirect for Admin role)
watchEffect(() => {
  if (normalizedRole.value === 'admin') {
    router.replace(`/${route.params.slug}/sasaran-kegiatan`)
  }
})

const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isUserOnly = computed(() => normalizedRole.value === 'user')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())


const userUnitKerjaId = computed(() => {
  if (!isUserOnly.value || !unitList.value) return null
  const found = unitList.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

const sasaranOptions = computed(() => {
  const source = Array.isArray(sasaranRaw.value?.data) ? sasaranRaw.value.data : (sasaranRaw.value || [])
  
  if (isSuperAdmin.value) {
    if (!form.value.unitKerjaId) return []
    return source.filter((s: any) => s.unitKerjaId === form.value.unitKerjaId)
  }

  if (isUserOnly.value) {
    const unitId = userUnitKerjaId.value
    if (!unitId) return []
    return source.filter((s: any) => s.unitKerjaId === unitId)
  }

  return []
})

const form = ref({
  unitKerjaId: null as number | null,
  sasaranId: null as number | null,
  indikatorId: null as number | null,
  target: '',
})

// Initialize Unit for User
onMounted(() => {
  if (isUserOnly.value) {
    // Unit logic is handled via computed and watch if needed, 
    // but form.unitKerjaId isn't used for user submission in the same way if API only needs ikuId
  }
})

const indikatorOptions = computed(() => {
  if (!form.value.sasaranId) return []
  const sasaran = sasaranOptions.value.find((s: any) => s.id === form.value.sasaranId)
  return sasaran?.indikators || []
})

watch(() => form.value.sasaranId, () => {
  form.value.indikatorId = null
})

watch(() => form.value.unitKerjaId, () => {
  form.value.sasaranId = null
  form.value.indikatorId = null
})

const isValid = computed(() => !!form.value.sasaranId && !!form.value.indikatorId && !!form.value.target)

const handleSubmit = async () => {
  if (!isValid.value) return

  submitting.value = true
  try {
    await $fetch('/api/sasaran-kegiatan/target', {
      method: 'POST',
      body: {
        idIku: form.value.indikatorId,
        tahun: currentYear,
        targetNilai: form.value.target
      }
    })
    
    toast.success('Target capaian berhasil disimpan!')
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
  } catch (err: any) {
    console.error('Error saving target:', err)
    toast.error(err.data?.message || 'Gagal menyimpan target capaian')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input:focus {
  outline: none;
  border-color: #2663A3;
  box-shadow: 0 0 0 4px rgba(38, 99, 163, 0.1);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
}

.field-input::placeholder {
  color: rgb(203 213 225);
}

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>
