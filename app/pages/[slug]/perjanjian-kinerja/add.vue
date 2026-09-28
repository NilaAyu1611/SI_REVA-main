<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Perjanjian Kinerja
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Tambah Baru</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-linear-to-r from-blue-600 to-[#2663A3] relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconFileCheck :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconFileCheck :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Buat Komitmen Kinerja</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Pilih sasaran dan indikator untuk ditetapkan sebagai komitmen tahunan.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Identitas Komitmen -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Identitas Komitmen</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Unit Kerja -->
            <div class="space-y-2 md:col-span-2">
              <label for="unitKerja" class="block text-sm font-bold text-slate-700 ml-1">Unit Kerja Pelaksana</label>
              <select 
                id="unitKerja" 
                v-model="form.unitKerja" 
                class="field-input"
                required
              >
                <option value="" disabled selected>Pilih Unit Kerja...</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.nama">
                  {{ unit.nama }}
                </option>
              </select>
            </div>

            <!-- Pilih Tahun -->
            <div class="space-y-2">
              <label for="tahun" class="block text-sm font-bold text-slate-700 ml-1">Tahun Anggaran</label>
              <select 
                id="tahun" 
                v-model="form.tahun" 
                class="field-input"
                required
                @change="fetchTargetRenstra"
              >
                <option v-for="y in [2024, 2025, 2026, 2027, 2028, 2029]" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>

            <!-- Sasaran -->
            <div class="space-y-2 md:col-span-2">
              <label for="sasaranId" class="block text-sm font-bold text-slate-700 ml-1">Sasaran Strategis / Program</label>
              <select 
                id="sasaranId" 
                v-model="form.sasaranId" 
                class="field-input"
                required
                @change="handleSasaranChange"
              >
                <option :value="null" disabled>-- Pilih Sasaran --</option>
                <option v-for="s in uniqueSasaranList" :key="s.id" :value="s.id">
                  [{{ s.kode || 'SS' }}] {{ s.sasaranText }} - ({{ s.unitKerja || 'Kepala LAN RI' }})
                </option>
              </select>
              <p class="text-[11px] text-slate-400 ml-1">Pilih sasaran yang akan menjadi acuan komitmen ini.</p>
            </div>

            <!-- Indikator -->
            <div class="space-y-2 md:col-span-2">
              <label for="indikatorId" class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja</label>
              <div class="relative">
                <select 
                  id="indikatorId" 
                  v-model="form.indikatorId" 
                  class="field-input pr-32"
                  required
                  :disabled="!form.sasaranId"
                  @change="fetchTargetRenstra"
                >
                  <option :value="null" disabled>-- Pilih Indikator --</option>
                  <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">
                    [{{ i.kode || 'IKU' }}] {{ i.namaIndikator }}
                  </option>
                </select>
                
                <!-- Renstra Target Badge -->
                <div v-if="form.target && isAutoFilled" class="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div class="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                    <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Renstra:</span>
                    <span class="text-sm font-black text-[#2663A3]">{{ form.target }}</span>
                    <span class="text-[10px] font-bold text-blue-400">{{ selectedIndikator?.satuan }}</span>
                  </div>
                </div>

                <div v-if="loadingTarget" class="absolute right-12 top-1/2 -translate-y-1/2">
                   <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                </div>
              </div>
              <p v-if="!form.sasaranId" class="text-[10px] text-amber-600 font-bold ml-1 italic">Silakan pilih sasaran terlebih dahulu.</p>
              <p v-else-if="isAutoFilled" class="text-[10px] text-blue-600 font-bold ml-1 flex items-center gap-1">
                <IconCheck :size="12" /> Target otomatis ditarik dari data Renstra 5 tahunan.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 02 removed as requested (using auto-sync from Renstra) -->

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 mt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)"
            class="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconCheck v-if="!submitting" :size="20" :stroke-width="3" />
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Komitmen PK
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Perjanjian Kinerja
 * Diperbarui dengan fitur Sinkronisasi Target Otomatis dari Renstra.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconArrowLeft, IconFileCheck, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const fetcher = (url: string) => fetch(url).then(r => r.json());

