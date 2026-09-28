<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconEye :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Detail Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Informasi lengkap data master sasaran program beserta hierarki cascading.
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
        </div>
        <button 
          @click="router.push(`/${route.params.slug}/master-sasaran-program`)"
          class="text-xs font-bold text-slate-400 hover:text-[#2663A3] transition-colors flex items-center gap-1"
        >
          <IconArrowLeft :size="14" />
          Kembali ke Daftar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Detail Data...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Section 1: Hierarki & Relasi Data (Cascading) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconSitemap :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Hierarki & Relasi Data (Cascading)</h2>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Sasaran</span>
            <p class="text-lg font-bold text-slate-700">{{ detail?.kode || detail?.kodeSp || '-' }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Urut</span>
            <p class="text-lg font-bold text-slate-700">{{ detail?.nomorUrut || '-' }}</p>
          </div>
          <div class="md:col-span-2 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Strategis Induk</span>
            <p class="text-lg font-bold text-slate-700">{{ ssName }}</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Rincian Sasaran Program Master -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Rincian Sasaran Program Master</h2>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="md:col-span-2 space-y-2">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pernyataan Sasaran</span>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-slate-700 font-bold leading-relaxed text-lg">"{{ detail?.sasaran_program_text || detail?.namaSp || '-' }}"</p>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengampu</span>
            <p class="text-base font-bold text-slate-700">{{ detail?.unit_kerja || detail?.pengampu || '-' }}</p>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instansi Terkait</span>
            <p class="text-base font-bold text-slate-700">{{ detail?.instansiTerkait || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          @click="router.push(`/${route.params.slug}/master-sasaran-program/edit?id=${id}`)"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <IconPencil :size="18" />
          Edit Data Master
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconEye, IconSitemap, IconFileText, IconArrowLeft, IconPencil } from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const id = route.query.id

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching, mutate } = useSWRV(
  id ? `/api/sasaran-program?id=${id}` : null,
  fetcher,
  { dedupingInterval: 0, revalidateOnFocus: true }
)
const { data: ssData } = useSWRV('/api/sasaran-strategis', fetcher)

onMounted(() => mutate())

const ssName = computed(() => {
  if (!detail.value || !ssData.value) return '-'
  const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
  const source = Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
  const found = source.find((s: any) => Number(s.id) === Number(item?.ssId))
  return found ? `[${found.kode_ss || found.kode}] ${found.nama_ss || found.sasaranText}` : '-'
})
</script>
