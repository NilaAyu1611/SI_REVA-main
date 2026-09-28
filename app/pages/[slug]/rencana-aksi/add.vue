<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/rencana-aksi`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Rencana Aksi
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Tambah Baru</span>
    </div>

    <!-- Content Section -->
    <div class="max-w-4xl mx-auto space-y-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Section 01: Sasaran Program & Indikator Kinerja -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2663A3]">
              <IconTarget :size="18" stroke-width="2.5" />
            </div>
            <h2 class="text-sm font-black text-[#2663A3] uppercase tracking-wider">Perencanaan - Sasaran Program</h2>
          </div>
          
          <div class="p-8 space-y-6">
            <!-- Sasaran Program -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Sasaran Program <span class="text-red-500">*</span></label>
              <select 
                v-model="form.sasaranProgramId" 
                class="field-input"
                required
              >
                <option :value="null" disabled>-- Pilih Sasaran Program --</option>
                <option v-for="s in filteredSasaranProgramList" :key="s.id" :value="s.id">{{ s.namaSp }}</option>
              </select>
            </div>

            <!-- Indikator Kinerja -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja <span class="text-red-500">*</span></label>
              <select 
                v-model="form.indikatorId" 
                class="field-input"
                required
                :disabled="!form.sasaranProgramId"
              >
                <option :value="null" disabled>-- Pilih Indikator Kinerja --</option>
                <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">{{ i.namaSk }}</option>
              </select>
              <p v-if="form.sasaranProgramId && filteredIndikatorList.length === 0" class="text-[11px] text-amber-600 font-bold ml-1 italic">
                * Tidak ada indikator kinerja untuk sasaran program terpilih.
              </p>
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
            <div v-for="(item, index) in form.rencanaAksiList" :key="index" class="space-y-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group">
              <button 
                v-if="form.rencanaAksiList.length > 1"
                type="button"
                @click="removeRencanaAksi(Number(index))"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
              >
                <IconX :size="14" stroke-width="3" />
              </button>

              <div class="space-y-2">
                <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Rencana Aksi / Aktivitas #{{ Number(index) + 1 }} <span class="text-red-500">*</span></label>
                <textarea 
                  v-model="item.namaAksi" 
                  rows="4"
                  class="field-input resize-none"
                  placeholder="Masukkan deskripsi rencana aksi (minimal 10 kalimat)..."
                  required
                ></textarea>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
                  <span class="text-[11px] text-slate-400 font-medium">
                    * Setiap kalimat wajib diakhiri tanda baca titik (.), seru (!), atau tanya (?).
                  </span>
                  <span 
                    :class="[
                      'text-xs font-black px-2 py-0.5 rounded-lg border inline-flex items-center gap-1 self-start sm:self-auto',
                      countSentences(item.namaAksi) >= 10 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                    ]"
                  >
                    {{ countSentences(item.namaAksi) }} / 10 Kalimat
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="space-y-2 col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Target Total</label>
                  <input v-model.number="item.target" type="number" class="field-input !p-2 font-bold" required />
                </div>
                <div class="space-y-2">
                   <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B01-B03 (TW I)</label>
                   <input v-model.number="item.tw1" type="number" class="field-input !p-2 text-center" placeholder="0" />
                </div>
                <div class="space-y-2">
                   <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B04-B06 (TW II)</label>
                   <input v-model.number="item.tw2" type="number" class="field-input !p-2 text-center" placeholder="0" />
                </div>
                <div class="space-y-2">
                   <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B07-B12 (TW III/IV)</label>
                   <input v-model.number="item.tw3" type="number" class="field-input !p-2 text-center" placeholder="0" />
                </div>
              </div>
            </div>

            <button 
              type="button" 
              @click="addRencanaAksi"
              class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-[#2663A3] hover:text-[#2663A3] transition-all flex items-center justify-center gap-2"
            >
              <IconPlus :size="18" />
              Tambah Rencana Aksi Lainnya
            </button>
            
            <p class="text-[11px] text-slate-400 text-center italic">Pilih sasaran kegiatan yang akan diturunkan menjadi rencana aksi operasional.</p>
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
            :disabled="submitting || !form.indikatorId"
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconDeviceFloppy :size="18" />
            <span v-if="!submitting">Simpan Perencanaan</span>
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Rencana Aksi
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPlus, IconCheck, IconTarget, 
  IconListDetails, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue';
import useSWRV from 'swrv';
import { useAuthUser } from '~/composables/useAuthUser';

const router = useRouter();
const route = useRoute();

// Config
const currentYear = 2026;

// State
const submitting = ref(false);
const { authUser, role } = useAuthUser();

const form = ref<any>({
  sasaranProgramId: null,
  indikatorId: null,
  rencanaAksiList: [
    { namaAksi: '', target: 0, tw1: 0, tw2: 0, tw3: 0 }
  ]
});

// Fetchers
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: rawSasaranProgram } = useSWRV('/api/sasaran-program', fetcher);
const { data: rawSasaranKegiatan } = useSWRV('/api/sasaran-kegiatan', fetcher);

// Computed / Filters
const loggedUnitKerja = computed(() => authUser.value?.unit_kerja || '');

const filteredSasaranProgramList = computed(() => {
  if (!rawSasaranProgram.value) return [];
  const list = Array.isArray(rawSasaranProgram.value) ? rawSasaranProgram.value : (rawSasaranProgram.value.data || []);
  
  const uniquePrograms = new Map();
  for (const item of list) {
    if (!item.id) continue;
    
    // Filter by unit kerja pengampu if the user is not super_admin
    const isSuper = role.value?.toLowerCase() === 'super_admin';
    if (!isSuper && loggedUnitKerja.value) {
      const pengampu = item.unit_kerja || item.unitKerjaNama || '';
      if (pengampu.toLowerCase().trim() !== loggedUnitKerja.value.toLowerCase().trim()) {
        continue;
      }
    }
    
    if (!uniquePrograms.has(item.id)) {
      uniquePrograms.set(item.id, {
        id: item.id,
        namaSp: item.sasaran_program_text,
        pengampu: item.unit_kerja || item.unitKerjaNama
      });
    }
  }
  return Array.from(uniquePrograms.values());
});

const filteredIndikatorList = computed(() => {
  if (!form.value.sasaranProgramId || !rawSasaranKegiatan.value) return [];
  const list = Array.isArray(rawSasaranKegiatan.value) ? rawSasaranKegiatan.value : (rawSasaranKegiatan.value.data || []);
  
  const uniqueKegiatan = new Map();
  for (const item of list) {
    if (Number(item.spId) === Number(form.value.sasaranProgramId)) {
      if (!uniqueKegiatan.has(item.id)) {
        uniqueKegiatan.set(item.id, {
          id: item.id,
          namaSk: item.sasaranText || item.sasaran_kegiatan_text
        });
      }
    }
  }
  return Array.from(uniqueKegiatan.values());
});

// Helper for sentence counting
const countSentences = (text: string) => {
  if (!text) return 0;
  const clean = text.trim();
  if (!clean) return 0;
  const sentences = clean.split(/[.!?]+(?:\s|$)/).filter(s => s.trim().length > 0);
  return sentences.length;
};

// Methods
const addRencanaAksi = () => {
  form.value.rencanaAksiList.push({ namaAksi: '', target: 0, tw1: 0, tw2: 0, tw3: 0 });
};

const removeRencanaAksi = (index: number) => {
  form.value.rencanaAksiList.splice(index, 1);
};

const handleSubmit = async () => {
  if (!form.value.indikatorId) return;

  // Validate that each action plan has at least 10 sentences
  for (let idx = 0; idx < form.value.rencanaAksiList.length; idx++) {
    const item = form.value.rencanaAksiList[idx];
    const sentenceCount = countSentences(item.namaAksi);
    if (sentenceCount < 10) {
      alert(`Validasi Gagal: Rencana Aksi #${idx + 1} baru memiliki ${sentenceCount} kalimat. Silakan tulis minimal 10 kalimat (masing-masing diakhiri dengan tanda baca titik/seru/tanya).`);
      return;
    }
  }

  submitting.value = true;
  try {
    for (const item of form.value.rencanaAksiList) {
      await $fetch<any>('/api/rencana-aksi', {
        method: 'POST',
        body: {
          indikatorId: form.value.indikatorId,
          namaAksi: item.namaAksi,
          target: item.target,
          tw1: item.tw1,
          tw2: item.tw2,
          tw3: item.tw3,
          tahun: currentYear
        }
      });
    }

    router.push(`/${route.params.slug}/rencana-aksi`);
  } catch (error: any) {
    console.error('Error saving data:', error);
    alert('Terjadi kesalahan saat menyimpan data.');
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

.field-input::placeholder {
  color: rgb(203 213 225);
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
