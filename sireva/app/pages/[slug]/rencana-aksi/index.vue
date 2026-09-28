<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Rencana Aksi
          <span class="px-3 py-1 rounded-full bg-blue-100 text-[#2663A3] text-xs font-black uppercase tracking-widest">
            {{ displayRows.length }} Data
          </span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium text-sm">Pengelolaan rincian rencana aksi dan target capaian operasional.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Floating Add Button for quick access -->
        <button
          v-if="canInput"
          @click="router.push(`/${$route.params.slug}/rencana-aksi/add`)"
          class="hidden md:flex px-6 py-3 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Tambah Rencana
        </button>

        <div class="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-if="isSuperAdmin || isAdmin"
            v-model="selectedUnitKerja"
            :options="unitKerjaOptions"
            :icon="IconBuilding"
            placeholder="Pilih Unit Kerja"
            class="border-0! shadow-none hover:bg-slate-50"
          />
          <div v-if="isSuperAdmin || isAdmin" class="w-px h-6 bg-slate-200"></div>
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

    <!-- Search Bar & Mobile Add -->
    <div class="px-2 flex flex-col md:flex-row gap-4">
      <div class="relative group flex-1">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari rencana aksi, indikator, atau sasaran..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
        />
      </div>
      
      <button
        v-if="canInput"
        @click="router.push(`/${$route.params.slug}/rencana-aksi/add`)"
        class="md:hidden w-full py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm flex items-center justify-center gap-2"
      >
        <IconPlus :size="18" stroke-width="3" />
        Tambah Rencana Aksi
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && displayRows.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs">Menyinkronkan Data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayRows.length === 0" class="text-center py-16 bg-white border border-slate-200 rounded-3xl mx-2 shadow-sm">
      <IconFolderSearch :size="48" class="mx-auto text-slate-300 mb-4" />
      <h3 class="text-lg font-bold text-slate-700">Tidak ada data ditemukan</h3>
      <p class="text-slate-500 mt-2 text-sm font-medium">Coba ubah filter pencarian atau tambahkan data baru.</p>
    </div>

    <!-- Table List Layout -->
    <div v-else class="mx-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <UiTable
        :columns="tableColumns"
        :data="paginatedRows"
        :page-size="pageSize"
        :current-page="currentPage"
        :show-pagination="true"
        @page-change="currentPage = $event"
        row-key="id"
        class="border-0"
      >
        <template #cell-no="{ index }">
          <span class="text-sm font-black text-slate-400">{{ (currentPage - 1) * pageSize + Number(index) + 1 }}</span>
        </template>

        <template #cell-indikator="{ value }">
          <p class="text-[13px] font-bold text-slate-800 leading-tight line-clamp-2">{{ value }}</p>
        </template>

        <template #cell-rencanaAksi="{ value }">
          <p class="text-[13px] font-black text-[#2663A3] leading-snug line-clamp-2 uppercase tracking-tight">{{ value }}</p>
        </template>

        <template #cell-target="{ value }">
          <div class="flex justify-center">
            <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 inline-flex min-w-[60px] justify-center shadow-sm">
              {{ value }}
            </span>
          </div>
        </template>

        <template #cell-tw1="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 inline-flex min-w-[50px] justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-tw2="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-cyan-50 text-cyan-700 border border-cyan-100 inline-flex min-w-[50px] justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-tw3="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 text-amber-700 border border-amber-100 inline-flex min-w-[50px] justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-tw4="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-100 inline-flex min-w-[50px] justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/rencana-aksi/view?id=${row.id}`)"
              class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Lihat Detail"
            >
              <IconEye :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="canInput"
              @click="router.push(`/${$route.params.slug}/rencana-aksi/edit?id=${row.id}`)"
              class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              title="Edit"
            >
              <IconPencil :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="isSuperAdmin"
              @click="handleDelete(row)"
              class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Hapus"
            >
              <IconTrash :size="20" stroke-width="2.5" />
            </button>
          </div>
        </template>
      </UiTable>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Rencana Aksi Index Standardized
 */

definePageMeta({ layout: 'dashboard' })

import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IconEye, IconPencil, IconPlus, IconBuilding, IconCalendarEvent,
  IconSearch, IconTrash, IconFolderSearch
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import UiTable from '@/components/UI/Table.vue'
import useSWRV from 'swrv'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const fetcher = async (url: string) => fetch(url).then(r => r.json())

// State
const searchQuery = ref('')
const selectedYear = ref('2026')
const selectedUnitKerja = ref('Semua Unit Kerja')
const currentPage = ref(1)
const pageSize = ref(10)

// Options
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

// Data Fetching
const { authUser, role } = useAuthUser()
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher)
const { data: rencanaData, isValidating: loading, mutate } = useSWRV('/api/rencana-aksi', fetcher)

// Role Checks
const isSuperAdmin = computed(() => role.value?.toLowerCase() === 'super_admin')
const isAdmin = computed(() => role.value?.toLowerCase() === 'admin')
const isUserOnly = computed(() => role.value?.toLowerCase() === 'user')
const canInput = computed(() => isSuperAdmin.value || isUserOnly.value)

const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

const unitKerjaOptions = computed(() => {
  const units = unitData.value?.map((u: any) => u.nama) || []
  if (isUserOnly.value) return loggedUnitKerjaName.value ? [loggedUnitKerjaName.value] : []
  return ['Semua Unit Kerja', ...new Set(units as string[])]
})

const displayRows = computed(() => {
  let rows = Array.isArray(rencanaData.value) ? rencanaData.value : []
  
  // Basic filtering logic
  if (selectedYear.value) {
    rows = rows.filter((r: any) => String(r.tahun) === selectedYear.value)
  }

  if (isUserOnly.value && loggedUnitKerjaName.value) {
    rows = rows.filter((r: any) => r.unitKerjaNama === loggedUnitKerjaName.value)
  } else if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    rows = rows.filter((r: any) => r.unitKerjaNama === selectedUnitKerja.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    rows = rows.filter((r: any) => 
      r.namaRencanaAksi?.toLowerCase().includes(q) || 
      r.indikatorNama?.toLowerCase().includes(q)
    )
  }

  return rows.map(r => ({
    ...r,
    indikator: r.indikatorNama,
    rencanaAksi: r.namaRencanaAksi,
    tw1: r.tw1 || 0,
    tw2: r.tw2 || 0,
    tw3: r.tw3 || 0,
    tw4: r.tw4 || 0
  }))
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return displayRows.value.slice(start, start + pageSize.value)
})

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 60 },
  { key: 'indikator', label: 'Indikator Kinerja', width: '30%' },
  { key: 'rencanaAksi', label: 'Rencana Aksi / Aktivitas', width: '30%' },
  { key: 'target', label: 'Total', center: true, width: 100 },
  { key: 'tw1', label: 'TW I', center: true, width: 80 },
  { key: 'tw2', label: 'TW II', center: true, width: 80 },
  { key: 'tw3', label: 'TW III', center: true, width: 80 },
  { key: 'tw4', label: 'TW IV', center: true, width: 80 },
  { key: 'aksi', label: 'Aksi', center: true, width: 120 },
]

async function handleDelete(item: any) {
  if (!confirm(`Hapus rencana aksi "${item.rencanaAksi}"?`)) return
  try {
    await $fetch('/api/rencana-aksi', {
      method: 'DELETE',
      body: { id: item.id }
    })
    mutate()
  } catch (error) {
    alert('Gagal menghapus data.')
  }
}

watch([searchQuery, selectedYear, selectedUnitKerja], () => { currentPage.value = 1 })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
