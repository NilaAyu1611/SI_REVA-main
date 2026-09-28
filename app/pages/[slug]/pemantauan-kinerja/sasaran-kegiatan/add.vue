<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Pemantauan: Input Capaian Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Pelaporan realisasi kinerja berdasarkan target yang telah ditetapkan dalam Renstra.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">{{ role }}</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Pelaporan Capaian</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 0. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unitKerjaId"
                    required
                    :disabled="!isSuperAdmin"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.id">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 1. Sasaran Kegiatan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.sasaranKegiatanId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Kegiatan --</option>
                    <option v-for="sk in uniqueSasaranKegiatan" :key="sk.id" :value="sk.id">{{ sk.sasaranText }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 2. Indikator Kinerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Kinerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.indikatorId"
                    required
                    :disabled="!form.sasaranKegiatanId"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400"
                  >
                    <option :value="null" disabled>-- Pilih Indikator --</option>
                    <option v-for="ind in filteredIndikators" :key="ind.id" :value="ind.id">{{ ind.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Indikator KIK -->
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

            <!-- 4. Target (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Target (Kamus Master)</td>
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

            <!-- 5. Realisasi -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">6. Realisasi <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasi"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-[#2663A3] focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:font-normal"
                  placeholder="Input Realisasi"
                />
                <p class="text-[11px] font-medium text-slate-400 mt-1.5 ml-1">* Hanya menerima angka bulat (tanpa titik/koma/desimal)</p>
              </td>
            </tr>

            <!-- 6. Analisa Pencapaian -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">7. Analisa Pencapaian <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPencapaian"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Tuliskan analisa pencapaian di sini..."
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.analisaPencapaian.length < 100 ? 'text-red-500' : 'text-emerald-500'" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ form.analisaPencapaian.length }} / 200 Karakter (Min: 100)
                  </span>
                  <p v-if="form.analisaPencapaian.length < 100" class="text-[10px] text-red-400 italic font-medium">Minimal pengisian adalah 100 karakter.</p>
                </div>
              </td>
            </tr>

            <!-- 7. Realisasi KIK -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">8. Realisasi KIK</td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasiKik"
                  :disabled="!form.kikId"
                  type="text"
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50 disabled:border-slate-100"
                  placeholder="Input Realisasi KIK"
                />
              </td>
            </tr>

            <!-- 8. Analisa Permasalahan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">9. Analisa Permasalahan <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPermasalahan"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Tuliskan analisa permasalahan atau kendala di sini..."
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.analisaPermasalahan.length < 100 ? 'text-red-500' : 'text-emerald-500'" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ form.analisaPermasalahan.length }} / 200 Karakter (Min: 100)
                  </span>
                  <p v-if="form.analisaPermasalahan.length < 100" class="text-[10px] text-red-400 italic font-medium">Minimal pengisian adalah 100 karakter.</p>
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
          @click="router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" /> Batal
        </button>
        <button
          type="submit"
          :disabled="submitting || !isValid"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Simpan Laporan Capaian
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
  IconChartBar, IconFileText, IconChevronDown, IconLock, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const { authUser, role } = useAuthUser()

const { data: unitList } = useFetch<any[]>('/api/unit-kerja', { lazy: true, default: () => [] })

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
  sasaranKegiatanId: null as number | null,
  indikatorId: null as number | null,
  kikId: null as number | null,
  realisasi: '',
  realisasiKik: '',
  analisaPencapaian: '',
  analisaPermasalahan: ''
})

// Auto-fill unit kerja for non-super admins
watch([userUnitKerjaId, isSuperAdmin], () => {
  if (!isSuperAdmin.value && userUnitKerjaId.value && !form.value.unitKerjaId) {
    form.value.unitKerjaId = userUnitKerjaId.value
  }
}, { immediate: true })

const skApiUrl = computed(() => {
  if (isSuperAdmin.value) {
    if (form.value.unitKerjaId) return `/api/sasaran-kegiatan/unit-kerja/${form.value.unitKerjaId}`
    return '/api/sasaran-kegiatan'
  }
  const unitId = userUnitKerjaId.value
  return unitId ? `/api/sasaran-kegiatan/unit-kerja/${unitId}` : null
})

const { data: skMaster } = useFetch<any>(() => skApiUrl.value, { lazy: true, default: () => [] })


const sasaranKegiatanList = computed(() => {
  if (!skMaster.value) return []
  return Array.isArray(skMaster.value) ? skMaster.value : (skMaster.value?.data || [])
})

const uniqueSasaranKegiatan = computed(() => {
  const seen = new Set()
  const result = []
  for (const row of sasaranKegiatanList.value) {
    if (!seen.has(row.id)) {
      seen.add(row.id)
      result.push({
        id: row.id,
        sasaranText: row.sasaranText || row.sasaran_kegiatan_text || '-'
      })
    }
  }
  return result
})

const filteredIndikators = computed(() => {
  if (!form.value.sasaranKegiatanId) return []
  const filteredRows = sasaranKegiatanList.value.filter((r: any) => r.id === form.value.sasaranKegiatanId)
  const seen = new Set()
  const result = []
  for (const row of filteredRows) {
    if (row.indikatorId && !seen.has(row.indikatorId)) {
      seen.add(row.indikatorId)
      result.push({
        id: row.indikatorId,
        nama: row.indikatorNama || row.indikator_kinerja || '-',
        satuan: row.satuan || row.indikatorSatuan || '',
        target: row.target_2 || '0'
      })
    }
  }
  return result
})

const availableKiks = computed<{ id: number, nama: string }[]>(() => {
  if (!form.value.indikatorId) return []
  const ind = filteredIndikators.value.find((i: any) => i.id === form.value.indikatorId)
  return (ind as any)?.kiks || []
})

const selectedTarget = computed(() => {
  if (!form.value.indikatorId) return 0
  const ind = filteredIndikators.value.find((i: any) => i.id === form.value.indikatorId)
  return ind ? Number(ind.target || 0) : 0
})

const selectedSatuan = computed(() => {
  if (!form.value.indikatorId) return ''
  const ind = filteredIndikators.value.find((i: any) => i.id === form.value.indikatorId)
  return ind ? ind.satuan : ''
})

const isValid = computed(() => {
  return form.value.analisaPencapaian.length >= 100 && 
         form.value.analisaPermasalahan.length >= 100 &&
         form.value.sasaranKegiatanId &&
         form.value.indikatorId &&
         form.value.realisasi
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/pemantauan-kegiatan', {
      method: 'POST',
      body: {
        sasaranKegiatanId: form.value.sasaranKegiatanId,
        indikatorId: form.value.indikatorId,
        kikId: form.value.kikId,
        realisasi: form.value.realisasi,
        realisasiKik: form.value.realisasiKik,
        analisaPencapaian: form.value.analisaPencapaian,
        analisaPermasalahan: form.value.analisaPermasalahan
      }
    })
    router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan`)
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
