<template>
  <div class="p-5 w-full flex items-center justify-center">
    <div class="flex flex-col gap-4">
      <Checkbox v-model="checked1" label="Unchecked" />
      <Checkbox v-model="checked2" label="Checked" />
      <Checkbox v-model="indeterminate" label="Indeterminate" :indeterminate="indeterminate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@idds/vue';

const checked1 = ref(false);
const checked2 = ref(true);
const indeterminate = ref(true);
</script>
