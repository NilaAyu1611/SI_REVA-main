<template>
  <div>
    <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Memuat struktur organisasi...</div>
    <div v-else-if="errorMsg" class="p-8 text-center text-sm text-red-500">{{ errorMsg }}</div>

    <div v-else class="org-chart-wrapper">
      <div class="zoom-controls">
        <span class="zoom-controls-label">Zoom</span>
        <button @click="zoomOut" class="zoom-btn" title="Zoom Out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
        <button @click="zoomIn" class="zoom-btn" title="Zoom In">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button @click="resetZoom" class="zoom-btn zoom-btn-text" title="Reset">Reset</button>
        <div class="zoom-divider"></div>
        <button @click="refreshChart" class="zoom-btn" title="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button @click="exportPDF" :disabled="isExporting" class="export-btn" title="Export PDF">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {{ isExporting ? 'Exporting...' : 'Export PDF' }}
        </button>
      </div>

      <div ref="scrollContainer" class="org-chart-container" @wheel.prevent="handleWheel">
        <div ref="chartAreaRef" class="zoom-area" :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }">
          <div class="root-row">
            <div v-if="tree.length === 0" class="empty-state">Tidak ada data organisasi untuk ditampilkan.</div>
            <template v-else>
              <UnitKerjaOrgNode
                v-for="root in tree"
                :key="root.id"
                :node="root"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import UnitKerjaOrgNode from './UnitKerjaOrgNode.client.vue'

export interface OrgChartNode {
  id: number
  nama: string
  level: number | null
  parentId: number | null
  children: OrgChartNode[]
}

const { data, error, pending, refresh } = useFetch<OrgChartNode[]>('/api/organisasi', {
  lazy: true,
  default: () => [] as OrgChartNode[],
  server: false  // ← This prevents SSR fetch entirely
})

const loading = computed(() => pending.value && (!data.value || (data.value as OrgChartNode[]).length === 0))

const errorMsg = computed(() => {
  if (!error.value) return ''
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data organisasi.'
})

const tree = computed<OrgChartNode[]>(() => (Array.isArray(data.value) ? data.value : []))

const zoom = ref(1)
const isExporting = ref(false)
const chartAreaRef = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

function zoomIn() { if (zoom.value < 2) zoom.value = Math.round((zoom.value + 0.1) * 10) / 10 }
function zoomOut() { if (zoom.value > 0.3) zoom.value = Math.round((zoom.value - 0.1) * 10) / 10 }
function resetZoom() { zoom.value = 1 }
async function refreshChart() { await refresh() }

function handleWheel(e: WheelEvent) {
  if (e.ctrlKey) {
    e.deltaY < 0 ? zoomIn() : zoomOut()
  }
}

async function exportPDF() {
  if (!chartAreaRef.value || isExporting.value) return
  isExporting.value = true

  const oldZoom = zoom.value
  zoom.value = 1
  await nextTick()

  try {
    const html2pdf = (await import('html2pdf.js')).default
    await html2pdf().set({
      margin: 0.5,
      filename: 'Organization_Chart_Unit_Kerja.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' }
    }).from(chartAreaRef.value as any).save()
  } catch (err) {
    console.error('PDF export failed:', err)
  } finally {
    zoom.value = oldZoom
    isExporting.value = false
  }
}
</script>

<style scoped>
.org-chart-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.zoom-controls-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: 0.25rem;
}

.zoom-btn {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  padding: 0.3rem 0.45rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  transition: all 0.15s;
  line-height: 1;
}

.zoom-btn:hover { background: #f1f5f9; color: #0f172a; }
.zoom-btn-text { font-size: 0.78rem; font-weight: 500; padding: 0.3rem 0.65rem; }

.zoom-divider {
  width: 1px;
  height: 1.4rem;
  background: #e2e8f0;
  margin: 0 0.25rem;
}

.zoom-level {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  min-width: 3rem;
  text-align: center;
}

.export-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 0.45rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.export-btn:hover:not(:disabled) { background: #1e40af; }
.export-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.org-chart-container {
  overflow: auto;
  padding: 2rem 1.5rem 3rem;
  flex-grow: 1;
  background: #fafcff;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.org-chart-container::-webkit-scrollbar { width: 7px; height: 7px; }
.org-chart-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.zoom-area {
  transition: transform 0.18s ease-out;
  min-width: max-content;
  min-height: max-content;
}

.root-row {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  align-items: flex-start;
}

.empty-state {
  font-size: 0.85rem;
  color: #94a3b8;
  padding: 3rem 0;
  text-align: center;
}
</style>
