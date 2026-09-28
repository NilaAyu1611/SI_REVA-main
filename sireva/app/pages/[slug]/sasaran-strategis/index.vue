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
            Sasaran Strategis
            <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {{ displayRows.length }} Data
            </span>
          </h1>
          <p class="text-slate-500 mt-1 font-medium text-sm">Kelola dan pantau target sasaran strategis organisasi secara real-time.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">L
        <!-- Floating Add Button -->
        <button
          v-if="isSuperAdmin"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
          class="hidden md:flex px-8 py-4 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Tambah Sasaran
        </button>

        <div class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
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
          placeholder="Cari kode atau sasaran strategis..." 
          class="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2663A3] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
        />
      </div>
      
      <button
        v-if="isSuperAdmin"
        @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
        class="md:hidden w-full py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20"
      >
        <IconPlus :size="18" stroke-width="3" />
        Tambah Sasaran Strategis
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && displayRows.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#2663A3] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-8 text-slate-500 font-black uppercase tracking-widest text-[10px]">Sinkronisasi Data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayRows.length === 0" class="text-center py-20 bg-white border border-slate-200 rounded-3xl mx-2 shadow-sm">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
        <IconFolderSearch :size="40" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">Tidak ada data ditemukan</h3>
      <p class="text-slate-500 mt-2 text-sm font-medium">Coba ubah kriteria pencarian atau tambahkan data baru.</p>
    </div>

    <!-- Table Layout (List Mode) -->
    <div v-else class="mx-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <UiTable
        :columns="tableColumns"
        :data="displayRows"
        :page-size="pageSize"
        :show-pagination="true"
        row-key="id"
        class="border-0"
      >
        <template #cell-no="{ absoluteIndex }">
          <span class="text-xs font-black text-slate-400">{{ absoluteIndex + 1 }}</span>
        </template>

        <template #cell-kode="{ value }">
          <span class="px-2 py-1 bg-blue-50 text-[#2663A3] text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
            {{ value || '-' }}
          </span>
        </template>

        <template #cell-sasaranText="{ value }">
          <p class="text-[13px] font-bold text-slate-800 leading-tight">{{ value }}</p>
        </template>


        <template #cell-indikatorNama="{ value }">
          <p class="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-snug">{{ value || '-' }}</p>
        </template>

        <template #cell-target="{ row }">
          <div class="flex items-end justify-center gap-1">
            <span class="text-sm font-black text-[#2663A3]">{{ row.targetValue || 0 }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase pb-0.5">{{ row.indikatorSatuan }}</span>
          </div>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/sasaran-strategis/view?id=${row.ssId}`)"
              class="p-2.5 text-slate-400 hover:text-[#2663A3] hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
              title="Lihat Detail"
            >
              <IconEye :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="isSuperAdmin"
              @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${row.ssId}`)"
              class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90"
              title="Edit"
            >
              <IconPencil :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="isSuperAdmin"
              @click.stop="handleDelete(row)"
              :disabled="loadingDeleteId === row.ssId"
              class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Hapus"
            >
              <IconTrash v-if="loadingDeleteId !== row.ssId" :size="20" stroke-width="2.5" />
              <div v-else class="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </button>
          </div>
        </template>
      </UiTable>
    </div>
  </div>
</template>


<script setup lang="ts">
/**
 * Komponen Sasaran Strategis Index Standardized
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
import { useToast } from '#imports'
import { useAuthUser } from '~/composables/useAuthUser'

const toast = useToast()

const router = useRouter()
const fetcher = (url: string) => fetch(url).then(r => r.json())

// State
const searchQuery = ref('')
const selectedYear = ref('2026')
const pageSize = ref(10)
const loadingDeleteId = ref<number | null>(null)

// Options
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

// Data Fetching
const { role, authUser } = useAuthUser()
// Role Checks Normalized
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isAdmin = computed(() => normalizedRole.value === 'admin')

const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())
const userUnitKerjaId = computed(() => null) // logic for unit removed as per request

const apiUrl = computed(() => {
  if (isSuperAdmin.value) return '/api/sasaran-strategis'
  return '/api/sasaran-strategis' // Simplified to return all as unit is not required
})

const { data: ssRaw, isValidating: loading, mutate } = useSWRV(() => apiUrl.value, fetcher)

// unitOptions removed as unit is not required

const displayRows = computed(() => {
  let rows = (ssRaw.value || []) as any[]
  if (ssRaw.value?.data) rows = ssRaw.value.data

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    rows = rows.filter((r: any) => 
      r.sasaranText?.toLowerCase().includes(q) || 
      r.kode?.toLowerCase().includes(q) ||
      r.indikatorNama?.toLowerCase().includes(q)
    )
  }

  return rows.map((r: any) => ({
    ...r,
    targetValue: r.targets?.find((t: any) => Number(t.tahun) === Number(selectedYear.value))?.target || 0
  }))
})

// (paginatedRows removed since Table.vue handles pagination internally)

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 60 },
  { key: 'kode', label: 'Kode', center: true, width: 80 },
  { key: 'sasaranText', label: 'Sasaran Strategis', width: '30%' },
  { key: 'indikatorNama', label: 'Indikator Kinerja', width: '25%' },
  { key: 'target', label: 'Target', center: true, width: 140 },
  { key: 'aksi', label: 'Aksi', center: true, width: 120 },
]

async function handleDelete(item: any) {
  if (!item.ssId) {
    toast.error('ID Sasaran Strategis tidak ditemukan.')
    return
  }

  const confirmMsg = `Apakah Anda yakin ingin menghapus sasaran strategis "${item.sasaranText}"?\n\nTindakan ini akan menghapus:\n- Seluruh indikator terkait\n- Seluruh target dan laporan terkait\n- Data ini tidak dapat dikembalikan.`
  
  if (!confirm(confirmMsg)) return
  
  loadingDeleteId.value = item.ssId
  try {
    await $fetch(`/api/sasaran-strategis/${item.ssId}`, { method: 'DELETE' })
    toast.success('Data sasaran strategis berhasil dihapus.')
    
    // Explicit revalidation
    await mutate()
  } catch (error: any) {
    console.error('Delete error details:', error)
    const msg = error.data?.statusMessage || error.message || 'Gagal menghapus data dari database.'
    toast.error(msg)
  } finally {
    loadingDeleteId.value = null
  }
}

watch([searchQuery, selectedYear], () => { 
  // Reset handled internally by Table.vue
})
</script>
