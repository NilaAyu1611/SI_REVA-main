<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-start gap-4 px-2">
      <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
        <IconLayoutGrid :size="28" stroke-width="2.5" />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Form Perencanaan Sasaran Strategis</h1>
        <p class="text-slate-500 font-medium text-sm mt-0.5">
          Tentukan sasaran strategis dan tambahkan satu atau lebih indikator kinerja beserta target capaiannya.
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 1: Pemetaan Sasaran Strategis -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-[#2663A3] flex items-center gap-3">
          <IconTarget :size="20" class="text-white" stroke-width="2.5" />
          <h2 class="text-white font-bold text-sm uppercase tracking-wider">Pemetaan Sasaran Strategis</h2>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Sasaran Strategis -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Sasaran Strategis <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <select
                  v-model="form.masterSsId"
                  required
                  class="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option :value="null" disabled>-- Pilih Sasaran Strategis (Master) --</option>
                  <option v-for="opt in filteredMasterSasaran" :key="opt.ssId" :value="opt.ssId">
                    [{{ opt.kode }}] {{ opt.sasaranText }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                  <IconChevronDown :size="20" stroke-width="3" />
                </div>
              </div>
              <p v-if="form.unitKerjaId && filteredMasterSasaran.length === 0" class="text-[10px] text-red-500 font-bold italic">
                * Tidak ada master data Sasaran Strategis untuk unit ini.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Indikator Kinerja & Target -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconChartBar :size="20" class="text-[#2663A3]" stroke-width="2.5" />
            <h2 class="text-slate-800 font-black text-sm uppercase tracking-wider">Indikator Kinerja & Target</h2>
          </div>
          <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
            Total: {{ form.indikatorList.length }} Indikator
          </span>
        </div>

        <div class="p-8 space-y-6">
          <div
            v-for="(indikator, idx) in form.indikatorList"
            :key="idx"
            class="relative p-6 border-2 border-blue-100 rounded-3xl bg-blue-50/10 space-y-6"
          >
            <!-- Badge Number -->
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#2663A3] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-700/20">
              {{ idx + 1 }}
            </div>

            <!-- Remove Button -->
            <button
              v-if="form.indikatorList.length > 1"
              type="button"
              @click="removeIndikator(idx)"
              class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
            >
              <IconTrash :size="16" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Indikator Kinerja <span class="text-red-500">*</span></label>
                <div class="relative group">
                  <select
                    v-model="indikator.masterIndId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    <option :value="null" disabled>-- Pilih Indikator Kinerja (Master) --</option>
                    <option v-for="opt in availableIndikatorOptions" :key="opt.indikatorId" :value="opt.indikatorId">
                      {{ opt.indikatorNama }} ({{ opt.indikatorSatuan }})
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                    <IconChevronDown :size="18" stroke-width="3" />
                  </div>
                </div>
                <p v-if="form.masterSsId && availableIndikatorOptions.length === 0" class="text-[10px] text-red-500 font-bold italic">
                  * Sasaran ini tidak memiliki master indikator.
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Capaian <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-3">
                  <div class="relative flex-1 group">
                    <input
                      v-model="indikator.target"
                      type="text"
                      required
                      placeholder="Nilai target (misal: 100, Baik)"
                      class="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div class="px-4 py-3.5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-600">
                    <IconCalendar :size="18" stroke-width="2.5" />
                    <span class="text-sm font-black">{{ currentYear }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Indicator Button -->
          <button
            type="button"
            @click="addIndikator"
            class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#2663A3] hover:border-[#2663A3] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold text-sm group"
          >
            <IconPlus :size="20" class="group-hover:scale-110 transition-transform" />
            Tambah Indikator Kinerja (Opsional)
          </button>

          <!-- Info Box -->
          <div class="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4">
            <div class="p-2 bg-white rounded-xl text-[#2663A3] shadow-sm shrink-0">
              <IconInfoCircle :size="18" stroke-width="2.5" />
            </div>
            <p class="text-[13px] text-blue-700 font-medium leading-relaxed">
              Pilih Sasaran Strategis dan Indikator Kinerja dari master data yang telah tersedia. Target akan otomatis tercatat pada database tahun berjalan ({{ currentYear }}).
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-end gap-4">
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
        >
          <IconX :size="18" stroke-width="3" />
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-black text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" stroke-width="3" />
          <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Simpan Sasaran Strategis
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watchEffect, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconLayoutGrid, IconTarget, IconChartBar, 
  IconPlus, IconTrash, IconChevronDown, 
  IconCalendar, IconInfoCircle, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const currentYear = ref(2026)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: masterData } = useSWRV('/api/sasaran-strategis', fetcher)
const { authUser, role } = useAuthUser()

// Role & Unit Logic
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

const userUnitKerjaId = computed(() => {
  if (!unitList.value) return null
  const found = unitList.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

// Dynamic Master Options
const filteredMasterSasaran = computed(() => {
  if (!masterData.value) return []
  
  // Group by ssId to get unique sasarans
  const map = new Map()
  masterData.value.forEach((item: any) => {
    if (!map.has(item.ssId)) {
      map.set(item.ssId, item)
    }
  })
  return Array.from(map.values())
})

const availableIndikatorOptions = computed(() => {
  if (!masterData.value || !form.value.masterSsId) return []
  return masterData.value.filter((item: any) => item.ssId === form.value.masterSsId && item.indikatorId)
})

const form = ref({
  masterSsId: null as number | null,
  unitKerjaId: null as number | null,
  indikatorList: [
    { masterIndId: null as number | null, target: '' }
  ]
})

// Reset indicators if Sasaran changes
watch(() => form.value.masterSsId, () => {
  form.value.indikatorList = [{ masterIndId: null, target: '' }]
})

// Initialize Unit for Non-SuperAdmin
watchEffect(() => {
  if (!isSuperAdmin.value && userUnitKerjaId.value && !form.value.unitKerjaId) {
    form.value.unitKerjaId = userUnitKerjaId.value
  }
})

function addIndikator() {
  form.value.indikatorList.push({ masterIndId: null, target: '' })
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.masterSsId) return
  submitting.value = true

  try {
    // Note: Since this is "Perencanaan", we likely only need to save targets for existing indicators
    // but the current API structure in add.vue was creating new SS/Indicators.
    // Given the user's request to "follow master", we will use the master IDs.
    
    const selectedSS = filteredMasterSasaran.value.find(s => s.ssId === form.value.masterSsId)

    for (const item of form.value.indikatorList) {
      if (!item.masterIndId || !item.target) continue

      // Save target for the selected master indicator
      await $fetch('/api/target-indikator-strategis', {
        method: 'POST',
        body: {
          indikatorId: item.masterIndId,
          tahun: currentYear.value,
          target: item.target,
        },
      })
    }

    alert('Perencanaan Berhasil Disimpan!')
    router.push(`/${route.params.slug}/sasaran-strategis`)
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Gagal menyimpan perencanaan. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Focus transitions and effects */
select:focus + div {
  transform: rotate(180deg);
}
</style>


