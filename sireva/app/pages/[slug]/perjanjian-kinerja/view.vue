<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <button @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
          <IconArrowLeft :size="14" />
          Perjanjian Kinerja
        </button>
        <span>/</span>
        <span class="text-slate-600 tracking-normal capitalize font-black">Detail Komitmen</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/edit?id=${id}`)"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
        >
          <IconPencil :size="18" class="text-blue-600" />
          Edit PK
        </button>
        <button 
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-black transition-all"
        >
          <IconHistory :size="18" />
          Log Aktivitas
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
      <!-- Loading -->
      <div v-if="fetching" class="p-24 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold">Mengambil rincian komitmen...</p>
      </div>

      <div v-else>
        <!-- Document Header Decor -->
        <div class="h-4 bg-gradient-to-r from-[#2663A3] to-blue-500"></div>

        <div class="p-10 md:p-16 space-y-16">
          <!-- Main Context Section -->
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100">
              Dokumen Perjanjian Kinerja
            </div>
            
            <div class="space-y-4 max-w-4xl">
              <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {{ viewData.indikator }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100">
                  <IconBuilding :size="16" class="text-blue-600" />
                  <span class="text-xs font-bold text-blue-700 uppercase tracking-tighter">{{ viewData.unitKerja }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <IconCalendar :size="16" class="text-slate-400" />
                  <span class="text-xs font-bold text-slate-600 uppercase tracking-tighter">Tahun Anggaran 2025</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Strategic Alignment -->
            <div class="lg:col-span-2 space-y-10">
              <div class="space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <IconTarget :size="18" />
                  </div>
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Alignment Strategis</h3>
                </div>
                
                <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative overflow-hidden group">
                  <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <IconTarget :size="100" />
                  </div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sasaran Terkait</p>
                  <p class="text-xl font-bold text-slate-800 leading-relaxed">{{ viewData.sasaran }}</p>
                </div>
              </div>

              <!-- Additional Details (Optional) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div class="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Pejabat Penanggung Jawab</p>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#2663A3] text-white flex items-center justify-center font-bold">
                      PK
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-900 leading-none">Kepala Pusat</p>
                      <p class="text-[10px] text-slate-500 mt-1 font-medium">{{ viewData.unitKerja }}</p>
                    </div>
                  </div>
                </div>
                <div class="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Status Verifikasi</p>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <IconCheck :size="20" :stroke-width="3" />
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-900 leading-none">Terverifikasi</p>
                      <p class="text-[10px] text-slate-500 mt-1 font-medium italic">Oleh Biro Perencanaan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Target Display -->
            <div class="space-y-8">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <IconFlag :size="18" />
                </div>
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Komitmen Target</h3>
              </div>

              <div class="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl shadow-blue-900/5 relative overflow-hidden group">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl group-hover:bg-blue-200/30 transition-colors"></div>
                
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">Target PK Tahunan</p>
                <div class="relative z-10">
                  <p class="text-6xl font-black text-[#2663A3] tracking-tighter leading-none">{{ viewData.target }}</p>
                  <div class="w-16 h-1.5 bg-blue-100 mx-auto mt-6 rounded-full"></div>
                </div>
                <p class="text-xs font-bold text-slate-500 max-w-[180px] mx-auto leading-relaxed relative z-10">
                  Target disepakati sesuai dengan Perjanjian Kinerja Tahun Anggaran 2025.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Metadata -->
        <div class="bg-slate-900 px-10 py-8 text-slate-500 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-wrap justify-center md:justify-start items-center gap-6">
            <div class="space-y-1">
              <p class="text-[9px] font-black text-slate-600 uppercase">Document Hash</p>
              <p class="text-[10px] font-mono">PK-{{ id.toString().padStart(4, '0') }}-SHA256</p>
            </div>
            <div class="w-px h-6 bg-slate-800"></div>
            <div class="space-y-1">
              <p class="text-[9px] font-black text-slate-600 uppercase">Generated At</p>
              <p class="text-[10px] font-medium">2025-04-29 14:45 WIB</p>
            </div>
          </div>
          <div class="text-center md:text-right">
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Authenticated Document</p>
            <p class="text-xs font-bold text-white tracking-tighter">SI-REVA DIGITAL PERFORMANCE MANAGEMENT</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Perjanjian Kinerja Modern
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPencil, IconHistory, IconBuilding, IconCalendar, 
  IconTarget, IconFlag, IconCheck 
} from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();

// State
const id = Number(route.query.id);
const fetching = ref(true);
const viewData = ref<any>({
  sasaran: '',
  indikator: '',
  target: '',
  unitKerja: '',
});

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/perjanjian-kinerja`);
    return;
  }

  try {
    fetching.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    viewData.value = {
      sasaran: id === 1 ? 'Terwujudnya ASN yang Profesional dan Kompeten' : 
               id === 2 ? 'Meningkatnya Kualitas Kurikulum Kediklatan ASN' : 
               'Terintegrasinya Sistem Pembelajaran Digital LAN',
      indikator: id === 1 ? 'Indeks Kepuasan Peserta Pelatihan Kediklatan ASN' : 
                 id === 2 ? 'Jumlah Modul Pelatihan Kepemimpinan Nasional Tersusun' : 
                 'Jumlah Fitur Platform Pembelajaran Digital Terintegrasi',
      target: id === 1 ? '85.0' : id === 2 ? '4 Modul' : '3 Fitur',
      unitKerja: id === 1 ? 'Pusbangkom ASN' : id === 2 ? 'Puslatbang KDOD' : 'Pusdatin LAN',
    };

  } catch (error) {
    console.error('Error fetching view data:', error);
  } finally {
    fetching.value = false;
  }
});
</script>

<style scoped>
.bg-white {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
