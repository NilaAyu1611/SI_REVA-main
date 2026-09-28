<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Perjanjian Kinerja</h1>
          <p class="text-sm text-slate-500 mt-1">Dokumentasi komitmen kinerja tahunan antara atasan dan bawahan.</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/add`)"
            class="w-full sm:w-auto px-5 py-2.5 bg-[#2663A3] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all"
          >
            <IconPlus :size="18" :stroke-width="3" />
            Tambah PK
          </button>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="px-6 py-4 bg-white flex flex-col md:flex-row items-center gap-4">
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <IconSearch :size="18" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari sasaran atau indikator PK..." 
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
          />
        </div>
        
        <div class="flex-1 flex flex-col sm:flex-row items-center justify-end gap-3 w-full md:w-auto">
          <div class="w-full sm:w-64">
            <FilterDropdown
              v-model="selectedUnitKerja"
              :options="unitKerjaOptions"
              :icon="IconBuilding"
            />
          </div>
          <div class="w-full sm:w-40">
            <FilterDropdown
              v-model="selectedYear"
              :options="yearOptions"
              :icon="IconCalendarEvent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Table List Layout -->
    <div v-if="tableRows.length > 0" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <UiTable
        :columns="tableColumns"
        :data="tableRows"
        :page-size="10"
        :show-pagination="true"
        row-key="id"
      >
        <template #cell-no="{ index }">
          <span class="text-sm font-bold text-slate-400">{{ Number(index) + 1 }}</span>
        </template>

        <template #cell-sasaran="{ value }">
          <p class="text-sm font-bold text-slate-800 leading-tight">{{ value }}</p>
        </template>

        <template #cell-indikator="{ value }">
          <p class="text-sm font-semibold text-slate-700 leading-snug">{{ value }}</p>
        </template>

        <template #cell-unitKerja="{ value }">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
            <IconBuilding :size="12" class="text-slate-400"/>
            {{ value }}
          </span>
        </template>

        <template #cell-target="{ value }">
          <span class="px-3 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 inline-flex min-w-14 justify-center shadow-sm">
            {{ value }}
          </span>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/view?id=${row.id}`)"
              class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <IconEye :size="18" />
            </button>
            <button
              @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/edit?id=${row.id}`)"
              class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <IconPencil :size="18" />
            </button>
            <button
              @click="handleDelete(row)"
              class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
            >
              <IconTrash :size="18" />
            </button>
          </div>
        </template>
      </UiTable>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 px-4 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
      <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <IconFileCheck :size="48" class="text-slate-200" />
      </div>
      <h3 class="text-2xl font-black text-slate-900">Belum Ada Perjanjian Kinerja</h3>
      <p class="text-slate-500 mt-2 max-w-sm text-center font-medium">Data PK untuk tahun {{ selectedYear }} belum tersedia atau tidak sesuai dengan filter pencarian Anda.</p>
      <button 
        @click="searchQuery = ''; selectedUnitKerja = 'Semua Unit Kerja'"
        class="mt-8 px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all"
      >
        Tampilkan Semua
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Perjanjian Kinerja Modern
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useSWRV from 'swrv'
import { 
  IconEye, IconPencil, IconPlus, IconBuilding, IconCalendarEvent, 
  IconTarget, IconFileCheck, IconSearch, IconTrash
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import UiTable from '@/components/UI/Table.vue'

const router = useRouter()
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher)
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const selectedUnitKerja = ref('Semua Unit Kerja')
const unitKerjaOptions = computed(() => {
  const units = unitData.value?.map((u: any) => u.nama) || []
  return ['Semua Unit Kerja', ...units]
});

const { data: committedPK } = useSWRV(() => `/api/perjanjian-kinerja?tahun=${selectedYear.value}&unitKerja=${selectedUnitKerja.value}`, fetcher)
const { data: allIndikators } = useSWRV('/api/indikator-kinerja', fetcher)
const { data: allSasaran } = useSWRV('/api/sasaran-strategis', fetcher)

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 70 },
  { key: 'sasaran', label: 'Sasaran Strategis / Program', width: '25%' },
  { key: 'indikator', label: 'Indikator Kinerja' },
  { key: 'unitKerja', label: 'Unit Kerja', width: '25%' },
  { key: 'target', label: 'Target', center: true, width: 100 },
  { key: 'aksi', label: 'Aksi', center: true, width: 140 },
]

const tableRows = computed(() => {
  if (!committedPK.value || !allIndikators.value || !allSasaran.value) return [];
  
  const indicatorMap = new Map((allIndikators.value as any[]).map(i => [i.id, i]));
  const sasaranMap = new Map((allSasaran.value as any[]).map(s => [s.id, s]));

  return (committedPK.value as any[]).map((pk: any) => {
    const indicator = indicatorMap.get(pk.indikatorId);
    const sasaran = sasaranMap.get(pk.sasaranId);
    
    return {
      id: pk.id,
      sasaran: sasaran?.sasaranText || 'Sasaran Umum',
      indikator: indicator?.namaIndikator || 'Indikator Tidak Ditemukan',
      target: pk.target || '-',
      unitKerja: pk.unitKerja || '-',
    };
  });
})

const groupedData = computed(() => {
  const groups: Record<string, any[]> = {}
  
  tableRows.value.forEach((item: any) => {
    const key = item.sasaran || 'Tanpa Sasaran'
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  })

  return Object.keys(groups).map(sasaran => ({
    sasaran,
    items: groups[sasaran]
  }))
})

async function handleDelete(item: any) {
  if (!confirm(`Apakah Anda yakin ingin membatalkan komitmen PK untuk indikator "${item.indikator}"?`)) return;
  
  try {
    const result = await $fetch<any[]>('/api/perjanjian-kinerja', {
      method: 'DELETE',
      body: { id: item.id }
    });

    if (result) {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}
</script>

<style scoped>
/* Scoped styles */
</style>
