
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconHierarchy2,
  IconCalendar,
  IconDownload,
  IconStar,
  IconBuilding,
  IconUsers,
  IconChevronRight,
  IconChevronLeft,
  IconTarget,
  IconChartBar,
  IconTargetArrow,
  IconBuildingBank
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import { useAuthUser } from '~/composables/useAuthUser'

/**
 * Cascading Kinerja — Interactive Drill-Down Edition
 * Hirarki 4 Level:
 * Sasaran Strategis → Indikator Strategis → Sasaran Program → Sasaran Kegiatan
 */

definePageMeta({ layout: 'dashboard' })

const { role, authUser } = useAuthUser()
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isAdmin = computed(() => normalizedRole.value === 'admin')
const isUser = computed(() => normalizedRole.value === 'user')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

// ──────────────────── State ────────────────────
const selectedYear = ref('2025')
const selectedSS = ref<any>(null)
const selectedIS = ref<any>(null)  // Indikator Strategis
const selectedSP = ref<any>(null)
const router = useRouter()
const route = useRoute()

// ──────────────────── Data Fetching ────────────────────
// Fetch Indikator Strategis berdasarkan SS yang dipilih
const { data: isRaw } = useFetch(() => selectedSS.value?.id ? `/api/indikator-strategis?sasaranStrategisId=${selectedSS.value.id}` : (null as any), { lazy: true, default: () => [] })

const { data: strategisList } = useFetch('/api/sasaran-strategis', { lazy: true, default: () => [] })
const { data: programList } = useFetch('/api/sasaran-program', { lazy: true, default: () => [] })
const { data: kegiatanList } = useFetch('/api/sasaran-kegiatan', { lazy: true, default: () => [] })

const loading = computed(() => !strategisList.value || !programList.value || !kegiatanList.value)

// ──────────────────── Drill-Down Navigation ────────────────────
function drillTo(level: 'ss' | 'is' | 'sp' | 'sk', item: any) {
  if (level === 'ss') {
    selectedSS.value = null
    selectedIS.value = null
    selectedSP.value = null
  } else if (level === 'is') {
    // Klik SS → tampilkan IS level
    if (item !== null) selectedSS.value = item
    selectedIS.value = null
    selectedSP.value = null
  } else if (level === 'sp') {
    // Klik IS → tampilkan SP level
    if (item !== null) selectedIS.value = item
    selectedSP.value = null
  } else if (level === 'sk') {
    selectedSP.value = item
  }
}

// ──────────────────── Computed Lists ────────────────────
const allUniqueStrategis = computed(() => {
  if (!strategisList.value) return []
  // Handle error response object
  const val = strategisList.value as any
  if (val?.success === false) {
    console.warn('[cascading] /api/sasaran-strategis error:', val.message)
    return []
  }
  const raw = Array.isArray(val) ? val : (val?.data || val?.rows || [])
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.reduce((acc: any[], item: any) => {
    const id = Number(item.ssId || item.id)
    if (id && !seen.has(id)) {
      seen.add(id)
      acc.push({ id, sasaranText: item.sasaranText || item.namaSs, unitKerja: item.unit_kerja || item.pengampu || '' })
    }
    return acc
  }, [])
})

// Indikator Strategis untuk SS yang dipilih
const isDrilled = computed(() => {
  if (!isRaw.value) return []
  const raw = Array.isArray(isRaw.value) ? isRaw.value : []
  return raw.map((item: any) => ({
    id: item.id,
    nama: item.nama || '-',
    kode: item.kode || '',
    satuan: item.satuan || '',
    ssId: item.sasaranStrategisId || item.sasaran_strategis_id
  }))
})

