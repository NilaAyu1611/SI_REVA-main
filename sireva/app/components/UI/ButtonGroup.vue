<template>
  <div class="flex flex-col gap-6 p-5">
    <BrandSelector class="mb-4" />
    <div>
      <p class="mb-2 text-sm text-[#666]">Selected: {{ selectedPeriod }}</p>
      <ButtonGroup v-model="selectedPeriod" :options="periodOptions" @change="handlePeriodChange" />
    </div>
    <div>
      <p class="mb-2 text-sm text-[#666]">Selected: {{ selectedView }}</p>
      <ButtonGroup v-model="selectedView" :options="viewOptions" @change="handleViewChange" />
    </div>
    <div>
      <p class="mb-2 text-sm text-[#666]">Selected: {{ selectedFilter }}</p>
      <ButtonGroup v-model="selectedFilter" :options="filterOptions" @change="handleFilterChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ButtonGroup } from '@idds/vue';
// Ganti path BrandSelector sesuai struktur project Anda
// Jika belum ada, bisa dikosongkan atau buat dummy
// import BrandSelector from '@/modules/common/components/brand-selector.vue';
const BrandSelector = { template: '<div></div>' };

const selectedPeriod = ref<string | number>('month');
const selectedView = ref<string | number>('grid');
const selectedFilter = ref<string | number>('all');

const periodOptions = [
  { value: 'year', label: '1 Tahun' },
  { value: 'month', label: '1 Bulan' },
  { value: 'week', label: '7 Hari' },
  { value: 'custom', label: 'Pilih Tanggal' },
];

const viewOptions = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'table', label: 'Table' },
];

const filterOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' },
  { value: 'archived', label: 'Arsip' },
];

const handlePeriodChange = (value: string | number) => {
  console.log('Period changed to:', value);
};

const handleViewChange = (value: string | number) => {
  console.log('View changed to:', value);
};

const handleFilterChange = (value: string | number) => {
  console.log('Filter changed to:', value);
};
</script>
