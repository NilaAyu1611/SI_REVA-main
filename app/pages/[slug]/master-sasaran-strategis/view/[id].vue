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
            Informasi lengkap mengenai sasaran strategis yang terpilih.
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          v-if="data?.data?.id"
          :to="`/${route.params.slug}/master-sasaran-strategis/edit?id=${data.data.id}`"
          class="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <IconPencil :size="18" /> Edit Data
        </NuxtLink>
      </div>
    </div>

    <!-- Diagnostic block -->
    <div class="bg-slate-900 text-emerald-400 p-6 rounded-3xl font-mono text-xs space-y-2 border border-slate-800">
      <div>Route Params: {{ JSON.stringify(route.params) }}</div>
      <div>Parsed ID: {{ id }}</div>
      <div>Data Payload: {{ JSON.stringify(data) }}</div>
      <div>Error: {{ error || 'null' }}</div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
      <div class="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <span class="font-bold text-sm tracking-widest uppercase">Memuat Detail...</span>
    </div>

    <!-- Details View Card -->
    <div v-else-if="data?.success && data?.data" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Main Info Card -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3 text-slate-700 font-bold text-sm uppercase tracking-wider">
            <IconFileText :size="20" class="text-emerald-500" stroke-width="2.5" />
            Informasi Sasaran Strategis
          </div>
          <div class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
            ID Database: {{ data.data.id }}
          </div>
        </div>

        <div class="p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Sasaran</label>
              <div class="text-lg font-black text-emerald-600">{{ data.data.kode_ss || '-' }}</div>
            </div>

            <div class="space-y-1.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</label>
              <div class="text-lg font-bold text-slate-800">{{ data.data.tahun || '-' }}</div>
            </div>

            <div class="space-y-1.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Urut</label>
              <div class="text-lg font-bold text-slate-800">{{ data.data.nomor_urut || '-' }}</div>
            </div>
          </div>

          <div class="space-y-1.5 pt-4 border-t border-slate-100">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teks Sasaran Strategis</label>
            <div class="text-2xl font-black text-[#2663A3] leading-relaxed">{{ data.data.nama_ss || '-' }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengampu</label>
              <div class="text-base font-bold text-slate-800">{{ data.data.pengampu || '-' }}</div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instansi Terkait</label>
              <div class="text-base font-bold text-slate-800">{{ data.data.instansi_terkait || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
      <IconAlertCircle :size="48" stroke-width="1.5" />
      <div class="text-center">
        <h3 class="font-black text-slate-900 text-lg">Data Tidak Ditemukan</h3>
        <p class="text-sm mt-1">Maaf, sasaran strategis dengan ID tersebut tidak tersedia.</p>
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
  IconEye, IconFileText, IconPencil, IconAlertCircle, IconArrowLeft 
} from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()

const id = computed(() => Number(route.params.id))

// Temporary logs for debugging
console.log('Detail route id:', id.value)
console.log('Fetching:', `/api/sasaran-strategis/${id.value}`)

const { data, error, pending } = useFetch(() => id.value ? `/api/sasaran-strategis/${id.value}` : null, { lazy: true, default: () => [] })

const loading = computed(() => pending.value && !data.value)
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
