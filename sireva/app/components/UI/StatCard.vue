<template>
  <div 
    class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-t-4 transition-all hover:shadow-md hover:-translate-y-1 group cursor-default"
    :class="borderColor"
  >
    <div class="p-6 text-center space-y-2">
      <div class="flex justify-center mb-2">
        <div class="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:scale-110 transition-transform" :class="iconBgColor">
          <component :is="icon" :size="20" />
        </div>
      </div>
      <h2 
        class="text-3xl font-black text-slate-800 tracking-tight transition-colors"
        :class="hoverTextColor"
      >
        {{ value }}
      </h2>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: Component;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
});

const borderColor = computed(() => {
  switch (props.color) {
    case 'green': return 'border-t-emerald-500';
    case 'orange': return 'border-t-orange-400';
    case 'red': return 'border-t-rose-500';
    case 'purple': return 'border-t-purple-500';
    default: return 'border-t-blue-500';
  }
});

const hoverTextColor = computed(() => {
  switch (props.color) {
    case 'green': return 'group-hover:text-emerald-600';
    case 'orange': return 'group-hover:text-orange-500';
    case 'red': return 'group-hover:text-rose-600';
    case 'purple': return 'group-hover:text-purple-600';
    default: return 'group-hover:text-blue-600';
  }
});

const iconBgColor = computed(() => {
  switch (props.color) {
    case 'green': return 'group-hover:bg-emerald-50 group-hover:text-emerald-600';
    case 'orange': return 'group-hover:bg-orange-50 group-hover:text-orange-500';
    case 'red': return 'group-hover:bg-rose-50 group-hover:text-rose-600';
    case 'purple': return 'group-hover:bg-purple-50 group-hover:text-purple-600';
    default: return 'group-hover:bg-blue-50 group-hover:text-blue-600';
  }
});
</script>
