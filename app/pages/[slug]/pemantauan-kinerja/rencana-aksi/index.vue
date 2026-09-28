<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Pemantauan Rencana Aksi</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">Daftar laporan pemantauan aktivitas dan progres rencana aksi.</p>
        </div>
      </div>

      <div v-if="canInput" class="flex items-center gap-3">
        <NuxtLink
          :to="`/${route.params.slug}/pemantauan-kinerja/rencana-aksi/add`"
          class="px-6 py-3 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 flex items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Input Pemantauan
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

        <template #cell-rencanaAksi="{ row }">
          <div class="space-y-1">
            <p class="text-[13px] font-bold text-slate-800 leading-tight">{{ row.rencanaAksiNama }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ row.indikatorNama }}</p>
          </div>
        </template>

        <template #cell-unitKerja="{ value }">
          <span class="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">
            {{ value }}
          </span>
        </template>

        <template #cell-keterangan="{ value }">
          <p class="text-xs text-slate-600 italic">"{{ value }}"</p>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <NuxtLink
              :to="`/${route.params.slug}/pemantauan-kinerja/rencana-aksi/view?id=${row.id}`"
              class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <IconEye :size="18" />
            </NuxtLink>
            <NuxtLink
              v-if="canInput"
              :to="`/${route.params.slug}/pemantauan-kinerja/rencana-aksi/edit?id=${row.id}`"
              class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <IconPencil :size="18" />
            </NuxtLink>
            <button
              v-if="canInput"
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
  IconChartBar, IconPlus, IconSearch, IconEye, IconPencil, IconTrash 
} from '@tabler/icons-vue'
import UiTable from '@/components/UI/Table.vue'
import { useAuthUser } from '~/composables/useAuthUser'

const route = useRoute()
const { authUser, role } = useAuthUser()

const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isAdmin = computed(() => normalizedRole.value === 'admin')
const isUser = computed(() => normalizedRole.value === 'user')
const canInput = computed(() => isSuperAdmin.value || isAdmin.value || isUser.value)
const userUnit = computed(() => authUser.value?.unit_kerja?.trim() || null)

const searchQuery = ref('')

const { data: rawData, pending: loading, refresh } = useFetch('/api/pemantauan-rencana-aksi', { lazy: true, default: () => [] })

const tableColumns = [
  { key: 'no', label: 'No', align: 'center', width: 60 },
  { key: 'unitKerja', label: 'Unit Kerja', width: '20%' },
  { key: 'rencanaAksi', label: 'Rencana Aksi & Indikator', width: '40%' },
  { key: 'keterangan', label: 'Keterangan', width: '25%' },
  { key: 'aksi', label: 'Aksi', align: 'center', width: 150 },
]

const displayRows = computed(() => {
  let rows = (rawData.value || []) as any[]
  if (rawData.value?.data) rows = rawData.value.data

  // Filter based on user role and unit kerja
  if (!isSuperAdmin.value && userUnit.value) {
    if (isAdmin.value) {
      // Eselon 1 admin sees plans linked to their cascaded programs
      rows = rows.filter(r => (r.programUnitKerja || '').trim() === userUnit.value)
    } else {
      // Eselon 2 user sees plans belonging to their activities
      rows = rows.filter(r => (r.unitKerja || '').trim() === userUnit.value)
    }
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    rows = rows.filter(r => 
      r.rencanaAksiNama?.toLowerCase().includes(q) || 
      r.keterangan?.toLowerCase().includes(q) ||
      r.unitKerja?.toLowerCase().includes(q)
    )
  }

  return rows
})

async function handleDelete(row: any) {
  if (!confirm('Hapus laporan pemantauan ini?')) return
  try {
    await $fetch(`/api/pemantauan-rencana-aksi?id=${row.id}`, { method: 'DELETE' })
    refresh()
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
