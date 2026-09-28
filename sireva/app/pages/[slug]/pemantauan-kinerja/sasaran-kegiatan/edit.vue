<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Pemantauan: Edit Capaian Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui laporan realisasi kinerja dan analisa pencapaian operasional.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <div v-if="loadingRecord" class="p-20 text-center flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-slate-100 border-t-[#2663A3] rounded-full animate-spin"></div>
      <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Data Laporan...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Perubahan Capaian</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Sasaran Kegiatan (Locked in Edit) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Sasaran Kegiatan</td>
              <td class="px-8 py-5">
                <p class="font-bold text-slate-800">{{ skName || '-' }}</p>
              </td>
            </tr>

            <!-- 2. Indikator Kinerja (Locked in Edit) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Indikator Kinerja</td>
              <td class="px-8 py-5">
                <p class="font-bold text-slate-800">{{ indikatorName || '-' }}</p>
              </td>
            </tr>

            <!-- 3. Indikator KIK -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">3. Indikator KIK</td>
              <td class="px-8 py-5">
                <p class="font-bold text-slate-600">{{ kikName || 'Tidak Ada KIK' }}</p>
              </td>
            </tr>

            <!-- 4. Target (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Target (Kamus Master)</td>
              <td class="px-8 py-5 text-[#2663A3] font-black text-lg flex items-center gap-2">
                {{ targetValue || 0 }}
                <span class="text-[10px] font-bold text-slate-400 uppercase">Satuan: {{ satuanValue || '-' }}</span>
              </td>
            </tr>

            <!-- 5. Realisasi -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Realisasi <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasi"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-[#2663A3] focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- 6. Analisa Pencapaian -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">6. Analisa Pencapaian <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPencapaian"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.analisaPencapaian.length < 100 ? 'text-red-500' : 'text-emerald-500'" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ form.analisaPencapaian.length }} / 200 Karakter (Min: 100)
                  </span>
                </div>
              </td>
            </tr>

            <!-- 7. Realisasi KIK -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">7. Realisasi KIK</td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasiKik"
                  :disabled="!hasKik"
                  type="text"
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                />
              </td>
            </tr>

            <!-- 8. Analisa Permasalahan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">8. Analisa Permasalahan <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPermasalahan"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.analisaPermasalahan.length < 100 ? 'text-red-500' : 'text-emerald-500'" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ form.analisaPermasalahan.length }} / 200 Karakter (Min: 100)
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
          Perbarui Laporan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconChartBar, IconFileText, IconX, IconDeviceFloppy } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const loadingRecord = ref(true)

const id = route.query.id
const form = ref({
  realisasi: '',
  realisasiKik: '',
  analisaPencapaian: '',
  analisaPermasalahan: ''
})

// Mock display data (normally fetched from API)
const skName = ref('')
const indikatorName = ref('')
const kikName = ref('')
const targetValue = ref(0)
const satuanValue = ref('')
const hasKik = ref(false)

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan`)
    return
  }
  
  try {
    const data = await $fetch<any>(`/api/pemantauan-kegiatan/${id}`)
    if (data) {
      form.value.realisasi = data.realisasi
      form.value.realisasiKik = data.realisasiKik || ''
      form.value.analisaPencapaian = data.analisaPencapaian || ''
      form.value.analisaPermasalahan = data.analisaPermasalahan || ''
      
      skName.value = data.sasaranText
      indikatorName.value = data.indikatorNama
      kikName.value = data.kikNama
      targetValue.value = data.targetValue
      satuanValue.value = data.satuan
      hasKik.value = !!data.kikId
    }
  } catch (error) {
    console.error('Error fetching record:', error)
  } finally {
    loadingRecord.value = false
  }
})

const isValid = computed(() => {
  return form.value.analisaPencapaian.length >= 100 && 
         form.value.analisaPermasalahan.length >= 100 &&
         form.value.realisasi
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch(`/api/pemantauan-kegiatan/${id}`, { method: 'PUT', body: form.value })
    router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    submitting.value = false
  }
}
</script>
