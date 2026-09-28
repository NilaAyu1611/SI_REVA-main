<template>
  <div class="p-5 flex flex-col gap-4">
    <div class="flex items-center gap-3 flex-wrap">
      <Button hierarchy="primary" :prefix-icon="iconDownload"> Download </Button>
      <Button hierarchy="secondary" :suffix-icon="iconArrowRight"> Continue </Button>
      <Button hierarchy="primary" :prefix-icon="iconCheck" :suffix-icon="iconArrowRight">
        Submit
      </Button>
    </div>
    <div class="flex items-center gap-3 flex-wrap">
      <Button hierarchy="primary" disabled> Disabled </Button>
      <Button hierarchy="secondary" disabled> Disabled </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { IconDownload, IconArrowRight, IconCheck } from '@tabler/icons-vue';
import { Button } from '@idds/vue';

// Buat VNode untuk icon dengan props size
const iconDownload = h(IconDownload, { size: 16 });
const iconArrowRight = h(IconArrowRight, { size: 16 });
const iconCheck = h(IconCheck, { size: 16 });
</script>
