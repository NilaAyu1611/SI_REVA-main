const fs = require('fs');
const content = fs.readFileSync('app/pages/[slug]/master-unit-kerja.vue', 'utf-8');
const lines = content.split('\n');
// Find saveUnitKerja
const lineIdx = lines.findIndex(l => l.includes('saveUnitKerja()'));
console.log('Found saveUnitKerja at line:', lineIdx + 1);
for (let i = lineIdx; i < lineIdx + 5; i++) {
  const line = lines[i];
  console.log(`Line ${i + 1}: ${JSON.stringify(line)}`);
  for (let j = 0; j < line.length; j++) {
    console.log(`  char ${j}: ${line[j]} (code: ${line.charCodeAt(j)})`);
  }
}
