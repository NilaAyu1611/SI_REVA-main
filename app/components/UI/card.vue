<template>
  <CardPlain class="h-[352px] max-w-sm overflow-hidden border border-slate-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
    <div class="flex flex-row justify-between w-full mb-6">
      <div class="flex flex-col">
        <h1 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{{ title }}</h1>
        <p class="text-3xl font-black text-slate-900 tracking-tight">{{ value }}</p>
        <p class="text-xs font-bold text-emerald-600 flex flex-row items-center gap-1 mt-2">
          <IconTrendingUp :size="14" class="inline" />
          {{ subValue }}
          <span class="text-slate-400 font-medium lowercase">{{ subText }}</span>
        </p>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2663A3]">
        <component :is="icon" :size="24" stroke-width="2.5" />
      </div>
    </div>
    <div class="flex-1 w-full h-full min-h-0 pt-2">
      <component
        :is="apexchartComponent"
        v-if="apexchartComponent"
        type="area"
        height="100%"
        :series="chartSeries"
        :options="chartOptions"
      />
      <div v-else class="flex-1 flex items-center justify-center text-slate-400 animate-pulse font-bold text-[10px] uppercase tracking-widest">
        Loading Chart...
      </div>
    </div>
  </CardPlain>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, computed } from 'vue';
import { CardPlain } from '@idds/vue';
import { IconTrendingUp, IconChartBar } from '@tabler/icons-vue';

const props = defineProps({
  title: { type: String, default: 'Title' },
  value: { type: String, default: '0' },
  subValue: { type: String, default: '0' },
  subText: { type: String, default: 'subtext' },
  icon: { type: Object, default: IconChartBar },
  series: { type: Array, default: () => [{ name: 'Data', data: [65, 70, 68, 72, 70, 75] }] }
});

const apexchartComponent = shallowRef<any>(null);

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const module = await import('vue3-apexcharts');
    apexchartComponent.value = module.default;
  }
});

const chartSeries = computed(() => props.series);

const chartOptions = {
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: true }
  },
  colors: ['#2663A3'],
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      top: 10,
      bottom: 10,
      left: 0,
      right: 0,
    },
  },
  xaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { show: false },
  },
  tooltip: {
    enabled: false,
  },
};
</script>
