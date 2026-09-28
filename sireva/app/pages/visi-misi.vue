<template>
  <div class="min-h-screen bg-white">
    <section class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Page Title -->
      <div class="mb-12">
        <h1 class="text-4xl font-extrabold text-[#2B6CB0] border-b-2 border-[#F7D628] pb-2 inline-block uppercase">
          VISI, MISI DAN TUJUAN LEMBAGA LAN RI
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <!-- Left: Image -->
        <div class="lg:col-span-5 mt-24">
          <div class="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            <img 
              src="/Gedung_LAN.jpg" 
              alt="Gedung Lembaga Administrasi Negara" 
              class="w-full h-[340px] sm:h-[400px] md:h-[480px] lg:h-[520px] object-cover"
            />
          </div>
        </div>

        <!-- Right: Content -->
        <div class="lg:col-span-7 space-y-10">
          <!-- Visi -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="w-2 h-8 bg-[#2B6CB0] mr-3 rounded-full"></span>
              VISI
            </h2>
            <p class="text-xl text-gray-700 italic leading-relaxed pl-5 border-l-2 border-gray-200">
              "Terwujudnya Kebijakan dan Kapasitas Aparatur Sipil Negara yang Berkualitas dalam rangka mewujudkan Bersama Indonesia Maju Menuju Indonesia Emas 2045"
            </p>
          </div>

          <!-- Misi -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-2 h-8 bg-[#F6AD55] mr-3 rounded-full"></span>
              MISI
            </h2>
            <ol class="space-y-4">
              <li v-for="(misi, index) in daftarMisi" :key="index" class="flex items-start group">
                <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-[#2B6CB0] font-bold mr-4 group-hover:bg-[#2B6CB0] group-hover:text-white transition-colors duration-200">
                  {{ index + 1 }}
                </span>
                <p class="text-gray-700 text-lg leading-snug pt-0.5">
                  {{ misi }}
                </p>
              </li>
            </ol>
          </div>

          <!-- Tujuan -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-2 h-8 bg-[#2B6CB0] mr-3 rounded-full"></span>
              TUJUAN
            </h2>
            <ol class="space-y-4">
              <li v-for="(tujuan, index) in daftarTujuan" :key="index" class="flex items-start group">
                <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 text-[#F6AD55] font-bold mr-4 group-hover:bg-[#F6AD55] group-hover:text-white transition-colors duration-200">
                  {{ index + 1 }}
                </span>
                <p class="text-gray-700 text-lg leading-snug pt-0.5">
                  {{ tujuan }}
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const daftarMisi = [
  "Mendorong terwujudnya kebijakan yang berkualitas di instansi pemerintah",
  "Melaksanakan transformasi pembelajaran ASN secara terintegrasi",
  "Menyelenggarakan pengembangan kapasitas dan pembelajaran ASN secara kolaboratif",
  "Menyelenggarakan mutu tata kelola pengembangan kapasitas dan pembelajaran ASN",
  "Melaksanakan tata kelola organisasi yang berkualitas dan berorientasi pada pengguna layanan"
];

const daftarTujuan = [
  "Mewujudkan kebijakan publik dan kapasitas ASN yang berkualitas",
  "Mewujudkan tata kelola organisasi yang berkualitas dan berorientasi pada pengguna layanan"
];

useHead({
  title: 'Visi, Misi dan Tujuan - SIREVA',
  meta: [
    { name: 'description', content: 'Visi, Misi, dan Tujuan Lembaga Administrasi Negara RI (LAN RI)' }
  ]
})
</script>

<style scoped>
/* Custom animations or refinements if needed */
</style>
