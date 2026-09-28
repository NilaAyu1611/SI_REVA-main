<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Detail Capaian Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">Ringkasan hasil pemantauan dan evaluasi kinerja operasional.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan`"
          class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconArrowLeft :size="18" /> Kembali
        </NuxtLink>
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan/edit?id=${id}`"
          class="px-6 py-3 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 flex items-center gap-2 active:scale-95"
        >
          <IconPencil :size="18" /> Edit Laporan
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-slate-100 border-t-[#2663A3] rounded-full animate-spin"></div>
      <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Detail Laporan...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Achievement Summary Card -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Persentase Capaian</p>
          <div class="flex items-baseline gap-2">
            <span class="text-5xl font-black text-slate-900">{{ calculateCapaian() }}%</span>
            <span :class="getStatusColor()" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
              {{ getStatusLabel() }}
            </span>
          </div>
        </div>
        <div class="w-1/3 h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-1000" 
            :class="getProgressColor()"
            :style="{ width: Math.min(calculateCapaian(), 100) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Detail Table -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Informasi Kinerja</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Sasaran Kegiatan</td>
              <td class="px-8 py-5 text-slate-800 font-medium">{{ record.sasaranText }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Indikator Kinerja</td>
              <td class="px-8 py-5 text-slate-800 font-medium">{{ record.indikatorNama }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Target (Kamus)</td>
              <td class="px-8 py-5">
                <span class="text-lg font-black text-slate-700">{{ record.targetValue }}</span>
                <span class="text-xs font-bold text-slate-400 uppercase ml-2">{{ record.satuan }}</span>
              </td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Realisasi</td>
              <td class="px-8 py-5">
                <span class="text-lg font-black text-[#2663A3]">{{ record.realisasi }}</span>
                <span class="text-xs font-bold text-slate-400 uppercase ml-2">{{ record.satuan }}</span>
              </td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">Indikator KIK</td>
              <td class="px-8 py-5 text-slate-600 italic">{{ record.kikNama || 'Tidak Ada KIK' }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">Realisasi KIK</td>
              <td class="px-8 py-5">
                <span v-if="record.kikId" class="text-lg font-black text-slate-700">{{ record.realisasiKik }}</span>
                <span v-else class="text-slate-400">-</span>
              </td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">Analisa Pencapaian</td>
              <td class="px-8 py-8">
                <div class="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-slate-700 leading-relaxed italic">
                  "{{ record.analisaPencapaian }}"
                </div>
              </td>
            </tr>
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">Analisa Permasalahan</td>
              <td class="px-8 py-8">
                <div class="p-6 bg-amber-50/50 border border-amber-100 rounded-2xl text-slate-700 leading-relaxed italic">
                  "{{ record.analisaPermasalahan }}"
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconChartBar, IconFileText, IconArrowLeft, IconPencil } from '@tabler/icons-vue'

const route = useRoute()
const id = route.query.id
const loading = ref(true)
const record = ref<any>({})

onMounted(async () => {
  if (!id) return
  try {
    const data = await $fetch<any>(`/api/pemantauan-kegiatan/${id}`)
    record.value = data
  } catch (error) {
    console.error('Error fetching:', error)
  } finally {
    loading.value = false
  }
})

function calculateCapaian() {
  if (!record.value.targetValue) return 0
  return Math.round((record.value.realisasi / record.value.targetValue) * 100)
}

function getStatusLabel() {
  const c = calculateCapaian()
  if (c >= 100) return 'Tuntas'
  if (c >= 80) return 'Baik'
  if (c >= 50) return 'Cukup'
  return 'Kurang'
}

function getStatusColor() {
  const c = calculateCapaian()
  if (c >= 100) return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (c >= 80) return 'bg-blue-50 text-blue-600 border-blue-100'
  if (c >= 50) return 'bg-amber-50 text-amber-600 border-amber-100'
  return 'bg-red-50 text-red-600 border-red-100'
}

function getProgressColor() {
  const c = calculateCapaian()
  if (c >= 100) return 'bg-emerald-500'
  if (c >= 80) return 'bg-blue-500'
  if (c >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}
</script>
