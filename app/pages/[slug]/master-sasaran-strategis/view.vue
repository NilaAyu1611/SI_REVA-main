<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
          <IconEye :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Detail Sasaran Strategis</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Informasi lengkap mengenai sasaran strategis dan indikator kinerjanya.
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          :to="`/${route.params.slug}/master-sasaran-strategis/edit?id=${id}${route.query.indId ? '&indId=' + route.query.indId : ''}`"
          class="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <IconPencil :size="18" /> Edit Data
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
      <div class="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <span class="font-bold text-sm tracking-widest uppercase">Memuat Detail...</span>
    </div>

    <div v-else-if="data" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Main Info Card -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3 text-slate-700 font-bold text-sm uppercase tracking-wider">
            <IconFileText :size="20" class="text-emerald-500" stroke-width="2.5" />
            Informasi Sasaran
          </div>
          <div class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
            ID: {{ data.id }}
          </div>
        </div>

        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Sasaran</label>
            <div class="text-lg font-bold text-slate-800">{{ data.kode || '-' }}</div>
          </div>
          <div class="col-span-full space-y-1.5 pt-4 border-t border-slate-50">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teks Sasaran Strategis</label>
            <div class="text-xl font-black text-[#2663A3] leading-relaxed">{{ data.sasaranText }}</div>
          </div>
        </div>
      </div>

      <!-- Indicators Section -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 px-4">
          <IconListCheck :size="20" class="text-emerald-500" />
          <h2 class="text-slate-800 font-black text-lg">Indikator Kinerja & Target</h2>
        </div>

        <div v-for="(ind, idx) in filteredIndikators" :key="ind.id" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-emerald-200">
          <div class="p-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
                    {{ Number(idx) + 1 }}
                  </span>
                  <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Indikator Kinerja</label>
                </div>
                <h3 class="text-lg font-bold text-slate-800 leading-tight pl-10">{{ ind.nama }}</h3>
              </div>
              <div class="flex flex-col items-end gap-1 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satuan</span>
                <span class="text-emerald-600 font-bold text-sm">{{ ind.satuan || '-' }}</span>
              </div>
            </div>

            <!-- Targets Row -->
            <div class="mt-8 pt-8 border-t border-slate-50">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block px-2">Target Capaian (5 Periode)</label>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div v-for="target in (ind.targets || [])" :key="target.tahun" class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 group hover:bg-white hover:border-emerald-200 transition-all">
                  <span class="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{{ target.tahun }}</span>
                  <span class="text-xl font-black text-slate-800 group-hover:text-emerald-600">{{ target.target }}</span>
                </div>
                <!-- Handle missing targets if any -->
                <div v-for="n in (5 - (ind.targets?.length || 0))" :key="'missing-'+n" class="p-4 bg-slate-50/30 rounded-2xl border border-slate-50 border-dashed flex flex-col items-center gap-1 opacity-40">
                  <span class="text-[10px] font-bold text-slate-300 tracking-tighter uppercase">-</span>
                  <span class="text-xl font-black text-slate-200">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
      <IconAlertCircle :size="48" stroke-width="1.5" />
      <div class="text-center">
        <h3 class="font-black text-slate-900">Data Tidak Ditemukan</h3>
        <p class="text-sm">Maaf, sasaran strategis dengan ID tersebut tidak tersedia.</p>
      </div>
      <button @click="router.back()" class="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
        Kembali ke Daftar
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-center pt-8">
      <button
        @click="router.push(`/${route.params.slug}/master-sasaran-strategis`)"
        class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
      >
        <IconArrowLeft :size="18" /> Kembali ke Daftar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconEye, IconFileText, IconPencil, IconListCheck, IconAlertCircle, IconArrowLeft 
} from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const id = Number(route.query.id)

const { data, error, pending } = useFetch(id ? `/api/sasaran-strategis/${id}` : null, { lazy: true, default: () => [] })

const loading = computed(() => pending.value && !data.value)

const filteredIndikators = computed(() => {
  if (!data.value || !data.value.indikatorStrategis) return []
  const indIdQuery = route.query.indId ? Number(route.query.indId) : null
  if (indIdQuery) {
    return data.value.indikatorStrategis.filter((ind: any) => Number(ind.id) === indIdQuery)
  }
  return data.value.indikatorStrategis
})
</script>

<style scoped>
@keyframes slide-in-from-bottom-4 {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-in {
  animation: slide-in-from-bottom-4 0.6s ease-out forwards;
}
</style>
