<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Unit Kerja</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-between items-center gap-2">
          <button
            type="button"
            @click="openModal()"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow transition-colors"
          >
            <IconPlus :size="16" :stroke="'2'" />
            Input Unit Kerja
          </button>
          <button
            type="button"
            @click="handlePrintOrgChart"
            :disabled="printLoading"
            class="bg-[#2663A3] hover:bg-blue-800 text-white font-bold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow disabled:opacity-50 transition-colors"
          >
            <span v-if="printLoading" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <IconDownload v-else :size="16" :stroke="'2'" />
            Cetak / PDF
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500">Memuat data...</div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600">{{ errorMessage }}</div>
      <div v-else class="p-5">
        <Table
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
                @click="openModal(row)"
                :aria-label="`Edit ${row.nama}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                @click="deleteUnitKerja(row.id)"
                :aria-label="`Hapus ${row.nama}`"
                title="Hapus"
                class="action-btn action-btn-delete"
              >
                <IconTrash :size="16" :stroke="'2'" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>



    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-800">{{ isEdit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <div class="p-5">
          <form @submit.prevent="saveUnitKerja" class="space-y-4">
            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Unit Kerja <span class="text-red-500">*</span></label>
              <input v-model="formData.nama" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>

            <!-- Level Dropdown -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Level <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div class="relative">
                <select
                  v-model="formData.level"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none pr-9 bg-white"
                >
                  <option :value="null">-- Tidak dipilih --</option>
                  <option v-for="lvl in levelOptions" :key="lvl.value" :value="lvl.value">
                    {{ lvl.label }}
                  </option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
              <p v-if="selectedLevelDesc" class="mt-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2.5 py-1.5">{{ selectedLevelDesc }}</p>
            </div>

            <!-- Parent ID Dropdown -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Unit Induk (Parent) <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
              </label>
              <!-- Search filter for parent dropdown -->
              <div class="relative mb-1">
                <input
                  v-model="parentSearch"
                  type="text"
                  placeholder="Ketik untuk cari unit induk..."
                  class="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-slate-50"
                />
                <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
              </div>
              <div class="relative">
                <select
                  v-model="formData.parentId"
                  size="5"
                  class="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm"
                >
                  <option :value="null" class="font-semibold text-slate-500 py-1">(Tidak ada — unit level teratas)</option>
                  <option
                    v-for="u in filteredParentOptions"
                    :key="u.id"
                    :value="u.id"
                    :disabled="u.id === formData.id"
                    class="py-1"
                  >
                    {{ u.levelLabel }} {{ u.nama }}
                  </option>
                </select>
              </div>
              <p v-if="formData.parentId" class="mt-1 text-xs text-blue-600 font-medium">
                Induk dipilih: <strong>{{ rawUnitsById.get(formData.parentId)?.nama || formData.parentId }}</strong>
              </p>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { IconPencil, IconTrash, IconPlus, IconDownload } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'
import { printOrgChart } from '~/utils/printOrgChart.js'

definePageMeta({ layout: 'dashboard' })

const columns = [
  { key: 'no', label: 'No.', className: 'text-center w-16' },
  { key: 'nama', label: 'Unit Kerja' },
  { key: 'parent', label: 'Parent Unit' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const printLoading = ref(false)

function handlePrintOrgChart() {
  if (printLoading.value) return
  printLoading.value = true
  try {
    printOrgChart(units.value)
  } finally {
    printLoading.value = false
  }
}


const fetcher = (url) => fetch(url).then((r) => r.json())
const { data, error, pending, refresh } = useFetch('/api/unit-kerja', { lazy: true, default: () => [] })

const loading = computed(() => pending.value && !data.value)

const errorMessage = computed(() => {
  if (!error.value) return ''
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data unit kerja.'
})

const units = computed(() => (Array.isArray(data.value) ? data.value : []))

const tableRows = computed(() => {
  const byId = new Map()
  for (const item of units.value) {
    byId.set(item.id, item)
  }

  let mappedRows = units.value.map((item) => ({
    no: 0,
    id: item.id,
    nama: item.nama || '-',
    parent: item.parentId ? byId.get(item.parentId)?.nama || '-' : '-',
    aksi: '',
  }))

  mappedRows.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }))

  mappedRows = mappedRows.map((item, index) => ({
    ...item,
    no: index + 1
  }))

  return mappedRows
})

