<template>
  <section class="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-xl">
    <div class="relative h-80 sm:h-105 lg:h-130">
      <div
        v-for="(slide, index) in slides"
        :key="slide.src"
        :class="[
          'absolute inset-0 transition-all duration-700 ease-out',
          index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03] pointer-events-none',
        ]"
      >
        <img :src="slide.src" :alt="slide.alt" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-900/45 to-slate-950/20" />
        <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
          <div class="max-w-2xl text-white font-sans">
            <p class="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm" style="color: #F7D628">
              {{ t('carouselSubtitle') }}
            </p>
            <h1 class="text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {{ slide.title }}
            </h1>
            <p class="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              {{ slide.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-4 z-10 flex items-center justify-end px-4 sm:px-6">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white backdrop-blur-sm transition hover:bg-slate-900/70 cursor-pointer"
            :aria-label="t('slidePrev')"
            @click="prevSlide"
          >
            &#8249;
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white backdrop-blur-sm transition hover:bg-slate-900/70 cursor-pointer"
            :aria-label="t('slideNext')"
            @click="nextSlide"
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

interface SlideItem {
  src: string
  alt: string
  title: string
  description: string
}

const slides = computed<SlideItem[]>(() => [
  {
    src: '/LAN_9694.JPG',
    alt: 'Gedung dan aktivitas di lingkungan LAN',
    title: t('carouselSlide1Title'),
    description: t('carouselSlide1Desc'),
  },
  {
    src: '/LAN_9736.JPG',
    alt: 'Kegiatan institusi LAN dengan suasana formal',
    title: t('carouselSlide2Title'),
    description: t('carouselSlide2Desc'),
  },
  {
    src: '/LAN_9802.JPG',
    alt: 'Lingkungan kerja dan dokumentasi kegiatan LAN',
    title: t('carouselSlide3Title'),
    description: t('carouselSlide3Desc'),
  }
])

const currentIndex = ref(0)
let autoplayHandle: ReturnType<typeof setInterval> | null = null

function setSlide(index: number) {
  currentIndex.value = index
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

function startAutoplay() {
  stopAutoplay()
  autoplayHandle = setInterval(() => {
    nextSlide()
  }, 5000)
}

function stopAutoplay() {
  if (autoplayHandle) {
    clearInterval(autoplayHandle)
    autoplayHandle = null
  }
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>