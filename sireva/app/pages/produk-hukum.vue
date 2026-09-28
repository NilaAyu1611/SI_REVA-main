<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <header class="bg-[#2663A3] text-white py-16 px-4 relative rounded-3xl mt-6 mx-2 shadow-lg">
      <div class="max-w-5xl mx-auto relative z-10 text-center">
        <div class="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
          <IconGavel class="w-8 h-8 text-blue-300" />
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Produk Hukum</h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Pusat dokumentasi peraturan, pedoman, dan produk hukum terkait perencanaan & evaluasi di lingkungan LAN RI.
        </p>
        
        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari peraturan atau kata kunci..." 
            class="w-full py-4 pl-12 pr-4 bg-white text-gray-900 rounded-2xl shadow-2xl focus:ring-4 focus:ring-blue-500/50 outline-none transition-all text-lg"
          />
          <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 -mt-8">
      <!-- Filters & Stats -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'px-6 py-2.5 rounded-full font-medium transition-all duration-200 border',
              activeCategory === cat 
                ? 'bg-[#2B6CB0] text-white border-[#2B6CB0] shadow-lg shadow-blue-500/20' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>
        <div class="text-gray-500 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          Menampilkan <span class="text-blue-600">{{ filteredProducts.length }}</span> Dokumen
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
        >
          <div class="flex justify-between items-start mb-4">
            <div :class="['px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider', product.badgeColor || 'bg-blue-100 text-blue-700']">
              {{ product.type }}
            </div>
            <div class="text-gray-400 text-sm font-medium">
              {{ product.date }}
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
            {{ product.title }}
          </h3>
          
          <div class="flex items-center text-sm text-gray-500 mb-4 font-medium italic">
            <IconFileDescription class="w-4 h-4 mr-1" />
            {{ product.number }}
          </div>
          
          <p class="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
            {{ product.description }}
          </p>
          
          <div class="flex gap-3">
            <button class="flex-1 py-3 px-4 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <IconEye class="w-4 h-4" /> Pratinjau
            </button>
            <button class="flex-1 py-3 px-4 bg-[#2B6CB0] hover:bg-[#1A365D] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
              <IconDownload class="w-4 h-4" /> Unduh
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
        <div class="inline-flex p-6 bg-gray-50 rounded-full mb-6">
          <IconSearchOff class="w-12 h-12 text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-gray-900">Tidak ada produk hukum ditemukan</h3>
        <p class="text-gray-500 mt-2">Coba kata kunci lain atau ubah kategori filter Anda.</p>
        <button @click="resetFilters" class="mt-6 text-blue-600 font-bold hover:underline">Reset Semua Filter</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  IconGavel, 
  IconSearch, 
  IconSearchOff,
  IconFileDescription, 
  IconDownload, 
  IconEye
} from '@tabler/icons-vue';
import { ref, computed } from 'vue';

const searchQuery = ref('');
const activeCategory = ref('Semua');

const categories = ['Semua', 'Perpres', 'Permen PANRB', 'Pedoman', 'Lainnya'];

const products = [
  {
    id: 1,
    type: 'Perpres',
    number: 'No. 29 Tahun 2014',
    title: 'Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)',
    date: '2014',
    description: 'Landasan hukum utama penyelenggaraan sistem akuntabilitas kinerja di lingkungan instansi pemerintah pusat dan daerah.',
    badgeColor: 'bg-indigo-100 text-indigo-700'
  },
  {
    id: 2,
    type: 'Permen PANRB',
    number: 'No. 53 Tahun 2014',
    title: 'Petunjuk Teknis Perjanjian Kinerja & Tata Cara Reviu',
    date: '2014',
    description: 'Panduan operasional bagi instansi pemerintah dalam menyusun dokumen perjanjian kinerja dan melakukan evaluasi internal berkala.',
    badgeColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 3,
    type: 'Pedoman',
    number: 'No. 1/P/2023',
    title: 'Pedoman Penyusunan Rencana Strategis (Renstra)',
    date: '2023',
    description: 'Instruksi terbaru mengenai standarisasi penyusunan rencana strategis 5 tahunan berbasis outcome-based budgeting.',
    badgeColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 4,
    type: 'Lainnya',
    number: 'SE Menpan No. 12/2022',
    title: 'Penyederhanaan Birokrasi & Dampak Kinerja',
    date: '2022',
    description: 'Surat edaran mengenai penyesuaian indikator kinerja individu pasca penyederhanaan struktur organisasi.',
    badgeColor: 'bg-rose-100 text-rose-700'
  }
];

const filteredProducts = computed(() => {
  return products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          p.number.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCat = activeCategory.value === 'Semua' || p.type === activeCategory.value;
    return matchesSearch && matchesCat;
  });
});

const resetFilters = () => {
  searchQuery.value = '';
  activeCategory.value = 'Semua';
};

useHead({
  title: 'Produk Hukum - SIREVA',
  meta: [
    { name: 'description', content: 'Daftar produk hukum dan peraturan terkait perencanaan dan evaluasi di LAN RI.' }
  ]
});
</script>

<style scoped>
/* Custom refinements if needed */
</style>
