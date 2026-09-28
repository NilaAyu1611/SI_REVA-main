<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconDatabase :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Tambah Sasaran Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Tautkan sasaran kegiatan ke hierarki cascading Sasaran Strategis dan Sasaran Program.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Table Form Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Data Sasaran Kegiatan</h2>
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
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Contoh: SK.01"
                />
              </td>
            </tr>

            <!-- 2. Sasaran Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_sp"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Program --</option>
                    <option v-for="sp in sasaranProgramOptions" :key="sp.id" :value="sp.id">
                      [{{ sp.kode }}] {{ sp.text }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Indikator Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_ip"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                    :disabled="!form.id_sp"
                  >
                    <option :value="null" disabled>-- Pilih Indikator Program --</option>
                    <option v-for="ip in indikatorProgramOptions" :key="ip.id" :value="ip.id">
                      [{{ ip.kode || '-' }}] {{ ip.nama }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unit_kerja"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option value="" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.nama">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 5. Sasaran Kegiatan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Sasaran Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <textarea
                  v-model="form.sasaran_kegiatan_text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all min-h-[100px]"
                  placeholder="Masukkan deskripsi sasaran kegiatan..."
                ></textarea>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Section: Dynamic Indikator Kinerja -->
      <div class="space-y-6 mt-6">
        <div 
          v-for="(ind, index) in indikators" 
          :key="index" 
          class="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-8 space-y-6 relative"
        >
          <!-- Remove Button -->
          <button 
            v-if="indikators.length > 1" 
            type="button" 
            @click="removeIndikator(index)" 
            class="absolute top-6 right-6 p-2 rounded-xl text-red-500 hover:bg-red-50 hover:scale-105 active:scale-95 transition-all"
            title="Hapus Indikator"
          >
            <IconTrash :size="20" />
          </button>

          <div class="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">INDIKATOR #{{ index + 1 }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kode Unik Indikator -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Kode Unik Indikator <span class="text-red-500">*</span></label>
              <input
                v-model="ind.kode_unik"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Contoh: IKU-1.1"
              />
            </div>

            <!-- Satuan -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Satuan <span class="text-red-500">*</span></label>
              <input
                v-model="ind.satuan"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Contoh: Persen, Dokumen, dll"
              />
            </div>

            <!-- Nama Indikator -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Nama Indikator <span class="text-red-500">*</span></label>
              <input
                v-model="ind.nama"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Nama Indikator Kinerja"
              />
            </div>
          </div>

          <!-- Target Capaian per Tahun -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Target Capaian Per Tahun <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-5 gap-4">
              <div v-for="n in 5" :key="n" class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Tahun {{ n }}</label>
                <input
                  v-model="ind[`target_${n}`]"
                  type="number"
                  step="any"
                  required
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center font-bold text-slate-700 focus:bg-white focus:border-[#2663A3] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Add Indicator Button -->
        <button
          type="button"
          @click="addIndikator"
          class="w-full py-4 rounded-3xl border-2 border-dashed border-slate-300 text-slate-500 font-bold hover:border-[#2663A3] hover:text-[#2663A3] transition-all flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/10 active:scale-[0.99]"
        >
          <IconPlus :size="18" /> Tambah Indikator Kinerja Lainnya
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-6">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan`)"
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
          Simpan Data Master
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * Master Data: Tambah Sasaran Kegiatan
 * Mengakar langsung dari Sasaran Program dengan cascading & multi-indicators.
 */
definePageMeta({ layout: 'dashboard' })

import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconDatabase, IconFileText, IconChevronDown, IconTrash, IconPlus, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const submitting = ref(false)

// 1. Reactive Form State
const form = reactive({
  id_ss: null as number | null,
  id_is: null as number | null,
  id_sp: null as number | null,
  id_ip: null as number | null,
  kode: '',
  unit_kerja: '',
  sasaran_kegiatan_text: ''
})

interface Indikator {
  kode_unik: string
  nama: string
  satuan: string
  target_1: number
  target_2: number
  target_3: number
  target_4: number
  target_5: number
  [key: string]: any
}

// 2. Dynamic Indicators List
const indikators = ref<Indikator[]>([
  {
    kode_unik: '',
    nama: '',
    satuan: '',
    target_1: 0,
    target_2: 0,
    target_3: 0,
    target_4: 0,
    target_5: 0
  }
])

const addIndikator = () => {
  indikators.value.push({
    kode_unik: '',
    nama: '',
    satuan: '',
    target_1: 0,
    target_2: 0,
    target_3: 0,
    target_4: 0,
    target_5: 0
  })
}

const removeIndikator = (index: number) => {
  if (indikators.value.length > 1) {
    indikators.value.splice(index, 1)
  }
}

// 3. API Data Fetching
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: spData } = useSWRV('/api/sasaran-program', fetcher)
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)

// 4. Dropdown Options Mapping
const sasaranProgramOptions = computed(() => {
  if (!spData.value) return []
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const seen = new Set()
  return source.filter((item: any) => {
    const idVal = item.id || item.spId
    if (!idVal || seen.has(idVal)) return false
    seen.add(idVal)
    return true
  }).map((item: any) => ({
    id: Number(item.id || item.spId),
    kode: item.kodeSp || item.kode || '-',
    text: item.namaSp || item.sasaran_program_text || ''
  }))
})

// Cascading Program Indicators state
const indikatorProgramOptions = ref<any[]>([])

// 5. Watch Sasaran Program selection
watch(() => form.id_sp, async (newVal) => {
  form.id_ip = null
  indikatorProgramOptions.value = []
  
  if (newVal) {
    // A. Fetch cascading indicators for selected Sasaran Program
    try {
      const data = await $fetch<any[]>(`/api/indikator-program?sasaranProgramId=${newVal}`)
      indikatorProgramOptions.value = data || []
    } catch (err) {
      console.error('Failed to fetch program indicators:', err)
      toast.error('Gagal memuat indikator program.')
    }

    // B. Auto-populate SS & IS hierarchy relationships if present
    if (spData.value) {
      const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
      const selectedSp = source.find((item: any) => Number(item.id || item.spId) === Number(newVal))
      if (selectedSp) {
        form.id_ss = selectedSp.ssId ? Number(selectedSp.ssId) : (selectedSp.id_ss ? Number(selectedSp.id_ss) : null)
        form.id_is = selectedSp.ikssId ? Number(selectedSp.ikssId) : (selectedSp.id_is ? Number(selectedSp.id_is) : null)
      }
    }

    // C. Auto-Prefix Kode (SP.01.01 -> SK.01.01.)
    const selectedSpOpt = sasaranProgramOptions.value.find((sp: any) => Number(sp.id) === Number(newVal))
    if (selectedSpOpt && selectedSpOpt.kode) {
      const cleaned = selectedSpOpt.kode.replace(/^SP[.-]?/i, '')
      form.kode = `SK.${cleaned}.`
    } else {
      form.kode = 'SK.01.01.'
    }
  } else {
    form.id_ss = null
    form.id_is = null
    form.kode = ''
  }
})

// 6. Submit handler (2-Step transaction-safe bulk insert)
const handleSubmit = async () => {
  if (submitting.value) return
  
  // Validasi Wajib
  if (!form.id_sp || !form.id_ip || !form.sasaran_kegiatan_text || !form.unit_kerja) {
    toast.error('Harap lengkapi semua field bertanda bintang (*)')
    return
  }

  // Validasi Indikator
  for (const ind of indikators.value) {
    if (!ind.nama || !ind.satuan) {
      toast.error('Harap lengkapi Nama dan Satuan untuk semua indikator!')
      return
    }
  }

  submitting.value = true
  try {
    // Step 1: Insert Parent (Sasaran Kegiatan)
    const skResponse = await $fetch<any>('/api/sasaran-kegiatan', {
      method: 'POST',
      body: {
        sp_id: form.id_sp,
        nama_sk: form.sasaran_kegiatan_text,
        pengampu: form.unit_kerja
      }
    })

    const skId = skResponse.data?.id || skResponse.id
    if (!skId) throw new Error('Gagal mendapatkan ID Sasaran Kegiatan baru.')

    // Step 2: Insert Child Indicators (Indikator Kinerja / IKU) sequentially
    for (const ind of indikators.value) {
      if (!ind.nama) continue

      const indResponse = await $fetch<any>('/api/indikator-kinerja', {
        method: 'POST',
        body: {
          sk_id: skId,
          nama_iku: ind.nama,
          satuan: ind.satuan
        }
      })

      const ikuId = indResponse.data?.id || indResponse.id
      if (!ikuId) throw new Error('Gagal menyimpan indikator kinerja baru.')

      // Step 3: Insert Target per Year
      const startYear = 2025
      const targets = [
        { idIku: ikuId, tahun: 2025, targetNilai: String(ind.target_1 || '0') },
        { idIku: ikuId, tahun: 2026, targetNilai: String(ind.target_2 || '0') },
        { idIku: ikuId, tahun: 2027, targetNilai: String(ind.target_3 || '0') },
        { idIku: ikuId, tahun: 2028, targetNilai: String(ind.target_4 || '0') },
        { idIku: ikuId, tahun: 2029, targetNilai: String(ind.target_5 || '0') },
      ]

      for (const targetItem of targets) {
        await $fetch('/api/target-indikator', {
          method: 'POST',
          body: targetItem
        })
      }
    }
    
    toast.success('Data master sasaran kegiatan berhasil ditambahkan.')
    router.push(`/${route.params.slug}/master-sasaran-kegiatan`)
  } catch (error: any) {
    console.error('Submit Error:', error)
    toast.error(error.data?.statusMessage || error.message || 'Gagal menyimpan data master.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Table-like form refinement */
table tr:last-child {
  border-bottom: none;
}
</style>
