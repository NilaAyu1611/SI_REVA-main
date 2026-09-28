<template>
  <div v-if="loading" class="w-full py-10 px-4 flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="flex flex-col items-center space-y-4 w-full max-w-2xl">
      <div class="h-20 w-full bg-gray-300 rounded-2xl animate-pulse" />
      <div class="w-1 h-10 bg-gray-300" />
      <div class="w-full h-48 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  </div>
  <div v-else-if="!rows.length" class="w-full py-10 px-4 flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="text-center text-gray-500 py-20">Belum ada data Sasaran Program</div>
  </div>
  <div v-else class="w-full py-10 px-4 space-y-8">
    <div
      v-for="item in rows"
      :key="item.id"
      class="flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100 py-10 px-4"
    >
      <div class="flex flex-col items-center w-full max-w-3xl">
        <!-- Top Node: Sasaran Program -->
        <div class="bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 px-8 py-4 w-full max-w-2xl text-center z-10">
          <h2 class="text-xl md:text-2xl font-bold tracking-wide">{{ item.sasaranText }}</h2>
        </div>
        <div class="w-1 h-10 bg-slate-300"></div>

        <!-- Center Info Card -->
        <div class="flex items-stretch bg-white rounded-xl border-2 border-blue-300 shadow-xl overflow-hidden w-full max-w-sm hover:shadow-2xl transition-shadow duration-300">
          <div class="bg-blue-500 p-4 flex items-center justify-center text-white w-20 shrink-0">
            <IconBuildingCommunity :size="40" class="drop-shadow-sm" />
          </div>
          <div class="p-5 flex-1 flex flex-col justify-center gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Kerja</span>
              <span class="text-sm font-semibold text-slate-800">{{ formatUnitKerja(item.unitKerjaNames) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Kode</span>
              <span class="text-sm font-semibold text-blue-700">{{ item.kode || '-' }}</span>
            </div>
            <div class="mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 text-center text-xs text-slate-500 italic">
              Belum ada data indikator program
            </div>
          </div>
        </div>

        <div class="w-1 h-10 bg-slate-300"></div>
        <!-- Bottom Node -->
        <div class="bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-700/20 px-8 py-3 text-center z-10">
          <h3 class="text-base font-bold tracking-wide">{{ item.kode || 'SP' }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useSWRV from 'swrv'
import { IconBuildingCommunity } from '@tabler/icons-vue'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const { data, isValidating: loading } = useSWRV<any[]>('/api/sasaran-program', fetcher)

const rows = computed(() => data.value ?? [])

function formatUnitKerja(names: string[] | null | undefined) {
  if (!names || !names.length) return '-'
  return names.join(', ')
}
</script>