const allUniqueProgram = computed(() => {
  if (!programList.value) return []
  const val = programList.value as any
  if (val?.success === false) return []
  const raw = Array.isArray(val) ? val : (val?.data || val?.rows || [])
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.reduce((acc: any[], item: any) => {
    const spId = Number(item.id)
    if (spId && !seen.has(spId)) {
      seen.add(spId)
      acc.push({
        id: spId,
        ssId: Number(item.ssId),
        sasaranText: item.sasaran_program_text || item.namaSp,
        unitKerja: item.unit_kerja || item.unitKerjaNama || ''
      })
    }
    return acc
  }, [])
})

const allUniqueKegiatan = computed(() => {
  if (!kegiatanList.value) return []
  const val = kegiatanList.value as any
  if (val?.success === false) return []
  const raw = Array.isArray(val) ? val : (val?.data || val?.rows || [])
  if (!Array.isArray(raw)) return []
  const map = new Map()
  raw.forEach((item: any) => {
    const id = Number(item.id)
    if (!id) return
    if (!map.has(id)) {
      map.set(id, {
        id,
        spId: Number(item.spId),
        sasaranText: item.sasaran_kegiatan_text || item.sasaranText || item.namaSk,
        unitKerja: item.unit_kerja || item.unitKerjaNama || '-',
        programUnitKerja: item.programUnitKerja || '',
        indicators: []
      })
    }
    if (item.indikatorId) {
      const yearIdx = ['2025','2026','2027','2028','2029'].indexOf(selectedYear.value)
      const targetKey = `target_${yearIdx + 1}`
      const entry = map.get(id)
      if (!entry.indicators.find((i: any) => i.id === item.indikatorId)) {
        entry.indicators.push({
          id: item.indikatorId,
          nama: item.indikator_kinerja || item.indikatorNama,
          target: item[targetKey] ?? null
        })
      }
    }
  })
  return Array.from(map.values())
})

// ──────────────────── Filtered for Cascading ────────────────────
const uniqueKegiatan = computed(() => {
  const list = allUniqueKegiatan.value
  if (isSuperAdmin.value || !loggedUnitKerjaName.value) return list

  const loggedUk = loggedUnitKerjaName.value.toLowerCase()
  if (isAdmin.value) {
    return list.filter((k: any) => {
      const progUk = (k.programUnitKerja || '').trim().toLowerCase()
      const ownUk = (k.unitKerja || '').trim().toLowerCase()
      return progUk === loggedUk || ownUk === loggedUk
    })
  } else {
    return list.filter((k: any) => {
      const ownUk = (k.unitKerja || '').trim().toLowerCase()
      return ownUk === loggedUk
    })
  }
})

const uniqueProgram = computed(() => {
  const list = allUniqueProgram.value
  if (isSuperAdmin.value || !loggedUnitKerjaName.value) return list

  const loggedUk = loggedUnitKerjaName.value.toLowerCase()
  if (isAdmin.value) {
    return list.filter((p: any) => {
      const ownUk = (p.unitKerja || '').trim().toLowerCase()
      return ownUk === loggedUk
    })
  } else {
    const parentSpIds = new Set(uniqueKegiatan.value.map(k => k.spId))
    return list.filter((p: any) => parentSpIds.has(p.id))
  }
})

const uniqueStrategis = computed(() => {
  const list = allUniqueStrategis.value
  if (isSuperAdmin.value || !loggedUnitKerjaName.value) return list

  const parentSsIds = new Set(uniqueProgram.value.map(p => p.ssId))
  return list.filter((ss: any) => parentSsIds.has(ss.id))
})

// ──────────────────── Filtered for drill-down ────────────────────
// SP difilter berdasarkan SS yang dipilih (relasi IS→SP belum ada di DB)
const programDrilled  = computed(() => uniqueProgram.value.filter(p => p.ssId === Number(selectedSS.value?.id)))
const kegiatanDrilled = computed(() => uniqueKegiatan.value.filter(k => k.spId === Number(selectedSP.value?.id)))

