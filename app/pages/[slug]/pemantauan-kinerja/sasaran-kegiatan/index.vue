<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Pemantauan Sasaran Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">Daftar laporan realisasi kinerja dan analisa pencapaian operasional.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan/add`"
          class="px-6 py-3 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 flex items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Input Capaian
        </NuxtLink>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="px-2 flex flex-col md:flex-row gap-4">
      <div class="relative group flex-1">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari laporan..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
        />
      </div>
      
      <div class="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <FilterDropdown
          v-model="selectedYear"
          :options="['2025', '2026', '2027', '2028', '2029']"
          :icon="IconCalendarEvent"
          placeholder="Pilih Tahun"
          class="border-0! shadow-none hover:bg-slate-50"
        />
      </div>
    </div>

    <!-- Table Section -->
    <div class="mx-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-[#2663A3] rounded-full animate-spin"></div>
        <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Data Pemantauan...</p>
      </div>

      <UiTable
        v-else
        :columns="tableColumns"
        :data="displayRows"
        row-key="id"
      >
        <template #cell-no="{ index }">
          <span class="text-sm font-black text-slate-400">{{ index + 1 }}</span>
        </template>

        <template #cell-sasaran="{ row }">
          <div class="space-y-1">
            <p class="text-[13px] font-bold text-slate-800 leading-tight">{{ row.sasaranText }}</p>
            <div class="flex items-start gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0"></div>
              <p class="text-[10px] font-medium text-slate-500 uppercase tracking-tight italic">{{ row.indikatorNama }}</p>
            </div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ row.kode }}</p>
          </div>
        </template>

        <template #cell-target="{ row }">
          <div class="flex flex-col">
            <span class="text-sm font-black text-slate-700">{{ row.targetValue }}</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase">{{ row.satuan }}</span>
          </div>
        </template>

        <template #cell-realisasi="{ row }">
          <span class="text-sm font-black text-[#2663A3]">{{ row.realisasi }}</span>
        </template>

        <template #cell-capaian="{ row }">
          <div class="flex items-center gap-3">
            <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
              <div 
                class="h-full transition-all duration-1000" 
                :class="getProgressColor(calculateCapaian(row))"
                :style="{ width: Math.min(calculateCapaian(row), 100) + '%' }"
              ></div>
            </div>
            <span class="text-xs font-black text-slate-700">{{ calculateCapaian(row) }}%</span>
          </div>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <NuxtLink
              :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan/view?id=${row.id}`"
              class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <IconEye :size="18" />
            </NuxtLink>
            <NuxtLink
              :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-kegiatan/edit?id=${row.id}`"
              class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <IconPencil :size="18" />
            </NuxtLink>
            <button
              @click="handleDelete(row)"
              class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <IconTrash :size="18" />
            </button>
          </div>
        </template>
      </UiTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  IconChartBar, IconPlus, IconSearch, IconCalendarEvent, 
  IconEye, IconPencil, IconTrash 
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import UiTable from '@/components/UI/Table.vue'
import { useAuthUser } from '~/composables/useAuthUser'

const route = useRoute()
const { authUser, role } = useAuthUser()

const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

const searchQuery = ref('')
const selectedYear = ref('2026')

const { data: rawData, pending: loading, refresh } = useFetch('/api/pemantauan-kegiatan', { lazy: true, default: () => [] })

const tableColumns = [
  { key: 'no', label: 'No', align: 'center', width: 60 },
  { key: 'sasaran', label: 'Sasaran & Indikator', width: '35%' },
  { key: 'target', label: 'Target', align: 'center', width: 120 },
  { key: 'realisasi', label: 'Realisasi', align: 'center', width: 120 },
  { key: 'capaian', label: 'Capaian (%)', width: '20%' },
  { key: 'aksi', label: 'Aksi', align: 'center', width: 150 },
]

const displayRows = computed(() => {
  let rows = (rawData.value || []) as any[]
  if (rawData.value?.data) rows = rawData.value.data

  if (!isSuperAdmin.value && loggedUnitKerjaName.value) {
    rows = rows.filter((r: any) => {
      const uk = r.unitKerjaNama || r.unit_kerja || r.pengampu || ''
      return uk.toLowerCase().includes(loggedUnitKerjaName.value.toLowerCase())
    })
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    rows = rows.filter(r => r.sasaranText?.toLowerCase().includes(q) || r.indikatorNama?.toLowerCase().includes(q))
  }

  return rows
})

function calculateCapaian(row: any) {
  if (!row.targetValue || row.targetValue === 0) return 0
  return Math.round((row.realisasi / row.targetValue) * 100)
}

function getProgressColor(percent: number) {
  if (percent >= 100) return 'bg-emerald-500'
  if (percent >= 80) return 'bg-blue-500'
  if (percent >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

async function handleDelete(row: any) {
  if (!confirm('Hapus laporan capaian ini?')) return
  try {
    await $fetch(`/api/pemantauan-kegiatan?id=${row.id}`, { method: 'DELETE' })
    refresh()
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
