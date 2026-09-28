<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconEye :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Detail Sasaran Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Informasi lengkap data master sasaran kegiatan beserta hierarki cascading.
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
        </div>
        <button 
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan`)"
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
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Sasaran Kegiatan</span>
            <p class="text-lg font-bold text-slate-700">{{ detail?.kode || detail?.kodeSk || '-' }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Urut</span>
            <p class="text-lg font-bold text-slate-700">{{ detail?.nomorUrut || '-' }}</p>
          </div>
          <div class="md:col-span-2 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Program Induk</span>
            <p class="text-lg font-bold text-slate-700">{{ spName }}</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Rincian Sasaran Kegiatan Master -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Rincian Sasaran Kegiatan Master</h2>
        </div>
        <div class="p-8 space-y-8">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pernyataan Sasaran</span>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-slate-700 font-bold leading-relaxed text-lg">"{{ detail?.sasaranText || detail?.sasaran_kegiatan_text || detail?.namaSk || '-' }}"</p>
            </div>
          </div>


          <div class="pt-4 border-t border-slate-100">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja Pengampu</span>
              <p class="text-base font-bold text-slate-700">{{ detail?.unit_kerja || detail?.unitKerjaNama || detail?.pengampu || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Indikator Kinerja -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">
            Indikator Kinerja
            <span v-if="ikList?.length" class="ml-2 px-2 py-0.5 bg-blue-100 text-[#2663A3] text-[10px] rounded-full font-black">{{ ikList.length }}</span>
          </h2>
        </div>
        <div class="p-6">
          <div v-if="!ikList || ikList.length === 0" class="p-6 text-center text-slate-400 text-sm font-medium">
            Belum ada indikator kinerja untuk sasaran ini.
          </div>
          <div v-else class="overflow-x-auto rounded-2xl border border-slate-100">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-10 text-center">No</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Indikator</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-28">Satuan</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-20">2025</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-20">2026</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-20">2027</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-20">2028</th>
                  <th class="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-20">2029</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(ik, idx) in ikList" :key="ik.id" class="hover:bg-slate-50/60 transition-colors">
                  <td class="p-3 text-center text-sm font-bold text-slate-400">{{ idx + 1 }}</td>
                  <td class="p-3 text-sm font-semibold text-slate-700 leading-snug">{{ ik.namaIku || '-' }}</td>
                  <td class="p-3 text-sm text-slate-600">{{ ik.satuan || '-' }}</td>
                  <td class="p-3 text-center text-sm font-bold text-[#2663A3]">{{ ik.target_1 ?? '-' }}</td>
                  <td class="p-3 text-center text-sm font-bold text-[#2663A3]">{{ ik.target_2 ?? '-' }}</td>
                  <td class="p-3 text-center text-sm font-bold text-[#2663A3]">{{ ik.target_3 ?? '-' }}</td>
                  <td class="p-3 text-center text-sm font-bold text-[#2663A3]">{{ ik.target_4 ?? '-' }}</td>
                  <td class="p-3 text-center text-sm font-bold text-[#2663A3]">{{ ik.target_5 ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan/edit?id=${id}`)"
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

import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconEye, IconSitemap, IconFileText, IconArrowLeft, IconPencil } from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const id = route.query.id

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching } = useSWRV(
  id ? `/api/sasaran-kegiatan?id=${id}` : null,
  fetcher,
  { dedupingInterval: 30000, revalidateOnFocus: false }
)
const { data: spData } = useSWRV('/api/sasaran-program', fetcher)
// Fetch all indikator kinerja for this SK
const { data: ikList } = useSWRV(
  id ? `/api/indikator-kinerja?sk_id=${id}` : null,
  fetcher,
  { dedupingInterval: 30000, revalidateOnFocus: false }
)


const spName = computed(() => {
  if (!detail.value || !spData.value) return '-'
  const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const found = source.find((s: any) => Number(s.id) === Number(item?.spId))
  return found ? `[${found.kodeSp || found.kode}] ${found.namaSp || found.sasaran_program_text}` : '-'
})
</script>
