<template>
  <div class="max-w-6xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Pemantauan: Input Rencana Aksi</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Pelaporan progres aktivitas berdasarkan rencana aksi yang telah disusun.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">{{ isSuperAdmin ? 'Super Admin' : 'User Kerja' }}</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Pemantauan Rencana Aksi</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unitKerjaId"
                    required
                    :disabled="!isSuperAdmin"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.id">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 2. Sasaran Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.sasaranProgramId"
                    required
                    :disabled="!form.unitKerjaId"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Program --</option>
                    <option v-for="sp in uniqueSasaranProgram" :key="sp.id" :value="sp.id">{{ sp.sasaranText }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Indikator Kinerja (Auto-pull list) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Kinerja Program (Tarik Otomatis)</td>
              <td class="px-8 py-5">
                <div v-if="filteredIndikators.length > 0" class="space-y-2">
                  <div v-for="(ind, i) in filteredIndikators" :key="i" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>{{ ind }}</span>
                  </div>
                </div>
                <div v-else class="text-slate-400 italic font-medium">
                  Belum ada indikator yang ditarik. Silakan pilih Sasaran Program terlebih dahulu.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Rencana Kegiatan Dinamis Table Layout -->
      <div v-if="form.sasaranProgramId" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconClipboardList :size="20" class="text-slate-500" stroke-width="2.5" />
            <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Daftar Rencana Kegiatan & Keterangan</h2>
          </div>
          <div class="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
            <span class="text-[10px] font-bold text-[#2663A3] uppercase">Jumlah: {{ filteredRencanaAksi.length }} Kegiatan</span>
          </div>
        </div>

        <div v-if="filteredRencanaAksi.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm border-collapse text-left">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase text-[10px] font-black tracking-wider">
                <th class="px-6 py-4 text-center w-12">No</th>
                <th class="px-6 py-4 w-1/3">Rencana Kegiatan (Aksi)</th>
                <th class="px-6 py-4 w-24 text-center">Target</th>
                <th class="px-6 py-4">Keterangan Rencana Kegiatan (Min 100 Karakter) <span class="text-red-500">*</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ra, idx) in filteredRencanaAksi" :key="ra.id" class="border-b border-slate-100 hover:bg-slate-50/30 transition-all">
                <td class="px-6 py-4 text-center font-bold text-slate-400">{{ idx + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-800 leading-normal">{{ ra.rencanaAksi }}</div>
                  <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Indikator: {{ ra.indikator }}</div>
                </td>
                <td class="px-6 py-4 text-center font-black text-slate-700">{{ ra.target || 0 }}</td>
                <td class="px-6 py-4 space-y-2">
                  <textarea
                    v-model="form.keteranganMap[ra.id]"
                    required
                    maxlength="800"
                    rows="3"
                    class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                    placeholder="Tuliskan keterangan progres rencana kegiatan ini..."
                  ></textarea>
                  <div class="flex justify-between items-center px-1">
                    <span :class="(form.keteranganMap[ra.id] || '').length < 100 ? 'text-red-500 font-bold' : 'text-slate-400 font-bold'" class="text-[10px] uppercase tracking-widest">
                      {{ (form.keteranganMap[ra.id] || '').length }} / 800 Karakter (Min. 100)
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-12 text-center text-slate-400 italic font-medium">
          Tidak ada data rencana kegiatan yang ditemukan untuk Sasaran Program ini di modul Perencanaan.
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" /> Batal
        </button>
        <button
          type="submit"
          :disabled="submitting || !isFormValid"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Simpan Pemantauan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconChartBar, IconFileText, IconChevronDown, IconX, IconDeviceFloppy, IconClipboardList 
} from '@tabler/icons-vue'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const { authUser, role } = useAuthUser()

const { data: unitList } = useFetch<any[]>('/api/unit-kerja', { lazy: true, default: () => [] })
const { data: raPlanning } = useFetch<any[]>('/api/rencana-aksi', { lazy: true, default: () => [] })

const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')


const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())
const userUnitKerjaId = computed(() => {
  if (!unitList.value) return null
  const found = unitList.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

const form = ref({
  unitKerjaId: null as number | null,
  sasaranProgramId: null as number | null,
  keteranganMap: {} as Record<number, string>
})

// Auto-fill unit kerja for non-super admins
watch([userUnitKerjaId, isSuperAdmin], () => {
  if (!isSuperAdmin.value && userUnitKerjaId.value && !form.value.unitKerjaId) {
    form.value.unitKerjaId = userUnitKerjaId.value
  }
}, { immediate: true })

const spApiUrl = computed(() => {
  if (isSuperAdmin.value) {
    if (form.value.unitKerjaId) return `/api/sasaran-program/unit-kerja/${form.value.unitKerjaId}`
    return '/api/sasaran-program'
  }
  const unitId = userUnitKerjaId.value
  return unitId ? `/api/sasaran-program/unit-kerja/${unitId}` : null
})

const { data: spMaster } = useFetch<any>(() => spApiUrl.value, { lazy: true, default: () => [] })


const sasaranProgramList = computed(() => {
  if (!spMaster.value) return []
  return Array.isArray(spMaster.value) ? spMaster.value : (spMaster.value?.data || [])
})

const uniqueSasaranProgram = computed(() => {
  const seen = new Set()
  const results: any[] = []
  
  sasaranProgramList.value.forEach((item: any) => {
    if (item.id && !seen.has(item.id)) {
      seen.add(item.id)
      results.push({ id: item.id, sasaranText: item.sasaran_program_text || item.namaSp || item.sasaranText })
    }
  })
  return results
})

const filteredIndikators = computed(() => {
  if (!form.value.sasaranProgramId) return []
  const seen = new Set()
  const results: string[] = []
  
  sasaranProgramList.value
    .filter((item: any) => item.id === form.value.sasaranProgramId && item.indikatorNama)
    .forEach((item: any) => {
      if (!seen.has(item.indikatorNama)) {
        seen.add(item.indikatorNama)
        results.push(item.indikatorNama)
      }
    })
  return results
})

const filteredRencanaAksi = computed(() => {
  if (!form.value.sasaranProgramId) return []
  const list = Array.isArray(raPlanning.value) ? raPlanning.value : (raPlanning.value?.data || [])
  return list.filter((ra: any) => ra.sasaranProgramId === form.value.sasaranProgramId)
})

// Initialize description bindings
watch(filteredRencanaAksi, (newList) => {
  newList.forEach((ra: any) => {
    if (form.value.keteranganMap[ra.id] === undefined) {
      form.value.keteranganMap[ra.id] = ''
    }
  })
}, { immediate: true })

const isFormValid = computed(() => {
  if (filteredRencanaAksi.value.length === 0) return false
  return filteredRencanaAksi.value.every((ra: any) => {
    const val = String(form.value.keteranganMap[ra.id] || '').trim()
    return val.length >= 100 && val.length <= 800
  })
})

const handleSubmit = async () => {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  try {
    const submitPromises = filteredRencanaAksi.value.map((ra: any) => {
      const keteranganVal = form.value.keteranganMap[ra.id] || ''
      return $fetch('/api/pemantauan-rencana-aksi', {
        method: 'POST',
        body: {
          rencanaAksiId: ra.id,
          realisasi: 100, // Standard placeholder realisasi
          analisaPencapaian: 'Laporan Progres Rencana Aksi',
          analisaPermasalahan: '-',
          keterangan: keteranganVal
        }
      })
    })
    
    await Promise.all(submitPromises)
    router.push(`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`)
  } catch (error) {
    console.error('Error saving pemantauan rencana aksi:', error)
    alert('Gagal menyimpan pemantauan. Silakan periksa koneksi atau data input.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
table tr:last-child {
  border-bottom: none;
}
</style>