// Fetch Data Referensi (Force refresh for better sync)
const { data: units } = useSWRV('/api/unit-kerja', fetcher, { revalidateOnFocus: true });
const { data: sasaranList } = useSWRV('/api/sasaran-strategis', fetcher, { revalidateOnFocus: true });
const { data: indikatorList } = useSWRV('/api/indikator-kinerja', fetcher, { revalidateOnFocus: true });

// Deduplicated Sasaran List
const uniqueSasaranList = computed(() => {
  if (!sasaranList.value) return [];
  const map = new Map();
  (sasaranList.value as any[]).forEach(s => {
    // Gunakan kombinasi teks dan unit untuk identitas unik
    const key = `${s.sasaranText}-${s.unitKerja}`;
    if (!map.has(key)) {
      map.set(key, s);
    }
  });
  return Array.from(map.values());
});

// State Form
const submitting = ref(false);
const loadingTarget = ref(false);
const isAutoFilled = ref(false);

const form = ref({
  tahun: new Date().getFullYear(),
  unitKerja: '',
  sasaranId: null as number | null,
  indikatorId: null as number | null,
  target: ''
});

// Logic Filter Indikator
const filteredIndikatorList = computed(() => {
  if (!form.value.sasaranId || !indikatorList.value) return [];
  return (indikatorList.value as any[]).filter(i => i.sasaranId === form.value.sasaranId);
});

// Ambil info indikator terpilih untuk label satuan
const selectedIndikator = computed(() => {
  if (!form.value.indikatorId || !indikatorList.value) return null;
  return (indikatorList.value as any[]).find(i => i.id === form.value.indikatorId);
});

/**
 * Handle Sasaran Change
 */
const handleSasaranChange = () => {
  form.value.indikatorId = null;
  form.value.target = '';
  isAutoFilled.value = false;
};

/**
 * Fetch Target from Renstra automatically
 */
const fetchTargetRenstra = async () => {
  if (!form.value.indikatorId || !form.value.tahun) return;

  loadingTarget.value = true;
  try {
    const targetData = await $fetch<any[]>('/api/target-indikator');
    const tahunData = await $fetch<any[]>('/api/tahun');
    
    const tahunObj = tahunData.find(t => Number(t.tahun) === Number(form.value.tahun));
    
    if (tahunObj) {
      const found = targetData.find(t => t.indikatorId === form.value.indikatorId && t.tahunId === tahunObj.id);
      
      if (found) {
        form.value.target = String(found.target);
        isAutoFilled.value = true;
      } else {
        form.value.target = '';
        isAutoFilled.value = false;
      }
    }
  } catch (error) {
    console.error('Failed to fetch renstra target:', error);
  } finally {
    loadingTarget.value = false;
  }
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  if (!form.value.indikatorId || !form.value.unitKerja) {
    alert('Harap lengkapi semua isian wajib.');
    return;
  }

  submitting.value = true;
  try {
    const result = await $fetch<any>('/api/perjanjian-kinerja', {
      method: 'POST',
      body: {
        tahun: Number(form.value.tahun),
        unitKerja: form.value.unitKerja,
        sasaranId: form.value.sasaranId,
        indikatorId: form.value.indikatorId,
        target: form.value.target,
        status: 'Approved'
      }
    });

    if (result) {
      router.push(`/${route.params.slug}/perjanjian-kinerja`);
    }
  } catch (error: any) {
    console.error('Error saving PK:', error);
    alert(error.data?.statusMessage || 'Gagal menyimpan komitmen PK. Silakan coba lagi.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input:focus {
  outline: none;
  border-color: #2663A3;
  box-shadow: 0 0 0 4px rgba(38, 99, 163, 0.1);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
}

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>
