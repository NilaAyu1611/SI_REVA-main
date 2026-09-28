<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconDatabase :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Tambah Sasaran Strategis</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Formulir kustomisasi master data sasaran strategis (Tabel Form Style).
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <form @submit.prevent="submitData" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Table Form Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Data Sasaran Strategis</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Kode Sasaran -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Kode Sasaran <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode_sasaran"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Max 10 digit"
                />
              </td>
            </tr>

            <!-- 3. Sasaran Strategis -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Strategis <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.nama_sasaran"
                  type="text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Masukkan Nama Sasaran Strategis"
                />
              </td>
            </tr>

            <!-- 4. Indikator Kinerja (Dinamis) -->
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
                        placeholder="Contoh: IKU-1.1"
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

                  <!-- Row 2: Satuan -->
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

                  <!-- Row 3: Target Capaian (Tahun 1 - 5) -->
                  <div class="space-y-4 pt-4 border-t border-slate-100">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-blue-600">Target Capaian Per Tahun</label>
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
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50"></td>
              <td class="px-8 py-5">
                <button @click="addIndikator" type="button" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-[#2663A3] rounded-xl font-bold text-xs hover:bg-blue-100 transition-all border-2 border-blue-100 border-dashed">
                  <IconPlus :size="16" stroke-width="3" /> Tambah Indikator Kinerja Lainnya
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
          @click="router.push(`/${route.params.slug}/master-sasaran-strategis`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" /> Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-10 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconDatabase, IconFileText, IconTrash, IconPlus, IconX, IconDeviceFloppy, IconChevronDown
} from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)

// Data Fetching for Dropdown
const fetcher = (url: string) => fetch(url).then(r => r.json())

// 1. Reactive State Definition
const form = reactive({
  kode_sasaran: '',
  nama_sasaran: '',
  indikator_kinerja: [
    {
      kode_indikator: '',
      nama_indikator: '',
      satuan: '',
      target_capaian: ['', '', '', '', ''] 
    }
  ]
})

// 2. Fungsi Dinamis: Tambah Indikator
function addIndikator() {
  form.indikator_kinerja.push({
    kode_indikator: '',
    nama_indikator: '',
    satuan: '',
    target_capaian: ['', '', '', '', '']
  })
}

// 2. Fungsi Dinamis: Hapus Indikator
function removeIndikator(index: number) {
  if (form.indikator_kinerja.length > 1) {
    form.indikator_kinerja.splice(index, 1)
  }
}

// 4. Fungsi Submit API
const submitData = async () => {
  if (submitting.value) return
  submitting.value = true

  try {
    // Step 1: Insert Parent (Sasaran Strategis)
    const ssResponse = await $fetch<any>('/api/sasaran-strategis', {
      method: 'POST',
      body: {
        kode: form.kode_sasaran,
        sasaranText: form.nama_sasaran,
        tahun: '2026'
      }
    })

    const ssId = ssResponse.data?.id || ssResponse.id
    if (!ssId) throw new Error('Gagal mendapatkan ID Sasaran Strategis baru.')

    // Step 2: Bulk Insert Indicators
    const indicatorsToInsert = form.indikator_kinerja
      .filter(ind => ind.nama_indikator)
      .map(ind => ({
        sasaranStrategisId: ssId,
        kode: ind.kode_indikator,
        nama: ind.nama_indikator,
        satuan: ind.satuan,
        target_capaian: ind.target_capaian // Keep for next step
      }))

    if (indicatorsToInsert.length > 0) {
      // Remove target_capaian before sending to API
      const body = indicatorsToInsert.map(({ target_capaian, ...rest }) => rest)
      
      const indResponse = await $fetch<any[]>('/api/indikator-strategis', {
        method: 'POST',
        body
      })

      // Step 3: Insert Targets
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
          await $fetch('/api/target-indikator-strategis', {
            method: 'POST',
            body: targetItem
          })
        }
      }
    }

    alert('Data Berhasil Disimpan!')
    router.push(`/${route.params.slug}/master-sasaran-strategis`)
  } catch (error: any) {
    console.error('Submission Error:', error)
    const errorMsg = error.data?.statusMessage || error.message || 'Terjadi kesalahan internal.'
    alert(`Gagal: ${errorMsg}`)
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


<style scoped>
/* Table-like form refinement */
table tr:last-child {
  border-bottom: none;
}
</style>
