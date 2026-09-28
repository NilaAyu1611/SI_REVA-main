<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Pemantauan: Input Capaian Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Pelaporan realisasi kinerja berdasarkan target program yang telah ditetapkan.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Pelaporan Capaian Program</h2>
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
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
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

            <!-- 3. Indikator Kinerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Kinerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.indikatorId"
                    required
                    :disabled="!form.sasaranProgramId"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                  >
                    <option :value="null" disabled>-- Pilih Indikator --</option>
                    <option v-for="ind in filteredIndikators" :key="ind.id" :value="ind.id">{{ ind.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Indikator KIK -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">4. Indikator KIK</td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.kikId"
                    :disabled="!availableKiks.length"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400"
                  >
                    <option :value="null">-- Tidak Ada KIK / Pilih KIK --</option>
                    <option v-for="kik in availableKiks" :key="kik.id" :value="kik.id">{{ kik.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 5. Target (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Target (Database)</td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div class="px-6 py-2.5 bg-slate-100 border-2 border-slate-200 rounded-xl font-black text-[#2663A3] text-lg">
                    {{ selectedTarget || 0 }}
                  </div>
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Satuan: {{ selectedSatuan || '-' }}</span>
                  <div class="ml-auto px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                    <IconLock :size="14" class="text-amber-600" />
                    <span class="text-[10px] font-bold text-amber-700 uppercase">Data Terkunci</span>
                  </div>
                </div>
              </td>
            </tr>

            <!-- 6. Realisasi -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">6. Realisasi <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasi"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-[#2663A3] focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Input Realisasi (Angka)"
                />
              </td>
            </tr>

            <!-- 7. Realisasi KIK -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">7. Realisasi KIK</td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasiKik"
                  :disabled="!form.kikId"
                  type="text"
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                  placeholder="Input Realisasi KIK"
                />
              </td>
            </tr>

            <!-- 8. Analisa Pencapaian -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">8. Analisa Pencapaian <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPencapaian"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Tuliskan analisa pencapaian (Max 200 karakter)..."
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.analisaPencapaian.length > 200 ? 'text-red-500' : 'text-slate-400'" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ form.analisaPencapaian.length }} / 200 Karakter
                  </span>
                </div>
              </td>
            </tr>

            <!-- 9. Analisa Permasalahan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">9. Analisa Permasalahan <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPermasalahan"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Tuliskan analisa permasalahan (Max 200 karakter)..."
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.analisaPermasalahan.length > 200 ? 'text-red-500' : 'text-slate-400'" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ form.analisaPermasalahan.length }} / 200 Karakter
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-program`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" /> Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Simpan Laporan Program
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconChartBar, IconFileText, IconChevronDown, IconLock, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: spMaster } = useSWRV('/api/sasaran-program', fetcher)

const form = ref({
  unitKerjaId: null as number | null,
  sasaranProgramId: null as number | null,
  indikatorId: null as number | null,
  kikId: null as number | null,
  realisasi: '',
  realisasiKik: '',
  analisaPencapaian: '',
  analisaPermasalahan: ''
})

const sasaranProgramList = computed(() => {
  if (!spMaster.value) return []
  return Array.isArray(spMaster.value?.data) ? spMaster.value.data : (spMaster.value || [])
})

const uniqueSasaranProgram = computed(() => {
  if (!form.value.unitKerjaId) return []
  const seen = new Set()
  const results: any[] = []
  
  sasaranProgramList.value.forEach((item: any) => {
    // Check if the selected unit is in the list of units for this sasaran
    const unitIds = Array.isArray(item.unitKerjaIds) ? item.unitKerjaIds : []
    if (unitIds.includes(form.value.unitKerjaId) && !seen.has(item.id)) {
      seen.add(item.id)
      results.push({ id: item.id, sasaranText: item.sasaranText })
    }
  })
  return results
})

const filteredIndikators = computed(() => {
  if (!form.value.sasaranProgramId) return []
  return sasaranProgramList.value
    .filter((item: any) => item.id === form.value.sasaranProgramId)
    .map((item: any) => ({
      id: item.indikatorId,
      nama: item.indikatorNama,
      satuan: item.indikatorSatuan,
      targets: item.targets || []
    }))
})

const availableKiks = computed<{ id: number, nama: string }[]>(() => {
  // Assuming KIKs are part of the indicator object if implemented
  // For now, returning empty since we haven't added KIKs to the planning response yet
  return []
})

const selectedTarget = computed(() => {
  if (!form.value.indikatorId) return 0
  const ind = filteredIndikators.value.find((i: any) => i.id === form.value.indikatorId)
  const currentYear = 2026 // Assumption
  const target = ind?.targets?.find((t: any) => t.tahun === currentYear)
  return target?.target || 0
})

const selectedSatuan = computed(() => {
  if (!form.value.indikatorId) return ''
  const ind = filteredIndikators.value.find((i: any) => i.id === form.value.indikatorId)
  return ind?.satuan || ''
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/pemantauan-program', {
      method: 'POST',
      body: {
        sasaranProgramId: form.value.sasaranProgramId,
        indikatorId: form.value.indikatorId,
        kikId: form.value.kikId,
        realisasi: form.value.realisasi,
        realisasiKik: form.value.realisasiKik,
        analisaPencapaian: form.value.analisaPencapaian,
        analisaPermasalahan: form.value.analisaPermasalahan
      }
    })
    router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-program`)
  } catch (error) {
    console.error('Error saving:', error)
    alert('Gagal menyimpan laporan. Silakan periksa koneksi atau data input.')
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
