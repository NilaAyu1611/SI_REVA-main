<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/rencana-aksi`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Rencana Aksi
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Edit Rencana</span>
    </div>

    <!-- Content Section -->
    <div class="max-w-4xl mx-auto space-y-6">
      <div v-if="fetching" class="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold tracking-widest text-xs uppercase">Sinkronisasi Data...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Section 01: Sasaran Kegiatan -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2663A3]">
              <IconTarget :size="18" stroke-width="2.5" />
            </div>
            <h2 class="text-sm font-black text-[#2663A3] uppercase tracking-wider">Perencanaan - Sasaran Kegiatan</h2>
          </div>
          
          <div class="p-8 space-y-6">
            <!-- Sasaran Kegiatan -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Sasaran Kegiatan</label>
              <select 
                v-model="form.sasaranId" 
                class="field-input bg-slate-50 cursor-not-allowed"
                disabled
              >
                <option v-for="s in filteredSasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>

            <!-- Indikator Kinerja -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja</label>
              <select 
                v-model="form.indikatorId" 
                class="field-input bg-slate-50 cursor-not-allowed"
                disabled
              >
                <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">{{ i.namaIndikator }}</option>
              </select>
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
          
          <div class="p-8 space-y-6">
            <div class="space-y-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div class="space-y-2">
                <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Rencana Aksi / Aktivitas <span class="text-red-500">*</span></label>
                <textarea 
                  v-model="form.namaAksi" 
                  rows="3"
                  class="field-input resize-none"
                  placeholder="Masukkan deskripsi rencana aksi..."
                  required
                ></textarea>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="space-y-2 col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Target Total</label>
                  <input v-model.number="form.target" type="number" class="field-input !p-2 font-bold" required />
                </div>
                <div class="space-y-2">
                   <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B01-B03 (TW I)</label>
                   <input v-model.number="form.tw1" type="number" class="field-input !p-2 text-center" placeholder="0" />
                </div>
                <div class="space-y-2">
                   <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B04-B06 (TW II)</label>
                   <input v-model.number="form.tw2" type="number" class="field-input !p-2 text-center" placeholder="0" />
                </div>
                <div class="space-y-2">
                   <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B07-B12 (TW III/IV)</label>
                   <input v-model.number="form.tw3" type="number" class="field-input !p-2 text-center" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/rencana-aksi`)"
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <IconX :size="18" />
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconDeviceFloppy :size="18" />
            <span v-if="!submitting">Simpan Perubahan</span>
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Edit Rencana Aksi Standardized
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconCheck, IconTarget, 
  IconListDetails, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue';
import useSWRV from 'swrv';

const router = useRouter();
const route = useRoute();

// Config
const currentYear = 2026;

// State
const id = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);

const form = ref<any>({
  id: id,
  sasaranId: null,
  indikatorId: null,
  namaAksi: '',
  target: 0,
  tw1: 0,
  tw2: 0,
  tw3: 0
});

// Fetchers
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: kegiatanList } = useSWRV('/api/sasaran-kegiatan', fetcher);

// Computed / Filters
const filteredSasaranList = computed(() => {
  if (!kegiatanList.value) return [];
  return (kegiatanList.value as any[]);
});

const filteredIndikatorList = computed(() => {
  if (!form.value.sasaranId || !kegiatanList.value) return [];
  const sasaran = (kegiatanList.value as any[]).find(s => s.id === form.value.sasaranId);
  return sasaran?.indikators || [];
});

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/rencana-aksi`);
    return;
  }

  try {
    fetching.value = true;
    const res = await $fetch<any>(`/api/rencana-aksi?id=${id}`);
    const existingData = Array.isArray(res) ? res[0] : res;
    
    if (existingData) {
      // Find parent sasaran from kegiatanList
      // Since existingData.indikatorId is the primary link
      // We might need to wait for kegiatanList or search through it
      
      form.value = {
        id: existingData.id,
        sasaranId: null, // Will be set below
        indikatorId: existingData.indikatorId,
        namaAksi: existingData.namaRencanaAksi,
        target: Number(existingData.target || 0),
        tw1: Number(existingData.tw1 || 0),
        tw2: Number(existingData.tw2 || 0),
        tw3: Number(existingData.tw3 || 0),
      };
      
      // Look for parent sasaran
      if (kegiatanList.value) {
        findParentSasaran();
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    fetching.value = false;
  }
});

import { watch } from 'vue';
watch(() => kegiatanList.value, () => {
  if (kegiatanList.value && form.value.indikatorId && !form.value.sasaranId) {
    findParentSasaran();
  }
});

function findParentSasaran() {
  const sasaran = (kegiatanList.value as any[]).find(s => 
    s.indikators?.some((i: any) => i.id === form.value.indikatorId)
  );
  if (sasaran) {
    form.value.sasaranId = sasaran.id;
  }
}

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await $fetch<any>('/api/rencana-aksi', {
      method: 'PUT',
      body: {
        id: form.value.id,
        indikatorId: form.value.indikatorId,
        namaAksi: form.value.namaAksi,
        target: form.value.target,
        tw1: form.value.tw1,
        tw2: form.value.tw2,
        tw3: form.value.tw3,
        tahun: currentYear
      }
    });

    router.push(`/${route.params.slug}/rencana-aksi`);
  } catch (error: any) {
    console.error('Error saving data:', error);
    alert('Gagal menyimpan perubahan.');
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
  background-color: #f8fafc;
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
