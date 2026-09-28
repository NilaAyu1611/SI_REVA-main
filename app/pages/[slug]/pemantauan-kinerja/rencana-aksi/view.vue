<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Detail Pemantauan Rencana Aksi</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">Ringkasan laporan progres aktivitas operasional.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`"
          class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconArrowLeft :size="18" /> Kembali
        </NuxtLink>
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/rencana-aksi/edit?id=${id}`"
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
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Informasi Aktivitas</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Unit Kerja</td>
              <td class="px-8 py-5 text-slate-800 font-medium">{{ record.unitKerjaNama }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Sasaran Kegiatan</td>
              <td class="px-8 py-5 text-slate-800 font-medium">{{ record.sasaranText }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Indikator Kinerja</td>
              <td class="px-8 py-5 text-slate-800 font-medium">{{ record.indikatorNama }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Rencana Kegiatan</td>
              <td class="px-8 py-5">
                <span class="text-lg font-black text-[#2663A3] uppercase tracking-tight">{{ record.rencanaAksiNama }}</span>
              </td>
            </tr>
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Keterangan Progres</td>
              <td class="px-8 py-5">
                <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-medium">
                  "{{ record.keteranganRencanaAksi || record.keterangan || '-' }}"
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
    const data = await $fetch<any>(`/api/pemantauan-rencana-aksi?id=${id}`)
    record.value = data
  } catch (error) {
    console.error('Error fetching:', error)
  } finally {
    loading.value = false
  }
})
</script>
