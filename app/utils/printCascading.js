// Utility: print cascading kinerja LAN
// Dipisahkan dari Vue SFC agar Vue macro parser tidak bingung
// dengan template literal HTML yang berisi <style>, </style>, dll.

export function printCascading(ssItems, year) {
  const printDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const ssListHtml = ssItems
    ? '<ul class="ss-level">' + ssItems + '</ul>'
    : '<p style="text-align:center;color:#94a3b8;padding:40px;">Tidak ada data untuk ditampilkan.</p>'

  const adjustScriptCode = [
    'function adjustScale() {',
    "  var tree = document.getElementById('cascade-tree');",
    '  if (!tree) return;',
    "  tree.style.transform = 'none';",
    "  tree.style.transformOrigin = 'top center';",
    "  tree.style.marginBottom = '0px';",
    '  if (window.innerWidth <= 768) return;',
    '  var tw = tree.scrollWidth;',
    '  var pw = document.documentElement.clientWidth;',
    '  if (tw > pw) {',
    '    var scale = pw / tw;',
    "    tree.style.transform = 'scale(' + scale + ')';",
    "    tree.style.marginBottom = ((scale - 1) * tree.scrollHeight) + 'px';",
    '  }',
    '}',
    'adjustScale();',
    'setTimeout(adjustScale, 100);',
    "if (document.readyState === 'complete') {",
    '  adjustScale();',
    '} else {',
    "  window.addEventListener('DOMContentLoaded', adjustScale);",
    "  window.addEventListener('load', adjustScale);",
    '}',
    "window.addEventListener('resize', adjustScale);",
    "window.addEventListener('beforeprint', adjustScale);",
    "window.addEventListener('afterprint', adjustScale);",
  ].join('\n')

  const css = `
  @page { size: A3 landscape; margin: 8mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #fff; color: #1e293b; font-size: 6.5pt;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .hdr {
    background: linear-gradient(135deg,#1e3a8a,#2563eb);
    color:#fff; text-align:center; padding:8px 16px; border-radius:8px; margin-bottom:10px;
  }
  .hdr h1 { font-size:12pt; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
  .hdr p  { font-size:7pt; color:#bfdbfe; margin-top:2px; }
  .legend { display:flex; gap:14px; justify-content:center; margin-bottom:10px; }
  .legend-item { display:flex; align-items:center; gap:4px; font-size:6pt; font-weight:700; }
  .dot { width:9px; height:9px; border-radius:2px; }
  .dot.ss { background:#1e3a8a; }
  .dot.sp { background:#7c3aed; }
  .dot.sk { background:#059669; }
  .badge {
    display:inline-block; font-size:5pt; font-weight:900; padding:1px 4px;
    border-radius:3px; margin-bottom:3px; letter-spacing:.3px; text-transform:uppercase;
  }
  .ss-badge { background:#fef3c7; color:#92400e; border:1px solid #fcd34d; }
  .sp-badge { background:#ede9fe; color:#4c1d95; border:1px solid #a78bfa; }
  .sk-badge { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
  .lan-card {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #fff; border-radius: 8px; padding: 10px 18px;
    min-width: 220px; text-align: center;
    border-bottom: 4px solid #3b82f6;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
    position: relative; z-index: 10;
  }
  .lan-title { font-size: 9pt; font-weight: 900; letter-spacing: 0.5px; }
  .ss-level {
    display: flex; list-style: none;
    padding-top: 24px; position: relative; gap: 0;
  }
  .ss-level::before {
    content: ''; position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 24px; border-left: 1.5px solid #1e3a8a;
  }
  .ss-item {
    display: flex; flex-direction: column;
    align-items: center; position: relative; padding: 0 12px;
  }
  .ss-item::before {
    content: ''; position: absolute;
    top: 0; right: 50%; width: 50%; height: 0;
    border-top: 1.5px solid #1e3a8a;
  }
  .ss-item::after {
    content: ''; position: absolute;
    top: 0; left: 50%; width: 50%; height: 0;
    border-top: 1.5px solid #1e3a8a;
  }
  .ss-item:only-child::before, .ss-item:only-child::after { display: none; }
  .ss-item:first-child::before { display: none; }
  .ss-item:last-child::after { display: none; }
  .ss-card {
    margin-top: 24px; position: relative;
    background:linear-gradient(135deg,#1e3a8a,#1d4ed8);
    color:#fff; border-radius:8px; padding:9px 14px;
    min-width:240px; max-width:320px;
    border-left:4px solid #fbbf24;
    box-shadow:0 3px 10px rgba(30,58,138,.25);
  }
  .ss-card::before {
    content: ''; position: absolute;
    top: -24px; left: 50%; transform: translateX(-50%);
    width: 0; height: 24px; border-left: 1.5px solid #1e3a8a;
  }
  .ss-title { font-size:8.5pt; font-weight:800; line-height:1.35; margin-bottom:4px; }
  .ss-sub   { font-size:6pt; color:#bfdbfe; }
  .ss-stats { display:flex; gap:8px; margin-top:5px; }
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
  .sk-card {
    background:#fff; border:1.5px solid #059669; border-radius:6px;
    padding:6px 8px; min-width:130px; max-width:175px;
    box-shadow:0 1px 4px rgba(5,150,105,.09);
  }
  .ik-section   { margin-top:4px; padding-top:3px; border-top:1px dashed #a7f3d0; }
  .ik-row       { display:flex; gap:2px; align-items:flex-start; }
  .ik-label     { font-size:5pt; font-weight:900; color:#065f46; flex-shrink:0; }
  .ik-text      { font-size:5pt; color:#374151; line-height:1.3; }
  .target-badge { display:inline-block; font-size:5pt; font-weight:700; color:#065f46; background:#d1fae5; border-radius:3px; padding:0 3px; margin-top:2px; }
  .ik-hr        { border:none; border-top:1px dashed #d1fae5; margin:2px 0; }
  .ik-empty     { font-size:5pt; color:#94a3b8; font-style:italic; }
  .sp-level {
    display: flex; list-style: none;
    padding-top: 24px; position: relative; gap: 0;
  }
  .sp-level::before {
    content: ''; position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 24px; border-left: 1.5px solid #7c3aed;
  }
  .sp-item {
    display: flex; flex-direction: column;
    align-items: center; position: relative; padding: 0 8px;
  }
  .sp-item::before {
    content: ''; position: absolute;
    top: 0; right: 50%; width: 50%; height: 0;
    border-top: 1.5px solid #7c3aed;
  }
  .sp-item::after {
    content: ''; position: absolute;
    top: 0; left: 50%; width: 50%; height: 0;
    border-top: 1.5px solid #7c3aed;
  }
  .sp-item:only-child::before, .sp-item:only-child::after { display: none; }
  .sp-item:first-child::before { display: none; }
  .sp-item:last-child::after { display: none; }
  .sp-card { margin-top: 24px; position: relative; }
  .sp-card::before {
    content: ''; position: absolute;
    top: -24px; left: 50%; transform: translateX(-50%);
    width: 0; height: 24px; border-left: 1.5px solid #7c3aed;
  }
  .sk-level {
    display: flex; list-style: none;
    padding-top: 18px; position: relative; gap: 0; margin-top: 0;
  }
  .sk-level::before {
    content: ''; position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 18px; border-left: 1.5px solid #059669;
  }
  .sk-item {
    display: flex; flex-direction: column;
    align-items: center; position: relative; padding: 0 6px;
  }
  .sk-item::before {
    content: ''; position: absolute;
    top: 0; right: 50%; width: 50%; height: 0;
    border-top: 1.5px solid #059669;
  }
  .sk-item::after {
    content: ''; position: absolute;
    top: 0; left: 50%; width: 50%; height: 0;
    border-top: 1.5px solid #059669;
  }
  .sk-item:only-child::before, .sk-item:only-child::after { display: none; }
  .sk-item:first-child::before { display: none; }
  .sk-item:last-child::after { display: none; }
  .sk-card { margin-top: 18px; position: relative; }
  .sk-card::before {
    content: ''; position: absolute;
    top: -18px; left: 50%; transform: translateX(-50%);
    width: 0; height: 18px; border-left: 1.5px solid #059669;
  }
  .empty-msg { color:#94a3b8; font-style:italic; font-size:6pt; margin-top:8px; }
  .btn-wrap { text-align:center; margin-top:20px; padding-bottom:12px; }
  .btn-print {
    padding:8px 24px; background:#1e3a8a; color:#fff; border:none;
    border-radius:7px; font-weight:700; font-size:9pt; cursor:pointer;
  }
  .tree-wrapper { overflow-x: auto; padding: 20px; margin-bottom: 20px; }
  #cascade-tree {
    min-width: max-content; margin: 0 auto;
    display: flex; flex-direction: column; align-items: center;
  }
  @media print {
    .btn-wrap { display:none; }
    body { background:white; }
    .tree-wrapper { overflow-x: visible; padding: 0; }
    #cascade-tree { min-width: max-content; display: flex; flex-direction: column; align-items: center; }
  }
  @media screen and (max-width: 768px), print and (max-width: 768px) {
    body { font-size: 8pt !important; padding: 10px !important; }
    .tree-wrapper { padding: 10px 0 !important; overflow-x: visible !important; }
    #cascade-tree { min-width: 100% !important; width: 100% !important; transform: none !important; margin-bottom: 0 !important; }
    .ss-level, .sp-level, .sk-level {
      display: flex !important; flex-direction: column !important;
      align-items: center !important; padding-top: 20px !important;
      gap: 20px !important; width: 100% !important;
    }
    .ss-item, .sp-item, .sk-item {
      display: flex !important; flex-direction: column !important;
      align-items: center !important; width: 100% !important; padding: 0 !important;
    }
    .ss-item::before, .ss-item::after,
    .sp-item::before, .sp-item::after,
    .sk-item::before, .sk-item::after { display: none !important; }
    .lan-card, .ss-card, .sp-card, .sk-card {
      position: relative !important; z-index: 5 !important;
      margin-top: 0 !important; width: 95% !important;
      max-width: 340px !important; min-width: auto !important;
    }
    .ss-card::before, .sp-card::before, .sk-card::before { display: none !important; }
    .sp-level { margin-top: 10px !important; }
    .sk-level { margin-top: 10px !important; }
  }
  `

  const bodyHtml = `
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
  `

  const win = window.open('', '_blank', 'width=1400,height=900')
  if (!win) {
    alert('Popup diblokir browser. Mohon izinkan popup untuk halaman ini.')
    return
  }

  win.document.open()
  win.document.write('<!DOCTYPE html><html lang="id"><head>')
  win.document.write('<meta charset="UTF-8">')
  win.document.write('<title>Peta Cascading Kinerja \u2014 ' + year + '</title>')
  const styleEl = win.document.createElement('style')
  styleEl.textContent = css
  win.document.head.appendChild(styleEl)
  win.document.write('</head><body>')
  win.document.write(bodyHtml)
  win.document.write('</body></html>')
  win.document.close()

  const sc = win.document.createElement('script')
  sc.textContent = adjustScriptCode
  win.document.body.appendChild(sc)
}
