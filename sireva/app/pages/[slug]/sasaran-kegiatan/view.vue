<template>
  <div class="space-y-6 pb-10 max-w-5xl mx-auto mt-4">
    <!-- Breadcrumb & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
          <IconArrowLeft :size="14" />
          Sasaran Kegiatan
        </button>
        <span>/</span>
        <span class="text-slate-600 tracking-normal capitalize font-black">Detail Target Capaian</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${id}`)"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
        >
          <IconPencil :size="18" class="text-blue-600" />
          Edit Target
        </button>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      <!-- Loading State -->
      <div v-if="fetching" class="p-24 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold">Menyiapkan rincian sasaran kegiatan...</p>
      </div>

      <div v-else>
        <!-- Document Header Decor -->
        <div class="h-3 bg-gradient-to-r from-blue-600 via-[#2663A3] to-indigo-600"></div>

        <div class="p-8 md:p-12 space-y-10">
          <!-- Title Section -->
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
              Perencanaan Kinerja - {{ currentYear }}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {{ sasaranData?.sasaranText || '-' }}
            </h1>
            <div class="flex items-center gap-6 pt-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <IconTarget :size="18" />
                </div>
                <div class="text-left">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Kode</p>
                  <p class="text-sm font-bold text-slate-700">{{ sasaranData?.kode || '-' }}</p>
                </div>
              </div>
              <div class="w-px h-8 bg-slate-100"></div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <IconBuilding :size="18" />
                </div>
                <div class="text-left">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Unit Kerja</p>
                  <p class="text-sm font-bold text-slate-700">{{ sasaranData?.unitKerjaNama || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicators List -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <IconChartBar :size="20" class="text-blue-600" />
              Indikator Kinerja & Target ({{ currentYear }})
            </h3>
            
            <div v-if="!sasaranData?.indikators || sasaranData.indikators.length === 0" class="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              Belum ada indikator untuk sasaran kegiatan ini.
            </div>

            <div v-else class="overflow-x-auto border border-slate-200 rounded-2xl">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200">
                    <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
                    <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Indikator Kinerja</th>
                    <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-32">Satuan</th>
                    <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-48 text-center">Target ({{ currentYear }})</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(ind, idx) in sasaranData.indikators" :key="ind.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="p-4 text-center text-sm font-bold text-slate-400">{{ Number(idx) + 1 }}</td>
                    <td class="p-4 text-sm font-semibold text-slate-700 leading-snug">{{ ind.nama }}</td>
                    <td class="p-4 text-sm text-slate-600">{{ ind.satuan || '-' }}</td>
                    <td class="p-4 text-center">
                      <div class="inline-flex px-4 py-1.5 rounded-lg font-bold text-sm" :class="getTargetForYear(ind, currentYear) !== '-' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'">
                        {{ getTargetForYear(ind, currentYear) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
          <IconInfoCircle :size="16" />
          <p class="text-[10px] font-bold uppercase tracking-widest">Hanya menampilkan target untuk tahun anggaran berjalan ({{ currentYear }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPencil, IconTarget,
  IconChartBar, IconBuilding, IconInfoCircle 
} from '@tabler/icons-vue';
import { useToast } from '#imports';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const id = Number(route.query.id);
const fetching = ref(true);
const currentYear = new Date().getFullYear();

const sasaranData = ref<any>(null);

function getTargetForYear(ind: any, year: number) {
  if (!ind || !ind.targets) return '-';
  const targetObj = ind.targets.find((t: any) => Number(t.tahun) === year);
  return targetObj && targetObj.target !== '' && targetObj.target !== null ? targetObj.target : '-';
}

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/sasaran-kegiatan`);
    return;
  }

  try {
    fetching.value = true;
    
    // Fetch single sasaran kegiatan record
    const detail = await $fetch<any>(`/api/sasaran-kegiatan?id=${id}`);
    if (!detail) throw new Error('Data tidak ditemukan');

    // Fetch all indicators for this sasaran kegiatan directly (correct approach)
    const ikList = await $fetch<any[]>(`/api/indikator-kinerja?sk_id=${id}`);
    const indicators = (ikList ?? []).map((ik: any) => ({
      id: ik.id,
      nama: ik.namaIku,
      satuan: ik.satuan,
      targets: [
        { tahun: 2025, target: ik.target_1 },
        { tahun: 2026, target: ik.target_2 },
        { tahun: 2027, target: ik.target_3 },
        { tahun: 2028, target: ik.target_4 },
        { tahun: 2029, target: ik.target_5 }
      ]
    }));

    sasaranData.value = {
      id: detail.id,
      kode: detail.kode,
      sasaranText: detail.sasaran_kegiatan_text,
      unitKerjaNama: detail.unit_kerja || 'Global / Semua Unit',
      indikators: indicators
    };

  } catch (error: any) {
    console.error('Error fetching view data:', error);
    toast.error(error.message || 'Gagal memuat rincian');
  } finally {
    fetching.value = false;
  }
});
</script>
