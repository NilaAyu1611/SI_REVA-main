<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconEye :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Detail Pemantauan: Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">Ringkasan capaian kinerja dan analisa program yang dilaporkan.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-program`"
          class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconArrowLeft :size="18" /> Kembali
        </NuxtLink>
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-program/edit?id=${id}`"
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
      <!-- Main Content Card -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
            <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Informasi Kinerja Program</h2>
          </div>
          <div :class="getProgressColorBg(calculateCapaian)" class="px-4 py-1.5 rounded-full border flex items-center gap-2">
            <div :class="getProgressColor(calculateCapaian)" class="w-2 h-2 rounded-full animate-pulse"></div>
            <span :class="getProgressColorText(calculateCapaian)" class="text-[10px] font-black uppercase tracking-widest">
              Capaian: {{ calculateCapaian }}%
            </span>
          </div>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Unit Kerja</td>
              <td class="px-8 py-5 text-slate-800 font-semibold">{{ record.unitKerjaNama }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Sasaran Program</td>
              <td class="px-8 py-5 text-slate-800 font-medium leading-relaxed">{{ record.sasaranText }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 border-r border-slate-100">Indikator Kinerja</td>
              <td class="px-8 py-5">
                <div class="flex flex-col gap-1">
                  <span class="text-[#2663A3] font-black text-lg leading-tight uppercase tracking-tight">{{ record.indikatorNama }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kode: {{ record.kode || '-' }}</span>
                </div>
              </td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic border-r border-slate-100">Indikator KIK</td>
              <td class="px-8 py-5 text-slate-600 font-medium">{{ record.kikNama || 'Tidak Ada KIK' }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 border-r border-slate-100">Target & Realisasi</td>
              <td class="px-8 py-5">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div class="space-y-1">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                    <p class="text-xl font-black text-slate-700">{{ record.targetValue }} <small class="text-[10px] text-slate-400 uppercase">{{ record.satuan }}</small></p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realisasi</p>
                    <p class="text-xl font-black text-[#2663A3]">{{ record.realisasi }}</p>
                  </div>
                  <div v-if="record.kikNama" class="space-y-1">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realisasi KIK</p>
                    <p class="text-xl font-black text-slate-700">{{ record.realisasiKik || 0 }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8 border-r border-slate-100">Analisa Pencapaian</td>
              <td class="px-8 py-8">
                <div class="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-slate-700 leading-relaxed font-medium">
                  "{{ record.analisaPencapaian }}"
                </div>
              </td>
            </tr>
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8 border-r border-slate-100">Analisa Permasalahan</td>
              <td class="px-8 py-8">
                <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium italic">
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

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconEye, IconArrowLeft, IconPencil, IconFileText } from '@tabler/icons-vue'

const route = useRoute()
const id = route.query.id
const loading = ref(true)
const record = ref<any>({})

onMounted(async () => {
  if (!id) return
  try {
    const data = await $fetch<any>(`/api/pemantauan-program/${id}`)
    record.value = data
  } catch (error) {
    console.error('Error fetching:', error)
  } finally {
    loading.value = false
  }
})

const calculateCapaian = computed(() => {
  if (!record.value.targetValue || record.value.targetValue === 0) return 0
  return Math.round((record.value.realisasi / record.value.targetValue) * 100)
})

function getProgressColor(percent: number) {
  if (percent >= 100) return 'bg-emerald-500'
  if (percent >= 80) return 'bg-blue-500'
  if (percent >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function getProgressColorBg(percent: number) {
  if (percent >= 100) return 'bg-emerald-50 border-emerald-100'
  if (percent >= 80) return 'bg-blue-50 border-blue-100'
  if (percent >= 50) return 'bg-amber-50 border-amber-100'
  return 'bg-red-50 border-red-100'
}

function getProgressColorText(percent: number) {
  if (percent >= 100) return 'text-emerald-700'
  if (percent >= 80) return 'text-blue-700'
  if (percent >= 50) return 'text-amber-700'
  return 'text-red-700'
}
</script>