// ──────────────────── Helpers ────────────────────
const getChildrenProgram  = (ssId: number)  => uniqueProgram.value.filter(p => p.ssId === Number(ssId))
const getChildrenKegiatan = (spId: number)  => uniqueKegiatan.value.filter(k => k.spId === Number(spId))
const getTotalKegiatan    = (ssId: number) => {
  const pIds = getChildrenProgram(ssId).map((p: any) => p.id)
  return uniqueKegiatan.value.filter(k => pIds.includes(k.spId)).length
}
// ──────────────────── Print / Export PDF ────────────────────
const printLoading = ref(false)

const printCascading = async () => {
  if (printLoading.value) return
  printLoading.value = true
  try {
    const year = selectedYear.value

    // ── Build org-chart HTML ──
    const ssItems = uniqueStrategis.value.map((ss: any) => {
      const programs = getChildrenProgram(ss.id)
      const totalSk = getTotalKegiatan(ss.id)

      const spItems = programs.map((sp: any) => {
        const kegiatans = getChildrenKegiatan(sp.id)
        const targets = kegiatans.flatMap((k: any) => k.indicators)
          .map((i: any) => parseFloat(i.target || '0'))
          .filter((v: number) => !isNaN(v))
        const targetStr = targets.length
          ? (targets.length === 1 ? String(targets[0]) : `${Math.min(...targets)}&ndash;${Math.max(...targets)}`)
          : '-'

        const skItems = kegiatans.map((sk: any) => {
          const inds = sk.indicators
          const indHTML = inds.length
            ? inds.map((ind: any) => `
                <div class="ik-row">
                  <span class="ik-label">IKK:</span>
                  <span class="ik-text">${ind.nama ?? '-'}</span>
                </div>
                <div class="target-row">
                  <span class="target-badge">Target ${year}: ${ind.target ?? '-'}</span>
                </div>`).join('<hr class="ik-hr">')
            : '<div class="ik-empty">Belum ada indikator</div>'

          return `<li class="sk-item">
            <div class="sk-card">
              <div class="badge sk-badge">SK</div>
              <div class="card-text">${sk.sasaranText ?? '-'}</div>
              <div class="ik-section">${indHTML}</div>
              <div class="card-pengampu">&#128100; ${sk.unitKerja ?? '-'}</div>
            </div>
          </li>`
        }).join('')

        const skLevelHtml = skItems ? `<ul class="sk-level">${skItems}</ul>` : ''

        return `<li class="sp-item">
          <div class="sp-card">
            <div class="badge sp-badge">SP</div>
            <div class="card-text">${sp.sasaranText ?? '-'}</div>
            <div class="card-pengampu">&#128100; ${sp.unitKerja ?? '-'}</div>
            <div class="card-stats">
              <span class="stat">&#128203; SK: <b>${kegiatans.length}</b></span>
              <span class="stat green">&#127919; Target ${year}: <b>${targetStr}</b></span>
            </div>
          </div>
          ${skLevelHtml}
        </li>`
      }).join('')

      const spLevelHtml = spItems ? `<ul class="sp-level">${spItems}</ul>` : '<p class="empty-msg">Belum ada Sasaran Program</p>'

      return `<li class="ss-item">
        <div class="ss-card">
          <div class="badge ss-badge">SS</div>
          <div class="ss-title">${ss.sasaranText ?? '-'}</div>
          <div class="ss-sub">&#128100; Pengampu: ${ss.unitKerja || 'Kepala Lembaga'}</div>
          <div class="ss-stats">
            <span class="stat light">SP: <b>${programs.length}</b></span>
            <span class="stat light">SK: <b>${totalSk}</b></span>
          </div>
        </div>
        ${spLevelHtml}
      </li>`
    }).join('')

    const ssListHtml = ssItems ? '<ul class="ss-level">' + ssItems + '</ul>' : '<p style="text-align:center;color:#94a3b8;padding:40px;">Tidak ada data untuk ditampilkan.</p>'
    const printDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Peta Cascading Kinerja — ${year}</title>
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
    background: linear-gradient(135deg,#1e3a8a,#2563eb);
    color:#fff; text-align:center; padding:8px 16px; border-radius:8px; margin-bottom:10px;
  }
  .hdr h1 { font-size:12pt; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
  .hdr p  { font-size:7pt; color:#bfdbfe; margin-top:2px; }

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
  .ss-title { font-size:8.5pt; font-weight:800; line-height:1.35; margin-bottom:4px; }
  .ss-sub   { font-size:6pt; color:#bfdbfe; }
  .ss-stats { display:flex; gap:8px; margin-top:5px; }

  /* ── SP CARD ── */
  .sp-card {
    background:#fff; border:1.5px solid #7c3aed; border-radius:7px;
    padding:7px 9px; min-width:150px; max-width:200px;
    box-shadow:0 2px 6px rgba(124,58,237,.1);
  }
  .card-text     { font-size:6.5pt; font-weight:700; line-height:1.4; color:#1e293b; margin-bottom:4px; }
  .card-pengampu { font-size:5pt; color:#64748b; margin-top:3px; }
  .card-stats    { display:flex; gap:5px; margin-top:5px; padding-top:4px; border-top:1px solid #e2e8f0; flex-wrap:wrap; }
  .stat          { font-size:5pt; color:#475569; }
  .stat.green    { color:#059669; font-weight:700; }
  .stat.light    { color:#bfdbfe; }

  /* ── SK CARD ── */
  .sk-card {
    background:#fff; border:1.5px solid #059669; border-radius:6px;
    padding:6px 8px; min-width:130px; max-width:175px;
    box-shadow:0 1px 4px rgba(5,150,105,.09);
  }

  /* ── IK SECTION ── */
  .ik-section   { margin-top:4px; padding-top:3px; border-top:1px dashed #a7f3d0; }
  .ik-row       { display:flex; gap:2px; align-items:flex-start; }
  .ik-label     { font-size:5pt; font-weight:900; color:#065f46; flex-shrink:0; }
  .ik-text      { font-size:5pt; color:#374151; line-height:1.3; }
  .target-badge { display:inline-block; font-size:5pt; font-weight:700; color:#065f46; background:#d1fae5; border-radius:3px; padding:0 3px; margin-top:2px; }
  .ik-hr        { border:none; border-top:1px dashed #d1fae5; margin:2px 0; }
  .ik-empty     { font-size:5pt; color:#94a3b8; font-style:italic; }

  /* ════════════════════════════════════════
     ORTHOGONAL TREE CONNECTORS
     Technique: ::before/::after on <li> draw
     the horizontal arms; ::before on <ul>
     draws the vertical drop from parent;
     margin-top on card + negative ::before
     creates the vertical stub up to the bar.
  ════════════════════════════════════════ */

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

  .empty-msg { color:#94a3b8; font-style:italic; font-size:6pt; margin-top:8px; }

  /* ── PRINT BUTTON ── */
  .btn-wrap { text-align:center; margin-top:20px; padding-bottom:12px; }
  .btn-print {
    padding:8px 24px; background:#1e3a8a; color:#fff; border:none;
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
      flex-direction: column;
      align-items: center;
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
  <h1>&#127979; Peta Cascading Kinerja</h1>
  <p>Tahun ${year} &nbsp;&bull;&nbsp; Dicetak: ${printDate}</p>
</div>

<div class="legend">
  <div class="legend-item"><div class="dot ss"></div> Sasaran Strategis (SS)</div>
  <div class="legend-item"><div class="dot sp"></div> Sasaran Program (SP)</div>
  <div class="legend-item"><div class="dot sk"></div> Sasaran Kegiatan (SK)</div>
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
  <button class="btn-print" onclick="window.print()">&#128424; Cetak / Simpan PDF</button>
</div>

${'<' + 'script>'}
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
${'</' + 'script>'}

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




