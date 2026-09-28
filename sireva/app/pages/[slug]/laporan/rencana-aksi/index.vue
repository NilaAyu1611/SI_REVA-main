<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-10">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h1 class="text-xl font-bold text-slate-800">Laporan Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Kelola dan evaluasi laporan capaian indikator rencana aksi.</p>
      </div>

      <!-- List View -->
      <div class="p-6 sm:p-8">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div class="relative w-full sm:w-80">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch class="w-4 h-4 text-slate-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari rencana aksi atau indikator..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            />
          </div>
          <button @click="showForm = true" class="w-full sm:w-auto px-5 py-2.5 bg-[#2663A3] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all">
            <IconPlus :size="18" />
            Buat Laporan Baru
          </button>
        </div>

        <div v-if="loading" class="text-center py-10">
          <div class="inline-block animate-pulse text-slate-500">Memuat data laporan...</div>
        </div>
        
        <div v-else-if="!filteredLaporanList || filteredLaporanList.length === 0" class="min-h-[40vh] flex flex-col items-center justify-center bg-white py-10 px-4">
          <div class="flex flex-col items-center text-center">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="mb-4">
              <circle cx="48" cy="48" r="48" fill="#2663A3" fill-opacity="0.08"/>
              <g>
                <polygon points="48,22 54,40 73,40 57,52 63,70 48,59 33,70 39,52 23,40 42,40" fill="#2663A3"/>
                <polygon points="48,28 52,40 64,40 54,48 58,60 48,53 38,60 42,48 32,40 44,40" fill="#FBB23B"/>
              </g>
            </svg>
            <h1 class="text-2xl font-bold mb-2 text-slate-800">Laporan Tidak Ditemukan</h1>
            <p class="text-slate-500">Belum ada laporan atau pencarian tidak cocok.</p>
          </div>
        </div>
        
        <div v-else class="overflow-x-auto border border-slate-200 rounded-xl">
          <UiTable
            :columns="tableColumns"
            :data="filteredLaporanList"
            :page-size="10"
            :show-pagination="true"
            row-key="id"
          >
            <template #cell-waktu="{ value }">
              <span class="font-medium text-slate-900 whitespace-nowrap">{{ getRelativeTime(value) }}</span>
            </template>

            <template #cell-indikatorName="{ row }">
              <div class="line-clamp-2 text-xs text-slate-600" :title="getIndikatorNameByRencanaAksi(row.rencanaAksiId)">
                {{ getIndikatorNameByRencanaAksi(row.rencanaAksiId) }}
              </div>
            </template>

            <template #cell-rencanaAksiName="{ row }">
              <div class="line-clamp-2 font-semibold text-slate-800" :title="getRencanaAksiName(row.rencanaAksiId)">
                {{ getRencanaAksiName(row.rencanaAksiId) }}
              </div>
            </template>

            <template #cell-capaian="{ value }">
              <span :class="[
                'px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center justify-center min-w-14',
                parseFloat(value) >= 100 ? 'bg-emerald-100 text-emerald-700' :
                parseFloat(value) >= 80 ? 'bg-blue-100 text-blue-700' :
                parseFloat(value) >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              ]">
                {{ value }}%
              </span>
            </template>

            <template #cell-aksi="{ row }">
              <div class="flex items-center justify-center gap-1">
                <button @click="viewingLaporan = row" class="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Lihat Dokumen">
                  <IconEye :size="18" />
                </button>
                <button @click="handleDelete(row.id)" class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Hapus Laporan">
                  <IconTrash :size="18" />
                </button>
              </div>
            </template>
          </UiTable>
        </div>
      </div>
    </div>

    <!-- Side Drawer: Buat Laporan Form -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-100 flex justify-end">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="showForm = false"></div>
        
        <div class="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
          <!-- Drawer Header -->
          <div class="px-6 py-5 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 class="text-xl font-bold text-slate-800">Buat Laporan Baru</h2>
              <p class="text-sm text-slate-500">Evaluasi dan catat capaian indikator.</p>
            </div>
            <button @click="showForm = false" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <IconX :size="24" />
            </button>
          </div>
          
          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <form id="laporan-form" @submit.prevent="handleSubmit" class="space-y-8 pb-10">
              <!-- Pemetaan Sasaran -->
              <div class="space-y-4">
                <h3 class="text-sm font-bold text-[#2663A3] uppercase tracking-wider flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-[#2663A3] rounded-full"></span>
                  Konteks Indikator
                </h3>
                <div class="grid grid-cols-1 gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">Indikator Kinerja <span class="text-red-500">*</span></label>
                    <select v-model="form.indikatorId" class="field-input" required>
                      <option :value="null">-- Pilih Indikator Kinerja --</option>
                      <option v-for="ind in indikatorList" :key="ind.id" :value="ind.id">
                        {{ ind.namaIndikator }}
                      </option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">Rencana Aksi <span class="text-red-500">*</span></label>
                    <select v-model="form.rencanaAksiId" class="field-input" :disabled="!form.indikatorId" required>
                      <option :value="null">-- Pilih Rencana Aksi --</option>
                      <option v-for="ra in filteredRencanaAksiList" :key="ra.id" :value="ra.id">
                        {{ ra.rencanaAksi }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <hr class="border-slate-100" />

              <!-- Data Capaian -->
              <div class="space-y-4">
                <h3 class="text-sm font-bold text-[#2663A3] uppercase tracking-wider flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-[#2663A3] rounded-full"></span>
                  Nilai Capaian
                </h3>
                <div class="space-y-2 max-w-sm relative">
                  <label class="block text-sm font-medium text-slate-700">Pencapaian (%) <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input 
                      v-model.number="form.capaian" 
                      type="number" 
                      step="0.01" 
                      class="field-input pr-10 text-lg font-bold" 
                      placeholder="Contoh: 85.5" 
                      required 
                    />
                    <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold">
                      %
                    </div>
                  </div>
                </div>
              </div>

              <hr class="border-slate-100" />

              <!-- Analisa & Evaluasi -->
              <div class="space-y-4">
                <h3 class="text-sm font-bold text-[#2663A3] uppercase tracking-wider flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-[#2663A3] rounded-full"></span>
                  Analisa & Evaluasi
                </h3>
                
                <div class="space-y-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">Analisa Pencapaian <span class="text-red-500">*</span></label>
                    <textarea 
                      v-model="form.analisaCapaian" 
                      rows="4" 
                      class="field-input resize-y focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Jelaskan secara komprehensif mengenai capaian rencana aksi ini..." 
                      required 
                    ></textarea>
                    <div class="flex justify-between text-xs mt-1 transition-colors">
                      <span class="text-slate-500">Minimal 100 karakter</span>
                      <span :class="form.analisaCapaian.length >= 100 ? 'text-emerald-600 font-bold' : 'text-red-500 font-medium'">
                        {{ form.analisaCapaian.length }} / Min. 100
                      </span>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">Analisa Permasalahan <span class="text-red-500">*</span></label>
                    <textarea 
                      v-model="form.analisaPermasalahan" 
                      rows="4" 
                      class="field-input resize-y focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Uraikan kendala, hambatan, atau permasalahan yang dihadapi..." 
                      required 
                    ></textarea>
                    <div class="flex justify-between text-xs mt-1 transition-colors">
                      <span class="text-slate-500">Minimal 100 karakter</span>
                      <span :class="form.analisaPermasalahan.length >= 100 ? 'text-emerald-600 font-bold' : 'text-red-500 font-medium'">
                        {{ form.analisaPermasalahan.length }} / Min. 100
                      </span>
                    </div>
                  </div>

                  <div class="space-y-2 p-5 bg-blue-50/70 rounded-xl border border-blue-100">
                    <label class="flex items-center gap-2 text-sm font-medium text-blue-900 mb-3">
                      <IconChecklist :size="18" />
                      Rencana Tindak Lanjut
                      <span class="text-[10px] font-bold bg-white text-slate-500 px-2 py-0.5 rounded shadow-sm uppercase">Opsional</span>
                    </label>
                    <textarea 
                      v-model="form.keteranganRencanaAksi" 
                      rows="3" 
                      class="field-input resize-y bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500/20" 
                      placeholder="Tambahkan rencana aksi untuk perbaikan periode berikutnya..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Drawer Footer -->
          <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0 z-10">
            <button type="button" @click="showForm = false" class="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
              Batal
            </button>
            <button 
              type="submit" 
              form="laporan-form"
              :disabled="submitting || !isFormValid"
              class="px-6 py-2.5 rounded-xl bg-[#2663A3] text-white font-semibold shadow-lg shadow-blue-700/20 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Simpan Laporan
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Document Modal: Lihat Detail -->
    <Teleport to="body">
      <div v-if="viewingLaporan" class="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="viewingLaporan = null"></div>
        
        <div class="relative w-full max-w-4xl bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
            <h2 class="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <IconFileDescription :size="20" class="text-[#2663A3]" />
              Dokumen Laporan
            </h2>
            <div class="flex items-center gap-2">
              <button class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors" @click="viewingLaporan = null">
                <IconX :size="24" />
              </button>
            </div>
          </div>
          
          <!-- Document Content (A4 style) -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
            <div class="bg-white max-w-3xl mx-auto shadow-sm border border-slate-200 rounded-lg p-8 sm:p-12">
              
              <!-- Document Head -->
              <div class="text-center pb-8 border-b-2 border-slate-800 mb-8">
                <h1 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Laporan Rencana Aksi</h1>
                <p class="text-slate-500 font-medium mt-2">Dibuat pada: {{ new Date(viewingLaporan.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              </div>
              
              <!-- Document Body -->
              <div class="space-y-8 text-slate-800">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Indikator Kinerja</div>
                  <div class="md:col-span-3 font-medium text-lg leading-relaxed">{{ getIndikatorNameByRencanaAksi(viewingLaporan.rencanaAksiId) }}</div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Rencana Aksi</div>
                  <div class="md:col-span-3 font-bold text-xl text-blue-700 leading-relaxed">{{ getRencanaAksiName(viewingLaporan.rencanaAksiId) }}</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Nilai Capaian</div>
                  <div class="md:col-span-3">
                    <span :class="[
                      'px-4 py-2 rounded-xl text-lg font-black inline-flex items-center shadow-sm border',
                      parseFloat(viewingLaporan.capaian) >= 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      parseFloat(viewingLaporan.capaian) >= 80 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      parseFloat(viewingLaporan.capaian) >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                    ]">
                      {{ viewingLaporan.capaian }}%
                    </span>
                  </div>
                </div>

                <div class="pt-6 border-t border-slate-100">
                  <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">1. Analisa Pencapaian</h3>
                  <p class="text-justify leading-loose whitespace-pre-wrap font-serif text-lg">{{ viewingLaporan.analisaCapaian }}</p>
                </div>

                <div class="pt-6 border-t border-slate-100">
                  <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">2. Analisa Permasalahan</h3>
                  <p class="text-justify leading-loose whitespace-pre-wrap font-serif text-lg">{{ viewingLaporan.analisaPermasalahan }}</p>
                </div>

                <div v-if="viewingLaporan.keteranganRencanaAksi" class="pt-6 border-t border-slate-100">
                  <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">3. Rencana Tindak Lanjut</h3>
                  <div class="p-6 bg-slate-50 rounded-lg border border-slate-200 font-serif text-lg leading-loose whitespace-pre-wrap">
                    {{ viewingLaporan.keteranganRencanaAksi }}
                  </div>
                </div>
              </div>

              <!-- Signature Area Dummy -->
              <div class="mt-20 flex justify-end">
                <div class="text-center">
                  <p class="text-slate-600 mb-16">Pelapor,</p>
                  <p class="font-bold text-slate-900 border-b border-slate-900 inline-block pb-1">Administrator SI-REVA</p>
                  <p class="text-slate-500 text-sm mt-1">NIP. -</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useSWRV from 'swrv';
import { IconChecklist, IconPlus, IconFileDescription, IconTrash, IconEye, IconX, IconSearch } from '@tabler/icons-vue';
import UiTable from '@/components/UI/Table.vue';

const router = useRouter();
const fetcher = (url: string) => fetch(url).then(r => r.json());

const showForm = ref(false);
const viewingLaporan = ref<any>(null);
const searchQuery = ref('');

const { data: laporanList, isValidating: loading, mutate: mutateLaporan } = useSWRV('/api/laporan-rencana-aksi', fetcher);
const { data: indikatorList } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: rencanaAksiList } = useSWRV('/api/rencana-aksi', fetcher);

const submitting = ref(false);

const tableColumns = [
  { key: 'waktu', label: 'Waktu', width: 140 },
  { key: 'indikatorName', label: 'Indikator Kinerja', width: 220 },
  { key: 'rencanaAksiName', label: 'Rencana Aksi', width: 260 },
  { key: 'capaian', label: 'Capaian', center: true, width: 110 },
  { key: 'aksi', label: 'Aksi', center: true, width: 110 },
];

const form = ref({
  indikatorId: null as number | null,
  rencanaAksiId: null as number | null,
  capaian: null as number | null,
  analisaCapaian: '',
  analisaPermasalahan: '',
  keteranganRencanaAksi: ''
});

const filteredRencanaAksiList = computed(() => {
  if (!form.value.indikatorId || !rencanaAksiList.value) return [];
  return rencanaAksiList.value.filter((ra: any) => ra.indikatorId === form.value.indikatorId);
});

const filteredLaporanList = computed(() => {
  if (!laporanList.value) return [];
  let list = laporanList.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((l: any) => {
      const indikator = getIndikatorNameByRencanaAksi(l.rencanaAksiId).toLowerCase();
      const rencanaAksi = getRencanaAksiName(l.rencanaAksiId).toLowerCase();
      return indikator.includes(q) || rencanaAksi.includes(q);
    });
  }
  return list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const isFormValid = computed(() => {
  return form.value.rencanaAksiId && 
         form.value.capaian !== null &&
         form.value.analisaCapaian.length >= 100 &&
         form.value.analisaPermasalahan.length >= 100;
});

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInTime = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
  
  if (diffInDays === 0) return 'Hari ini';
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function handleSubmit() {
  if (!isFormValid.value) return;
  submitting.value = true;
  
  try {
    const payload = {
      rencanaAksiId: form.value.rencanaAksiId,
      capaian: form.value.capaian,
      analisaCapaian: form.value.analisaCapaian,
      analisaPermasalahan: form.value.analisaPermasalahan,
      keteranganRencanaAksi: form.value.keteranganRencanaAksi
    };

    const res = await $fetch('/api/laporan-rencana-aksi', {
      method: 'POST',
      body: payload
    });
    
    if (res) {
      // Reset form
      form.value = {
        indikatorId: null,
        rencanaAksiId: null,
        capaian: null,
        analisaCapaian: '',
        analisaPermasalahan: '',
        keteranganRencanaAksi: ''
      };
      showForm.value = false;
      mutateLaporan();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menyimpan laporan.');
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: number) {
  if (!confirm('Apakah Anda yakin ingin menghapus laporan ini? Data yang dihapus tidak dapat dikembalikan.')) return;
  try {
    await $fetch('/api/laporan-rencana-aksi', {
      method: 'DELETE',
      body: { id }
    });
    mutateLaporan();
  } catch (error) {
    console.error(error);
    alert('Gagal menghapus laporan.');
  }
}

function getRencanaAksiName(id: number) {
  if (!rencanaAksiList.value) return '-';
  const match = rencanaAksiList.value.find((r: any) => r.id === id);
  return match ? match.rencanaAksi : '-';
}

function getIndikatorNameByRencanaAksi(id: number) {
  if (!rencanaAksiList.value || !indikatorList.value) return '-';
  const rencana = rencanaAksiList.value.find((r: any) => r.id === id);
  if (!rencana) return '-';
  const indikator = indikatorList.value.find((i: any) => i.id === rencana.indikatorId);
  return indikator ? indikator.namaIndikator : '-';
}
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
  transition: all 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  appearance: none;
  margin: 0; 
}
input[type=number] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
}
</style>
