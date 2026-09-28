<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 font-sans">
    <HomeCarousel />

    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.16em]" style="color: #F7D628">{{ t('planning') }}</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">{{ t('planningSub') }}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ t('planningDesc') }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.16em]" style="color: #F7D628">{{ t('monitoring') }}</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">{{ t('monitoringSub') }}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ t('monitoringDesc') }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.16em]" style="color: #F7D628">{{ t('evaluation') }}</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">{{ t('evaluationSub') }}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ t('evaluationDesc') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HomeCarousel from '@/components/HomeCarousel.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>
