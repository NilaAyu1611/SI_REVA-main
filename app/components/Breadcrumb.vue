<template>
  <nav v-if="breadcrumbs.length" aria-label="Breadcrumb" class="mb-4">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <li>
        <NuxtLink to="/" class="font-medium text-slate-500 hover:text-blue-700 transition-colors">Home</NuxtLink>
      </li>
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path" class="flex items-center gap-2">
        <span class="text-slate-300">/</span>
        <NuxtLink
          v-if="index !== breadcrumbs.length - 1"
          :to="crumb.path"
          class="font-medium text-slate-500 hover:text-blue-700 transition-colors"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="font-semibold text-slate-700">
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const route = useRoute();

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  'visi-misi-tujuan': 'Visi, Misi, dan Tujuan',
  'sasaran-strategis': 'Sasaran Strategis',
  'perjanjian-kinerja': 'Perjanjian Kinerja',
  'sasaran-program': 'Sasaran Program',
  'sasaran-kegiatan': 'Sasaran Kegiatan',
  cascading: 'Cascading',
  'rencana-aksi': 'Rencana Aksi',
  laporan: 'Laporan',
  'master-unit-kerja': 'Master Unit Kerja',
  'master-user': 'Master User',
};

function titleFromSegment(segment: string) {
  if (labelMap[segment]) return labelMap[segment];
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const slugParam = String(route.params.slug || '').toLowerCase();
  if (!slugParam) return [];

  const segments = route.path.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const label = index === 0 ? slugParam.toUpperCase() : titleFromSegment(segment);
    return {
      label,
      path: `/${segments.slice(0, index + 1).join('/')}`,
    };
  });
});
</script>
