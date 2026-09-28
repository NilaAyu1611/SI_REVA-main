<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <HomeCarousel />

    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.16em]" style="color: #F7D628">Perencanaan</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">Sasaran sampai rencana aksi</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">Kelola kesinambungan visi, sasaran strategis, program, kegiatan, hingga rencana aksi dalam alur yang lebih rapi.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.16em]" style="color: #F7D628">Pemantauan</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">Capaian dan realisasi</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">Pantau target, realisasi triwulan, dan indikator kinerja melalui tampilan data yang mudah dibaca lintas level jabatan.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.16em]" style="color: #F7D628">Evaluasi</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">Pengambilan keputusan</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">Gunakan informasi yang terpusat untuk evaluasi kinerja, pelaporan, dan tindak lanjut perbaikan secara lebih cepat.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HomeCarousel from '@/components/HomeCarousel.vue'
</script>
