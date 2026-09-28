<template>
  <div :class="className">
    <slot />

    <!-- Search bar -->
    <div v-if="showSearch" class="mb-3 flex justify-end">
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari data..."
          class="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white w-64"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
      </div>
    </div>

    <div class="rounded-xl bg-white overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
        <thead class="bg-blue-100 sticky top-0 z-10">
          <template v-if="hasGroupedHeaders">
            <tr>
              <th
                v-for="cell in topHeaderCells"
                :key="cell.key"
                :rowspan="cell.type === 'column' ? 2 : undefined"
                :colspan="cell.type === 'group' ? cell.colspan : undefined"
                :style="cell.type === 'column' && cell.col.width ? { width: cell.col.width + (typeof cell.col.width === 'number' ? 'px' : '') } : {}"
                :class="[
                  'px-3 py-2 font-semibold align-middle',
                  cell.type === 'group' ? 'text-center text-blue-700' : getHeaderClass(cell.col)
                ]"
              >
                {{ cell.type === 'group' ? cell.label : (cell.col.label || cell.col.header) }}
              </th>
            </tr>
            <tr>
              <th
                v-for="col in groupedColumns"
                :key="col.key || col.accessor"
                :style="col.width ? { width: col.width + (typeof col.width === 'number' ? 'px' : '') } : {}"
                :class="['px-3 py-2 font-semibold align-middle', getHeaderClass(col)]"
              >
                {{ col.label || col.header }}
              </th>
            </tr>
          </template>
          <tr v-else>
            <th
              v-for="col in normalizedColumns"
              :key="col.key || col.accessor"
              :style="col.width ? { width: col.width + (typeof col.width === 'number' ? 'px' : '') } : {}"
              :class="[
                'px-3 py-2 font-semibold align-middle select-none',
                getHeaderClass(col),
                col.sortable ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''
              ]"
              @click="col.sortable ? toggleSort(col.key || col.accessor) : undefined"
            >
              <span class="inline-flex items-center gap-1">
                {{ col.label || col.header }}
                <span v-if="col.sortable" class="inline-flex flex-col leading-none" style="font-size:8px; line-height:1;">
                  <span :style="sortKey === (col.key || col.accessor) && sortDir === 'asc' ? 'color:#1d4ed8;font-weight:900;' : 'color:#93c5fd;'">▲</span>
                  <span :style="sortKey === (col.key || col.accessor) && sortDir === 'desc' ? 'color:#1d4ed8;font-weight:900;' : 'color:#93c5fd;'">▼</span>
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="pagedData.length">
            <tr
              v-for="(row, rowIndex) in pagedData"
              :key="row[rowKey] ?? rowIndex"
              class="align-middle bg-white hover:bg-slate-50 transition-colors"
            >
              <td
                v-for="col in normalizedColumns"
                :key="col.key || col.accessor"
                :class="['px-3 py-2 text-sm align-middle', getCellClass(col)]"
                style="color: #000 !important;"
              >
                <slot
                  :name="`cell-${String(col.key || col.accessor)}`"
                  :row="row"
                  :col="col"
                  :value="row[col.key || col.accessor]"
                  :index="rowIndex"
                  :page="page"
                  :absolute-index="(page - 1) * props.pageSize + rowIndex"
                >
                  <span v-if="col.render">{{ col.render(row) }}</span>
                  <span v-else>{{ row[col.key || col.accessor] }}</span>
                </slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="normalizedColumns.length" class="text-center py-8">
                <slot name="empty">
                  <span class="text-gray-400">Tidak ada data</span>
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="showPagination && totalPages > 1" class="flex justify-between items-center mt-4 px-2 pb-2">
        <span class="text-xs text-slate-500">
          Menampilkan {{ (page - 1) * props.pageSize + 1 }}–{{ Math.min(page * props.pageSize, filteredData.length) }} dari {{ filteredData.length }} data
        </span>
        <div class="flex gap-2">
          <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors">‹ Prev</button>
          <span class="text-sm text-slate-600 self-center">{{ page }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors">Next ›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Column {
  key: string
  label: string
  render?: (row: any) => string
  width?: string | number
  className?: string
  group?: string
  sortable?: boolean
  center?: boolean
  right?: boolean
}

interface HeaderGroupCell {
  key: string
  type: 'group' | 'column'
  label?: string
  colspan?: number
  col?: any
}

const props = defineProps({
  columns: { type: Array as () => Column[], required: true },
  data:    { type: Array as () => any[], required: true },
  pageSize:       { type: Number,  default: 10 },
  showSearch:     { type: Boolean, default: false },
  showPagination: { type: Boolean, default: true },
  rowKey:    { type: String, default: 'id' },
  className: { type: String, default: '' },
})

const searchTerm = ref('')
const page = ref(1)
const sortKey = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
  page.value = 1
}

const normalizedColumns = computed(() =>
  props.columns.map((col: any) => {
    if (col.accessor && col.header) return col
    return { accessor: col.key, header: col.label, ...col }
  })
)

const hasGroupedHeaders = computed(() => normalizedColumns.value.some((col: any) => Boolean(col.group)))
const groupedColumns    = computed(() => normalizedColumns.value.filter((col: any) => Boolean(col.group)))

const topHeaderCells = computed<HeaderGroupCell[]>(() => {
  const cells: HeaderGroupCell[] = []
  for (let i = 0; i < normalizedColumns.value.length; i++) {
    const col = normalizedColumns.value[i]
    if (!col.group) {
      cells.push({ key: `col-${String(col.key || col.accessor)}-${i}`, type: 'column', col })
      continue
    }
    let span = 1
    while (i + span < normalizedColumns.value.length && normalizedColumns.value[i + span].group === col.group) span++
    cells.push({ key: `group-${col.group}-${i}`, type: 'group', label: col.group, colspan: span })
    i += span - 1
  }
  return cells
})

// 1. Filter
const filteredData = computed(() => {
  if (!props.showSearch || !searchTerm.value) return props.data
  const q = searchTerm.value.toLowerCase()
  return props.data.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(q))
  )
})

// 2. Sort
const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filteredData.value].sort((a, b) => {
    const av = a[key] ?? ''
    const bv = b[key] ?? ''
    if (!isNaN(Number(av)) && !isNaN(Number(bv)) && av !== '' && bv !== '') {
      return (Number(av) - Number(bv)) * dir
    }
    return String(av).localeCompare(String(bv), 'id') * dir
  })
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / props.pageSize) || 1)
const pagedData  = computed(() => {
  const start = (page.value - 1) * props.pageSize
  return sortedData.value.slice(start, start + props.pageSize)
})

function prevPage() { if (page.value > 1) page.value-- }
function nextPage() { if (page.value < totalPages.value) page.value++ }

function getHeaderClass(col: any) {
  const isCenter = col.center || col.className?.includes('text-center')
  return [isCenter ? 'text-center' : 'text-left', col.color || 'text-blue-700']
}
function getCellClass(col: any) {
  if (col.center || col.className?.includes('text-center')) return 'text-center'
  if (col.right) return 'text-right'
  return 'text-left'
}

watch([() => props.data, searchTerm], () => { page.value = 1 })
</script>
