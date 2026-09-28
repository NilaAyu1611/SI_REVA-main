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
            Master Sasaran Program
            <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {{ filteredRows.length }} Data
            </span>
          </h1>
          <p class="text-slate-500 mt-1 font-medium text-sm">Pengelolaan sasaran program kerja dan target capaian indikator.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Input Button -->
        <NuxtLink
          :to="`/${route.params.slug}/master-sasaran-program/add`"
          class="hidden md:flex px-8 py-4 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Input Sasaran Program
        </NuxtLink>

        <!-- Filters -->
        <div class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-slot="{}"
            v-if="isSuperAdmin"
            v-model="selectedUnit"
            :options="unitOptions"
            :icon="IconBuilding"
            placeholder="Pilih Unit Kerja"
            class="border-0! shadow-none hover:bg-slate-50"
            :label-mode="true"
          />
          <div v-if="isSuperAdmin" class="w-px h-6 bg-slate-200"></div>
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
          placeholder="Cari sasaran program, indikator, atau unit..." 
          class="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2663A3] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
        />
      </div>
      
      <NuxtLink
        :to="`/${route.params.slug}/master-sasaran-program/add`"
        class="md:hidden w-full py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20"
      >
        <IconPlus :size="18" stroke-width="3" />
        Input Sasaran Program
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

        <template #cell-unit_kerja="{ value }">
          <p class="text-[12px] font-medium text-slate-600 leading-tight">{{ value }}</p>
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
              :to="`/${route.params.slug}/master-sasaran-program/view?id=${row.spId}${row.id !== row.spId ? '&indId=' + row.id : ''}`"
              class="p-2.5 text-slate-400 hover:text-[#2663A3] hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
              title="Lihat Detail"
            >
              <IconEye :size="20" stroke-width="2.5" />
            </NuxtLink>
            <NuxtLink
              :to="`/${route.params.slug}/master-sasaran-program/edit?id=${row.spId}${row.id !== row.spId ? '&indId=' + row.id : ''}`"
              class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90"
              title="Edit"
            >
              <IconPencil :size="20" stroke-width="2.5" />
            </NuxtLink>
            <button
              type="button"
              @click="handleDelete(row.spId)"
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
import { 
  IconPencil, IconTrash, IconPlus, IconEye, 
  IconBuilding, IconCalendarEvent, IconLayoutGrid, IconSearch, IconFolderSearch 
} from '@tabler/icons-vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import Table from '@/components/UI/Table.vue';
import { useToast, useAuthUser } from '#imports';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { authUser, role } = useAuthUser();

const isSuperAdmin = computed(() => role.value === 'super_admin');
const userUnit = computed(() => authUser.value?.unit_kerja?.trim() || null);

interface SasaranRow {
  id: any;
  spId: number;
  nomor: number;
  kode: string;
  sasaran: string;
  unit_kerja: string;
  indikator: string;
  target: string | number;
  satuan: string;
  aksi: string;
}

const searchQuery = ref('');
const selectedYear = ref('2026');
const selectedUnit = ref<string | null>(null);

const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const { data, error, pending, refresh } = useFetch('/api/sasaran-program', { lazy: true, default: () => [] });

const { data: unitData } = useFetch('/api/unit-kerja', { lazy: true, default: () => [] });

const unitOptions = computed(() => {
  const units = (unitData.value || []).map((u: any) => ({ value: u.nama, label: u.nama }));
  return [{ value: null, label: 'Semua Unit Kerja' }, ...units];
});

const columns = [
  { key: 'nomor', label: 'No', center: true, width: 60 },
  { key: 'kode', label: 'Kode', center: true, width: 80 },
  { key: 'sasaran', label: 'Sasaran Program', width: '25%' },
  { key: 'unit_kerja', label: 'Unit Kerja', width: '20%' },
  { key: 'indikator', label: 'Indikator Kinerja', width: '25%' },
  { key: 'target', label: 'Target', center: true, width: 140 },
  { key: 'aksi', label: 'Aksi', center: true, width: 120 },
];

const loading = computed(() => pending.value && !data.value);

const errorMessage = computed(() => {
  if (!error.value) return '';
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data sasaran program.';
});

const filteredRows = computed<SasaranRow[]>(() => {
  if (!data.value) return [];
  const source = Array.isArray(data.value) ? data.value : ((data.value as any)?.data || []);
  
  let rows = source;

  // Filter based on user role and unit kerja
  if (!isSuperAdmin.value && userUnit.value) {
    rows = rows.filter((item: any) => (item.unit_kerja || '').trim() === userUnit.value);
  } else if (selectedUnit.value) {
    rows = rows.filter((item: any) => (item.unit_kerja || '').trim() === selectedUnit.value.trim());
  }

  // Apply search query filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    rows = rows.filter((item: any) => {
      const kode = (item.kode || '').toLowerCase();
      const sasaran = (item.sasaran_program_text || '').toLowerCase();
      const unit = (item.unit_kerja || '').toLowerCase();
      const indikator = (item.indikatorNama || '').toLowerCase();
      return kode.includes(q) || sasaran.includes(q) || unit.includes(q) || indikator.includes(q);
    });
  }

  return rows.map((item: any, index: number) => {
    // Resolve target dynamically based on year filter
    const yearIndex = yearOptions.indexOf(selectedYear.value);
    const targetKey = `target_${yearIndex + 1}`;
    const targetValue = item[targetKey] || 0;

    const indId = (item.indikatorId !== undefined && item.indikatorId !== null) ? Number(item.indikatorId) : null;

    return {
      id: indId || item.id,
      spId: item.id,
      nomor: index + 1,
      kode: item.kode || '-',
      sasaran: item.sasaran_program_text || '-',
      unit_kerja: item.unit_kerja || '-',
      indikator: item.indikatorNama || '-',
      target: targetValue,
      satuan: item.satuan || '-',
      aksi: '',
    };
  });
});

const handleDelete = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data master sasaran program ini?')) return;
  
  try {
    await $fetch('/api/sasaran-program', {
      method: 'DELETE',
      body: { id }
    });
    toast.success('Data master berhasil dihapus');
    refresh();
  } catch (err: any) {
    console.error('Delete error:', err);
    toast.error(err.data?.statusMessage || 'Gagal menghapus data');
  }
};
</script>
