<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// @ts-ignore
import '@idds/vue/index.css'
// @ts-ignore
import { setBrandTheme } from '@idds/vue'

setBrandTheme('lan')
</script>
