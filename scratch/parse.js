const fs = require('fs');
const compiler = require('@vue/compiler-sfc');

const code = fs.readFileSync('app/pages/[slug]/master-unit-kerja.vue', 'utf-8');
const { descriptor } = compiler.parse(code);

if (descriptor.scriptSetup) {
  const compiled = compiler.compileScript(descriptor, {
    id: 'test-id',
    inlineTemplate: false
  });
  console.log('Compiled Script Setup Successfully!');
  // print lines around 685
  const lines = compiled.content.split('\n');
  console.log('Total compiled lines:', lines.length);
  for (let i = Math.max(0, 680 - 1); i < Math.min(lines.length, 695); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('No script setup found.');
}
