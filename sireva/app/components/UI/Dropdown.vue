<template>
  <SelectDropdown
    v-model="selected"
    :options="options"
    placeholder="Select..."
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectDropdown } from '@idds/vue';

const selected = ref('');
const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];
</script>
