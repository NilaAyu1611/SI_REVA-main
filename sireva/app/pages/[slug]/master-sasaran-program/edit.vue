<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Edit Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data master sasaran program, hierarki cascading, dan target Renstra.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Data Master...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Table Form Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Edit Sasaran Program</h2>
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
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
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
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
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
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
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
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] min-h-[100px] transition-all"
                ></textarea>
              </td>
            </tr>

            <!-- 6. Indikator Kinerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">6. Indikator Kinerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode_iku"
                  type="text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Masukkan Indikator Kinerja Utama (IKU) Sasaran Program..."
                />
              </td>
            </tr>

            <!-- 7. Satuan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">7. Satuan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.satuan"
                  type="text"
                  required
                  class="w-full md:w-1/2 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- 8. Target Renstra -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">8. Target Renstra (5 Tahun) <span class="text-red-500">*</span></td>
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
          Simpan Perubahan Master
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPencil, IconFileText, IconChevronDown, IconTrash, IconPlus, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = route.query.id
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching } = useSWRV(
  id ? `/api/sasaran-program?id=${id}` : null,
  fetcher,
  { dedupingInterval: 0 }
)
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: ssData } = useSWRV('/api/sasaran-strategis', fetcher)

// 1. Standardized Form State
const form = ref<Record<string, any>>({
  id_ss: null as number | null,
  id_is: null as number | null,
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

// 2. Load Data — populate sekali saja
const initialized = ref(false)
watchEffect(() => {
  if (detail.value && !initialized.value) {
    const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
    if (item) {
      initialized.value = true
      form.value.id_ss = item.ssId || item.id_ss ? Number(item.ssId || item.id_ss) : null
      form.value.id_is = item.indikatorId ? Number(item.indikatorId) : null
      form.value.kode = item.kode || item.kodeSp || ''
      form.value.unit_kerja = item.unit_kerja || item.unitKerjaNama || ''
      form.value.kode_iku = item.kode_iku || item.kode_iku || ''
      form.value.sasaran_program_text = item.sasaran_program_text || item.namaSp || ''
      form.value.satuan = item.satuan || item.indikatorSatuan || ''
      form.value.target_1 = Number(item.target_1 || 0)
      form.value.target_2 = Number(item.target_2 || 0)
      form.value.target_3 = Number(item.target_3 || 0)
      form.value.target_4 = Number(item.target_4 || 0)
      form.value.target_5 = Number(item.target_5 || 0)
    }
  }
})

// 3. Options Mapping
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

const indikatorStrategisOptions = computed(() => {
  if (!form.value.id_ss || !ssData.value) return []
  const source = Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
  const seen = new Set()
  return source
    .filter((item: any) => Number(item.ssId) === Number(form.value.id_ss) && item.indikatorId)
    .filter((item: any) => {
      if (seen.has(item.indikatorId)) return false
      seen.add(item.indikatorId)
      return true
    })
    .map((item: any) => ({
      id: item.indikatorId,
      nama: item.indikatorNama
    }))
})

watchEffect(() => {
  if (indikatorStrategisOptions.value.length > 0 && !indikatorStrategisOptions.value.find(i => i.id === form.value.id_is)) {
    if (!fetching.value && form.value.id_is !== null) {
      form.value.id_is = null
    }
  }
})



const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const spId = Number(id)

    // 1. Update Sasaran Program (nama_sp & pengampu)
    const spRes = await $fetch<any>(`/api/sasaran-program/${spId}`, {
      method: 'PUT',
      body: {
        nama_sp: form.value.sasaran_program_text,
        pengampu: form.value.unit_kerja || null,
      }
    })
    if (spRes?.success === false) {
      toast.error(spRes.message || 'Gagal memperbarui sasaran program.')
      return
    }

    // 2. Update Indikator Program (kode_iku & satuan) jika ada
    if (form.value.id_is) {
      await $fetch('/api/indikator-program', {
        method: 'PUT',
        body: {
          id: form.value.id_is,
          kode: form.value.kode_iku || null,
          satuan: form.value.satuan || null,
        }
      })
    }

    toast.success('Data master sasaran program berhasil diperbarui.')
    router.push(`/${route.params.slug}/master-sasaran-program`)
  } catch (error: any) {
    console.error('Error:', error)
    toast.error(error?.data?.message || error?.message || 'Gagal menyimpan perubahan.')
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
