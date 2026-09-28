<template>
  <div class="space-y-8 pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
      <div class="flex items-start gap-5">
        <div class="p-4 bg-blue-100 rounded-3xl text-[#2663A3] shadow-sm">
          <IconLayoutGrid :size="32" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Master Sasaran Strategis
            <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {{ filteredRows.length }} Data
            </span>
          </h1>
          <p class="text-slate-500 mt-1 font-medium text-sm">Kelola dan pantau data master sasaran strategis organisasi secara real-time.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Input Button -->
        <NuxtLink
          :to="`/${route.params.slug}/master-sasaran-strategis/add`"
          class="hidden md:flex px-8 py-4 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Input Sasaran Strategis
        </NuxtLink>

        <!-- Filters -->
        <div class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-model="selectedUnit"
            :options="unitOptions"
            :icon="IconBuilding"
            placeholder="Pilih Unit Kerja"
            class="border-0! shadow-none hover:bg-slate-50"
            :label-mode="true"
          />
          <div class="w-px h-6 bg-slate-200"></div>
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
            placeholder="Pilih Tahun"
            class="border-0! shadow-none hover:bg-slate-50"
          />
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-2 flex flex-col md:flex-row gap-4">
      <div class="relative group flex-1">
        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-[#2663A3] transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari kode, sasaran strategis, atau indikator..." 
          class="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2663A3] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
        />
      </div>
      
      <NuxtLink
        :to="`/${route.params.slug}/master-sasaran-strategis/add`"
        class="md:hidden w-full py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20"
      >
        <IconPlus :size="18" stroke-width="3" />
        Input Sasaran Strategis
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#2663A3] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-8 text-slate-500 font-black uppercase tracking-widest text-[10px]">Sinkronisasi Data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredRows.length === 0" class="text-center py-20 bg-white border border-slate-200 rounded-3xl mx-2 shadow-sm">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
        <IconFolderSearch :size="40" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">Tidak ada data ditemukan</h3>
      <p class="text-slate-500 mt-2 text-sm font-medium">Coba ubah kriteria pencarian atau tambahkan data baru.</p>
    </div>

    <!-- Table Layout (List Mode) -->
    <div v-else class="mx-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <Table
        :columns="columns"
        :data="filteredRows"
        row-key="id"
        :showSearch="false"
        :showPagination="true"
        :pageSize="10"
        class="border-0"
      >
        <template #cell-nomor="{ absoluteIndex }">
          <span class="text-xs font-black text-slate-400">{{ absoluteIndex + 1 }}</span>
        </template>

        <template #cell-kode="{ value }">
          <span class="px-2 py-1 bg-blue-50 text-[#2663A3] text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
            {{ value || '-' }}
          </span>
        </template>

        <template #cell-sasaran="{ value }">
          <p class="text-[13px] font-bold text-slate-800 leading-tight">{{ value }}</p>
        </template>

        <template #cell-indikator="{ value }">
          <p class="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-snug">{{ value || '-' }}</p>
        </template>

        <template #cell-target="{ row }">
          <div class="flex items-end justify-center gap-1">
            <span class="text-sm font-black text-[#2663A3]">{{ row.target || 0 }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase pb-0.5">{{ row.satuan || '-' }}</span>
          </div>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <NuxtLink
              :to="`/${route.params.slug}/master-sasaran-strategis/view?id=${row.ssId}`"
              class="p-2.5 text-slate-400 hover:text-[#2663A3] hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
              title="Lihat Detail"
            >
              <IconEye :size="20" stroke-width="2.5" />
            </NuxtLink>
            <NuxtLink
              :to="`/${route.params.slug}/master-sasaran-strategis/edit?id=${row.ssId}`"
              class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90"
              title="Edit"
            >
              <IconPencil :size="20" stroke-width="2.5" />
            </NuxtLink>
            <button
              type="button"
              @click="handleDelete(row.ssId)"
              class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
              title="Hapus"
            >
              <IconTrash :size="20" stroke-width="2.5" />
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { 
  IconPencil, IconTrash, IconPlus, IconEye, 
  IconBuilding, IconCalendarEvent, IconLayoutGrid, IconSearch, IconFolderSearch 
} from '@tabler/icons-vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import Table from '@/components/UI/Table.vue';

const router = useRouter();
const route = useRoute();

interface SasaranStrategisApi {
  id: number;
  kode: string | null;
  sasaranText: string;
  unitKerjaId: number | null;
  ownerUnitName?: string;
  tahun?: string;
}

interface SasaranRow {
  id: any;
  ssId: number;
  nomor: number;
  kode: string;
  sasaran: string;
  indikator: string;
  target: string | number;
  satuan: string;
  unit_kerja: string;
  aksi: string;
}

const searchQuery = ref('');
const selectedYear = ref('2026');
const selectedUnit = ref<string | null>(null);

const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const { data, error, isValidating, mutate } = useSWRV<SasaranStrategisApi[]>('/api/sasaran-strategis', fetcher, {
  dedupingInterval: 60000,
  revalidateOnFocus: false,
});

const { data: unitData } = useSWRV<any[]>('/api/unit-kerja', fetcher);

const unitOptions = computed(() => {
  const units = (unitData.value || []).map((u: any) => ({ value: u.nama, label: u.nama }));
  return [{ value: null, label: 'Semua Unit Kerja' }, ...units];
});

const columns = [
  { key: 'nomor', label: 'No', center: true, width: 60 },
  { key: 'kode', label: 'Kode', center: true, width: 80 },
  { key: 'sasaran', label: 'Sasaran Strategis', width: '30%' },
  { key: 'indikator', label: 'Indikator Kinerja', width: '35%' },
  { key: 'target', label: 'Target', center: true, width: 140 },
  { key: 'aksi', label: 'Aksi', center: true, width: 120 },
];

const loading = computed(() => isValidating.value && !data.value);

const errorMessage = computed(() => {
  if (!error.value) return '';
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data sasaran strategis.';
});

const filteredRows = computed<SasaranRow[]>(() => {
  if (!data.value) return [];
  const source = Array.isArray(data.value) ? data.value : [];
  
  // Apply year filter
  let rows = source;
  if (selectedYear.value) {
    rows = rows.filter((item: any) => Number(item.tahun) === Number(selectedYear.value));
  }
  
  // Apply unit kerja filter (pengampu)
  if (selectedUnit.value) {
    rows = rows.filter((item: any) => item.pengampu === selectedUnit.value);
  }

  // Apply search query filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    rows = rows.filter((item: any) => {
      const kode = (item.kode || item.kodeSs || '').toLowerCase();
      const sasaran = (item.sasaranText || item.namaSs || '').toLowerCase();
      const indikator = (item.indikatorNama || '').toLowerCase();
      return kode.includes(q) || sasaran.includes(q) || indikator.includes(q);
    });
  }

  return rows.map((item: any, index: number) => {
    const targetObj = item.targets?.find((t: any) => Number(t.tahun) === Number(selectedYear.value));
    return {
      id: item.id,
      ssId: item.ssId || item.id,
      nomor: index + 1,
      kode: item.kode || item.kodeSs || '-',
      sasaran: item.sasaranText || item.namaSs || '-',
      indikator: item.indikatorNama || '-',
      target: targetObj ? targetObj.target : 0,
      satuan: item.indikatorSatuan || '-',
      unit_kerja: item.pengampu || '-',
      aksi: '',
    };
  });
});

const handleDelete = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
  
  try {
    await $fetch(`/api/sasaran-strategis/${id}`, {
      method: 'DELETE'
    });
    mutate();
  } catch (error) {
    console.error('Error deleting:', error);
    alert('Gagal menghapus data.');
  }
};
</script>
