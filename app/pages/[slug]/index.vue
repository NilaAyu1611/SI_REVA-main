<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'dashboard' })

const tabs = [
  { key: 'ss', label: 'Sasaran Strategis' },
  { key: 'sp', label: 'Sasaran Program' },
  { key: 'sk', label: 'Sasaran Kegiatan' },
]
const activeTab = ref('ss')
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h1 class="text-xl font-bold text-slate-800">Peta Kinerja</h1>
        <p class="text-sm text-slate-500 mt-1">Diagram capaian sasaran dan indikator kinerja.</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 px-6 pt-4 border-b border-slate-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 -mb-px',
            activeTab === tab.key
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <PerformanceMap v-if="activeTab === 'ss'" />
        <PerformanceMapProgram v-else-if="activeTab === 'sp'" />
        <PerformanceMapKegiatan v-else-if="activeTab === 'sk'" />
      </div>
    </div>
  </div>
</template>
