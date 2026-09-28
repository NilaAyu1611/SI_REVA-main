<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPlus :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Tambah Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Lengkapi data sasaran program, unit kerja, dan target indikator untuk periode Renstra.
          </p>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitData" class="space-y-6">
      <!-- Look-up Helper Table (Optional but requested) -->
      <div v-if="sasaranStrategisOptions.length > 0" class="bg-blue-50/50 rounded-3xl border border-blue-100 p-6 space-y-4">
        <div class="flex items-center gap-2 text-blue-700">
          <IconListCheck :size="20" />
          <h3 class="font-bold text-sm uppercase tracking-wider">Referensi Sasaran Strategis</h3>
        </div>
        <div class="bg-white rounded-2xl border border-blue-100 overflow-hidden">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="bg-blue-100/50 text-blue-700 font-bold uppercase tracking-tight">
                <th class="px-4 py-2 w-16">ID</th>
                <th class="px-4 py-2">Nama Sasaran Strategis</th>
                <th class="px-4 py-2 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ss in sasaranStrategisOptions" :key="ss.id" class="border-t border-blue-50 hover:bg-blue-50/30 transition-colors">
                <td class="px-4 py-2 font-mono font-bold">{{ ss.id }}</td>
                <td class="px-4 py-2 text-slate-600">{{ ss.sasaranText }}</td>
                <td class="px-4 py-2">
                  <button 
                    @click="form.id_ss = ss.id" 
                    type="button"
                    class="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    Pilih
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Table Form Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Sasaran Program</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Kode -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Kode <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode"
                  type="text"
                  required
                  class="w-full md:w-1/3 field-input"
                  placeholder="Input Kode Sasaran"
                />
              </td>
            </tr>

            <!-- 2. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unit_kerja"
                    required
                    class="w-full appearance-none field-input"
                  >
                    <option value="" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.nama">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Sasaran Strategis -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Sasaran Strategis <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_ss"
                    required
                    class="w-full appearance-none field-input"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                    <option v-for="ss in sasaranStrategisOptions" :key="ss.id" :value="ss.id">
                      [{{ ss.kode }}] {{ ss.sasaranText }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Indikator Kinerja (Kode IKU) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Indikator Kinerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.kode_iku"
                    required
                    class="w-full appearance-none field-input"
                    :disabled="!form.id_ss"
                  >
                    <option value="" disabled>-- Pilih Indikator Strategis --</option>
                    <option v-for="is in indikatorStrategisOptions" :key="is.id" :value="is.kode || is.nama">
                      {{ is.nama }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 5. Sasaran Program Text -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Nama Sasaran Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <textarea
                  v-model="form.sasaran_program_text"
                  required
                  class="w-full field-input min-h-[100px]"
                  placeholder="Masukkan deskripsi sasaran program..."
                ></textarea>
              </td>
            </tr>

            <!-- 6. Satuan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">6. Satuan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.satuan"
                  type="text"
                  required
                  class="w-full md:w-1/2 field-input"
                  placeholder="Contoh: Persen, Dokumen, dll"
                />
              </td>
            </tr>

            <!-- 7. Target Renstra -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">7. Target Renstra (5 Tahun) <span class="text-red-500">*</span></td>
              <td class="px-8 py-8">
                <div class="grid grid-cols-5 gap-4">
                  <div v-for="n in 5" :key="n" class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Tahun {{ n }}</label>
                    <input
                      v-model="form[`target_${n}`]"
                      type="number"
                      step="any"
                      required
                      class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center font-bold text-slate-700 focus:bg-white focus:border-[#2663A3] transition-all"
                      placeholder="0"
                    />
                  </div>
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
          @click="router.push(`/${route.params.slug}/sasaran-program`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {{ submitting ? 'Menyimpan...' : 'Simpan Sasaran Program' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Form Tambah Sasaran Program (Supabase Integrated)
 */
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPlus, IconFileText, IconChevronDown, IconDeviceFloppy, IconListCheck 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const submitting = ref(false)

// 1. State Form (Key sesuai nama kolom database)
const form = ref<Record<string, any>>({
  id_ss: null as number | null,
  kode: '',
  unit_kerja: '',
  kode_iku: '',
  sasaran_program_text: '',
  satuan: '',
  target_1: 0,
  target_2: 0,
  target_3: 0,
  target_4: 0,
  target_5: 0
})

// 2. Dropdown Relasi (Data Fetching)
const fetcher = (url: string) => fetch(url).then(r => r.json())

// Fetching Unit Kerja
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)

// Fetching Sasaran Strategis (Master)
const { data: ssData } = useSWRV('/api/sasaran-strategis', fetcher)

// Opsi Sasaran Strategis (Deduplicated)
const sasaranStrategisOptions = computed(() => {
  if (!ssData.value) return []
  const source = Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
  const seen = new Set()
  return source.filter((item: any) => {
    if (!item.ssId || seen.has(item.ssId)) return false
    seen.add(item.ssId)
    return true
  }).map((item: any) => ({
    id: Number(item.ssId),
    kode: item.kode || '-',
    sasaranText: item.sasaranText
  }))
})

// Opsi Indikator Strategis (Filtered by Selected Sasaran Strategis)
const indikatorStrategisOptions = computed(() => {
  if (!form.value.id_ss || !ssData.value) return []
  const source = Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
  return source
    .filter((item: any) => item.ssId === form.value.id_ss)
    .map((item: any) => ({
      id: item.indikatorId,
      nama: item.indikatorNama,
      kode: item.indikatorKode
    }))
})

// 4. Fungsi Submit
const submitData = async () => {
  if (submitting.value) return
  
  // Validasi sederhana
  if (!form.value.id_ss || !form.value.unit_kerja || !form.value.sasaran_program_text) {
    toast.error('Harap lengkapi semua data wajib (*)')
    return
  }

  submitting.value = true
  try {
    await $fetch('/api/sasaran-program', {
      method: 'POST',
      body: {
        id_ss: form.value.id_ss,
        kode: form.value.kode,
        unit_kerja: form.value.unit_kerja,
        kode_iku: form.value.kode_iku,
        sasaran_program_text: form.value.sasaran_program_text,
        satuan: form.value.satuan,
        target_1: form.value.target_1,
        target_2: form.value.target_2,
        target_3: form.value.target_3,
        target_4: form.value.target_4,
        target_5: form.value.target_5
      }
    })
    
    toast.success('Data sasaran program berhasil ditambahkan.')
    router.push(`/${route.params.slug}/sasaran-program`)
  } catch (error: any) {
    console.error('Error submitting data:', error)
    toast.error(error.data?.statusMessage || 'Gagal menyimpan data ke database.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.field-input {
  background-color: white;
  border-width: 2px;
  border-color: rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  font-weight: 500;
  color: rgb(51 65 85);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.field-input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  border-color: #2663A3;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: rgb(219 234 254);
}
</style>
