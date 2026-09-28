import { defineComponent as _defineComponent } from 'vue'
import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, unref as _unref, createBlock as _createBlock, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, createVNode as _createVNode, withCtx as _withCtx, vModelText as _vModelText, withDirectives as _withDirectives, withModifiers as _withModifiers } from "vue"

const _hoisted_1 = { class: "space-y-4" }
const _hoisted_2 = { class: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" }
const _hoisted_3 = { class: "px-5 py-3 border-b border-slate-200 bg-white" }
const _hoisted_4 = { class: "flex w-full justify-end gap-2" }
const _hoisted_5 = ["disabled"]
const _hoisted_6 = {
  key: 0,
  class: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
}
const _hoisted_7 = {
  key: 0,
  class: "p-6 text-sm text-slate-500"
}
const _hoisted_8 = {
  key: 1,
  class: "p-6 text-sm text-red-600"
}
const _hoisted_9 = {
  key: 2,
  class: "p-5"
}
const _hoisted_10 = { class: "flex items-center justify-center gap-2" }
const _hoisted_11 = ["onClick", "aria-label"]
const _hoisted_12 = ["onClick", "aria-label"]
const _hoisted_13 = {
  key: 0,
  class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
}
const _hoisted_14 = { class: "bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden" }
const _hoisted_15 = { class: "px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center" }
const _hoisted_16 = { class: "text-lg font-semibold text-slate-800" }
const _hoisted_17 = { class: "p-5" }
const _hoisted_18 = { class: "flex justify-end gap-2 mt-6" }
const _hoisted_19 = ["disabled"]

import { computed, ref, reactive } from 'vue'
import { IconPencil, IconTrash, IconPlus, IconDownload } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'

interface UnitKerjaApi {
  id: number
  nama: string | null
  level: number | null
  parentId: number | null
  createdAt: string | null
  updatedAt: string | null
}

interface UnitKerjaRow {
  no: number
  id: number
  nama: string
  parent: string
  aksi: string
}


export default /*@__PURE__*/_defineComponent({
  setup(__props) {

definePageMeta({ layout: 'dashboard' })

const columns = [
  { key: 'no', label: 'No.', className: 'text-center w-16' },
  { key: 'nama', label: 'Unit Kerja' },
  { key: 'parent', label: 'Parent Unit' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const printLoading = ref(false)

function printOrgChart() {
  if (printLoading.value) return
  printLoading.value = true
  try {
    const flatList = units.value
    
    // Find Kepala LAN (level === 0)
    const kepalaLanNode = flatList.find(u => u.level === 0) || flatList.find(u => (u.nama || '').toLowerCase().includes('kepala lan'))
    
    const nodeMap = new Map<number, any>()
    for (const item of flatList) {
      nodeMap.set(item.id, {
        id: item.id,
        nama: item.nama || '',
        level: item.level ?? 0,
        parentId: item.parentId,
        children: []
      })
    }

    const eselon1Nodes: any[] = []
    const directEselon2Nodes: any[] = []

    for (const node of nodeMap.values()) {
      if (node.id === kepalaLanNode?.id) continue
      if (node.level === 1) {
        eselon1Nodes.push(node)
      } else if (node.level === 2) {
        if (node.parentId && nodeMap.has(node.parentId) && nodeMap.get(node.parentId).level === 1) {
          nodeMap.get(node.parentId).children.push(node)
        } else {
          directEselon2Nodes.push(node)
        }
      }
    }

    // Sort Eselon 1 and Eselon 2 by name
    eselon1Nodes.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }))
    directEselon2Nodes.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }))
    for (const node of nodeMap.values()) {
      if (node.children && node.children.length > 0) {
        node.children.sort((a: any, b: any) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }))
      }
    }

    // Build the Eselon 1 level HTML
    const spItems = [...eselon1Nodes, ...directEselon2Nodes].map((sp: any) => {
      const isEselon2 = sp.level === 2
      const badgeText = isEselon2 ? 'ESELON II' : 'ESELON I'
      const badgeClass = isEselon2 ? 'sk-badge' : 'sp-badge'
      const cardStyle = isEselon2 ? 'style="border-color: #059669;"' : ''
      
      let skItems = ''
      if (sp.children && sp.children.length > 0) {
        skItems = sp.children.map((sk: any) => `
          <li class="sk-item">
            <div class="sk-card">
              <div class="badge sk-badge">ESELON II</div>
              <div class="card-text">${sk.nama}</div>
            </div>
          </li>
        `).join('')
      }

      const skLevelHtml = skItems ? `<ul class="sk-level">${skItems}</ul>` : ''

      return `
        <li class="sp-item">
          <div class="sp-card" ${cardStyle}>
            <div class="badge ${badgeClass}">${badgeText}</div>
            <div class="card-text">${sp.nama}</div>
          </div>
          ${skLevelHtml}
        </li>
      `
    }).join('')

    // Build Kepala LAN HTML
    const kepalaLanName = kepalaLanNode ? kepalaLanNode.nama : 'Kepala LAN'
    const spLevelHtml = spItems ? `<ul class="sp-level">${spItems}</ul>` : ''
    const ssItems = `
      <li class="ss-item">
        <div class="ss-card">
          <div class="badge ss-badge">KEPALA LAN</div>
          <div class="ss-title">${kepalaLanName}</div>
          <div class="ss-sub">&#128100; Lembaga Administrasi Negara</div>
        </div>
        ${spLevelHtml}
      </li>
    `

    const ssListHtml = ssItems ? '<ul class="ss-level">' + ssItems + '</ul>' : '<p style="text-align:center;color:#94a3b8;padding:40px;">Tidak ada data untuk ditampilkan.</p>'
    const printDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const sOpen = '<' + 'script>'
    const sClose = '</' + 'script>'

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Peta Struktur Organisasi Unit Kerja</title>
<style>
  @page { size: A3 landscape; margin: 8mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #fff; color: #1e293b; font-size: 6.5pt;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* ── HEADER ── */
  .hdr {
    background: linear-gradient(135deg,#1f4f85,#2663a3);
    color:#fff; text-align:center; padding:8px 16px; border-radius:8px; margin-bottom:10px;
  }
  .hdr h1 { font-size:12pt; font-weight:900; letter-spacing:1px; text-transform:uppercase; margin: 0; }
  .hdr p { font-size:7pt; color:#bfdbfe; margin-top:2px; }
  
  /* ── LEGEND ── */
  .legend { display:flex; gap:14px; justify-content:center; margin-bottom:10px; }
  .legend-item { display:flex; align-items:center; gap:4px; font-size:6pt; font-weight:700; }
  .dot { width:9px; height:9px; border-radius:2px; }
  .dot.ss { background:#1e3a8a; }
  .dot.sp { background:#7c3aed; }
  .dot.sk { background:#059669; }

  /* ── BADGES ── */
  .badge {
    display:inline-block; font-size:5pt; font-weight:900; padding:1px 4px;
    border-radius:3px; margin-bottom:3px; letter-spacing:.3px; text-transform:uppercase;
  }
  .ss-badge { background:#fef3c7; color:#92400e; border:1px solid #fcd34d; }
  .sp-badge { background:#ede9fe; color:#4c1d95; border:1px solid #a78bfa; }
  .sk-badge { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }

  /* ── LAN CARD ── */
  .lan-card {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #fff; border-radius: 8px; padding: 10px 18px;
    min-width: 220px; text-align: center;
    border-bottom: 4px solid #3b82f6;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
    position: relative;
    z-index: 10;
  }
  .lan-title { font-size: 9pt; font-weight: 900; letter-spacing: 0.5px; }

  /* ── SS level (children of LAN) ── */
  .ss-level {
    display: flex;
    list-style: none;
    padding-top: 24px;   /* room for the vertical drop line from LAN */
    position: relative;
    gap: 0;
  }

  /* Vertical line dropping from LAN card bottom to the horizontal bar */
  .ss-level::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 24px;
    border-left: 1.5px solid #1e3a8a;
  }

  /* Each SS item */
  .ss-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 12px;
  }

  /* Left horizontal arm (toward left sibling) */
  .ss-item::before {
    content: '';
    position: absolute;
    top: 0; right: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #1e3a8a;
  }
  /* Right horizontal arm (toward right sibling) */
  .ss-item::after {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #1e3a8a;
  }
  /* Single child — no horizontal arms */
  .ss-item:only-child::before,
  .ss-item:only-child::after  { display: none; }
  /* First child — no left arm */
  .ss-item:first-child::before { display: none; }
  /* Last child  — no right arm */
  .ss-item:last-child::after   { display: none; }

  /* SS card — vertical stub from horizontal bar down to card top */
  .ss-card {
    margin-top: 24px;   /* space for stub */
    position: relative;
  }
  .ss-card::before {
    content: '';
    position: absolute;
    top: -24px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 24px;
    border-left: 1.5px solid #1e3a8a;
  }

  /* ── SS CARD ── */
  .ss-card {
    background:linear-gradient(135deg,#1e3a8a,#1d4ed8);
    color:#fff; border-radius:8px; padding:9px 14px;
    min-width:240px; max-width:320px;
    border-left:4px solid #fbbf24;
    box-shadow:0 3px 10px rgba(30,58,138,.25);
  }
  .ss-title { font-size:8.5pt; font-weight:800; line-height:1.35; margin-bottom:4px; text-align: center; }
  .ss-sub   { font-size:6pt; color:#bfdbfe; text-align: center; }

  /* ── SP CARD ── */
  .sp-card {
    background:#fff; border:1.5px solid #7c3aed; border-radius:7px;
    padding:7px 9px; min-width:150px; max-width:200px;
    box-shadow:0 2px 6px rgba(124,58,237,.1);
  }
  .card-text     { font-size:6.5pt; font-weight:700; line-height:1.4; color:#1e293b; margin-bottom:4px; text-align: center; }

  /* ── SK CARD ── */
  .sk-card {
    background:#fff; border:1.5px solid #059669; border-radius:6px;
    padding:6px 8px; min-width:130px; max-width:175px;
    box-shadow:0 1px 4px rgba(5,150,105,.09);
  }

  /* ── SP level (children of SS) ── */
  .sp-level {
    display: flex;
    list-style: none;
    padding-top: 24px;   /* room for the vertical drop line from SS */
    position: relative;
    gap: 0;
  }

  /* Vertical line dropping from SS card bottom to the horizontal bar */
  .sp-level::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 24px;
    border-left: 1.5px solid #7c3aed;
  }

  /* Each SP item */
  .sp-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 8px;
  }

  /* Left horizontal arm (toward left sibling) */
  .sp-item::before {
    content: '';
    position: absolute;
    top: 0; right: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #7c3aed;
  }
  /* Right horizontal arm (toward right sibling) */
  .sp-item::after {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #7c3aed;
  }
  /* Single child — no horizontal arms */
  .sp-item:only-child::before,
  .sp-item:only-child::after  { display: none; }
  /* First child — no left arm */
  .sp-item:first-child::before { display: none; }
  /* Last child  — no right arm */
  .sp-item:last-child::after   { display: none; }

  /* SP card — vertical stub from horizontal bar down to card top */
  .sp-card {
    margin-top: 24px;   /* space for stub */
    position: relative;
  }
  .sp-card::before {
    content: '';
    position: absolute;
    top: -24px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 24px;
    border-left: 1.5px solid #7c3aed;
  }

  /* ── SK level (children of SP) ── */
  .sk-level {
    display: flex;
    list-style: none;
    padding-top: 18px;
    position: relative;
    gap: 0;
    margin-top: 0;
  }

  /* Vertical drop from SP card bottom */
  .sk-level::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 18px;
    border-left: 1.5px solid #059669;
  }

  .sk-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 6px;
  }

  .sk-item::before {
    content: '';
    position: absolute;
    top: 0; right: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #059669;
  }
  .sk-item::after {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #059669;
  }
  .sk-item:only-child::before,
  .sk-item:only-child::after  { display: none; }
  .sk-item:first-child::before { display: none; }
  .sk-item:last-child::after   { display: none; }

  .sk-card {
    margin-top: 18px;
    position: relative;
  }
  .sk-card::before {
    content: '';
    position: absolute;
    top: -18px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 18px;
    border-left: 1.5px solid #059669;
  }

  .btn-wrap { text-align:center; margin-top:20px; padding-bottom:12px; }
  .btn-print {
    padding:8px 24px; background:#1f4f85; color:#fff; border:none;
    border-radius:7px; font-weight:700; font-size:9pt; cursor:pointer;
  }
  .tree-wrapper {
    overflow-x: auto;
    padding: 20px;
    margin-bottom: 20px;
  }
  #cascade-tree {
    min-width: max-content;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media print {
    .btn-wrap { display:none; }
    body { background:white; }
    .tree-wrapper {
      overflow-x: visible;
      padding: 0;
    }
    #cascade-tree {
      min-width: max-content;
      display: flex;
    }
  }
  
  /* ── MOBILE RESPONSIVE STYLES ── */
  @media screen and (max-width: 768px), print and (max-width: 768px) {
    body {
      font-size: 8pt !important;
      padding: 10px !important;
    }
    .hdr {
      padding: 12px !important;
      margin-bottom: 15px !important;
    }
    .hdr h1 {
      font-size: 13pt !important;
    }
    .hdr p {
      font-size: 8pt !important;
    }
    .legend {
      flex-wrap: wrap !important;
      gap: 10px !important;
      margin-bottom: 15px !important;
    }
    .legend-item {
      font-size: 7.5pt !important;
    }
    .dot {
      width: 12px !important;
      height: 12px !important;
    }
    
    .tree-wrapper {
      padding: 10px 0 !important;
      overflow-x: visible !important;
    }
    
    #cascade-tree {
      min-width: 100% !important;
      width: 100% !important;
      transform: none !important;
      margin-bottom: 0 !important;
    }
    
    .ss-level, .sp-level, .sk-level {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      padding-top: 20px !important;
      gap: 20px !important;
      width: 100% !important;
    }
    
    .ss-level::before, .sp-level::before, .sk-level::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 0 !important;
      height: 100% !important;
      z-index: 1 !important;
    }
    .ss-level::before { border-left: 2px solid #1e3a8a !important; }
    .sp-level::before { border-left: 2px solid #7c3aed !important; }
    .sk-level::before { border-left: 2px solid #059669 !important; }
    
    .ss-item, .sp-item, .sk-item {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: 100% !important;
      padding: 0 !important;
    }
    
    .ss-item::before, .ss-item::after,
    .sp-item::before, .sp-item::after,
    .sk-item::before, .sk-item::after {
      display: none !important;
    }
    
    .lan-card, .ss-card, .sp-card, .sk-card {
      position: relative !important;
      z-index: 5 !important;
      margin-top: 0 !important;
      width: 95% !important;
      max-width: 340px !important;
      min-width: auto !important;
    }
    
    .ss-card::before, .sp-card::before, .sk-card::before {
      display: none !important;
    }
    
    .sp-level {
      margin-top: 10px !important;
    }
    .sk-level {
      margin-top: 10px !important;
    }
  }
</style>
</head>
<body>
<div class="hdr">
  <h1>Peta Struktur Organisasi</h1>
  <p>Lembaga Administrasi Negara &bull; Dicetak: ${printDate}</p>
</div>

<div class="legend">
  <div class="legend-item"><div class="dot ss"></div> Kepala LAN</div>
  <div class="legend-item"><div class="dot sp"></div> Eselon I</div>
  <div class="legend-item"><div class="dot sk"></div> Eselon II</div>
</div>

<div class="tree-wrapper">
  <div id="cascade-tree">
    <div class="lan-card">
      <div class="badge" style="background:#475569; color:#fff; border:1px solid #64748b; margin-bottom:2px;">INSTANSI</div>
      <div class="lan-title">Lembaga Administrasi Negara (LAN)</div>
    </div>
    ${ssListHtml}
  </div>
</div>

<div class="btn-wrap">
  <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
</div>

${sOpen}
function adjustScale() {
  var tree = document.getElementById('cascade-tree');
  if (!tree) return;
  tree.style.transform = 'none';
  tree.style.transformOrigin = 'top center';
  tree.style.marginBottom = '0px';

  if (window.innerWidth <= 768) return;

  var tw = tree.scrollWidth;
  var pw = document.documentElement.clientWidth;
  if (tw > pw) {
    var scale = pw / tw;
    tree.style.transform = 'scale(' + scale + ')';
    tree.style.marginBottom = ((scale - 1) * tree.scrollHeight) + 'px';
  }
}
adjustScale();
setTimeout(adjustScale, 100);
if (document.readyState === 'complete') {
  adjustScale();
} else {
  window.addEventListener('DOMContentLoaded', adjustScale);
  window.addEventListener('load', adjustScale);
}
window.addEventListener('resize', adjustScale);
window.addEventListener('beforeprint', adjustScale);
window.addEventListener('afterprint', adjustScale);
${sClose}
</body>
</html>`

    const win = window.open('', '_blank', 'width=1400,height=900')
    if (!win) {
      alert('Popup diblokir browser. Mohon izinkan popup untuk halaman ini.')
      return
    }
    win.document.write(html)
    win.document.close()
  } finally {
    printLoading.value = false
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const { data, error, pending, refresh } = useFetch('/api/unit-kerja', { lazy: true, default: () => [] })

const loading = computed(() => pending.value && !data.value)

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

// Modal & Form State
const showModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const formData = reactive({
  id: null as number | null,
  nama: '',
  level: null as number | null,
  parentId: null as number | null
})

function openModal(row?: UnitKerjaRow) {
  isEdit.value = !!row
  if (row) {
    formData.id = row.id
    const originalItem = units.value.find(u => u.id === row.id)
    if (originalItem) {
      formData.nama = originalItem.nama || ''
      formData.level = originalItem.level || null
      formData.parentId = originalItem.parentId || null
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
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menyimpan data')
  } finally {
    isSaving.value = false
  }
}

async function deleteUnitKerja(id: number) {
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
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menghapus data')
  }
}

return (_ctx: any,_cache: any) => {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _cache[4] || (_cache[4] = _createElementVNode("div", { class: "px-5 py-4 border-b border-slate-200 bg-slate-50 text-center" }, [
        _createElementVNode("h1", { class: "text-lg font-semibold text-slate-800" }, "Master Unit Kerja")
      ], -1 /* CACHED */)),
      _createElementVNode("div", _hoisted_3, [
        _createElementVNode("div", _hoisted_4, [
          _createElementVNode("button", {
            type: "button",
            onClick: printOrgChart,
            disabled: printLoading.value,
            class: "bg-[#2663A3] hover:bg-blue-800 text-white font-bold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow disabled:opacity-50 transition-colors"
          }, [
            (printLoading.value)
              ? (_openBlock(), _createElementBlock("span", _hoisted_6))
              : (_openBlock(), _createBlock(_unref(IconDownload), {
                  key: 1,
                  size: 16,
                  stroke: '2'
                })),
            _cache[3] || (_cache[3] = _createTextVNode(" Cetak / PDF ", -1 /* CACHED */))
          ], 8 /* PROPS */, _hoisted_5)
        ])
      ]),
      (loading.value)
        ? (_openBlock(), _createElementBlock("div", _hoisted_7, "Memuat data..."))
        : (errorMessage.value)
          ? (_openBlock(), _createElementBlock("div", _hoisted_8, _toDisplayString(errorMessage.value), 1 /* TEXT */))
          : (_openBlock(), _createElementBlock("div", _hoisted_9, [
              _createVNode(Table, {
                columns: columns,
                data: tableRows.value,
                rowKey: "id",
                showSearch: true,
                showPagination: true,
                pageSize: 10
              }, {
                "cell-parent": _withCtx(({ row }) => [
                  _createElementVNode("span", null, _toDisplayString(row.parent || '-'), 1 /* TEXT */)
                ]),
                "cell-aksi": _withCtx(({ row }) => [
                  _createElementVNode("div", _hoisted_10, [
                    _createElementVNode("button", {
                      type: "button",
                      onClick: ($event: any) => (openModal(row)),
                      "aria-label": `Edit ${row.nama}`,
                      title: "Edit",
                      class: "action-btn action-btn-edit"
                    }, [
                      _createVNode(_unref(IconPencil), {
                        size: 16,
                        stroke: '2'
                      })
                    ], 8 /* PROPS */, _hoisted_11),
                    _createElementVNode("button", {
                      type: "button",
                      onClick: ($event: any) => (deleteUnitKerja(row.id)),
                      "aria-label": `Hapus ${row.nama}`,
                      title: "Hapus",
                      class: "action-btn action-btn-delete"
                    }, [
                      _createVNode(_unref(IconTrash), {
                        size: 16,
                        stroke: '2'
                      })
                    ], 8 /* PROPS */, _hoisted_12)
                  ])
                ]),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["data"])
            ]))
    ]),
    _createCommentVNode(" Modal Form "),
    (showModal.value)
      ? (_openBlock(), _createElementBlock("div", _hoisted_13, [
          _createElementVNode("div", _hoisted_14, [
            _createElementVNode("div", _hoisted_15, [
              _createElementVNode("h2", _hoisted_16, _toDisplayString(isEdit.value ? 'Edit Unit Kerja' : 'Input Unit Kerja'), 1 /* TEXT */),
              _createElementVNode("button", {
                onClick: closeModal,
                class: "text-slate-400 hover:text-slate-600"
              }, "×")
            ]),
            _createElementVNode("div", _hoisted_17, [
              _createElementVNode("form", {
                onSubmit: _withModifiers(saveUnitKerja, ["prevent"]),
                class: "space-y-4"
              }, [
                _createElementVNode("div", null, [
                  _cache[5] || (_cache[5] = _createElementVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Nama Unit Kerja", -1 /* CACHED */)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => ((formData.nama) = $event)),
                    type: "text",
                    required: "",
                    class: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  }, null, 512 /* NEED_PATCH */), [
                    [_vModelText, formData.nama]
                  ])
                ]),
                _createElementVNode("div", null, [
                  _cache[6] || (_cache[6] = _createElementVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Parent ID (Opsional)", -1 /* CACHED */)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event: any) => ((formData.parentId) = $event)),
                    type: "number",
                    class: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  }, null, 512 /* NEED_PATCH */), [
                    [_vModelText, formData.parentId]
                  ])
                ]),
                _createElementVNode("div", null, [
                  _cache[7] || (_cache[7] = _createElementVNode("label", { class: "block text-sm font-medium text-slate-700 mb-1" }, "Level (Opsional)", -1 /* CACHED */)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event: any) => ((formData.level) = $event)),
                    type: "number",
                    class: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  }, null, 512 /* NEED_PATCH */), [
                    [_vModelText, formData.level]
                  ])
                ]),
                _createElementVNode("div", _hoisted_18, [
                  _createElementVNode("button", {
                    type: "button",
                    onClick: closeModal,
                    class: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                  }, "Batal"),
                  _createElementVNode("button", {
                    type: "submit",
                    disabled: isSaving.value,
                    class: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                  }, _toDisplayString(isSaving.value ? 'Menyimpan...' : 'Simpan'), 9 /* TEXT, PROPS */, _hoisted_19)
                ])
              ], 32 /* NEED_HYDRATION */)
            ])
          ])
        ]))
      : _createCommentVNode("v-if", true)
  ]))
}
}

})