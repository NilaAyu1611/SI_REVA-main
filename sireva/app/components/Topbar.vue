<template>
  <div class="topbar bg-gray-50 border-b border-gray-200 w-full">
    <div class="container mx-auto px-4">
      <div v-if="!authUser" class="flex justify-end items-center py-1 text-xs text-gray-700 space-x-1">
        <a id="hdr_lang_id" href="javascript:void(0);" class="border-r pr-2 active text-black">ID</a>
        <a id="hdr_lang_en" href="javascript:void(0);" class="pl-2 text-gray-500 hover:text-black">EN</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthUser } from '@/composables/useAuthUser';
const { authUser } = useAuthUser();
</script>

<style scoped>
.topbar {
  font-size: 13px;
}
</style>
