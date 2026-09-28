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
          <div class="max-w-2xl text-white">
            <p class="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm" style="color: #F7D628">
              SIREVA New Generation
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
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white backdrop-blur-sm transition hover:bg-slate-900/70"
            aria-label="Slide sebelumnya"
            @click="prevSlide"
          >
            &#8249;
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white backdrop-blur-sm transition hover:bg-slate-900/70"
            aria-label="Slide berikutnya"
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
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface SlideItem {
  src: string
  alt: string
  title: string
  description: string
}

const slides: SlideItem[] = [
  {
    src: '/LAN_9694.JPG',
    alt: 'Gedung dan aktivitas di lingkungan LAN',
    title: 'Perencanaan dan evaluasi kinerja dalam satu ruang kerja yang terpadu.',
    description: 'SIREVA NG membantu menyusun sasaran, memantau realisasi, dan menjaga kesinambungan antara target strategis hingga rencana aksi.',
  },
  {
    src: '/LAN_9736.JPG',
    alt: 'Kegiatan institusi LAN dengan suasana formal',
    title: 'Selaraskan sasaran strategis, program, kegiatan, dan perjanjian kinerja.',
    description: 'Tampilan yang terstruktur memudahkan setiap unit kerja melihat keterkaitan indikator, target, dan capaian secara lebih jelas.',
  },
  {
    src: '/LAN_9802.JPG',
    alt: 'Lingkungan kerja dan dokumentasi kegiatan LAN',
    title: 'Bangun pengambilan keputusan berbasis data yang lebih cepat dan terukur.',
    description: 'Gunakan dashboard dan tabel monitoring untuk membaca progres triwulan, mengevaluasi target, dan menindaklanjuti rencana aksi prioritas.',
  },
  {
    src: '/tohaganteng.jpeg',
    alt: 'Foto Tohaganteng',
    title: 'Tohaganteng: Inspirasi Baru',
    description: 'Menjadi inspirasi dan semangat baru dalam setiap langkah perubahan.',
  },
]

const currentIndex = ref(0)
let autoplayHandle: ReturnType<typeof setInterval> | null = null

function setSlide(index: number) {
  currentIndex.value = index
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
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