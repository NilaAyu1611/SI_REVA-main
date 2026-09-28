<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Sasaran Kegiatan
          <span class="px-3 py-1 rounded-full bg-blue-100 text-[#2663A3] text-xs font-black uppercase tracking-widest">
            {{ displayRows.length }} Data
          </span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium text-sm">Pengelolaan sasaran kegiatan dan pemantauan target operasional.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Floating Add Button -->
        <button
          v-if="canInputAdd"
          @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/add`)"
          class="hidden md:flex px-6 py-3 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Tambah Sasaran
        </button>

        <div class="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-if="isSuperAdmin"
            v-model="selectedUnitId"
            :options="unitOptions"
            :icon="IconBuilding"
            placeholder="Pilih Unit Kerja"
            class="border-0! shadow-none hover:bg-slate-50"
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
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari kode atau sasaran kegiatan..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
        />
      </div>
      
      <button
        v-if="canInputAdd"
        @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/add`)"
        class="md:hidden w-full py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm flex items-center justify-center gap-2"
      >
        <IconPlus :size="18" stroke-width="3" />
        Tambah Sasaran Kegiatan
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && displayRows.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs">Memproses Data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayRows.length === 0" class="text-center py-16 bg-white border border-slate-200 rounded-3xl mx-2 shadow-sm">
      <IconFolderSearch :size="48" class="mx-auto text-slate-300 mb-4" />
      <h3 class="text-lg font-bold text-slate-700">Tidak ada data ditemukan</h3>
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
          <span class="text-sm font-black text-slate-400">{{ absoluteIndex + 1 }}</span>
        </template>

        <template #cell-kode="{ value }">
          <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
            {{ value || '-' }}
          </span>
        </template>

        <template #cell-sasaranText="{ value }">
          <p class="text-[13px] font-bold text-slate-800 leading-tight">{{ value }}</p>
        </template>

        <template #cell-unit="{ row }">
          <div class="flex flex-wrap gap-1">
            <span v-for="u in (row.unitKerjaNames || [])" :key="u" class="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">
              {{ u }}
            </span>
            <span v-if="!row.unitKerjaNames || row.unitKerjaNames.length === 0" class="text-[10px] text-slate-400 italic">Tidak ada unit</span>
          </div>
        </template>

        <template #cell-indikatorNama="{ value }">
          <p class="text-[12px] font-black text-slate-700 uppercase tracking-tight">{{ value || '-' }}</p>
        </template>

        <template #cell-target="{ row }">
          <span class="text-sm font-black text-blue-600">{{ row.targetValue || 0 }}</span>
          <span class="text-[10px] font-bold text-slate-400 ml-1 uppercase">{{ row.indikatorSatuan }}</span>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/view?id=${row.id}`)"
              class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Lihat Detail"
            >
              <IconEye :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="canInputAdd"
              @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${row.id}`)"
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
 * Komponen Sasaran Kegiatan Index Standardized
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
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()

// State
const searchQuery = ref('')
const selectedYear = ref('2026')
const selectedUnitId = ref<number | null>(null)
const pageSize = ref(10)

// Options
const yearOptions = [
  { value: '2025', label: 'Tahun 2025' },
  { value: '2026', label: 'Tahun 2026' },
  { value: '2027', label: 'Tahun 2027' },
  { value: '2028', label: 'Tahun 2028' },
  { value: '2029', label: 'Tahun 2029' },
]

// Data Fetching
const { role, authUser } = useAuthUser()
const { data: unitData } = useFetch<any[]>('/api/unit-kerja', { lazy: true, default: () => [] })

// Role Checks Normalized
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isAdmin = computed(() => normalizedRole.value === 'admin')
const isUser = computed(() => normalizedRole.value === 'user')
const canInputAdd = computed(() => isSuperAdmin.value || isUser.value)