// Level options
const levelOptions = [
  { value: 0, label: '0 — Pimpinan Tertinggi (Kepala LAN)', desc: 'Pimpinan tertinggi lembaga, misalnya Kepala LAN.' },
  { value: 1, label: '1 — Eselon I (Deputi / Sekretaris Utama)', desc: 'Unit Eselon I di bawah pimpinan, misalnya Deputi atau Sekretaris Utama.' },
  { value: 2, label: '2 — Eselon II (Biro / Pusat / Direktorat)', desc: 'Unit Eselon II, misalnya Biro, Pusat, Direktorat, atau Inspektorat.' },
  { value: 3, label: '3 — Eselon III (Bagian / Bidang)', desc: 'Unit Eselon III, misalnya Bagian atau Bidang.' },
  { value: 4, label: '4 — Eselon IV (Sub Bagian / Sub Bidang)', desc: 'Unit Eselon IV, misalnya Sub Bagian atau Sub Bidang.' },
]

const selectedLevelDesc = computed(() => {
  const opt = levelOptions.find(o => o.value === formData.level)
  return opt?.desc || ''
})

// Fast id-keyed map for reliable edit lookups
const rawUnitsById = computed(() => {
  const map = new Map()
  for (const item of units.value) {
    if (item.id != null) map.set(item.id, item)
  }
  return map
})

// Parent search filter state
const parentSearch = ref('')

const filteredParentOptions = computed(() => {
  const q = parentSearch.value.trim().toLowerCase()
  return units.value
    .filter(u => !q || u.nama?.toLowerCase().includes(q))
    .map(u => ({
      ...u,
      levelLabel: u.level != null ? `[L${u.level}]` : ''
    }))
    .sort((a, b) => {
      // sort by level first, then by name
      if ((a.level ?? 99) !== (b.level ?? 99)) return (a.level ?? 99) - (b.level ?? 99)
      return a.nama?.localeCompare(b.nama, 'id', { sensitivity: 'base' }) ?? 0
    })
})

// Modal & Form State
const showModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const formData = reactive({
  id: null,
  nama: '',
  level: null,
  parentId: null
})

function openModal(row) {
  isEdit.value = !!row
  parentSearch.value = ''
  if (row) {
    formData.id = row.id
    const originalItem = rawUnitsById.value.get(Number(row.id))
    if (originalItem) {
      formData.nama = originalItem.nama || ''
      formData.level = originalItem.level ?? null
      formData.parentId = originalItem.parentId ?? null
    } else {
      formData.nama = row.nama !== '-' ? row.nama : ''
      formData.level = null
      formData.parentId = null
    }
  } else {
    formData.id = null
    formData.nama = ''
    formData.level = null
    formData.parentId = null
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveUnitKerja() {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const response = await fetch('/api/unit-kerja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.statusMessage || 'Gagal menyimpan data')
    }
    
    closeModal()
    await refresh()
  } catch (err) {
    alert(err.message || 'Terjadi kesalahan saat menyimpan data')
  } finally {
    isSaving.value = false
  }
}

async function deleteUnitKerja(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus unit kerja ini?')) return
  
  try {
    const response = await fetch('/api/unit-kerja', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.statusMessage || 'Gagal menghapus data')
    }
    
    await refresh()
  } catch (err) {
    alert(err.message || 'Terjadi kesalahan saat menghapus data')
  }
}
</script>

<style scoped>
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
