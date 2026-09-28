<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-linear-to-br from-slate-900 via-[#1F4F85] to-blue-900 text-center relative overflow-hidden">
        <!-- Abstract Decoration -->
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-black uppercase tracking-widest mb-6">
            <IconTarget :size="14" />
            Arah Kebijakan Strategis
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">Visi, Misi & Tujuan</h1>
          <p class="text-blue-100/80 text-lg font-medium max-w-2xl mx-auto">Fondasi utama dalam mewujudkan tata kelola pemerintahan yang berkelas dunia melalui pengembangan kompetensi ASN.</p>
        </div>
      </div>

      <div class="px-8 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
            <IconLayoutDashboard :size="20" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-slate-800">Peta Strategis LAN RI</h2>
            <p class="text-[11px] text-slate-500 font-medium">Visualisasi hirarki perencanaan tingkat tinggi.</p>
          </div>
        </div>
        <button
          v-if="isSuperAdmin"
          @click="router.push(`/${$route.params.slug}/visi-misi/add`)"
          class="w-full sm:w-auto px-6 py-2.5 bg-[#2663A3] hover:bg-[#1F4F85] text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <IconPlus :size="18" :stroke-width="3" />
          Update Data Strategis
        </button>
      </div>
    </div>

    <!-- Loading / Error States -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p class="text-sm font-bold text-slate-400 animate-pulse">Menghubungkan ke Pusat Data...</p>
    </div>
    
    <div v-else-if="errorMessage" class="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
      <IconAlertCircle :size="48" class="text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-red-800">Gagal Memuat Data</h3>
      <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
    </div>

    <!-- Grouped Data Cards -->
    <div v-else class="space-y-12">
      <div v-for="visi in groupedData" :key="visi.id" class="space-y-8">
        <!-- Visi Hero Card -->
        <div class="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
          
          <div class="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div class="shrink-0 w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20">
              <IconRocket :size="32" stroke-width="2.5" />
            </div>
            <div class="flex-1">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">Visi Utama</span>
              <h2 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {{ visi.visiText }}
              </h2>
            </div>
          </div>

          <!-- Mission Grid -->
          <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div 
              v-for="(misi, mIdx) in visi.missions" 
              :key="misi.id"
              class="bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group/misi"
            >
              <div class="flex items-start gap-4 mb-6">
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover/misi:text-blue-600 group-hover/misi:border-blue-100 flex items-center justify-center text-sm font-black transition-colors">
                  {{ Number(mIdx) + 1 }}
                </div>
                <div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Misi {{ Number(mIdx) + 1 }}</span>
                  <h3 class="text-base font-bold text-slate-800 leading-snug">{{ misi.misiText }}</h3>
                </div>
              </div>

              <!-- Goals Sub-list -->
              <div class="space-y-3">
                <div class="text-[9px] font-black uppercase tracking-widest text-slate-400/70 ml-1 mb-2">Tujuan Terkait:</div>
                <div 
                  v-for="tujuan in misi.goals" 
                  :key="tujuan.id"
                  class="flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-slate-100 group-hover/misi:border-blue-50 transition-all"
                >
                  <IconCircleCheck :size="16" class="mt-0.5 text-blue-500 shrink-0" />
                  <p class="text-xs font-semibold text-slate-600 leading-relaxed">{{ tujuan.tujuanText }}</p>
                </div>
                <div v-if="!misi.goals.length" class="text-xs italic text-slate-400 p-3">
                  Belum ada tujuan yang terhubung.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Visi, Misi & Tujuan Premium
 * Tata letak hirarki strategis menggantikan tabel konvensional.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IconEye, IconPlus, IconTarget, IconRocket, 
  IconLayoutDashboard, IconCircleCheck, IconAlertCircle 
} from '@tabler/icons-vue';

const router = useRouter();
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// SWRV Data Fetching
const { data: visiRes, pending: visiLoading, error: visiError } = useFetch('/api/visi', { lazy: true, default: () => [] });
const { data: misiRes, pending: misiLoading, error: misiError } = useFetch('/api/misi', { lazy: true, default: () => [] });
const { data: tujuanRes, pending: tujuanLoading, error: tujuanError } = useFetch('/api/tujuan', { lazy: true, default: () => [] });

// State Management
const loading = computed(() => visiLoading.value || misiLoading.value || tujuanLoading.value);

const { authUser, role } = useAuthUser();

const isSuperAdmin = computed(() => {
  const roleName = String(role.value || '').toLowerCase()
  return roleName === 'super_admin'
})

const errorMessage = computed(() => {
  const err = visiError.value || misiError.value || tujuanError.value;
  if (!err) return '';
  return 'Gagal menyinkronkan data strategis. Silakan coba beberapa saat lagi.';
});

// Grouped Data Logic for Hierarchical Display
const groupedData = computed(() => {
  const visiData = Array.isArray(visiRes.value?.data) ? visiRes.value.data : [];
  const misiData = Array.isArray(misiRes.value) ? misiRes.value : [];
  const tujuanData = Array.isArray(tujuanRes.value) ? tujuanRes.value : [];

  return visiData.map((v: any) => {
    const missions = misiData
      .filter((m: any) => m.visiId === v.id)
      .map((m: any) => {
        const goals = tujuanData.filter((t: any) => t.misiId === m.id);
        return { ...m, goals };
      });
    return { ...v, missions };
  });
});
</script>

<style scoped>
/* Transisi kartu yang halus */
.group:hover {
  transform: translateY(-2px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
