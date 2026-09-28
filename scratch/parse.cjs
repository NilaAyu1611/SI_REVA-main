const fs = require('fs');
const compiler = require('@vue/compiler-sfc');

const code = fs.readFileSync('app/pages/[slug]/master-unit-kerja.vue', 'utf-8');
const { descriptor } = compiler.parse(code);

if (descriptor.scriptSetup) {
  try {
    const compiled = compiler.compileScript(descriptor, {
      id: 'test-id',
      inlineTemplate: true
    });
    console.log('Compiled Script Setup Successfully!');
    fs.writeFileSync('scratch/master_unit_kerja_compiled.ts', compiled.content, 'utf-8');
    console.log('Wrote output to scratch/master_unit_kerja_compiled.ts');
  } catch (err) {
    console.error('Error during compileScript:', err);
  }
} else {
  console.log('No script setup found.');
}
