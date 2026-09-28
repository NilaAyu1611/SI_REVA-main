<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/rencana-aksi`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Rencana Aksi
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Detail Rencana</span>
    </div>

    <!-- Content Section -->
    <div class="max-w-4xl mx-auto space-y-6">
      <div v-if="loading" class="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold tracking-widest text-xs uppercase">Memuat Data...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Section 01: Sasaran Kegiatan -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2663A3]">
              <IconTarget :size="18" stroke-width="2.5" />
            </div>
            <h2 class="text-sm font-black text-[#2663A3] uppercase tracking-wider">Perencanaan - Sasaran Kegiatan</h2>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Kegiatan</p>
                <p class="text-sm font-bold text-slate-700 leading-relaxed">{{ detail?.sasaranNama || '-' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indikator Kinerja</p>
                <p class="text-sm font-bold text-[#2663A3] leading-relaxed">{{ detail?.indikatorNama || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 02: Rencana Aksi -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <IconListDetails :size="18" stroke-width="2.5" />
            </div>
            <h2 class="text-sm font-black text-indigo-600 uppercase tracking-wider">Perencanaan - Rencana Aksi</h2>
          </div>
          
          <div class="p-8 space-y-8">
            <div class="space-y-2">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Rencana Aksi / Aktivitas</p>
              <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-base font-black text-slate-800 leading-relaxed uppercase tracking-tight">{{ detail?.namaRencanaAksi }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="p-6 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Target</p>
                <p class="text-2xl font-black text-blue-700 tracking-tighter">{{ detail?.target || 0 }}</p>
              </div>
              <div class="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Target TW I</p>
                <p class="text-2xl font-black text-indigo-700 tracking-tighter">{{ detail?.tw1 || 0 }}</p>
              </div>
              <div class="p-6 rounded-2xl bg-cyan-50 border border-cyan-100 text-center">
                <p class="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Target TW II</p>
                <p class="text-2xl font-black text-cyan-700 tracking-tighter">{{ detail?.tw2 || 0 }}</p>
              </div>
              <div class="p-6 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <p class="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Target TW III/IV</p>
                <p class="text-2xl font-black text-amber-700 tracking-tighter">{{ detail?.tw3 || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="flex items-center justify-end gap-3 pt-6">
          <button 
            @click="router.push(`/${$route.params.slug}/rencana-aksi`)"
            class="px-8 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button 
            v-if="canInput"
            @click="router.push(`/${$route.params.slug}/rencana-aksi/edit?id=${detail.id}`)"
            class="px-8 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2"
          >
            <IconPencil :size="18" />
            Edit Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Rencana Aksi Standardized (Read Only)
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconTarget, IconListDetails, IconPencil 
} from '@tabler/icons-vue';
import { useAuthUser } from '~/composables/useAuthUser';

const router = useRouter();
const route = useRoute();
const { role } = useAuthUser();

const id = Number(route.query.id);
const loading = ref(true);
const detail = ref<any>(null);

const canInput = computed(() => {
  const roleName = role.value?.toLowerCase();
  return roleName === 'super_admin' || roleName === 'user';
});

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/rencana-aksi`);
    return;
  }

  try {
    loading.value = true;
    const res = await $fetch<any>(`/api/rencana-aksi?id=${id}`);
    detail.value = Array.isArray(res) ? res[0] : res;
    
    if (!detail.value) {
      alert('Data tidak ditemukan');
      router.push(`/${route.params.slug}/rencana-aksi`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
});
</script>
