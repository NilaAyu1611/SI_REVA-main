<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Unit Kerja</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <button
            type="button"
            class="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow"
          >
            <IconPlus :size="16" :stroke="'2'" />
            Input Unit Kerja
          </button>
        </div>
      </div>

      <div class="px-5 pt-4 bg-white border-b border-slate-100">
        <div class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            class="tab-btn"
            :class="activeTab === 'table' ? 'tab-btn-active' : 'tab-btn-inactive'"
            @click="activeTab = 'table'"
          >
            Tabel Unit Kerja
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="activeTab === 'chart' ? 'tab-btn-active' : 'tab-btn-inactive'"
            @click="activeTab = 'chart'"
          >
            Organization Chart
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500">Memuat data...</div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600">{{ errorMessage }}</div>
      <div v-else class="p-5">
        <Table
          v-if="activeTab === 'table'"
          :columns="columns"
          :data="tableRows"
          rowKey="id"
          :showSearch="true"
          :showPagination="true"
          :pageSize="10"
        >
          <template #cell-parent="{ row }">
            <span>{{ row.parent || '-' }}</span>
          </template>

          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                :aria-label="`Edit ${row.nama}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                :aria-label="`Hapus ${row.nama}`"
                title="Hapus"
                class="action-btn action-btn-delete"
              >
                <IconTrash :size="16" :stroke="'2'" />
              </button>
            </div>
          </template>
        </Table>

        <div v-else class="org-chart-wrap">
          <UnitKerjaOrgChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref } from 'vue'
import useSWRV from 'swrv'
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'
import UnitKerjaOrgChart from '@/components/UI/UnitKerjaOrgChart.vue'

interface UnitKerjaApi {
  id: number
  nama: string | null
  level: number | null
  parentId: number | null
  createdAt: string | null
  updatedAt: string | null
}

interface UnitKerjaRow {
  id: number
  nama: string
  parent: string
  aksi: string
}

const columns = [
  { key: 'id', label: 'ID', className: 'text-center w-16' },
  { key: 'nama', label: 'Unit Kerja' },
  { key: 'parent', label: 'Parent Unit' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const activeTab = ref<'table' | 'chart'>('table')

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const { data, error, isValidating } = useSWRV<UnitKerjaApi[]>('/api/unit-kerja', fetcher)

const loading = computed(() => isValidating.value && !data.value)

const errorMessage = computed(() => {
  if (!error.value) return ''
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data unit kerja.'
})

const units = computed<UnitKerjaApi[]>(() => (Array.isArray(data.value) ? data.value : []))

const tableRows = computed<UnitKerjaRow[]>(() => {
  const byId = new Map<number, UnitKerjaApi>()
  for (const item of units.value) {
    byId.set(item.id, item)
  }

  return units.value.map((item) => ({
    id: item.id,
    nama: item.nama || '-',
    parent: item.parentId ? byId.get(item.parentId)?.nama || '-' : '-',
    aksi: '',
  }))
})
</script>

<style scoped>
.tab-btn {
  border-radius: 0.45rem;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.45rem 0.8rem;
  transition: all 0.15s ease;
}

.tab-btn-active {
  background: #1d4ed8;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.2);
}

.tab-btn-inactive {
  color: #475569;
}

.tab-btn-inactive:hover {
  background: #e2e8f0;
}

.org-chart-wrap {
  min-height: 25rem;
}

.org-chart-scroll {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.action-btn {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn-edit {
  color: #1d4ed8;
  background: #dbeafe;
  border-color: #bfdbfe;
}

.action-btn-edit:hover {
  color: #fff;
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn-delete {
  color: #b91c1c;
  background: #fee2e2;
  border-color: #fecaca;
}

.action-btn-delete:hover {
  color: #fff;
  background: #dc2626;
  border-color: #dc2626;
}
</style>