const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())
const userUnitKerjaId = computed(() => {
  if (!unitData.value) return null
  const found = unitData.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

// Always fetch all data — filter client-side to avoid SWRV reactive URL issues
const { data: skRaw, pending: loading, refresh } = useFetch<any[]>('/api/sasaran-kegiatan', { lazy: true, default: () => [] })

// Resolve selected unit name from ID for client-side filtering
const selectedUnitName = computed(() => {
  if (!selectedUnitId.value || !unitData.value) return null
  const found = unitData.value.find((u: any) => u.id === selectedUnitId.value)
  return found?.nama || null
})

const unitOptions = computed(() => {
  const units = (unitData.value || []).map((u: any) => ({ value: u.id, label: u.nama }))
  return [{ value: null, label: 'Semua Unit Kerja' }, ...units]
})

const displayRows = computed(() => {
  let rows = (skRaw.value || []) as any[]
  if ((skRaw.value as any)?.data) rows = (skRaw.value as any).data

  // If not super admin, filter to own unit/cascade
  if (!isSuperAdmin.value && loggedUnitKerjaName.value) {
    if (isAdmin.value) {
      rows = rows.filter((r: any) => {
        const progUk = (r.programUnitKerja || '').trim().toLowerCase()
        const ownUk = (r.unit_kerja || r.unitKerjaNama || r.pengampu || '').trim().toLowerCase()
        const loggedUk = loggedUnitKerjaName.value.toLowerCase()
        return progUk === loggedUk || ownUk === loggedUk
      })
    } else {
      rows = rows.filter((r: any) => {
        const ownUk = (r.unit_kerja || r.unitKerjaNama || r.pengampu || '').trim().toLowerCase()
        const loggedUk = loggedUnitKerjaName.value.toLowerCase()
        return ownUk === loggedUk
      })
    }
  }

  // Super admin: filter by selected unit kerja
  if (isSuperAdmin.value && selectedUnitName.value) {
    rows = rows.filter((r: any) => {
      const uk = r.unit_kerja || r.unitKerjaNama || r.pengampu || ''
      return uk.toLowerCase().includes(selectedUnitName.value!.toLowerCase())
    })
  }

  const yearIdx = ['2025', '2026', '2027', '2028', '2029'].indexOf(selectedYear.value)

  const normalized = rows.map((r: any) => {
    const targetValue = yearIdx !== -1 ? (r[`target_${yearIdx + 1}`] ?? '0') : '0'
    return {
      ...r,
      sasaranText: r.sasaran_kegiatan_text || r.sasaranText || '-',
      indikatorNama: r.indikator_kinerja || r.indikatorNama || '-',
      indikatorSatuan: r.satuan || r.indikatorSatuan || '',
      unitKerjaNames: r.unit_kerja ? [r.unit_kerja] : (r.unitKerjaNama ? [r.unitKerjaNama] : []),
      targetValue
    }
  })

  if (!searchQuery.value) return normalized
  const q = searchQuery.value.toLowerCase()
  return normalized.filter((r: any) =>
    r.sasaranText?.toLowerCase().includes(q) ||
    r.kode?.toLowerCase().includes(q) ||
    r.indikatorNama?.toLowerCase().includes(q)
  )
})

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 60 },
  { key: 'kode', label: 'Kode', center: true, width: 80 },
  { key: 'sasaranText', label: 'Sasaran Kegiatan', width: '25%' },
  { key: 'unit', label: 'Unit Kerja', width: '20%' },
  { key: 'indikatorNama', label: 'Indikator Kinerja', width: '25%' },
  { key: 'target', label: 'Target', center: true, width: 140 },
  { key: 'aksi', label: 'Aksi', center: true, width: 120 },
]

async function handleDelete(item: any) {
  if (!confirm(`Hapus sasaran kegiatan "${item.sasaranText}"?`)) return
  try {
    const res = await $fetch<any>(`/api/sasaran-kegiatan/${item.id}`, { method: 'DELETE' })
    if (res?.success === false) {
      alert(res.message || 'Gagal menghapus data.')
      return
    }
    refresh()
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || 'Gagal menghapus data.'
    alert(msg)
  }
}

watch([searchQuery, selectedYear, selectedUnitId], () => {
  // Reset handled by Table internally
})
</script>
