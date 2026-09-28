<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconDatabase :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Tambah Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Formulir kustomisasi master data sasaran program (Standardized).
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
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Data Sasaran Program</h2>
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
                  placeholder="Contoh: SP.01"
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
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
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
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
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



            <!-- 4. Indikator Strategis -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Indikator Strategis <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_is"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                    :disabled="!form.id_ss"
                  >
                    <option :value="null" disabled>-- Pilih Indikator Strategis --</option>
                    <option v-for="is in indikatorStrategisOptions" :key="is.id" :value="is.id">
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
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all min-h-[100px]"
                  placeholder="Masukkan deskripsi sasaran program..."
                ></textarea>
              </td>
            </tr>

            <!-- 6. Indikator Kinerja (Dinamis) -->
            <template v-for="(ind, index) in form.indikator_kinerja" :key="index">
              <tr class="border-b border-slate-100 bg-slate-50/30">
                <td class="w-1/4 px-8 py-5 font-black text-[#2663A3] text-xs uppercase tracking-widest align-top pt-8">
                  Indikator #{{ index + 1 }}
                </td>
                <td class="px-8 py-8 space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Kode Unik Indikator -->
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kode Unik Indikator <span class="text-red-500">*</span></label>
                      <input
                        v-model="ind.kode_indikator"
                        type="text"
                        required
                        class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                        placeholder="Contoh: IKP-1.1"
                      />
                    </div>
                    <!-- Hapus Button (Right Aligned in grid) -->
                    <div v-if="form.indikator_kinerja.length > 1" class="flex justify-end pt-6">
                      <button @click="removeIndikator(index)" type="button" class="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors" title="Hapus Indikator">
                        <IconTrash :size="18" />
                      </button>
                    </div>
                  </div>

                  <!-- Nama Indikator -->
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Indikator <span class="text-red-500">*</span></label>
                    <input
                      v-model="ind.nama_indikator"
                      type="text"
                      required
                      class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                      placeholder="Nama Indikator Kinerja"
                    />
                  </div>

                  <!-- Satuan -->
                  <div class="w-full md:w-1/3 space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Satuan <span class="text-red-500">*</span></label>
                    <input
                      v-model="ind.satuan"
                      type="text"
                      required
                      class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                      placeholder="Contoh: Persen, Dokumen, dll"
                    />
                  </div>

                  <!-- Target Capaian (Tahun 1 - 5) -->
                  <div class="space-y-4 pt-4 border-t border-slate-100">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-[#2663A3]">Target Capaian Per Tahun</label>
                    <div class="grid grid-cols-5 gap-3">
                      <div v-for="tahunIdx in 5" :key="tahunIdx" class="space-y-2">
                        <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center block">Thn {{ tahunIdx }}</label>
                        <input
                          v-model="ind.target_capaian[tahunIdx-1]"
                          type="text"
                          required
                          class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center font-bold text-slate-700 focus:bg-white focus:border-[#2663A3] transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Tombol Tambah Indikator -->
            <tr class="border-b border-slate-100 bg-slate-50/10">
              <td class="w-1/4 px-8 py-5"></td>
              <td class="px-8 py-5">
                <button
                  type="button"
                  @click="addIndikator"
                  class="px-5 py-2.5 border-2 border-dashed border-slate-300 text-slate-500 hover:text-[#2663A3] hover:border-[#2663A3] hover:bg-blue-50/30 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                >
                  <IconPlus :size="16" stroke-width="2.5" />
                  Tambah Indikator Kinerja Lainnya
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-program`)"
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
definePageMeta({ layout: 'dashboard' })

import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconDatabase, IconFileText, IconChevronDown, IconTrash, IconPlus, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useToast } from '#imports'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: ssData } = useSWRV('/api/sasaran-strategis', fetcher)

// 1. Reactive State Definition
const form = reactive({
  id_ss: null as number | null,
  id_is: null as number | null,
  kode: '',
  unit_kerja: '',
  sasaran_program_text: '',
  indikator_kinerja: [
    {
      kode_indikator: '',
      nama_indikator: '',
      satuan: '',
      target_capaian: ['', '', '', '', '']
    }
  ]
})

// 2. Options Mapping for Parent Dropdown
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

// 3. Dynamic Cascading Dropdown Options
const indikatorStrategisOptions = ref<any[]>([])

watch(() => form.id_ss, async (newSsId) => {
  form.id_is = null
  indikatorStrategisOptions.value = []
  
  if (newSsId) {
    // A. Cascading Dropdown Fetch from Table Indikator Sasaran Strategis
    try {
      const data = await $fetch<any[]>(`/api/indikator-strategis?sasaranStrategisId=${newSsId}`)
      indikatorStrategisOptions.value = data || []
    } catch (err) {
      console.error('Failed to fetch indicators:', err)
      toast.error('Gagal memuat indikator strategis untuk sasaran terpilih.')
    }

    // B. Auto-Prefix Kode Logic
    const selectedSs = sasaranStrategisOptions.value.find((ss: any) => Number(ss.id) === Number(newSsId))
    if (selectedSs && selectedSs.kode) {
      const cleaned = selectedSs.kode.replace(/^SS[.-]?/i, '')
      form.kode = `SP.${cleaned}.`
    } else {
      form.kode = 'SP.01.'
    }
  } else {
    form.kode = ''
  }
})

// 4. Dynamic Form Add/Remove Indicators
function addIndikator() {
  form.indikator_kinerja.push({
    kode_indikator: '',
    nama_indikator: '',
    satuan: '',
    target_capaian: ['', '', '', '', '']
  })
}

function removeIndikator(index: number) {
  if (form.indikator_kinerja.length > 1) {
    form.indikator_kinerja.splice(index, 1)
  }
}

// 5. Submit (2-Step / 3-Step Dynamic persist)
const handleSubmit = async () => {
  if (submitting.value) return
  
  if (!form.id_ss || !form.id_is || !form.unit_kerja || !form.sasaran_program_text) {
    toast.error('Harap lengkapi seluruh field wajib (*)')
    return
  }

  submitting.value = true
  try {
    // Step 1: Insert Parent (Sasaran Program)
    const spResponse = await $fetch<any>('/api/sasaran-program', {
      method: 'POST',
      body: {
        ss_id: form.id_ss,
        nama_sp: form.sasaran_program_text,
        pengampu: form.unit_kerja
      }
    })

    const spId = spResponse.data?.id || spResponse.id
    if (!spId) throw new Error('Gagal mendapatkan ID Sasaran Program baru.')

    // Step 2: Bulk Insert Program Indicators
    const indicatorsToInsert = form.indikator_kinerja
      .filter(ind => ind.nama_indikator)
      .map(ind => ({
        sasaranProgramId: spId,
        kode: ind.kode_indikator,
        nama: ind.nama_indikator,
        satuan: ind.satuan,
        target_capaian: ind.target_capaian // Keep for next step
      }))

    if (indicatorsToInsert.length > 0) {
      // Remove target_capaian before sending to API
      const body = indicatorsToInsert.map(({ target_capaian, ...rest }) => rest)
      
      const indResponse = await $fetch<any[]>('/api/indikator-program', {
        method: 'POST',
        body
      })

      // Step 3: Insert Program Targets per Year
      const startYear = 2025
      for (let i = 0; i < indResponse.length; i++) {
        const newInd = indResponse[i]
        const originalTargets = indicatorsToInsert[i]?.target_capaian

        if (!originalTargets) continue

        const targets = originalTargets.map((val, tIdx) => ({
          indikatorId: newInd.id,
          tahun: startYear + tIdx,
          target: val || '0'
        }))

        for (const targetItem of targets) {
          await $fetch('/api/target-indikator-program', {
            method: 'POST',
            body: targetItem
          })
        }
      }
    }
    
    toast.success('Data master sasaran program berhasil disimpan.')
    router.push(`/${route.params.slug}/master-sasaran-program`)
  } catch (error: any) {
    console.error('Error:', error)
    toast.error(error.data?.statusMessage || error.message || 'Gagal menyimpan data master.')
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
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(51 65 85);
  transition: all 0.2s;
}
.field-input:focus {
  outline: none;
  border-color: #2663A3;
  box-shadow: 0 0 0 4px rgb(219 234 254);
}
</style>
