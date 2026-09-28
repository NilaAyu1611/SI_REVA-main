<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Visi, Misi & Tujuan</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <NuxtLink
            :to="`/${route.params.slug}/master-visi-misi-tujuan/add`"
            class="bg-[#2663A3] hover:bg-blue-700 text-white font-bold rounded-xl px-6 py-2.5 inline-flex items-center gap-2 text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <IconPlus :size="18" stroke-width="3" />
            Input Visi/Misi/Tujuan
          </NuxtLink>
        </div>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Memuat data...
      </div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600 text-center">{{ errorMessage }}</div>
      
      <div v-else class="p-4">
        <Table
          :columns="columns"
          :data="tableData"
          :loading="loading"
        >
          <template #cell-tipe="{ row }">
            <span 
              class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="{
                'bg-blue-100 text-blue-700': row.tipe === 'VISI',
                'bg-emerald-100 text-emerald-700': row.tipe === 'MISI',
                'bg-amber-100 text-amber-700': row.tipe === 'TUJUAN'
              }"
            >
              {{ row.tipe }}
            </span>
          </template>
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <NuxtLink
                :to="`/${route.params.slug}/master-visi-misi-tujuan/edit?id=${row.id}&tipe=${row.tipe.toLowerCase()}`"
                :aria-label="`Edit ${row.tipe}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" />
              </NuxtLink>
              <button
                type="button"
                @click="handleDelete(row)"
                :aria-label="`Hapus ${row.tipe}`"
                title="Hapus"
                class="action-btn action-btn-delete"
              >
                <IconTrash :size="16" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';

const route = useRoute();

const { data: visiData, error: vError, pending: vLoading, refresh: refreshVisi } = useFetch('/api/visi', { lazy: true, default: () => [] });
const { data: misiData, error: mError, pending: mLoading, refresh: refreshMisi } = useFetch('/api/misi', { lazy: true, default: () => [] });
const { data: tujuanData, error: tError, pending: tLoading, refresh: refreshTujuan } = useFetch('/api/tujuan', { lazy: true, default: () => [] });

const loading = computed(() => vLoading.value || mLoading.value || tLoading.value);
const errorMessage = computed(() => vError.value || mError.value || tError.value ? 'Gagal memuat data' : '');

const columns = [
  { key: 'tipe', label: 'Tipe', align: 'center' as const },
  { key: 'kode', label: 'Kode', align: 'center' as const },
  { key: 'text', label: 'Pernyataan / Deskripsi', align: 'left' as const },
  { key: 'aksi', label: 'Aksi', align: 'center' as const },
];

const tableData = computed(() => {
  const result: any[] = [];
  
  if (visiData.value) {
    const list = Array.isArray(visiData.value) ? visiData.value : (visiData.value.data || []);
    list.forEach((v: any) => result.push({ id: v.id, tipe: 'VISI', kode: v.kode || '-', text: v.visiText }));
  }
  
  if (misiData.value) {
    const list = Array.isArray(misiData.value) ? misiData.value : (misiData.value.data || []);
    list.forEach((m: any) => result.push({ id: m.id, tipe: 'MISI', kode: m.kode || '-', text: m.misiText }));
  }
  
  if (tujuanData.value) {
    const list = Array.isArray(tujuanData.value) ? tujuanData.value : (tujuanData.value.data || []);
    list.forEach((t: any) => result.push({ id: t.id, tipe: 'TUJUAN', kode: t.kode || '-', text: t.tujuanText }));
  }
  
  return result;
});

const handleDelete = async (row: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus ${row.tipe} ini?`)) {
    try {
      await $fetch(`/api/${row.tipe.toLowerCase()}`, {
        method: 'DELETE',
        body: { id: row.id }
      });
      if (row.tipe === 'VISI') await refreshVisi();
      else if (row.tipe === 'MISI') await refreshMisi();
      else if (row.tipe === 'TUJUAN') await refreshTujuan();
    } catch (error: any) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus data: ' + (error.data?.message || error.message || 'Terjadi kesalahan'));
    }
  }
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.action-btn {
  @apply p-2 rounded-xl transition-all active:scale-90;
}
.action-btn-edit {
  @apply text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100;
}
.action-btn-delete {
  @apply text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100;
}
</style>
