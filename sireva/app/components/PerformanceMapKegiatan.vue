<template>
  <div v-if="loading" class="w-full py-10 px-4 flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="flex flex-col items-center space-y-4 w-full max-w-2xl">
      <div class="h-20 w-full bg-gray-300 rounded-2xl animate-pulse" />
      <div class="w-1 h-10 bg-gray-300" />
      <div class="w-full h-64 bg-gray-200 rounded-xl animate-pulse" />
      <div class="w-1 h-10 bg-gray-300" />
      <div class="h-12 w-60 bg-gray-300 rounded-2xl animate-pulse" />
    </div>
  </div>
  <div v-else-if="!allDiagrams.length" class="w-full py-10 px-4 flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="text-center text-gray-500 py-20">Belum ada data Sasaran Kegiatan</div>
  </div>
  <div v-else class="w-full py-10 px-4 space-y-10">
    <div
      v-for="item in allDiagrams"
      :key="`${item.sk.id}-${item.iku.id}`"
      class="flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100 py-10 px-4"
    >
      <div class="flex flex-col items-center w-full max-w-3xl">
        <!-- Top Node: Sasaran Kegiatan -->
        <div class="bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-600/20 px-8 py-4 w-full max-w-2xl text-center z-10">
          <h2 class="text-xl md:text-2xl font-bold tracking-wide">{{ item.sk.sasaranText }}</h2>
        </div>
        <div class="w-1 h-10 bg-slate-300"></div>

        <!-- Middle Row -->
        <div class="flex flex-col md:flex-row items-center md:items-stretch relative w-full justify-center">
          <!-- Left Panel: Capaian Utama -->
          <div class="flex items-stretch bg-white rounded-xl border-2 border-amber-400 shadow-xl overflow-hidden relative z-10 w-full max-w-sm md:mr-16 mb-8 md:mb-0 hover:shadow-2xl transition-shadow duration-300">
            <div class="bg-amber-400 p-4 flex items-center justify-center text-amber-900 w-20 shrink-0">
              <IconTarget :size="40" class="drop-shadow-sm" />
            </div>
            <div class="p-5 flex-1 flex flex-col justify-center">
              <p class="text-center font-semibold text-slate-800 mb-1 leading-snug">{{ item.iku.namaIku }}</p>
              <p class="text-center text-xs font-medium text-slate-500 mb-4">
                Satuan: {{ item.iku.satuanPengukuran || '-' }}
              </p>
              <div class="bg-blue-50/80 rounded-xl p-4 text-center mb-4 border border-blue-100">
                <h4 class="text-xs font-bold text-blue-700/80 uppercase tracking-wider mb-1">Capaian {{ CURRENT_YEAR }}</h4>
                <h1 class="text-4xl font-extrabold text-blue-700">{{ item.metrics.capaian }}</h1>
              </div>
              <div class="flex justify-between text-sm bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div class="text-center w-1/2 px-2 border-r border-slate-200">
                  <div class="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Target</div>
                  <div class="text-slate-500 font-semibold">{{ item.metrics.target }}</div>
                </div>
                <div class="text-center w-1/2 px-2">
                  <div class="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Realisasi</div>
                  <div class="text-slate-500 font-semibold">{{ item.metrics.realisasi }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connectors (Desktop) -->
          <div class="hidden md:block absolute left-[calc(50%-12rem)] top-0 bottom-0 w-16 z-0">
            <div class="absolute top-1/2 left-0 w-8 h-0.5 bg-slate-300 -translate-y-1/2"></div>
            <div class="absolute top-[16%] bottom-[16%] left-8 w-0.5 bg-slate-300"></div>
            <div class="absolute top-[16%] left-8 w-8 h-0.5 bg-slate-300"></div>
            <div class="absolute top-1/2 left-8 w-8 h-0.5 bg-slate-300 -translate-y-1/2"></div>
            <div class="absolute bottom-[16%] left-8 w-8 h-0.5 bg-slate-300"></div>
            <div class="absolute top-1/2 left-0 w-3 h-3 bg-slate-400 rounded-full -translate-y-1/2 -ml-1.5"></div>
          </div>
          <div class="md:hidden w-0.5 h-8 bg-slate-300 mb-2"></div>

          <!-- Right Panel -->
          <div class="flex flex-col justify-between z-10 w-full max-w-xs gap-3 relative py-2">
            <!-- Pertumbuhan -->
            <div class="flex bg-white rounded-xl border border-amber-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <div class="p-4 flex-1 flex flex-col justify-center pl-5">
                <h5 class="text-sm font-bold text-emerald-600 mb-1">Pertumbuhan {{ item.iku.satuanPengukuran }}</h5>
                <div class="flex gap-3 text-xs font-medium text-slate-600">
                  <span>Capaian: <span class="font-bold text-slate-800">{{ item.metrics.capaian }}</span></span>
                  <span class="text-slate-300">|</span>
                  <span>Realisasi: <span class="font-bold text-slate-800">{{ item.metrics.realisasi }}</span></span>
                </div>
              </div>
              <div class="bg-amber-100 p-4 flex items-center justify-center text-amber-600 border-l border-amber-200 shrink-0">
                <IconTrendingUp :size="24" />
              </div>
            </div>
            <!-- Capaian RPJMD -->
            <div class="flex bg-white rounded-xl border border-amber-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div class="p-4 flex-1 flex flex-col justify-center pl-5">
                <p class="text-xs font-semibold text-slate-600 mb-1">Capaian thd. target akhir RPJMD</p>
                <p class="text-lg font-extrabold text-blue-600">{{ item.metrics.capaian }}</p>
              </div>
              <div class="bg-amber-100 p-4 flex items-center justify-center text-amber-600 border-l border-amber-200 shrink-0">
                <IconPercentage :size="24" />
              </div>
            </div>
            <!-- Rata-rata Nasional -->
            <div class="flex rounded-xl border border-amber-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden relative bg-slate-50">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
              <div class="p-4 flex-1 flex flex-col justify-center pl-5">
                <p class="text-xs font-medium text-slate-500 leading-relaxed">Belum ada data dari rata-rata nasional</p>
              </div>
              <div class="bg-slate-200 p-4 flex items-center justify-center text-slate-500 border-l border-slate-300 shrink-0">
                <IconChartBar :size="24" />
              </div>
            </div>
          </div>
        </div>

        <div class="w-1 h-10 bg-slate-300 mt-4 md:mt-0"></div>
        <!-- Bottom Node -->
        <div class="bg-violet-700 text-white rounded-2xl shadow-lg shadow-violet-700/20 px-8 py-3 text-center z-10">
          <h3 class="text-base font-bold tracking-wide">{{ item.sk.kode || 'SK' }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useSWRV from 'swrv'
import { IconTarget, IconChartBar, IconTrendingUp, IconPercentage } from '@tabler/icons-vue'

const CURRENT_YEAR = new Date().getFullYear()
const fetcher = (url: string) => fetch(url).then(res => res.json())

const { data: skRes, isValidating: skLoading } = useSWRV<any[]>('/api/sasaran-kegiatan', fetcher)
const { data: ikuRes, isValidating: ikuLoading } = useSWRV<any[]>('/api/indikator-kinerja', fetcher)
const { data: targetRes, isValidating: targetLoading } = useSWRV<any[]>('/api/target-indikator', fetcher)

const loading = computed(() => skLoading.value || ikuLoading.value || targetLoading.value)

// Latest target per indikator id
const latestTargetByIku = computed(() => {
  const result: Record<number, any> = {}
  for (const t of (targetRes.value ?? [])) {
    const id = t.indikatorId
    if (!result[id] || new Date(t.createdAt) > new Date(result[id].createdAt)) {
      result[id] = t
    }
  }
  return result
})

// IKUs grouped by sasaran kegiatan id
const ikuBySk = computed(() => {
  const result: Record<number, any[]> = {}
  for (const iku of (ikuRes.value ?? [])) {
    if (iku.idSk == null) continue
    ;(result[iku.idSk] ??= []).push(iku)
  }
  return result
})

function getMetrics(ikuId: number) {
  const t = latestTargetByIku.value[ikuId]
  if (!t) return { target: '-', realisasi: '-', capaian: '-%' }
  const target = parseFloat(t.target)
  const realisasi = parseFloat(t.realisasi)
  return {
    target: t.target ?? '-',
    realisasi: t.realisasi ?? '-',
    capaian: !isNaN(target) && !isNaN(realisasi) && target > 0
      ? ((realisasi / target) * 100).toFixed(1) + '%'
      : '-%',
  }
}

// One diagram per (sasaran kegiatan × iku)
const allDiagrams = computed(() => {
  const result: { sk: any; iku: any; metrics: any }[] = []
  for (const sk of (skRes.value ?? [])) {
    const ikus = ikuBySk.value[sk.id] ?? []
    if (!ikus.length) continue
    for (const iku of ikus) {
      result.push({ sk, iku, metrics: getMetrics(iku.id) })
    }
  }
  return result
})
</script>
