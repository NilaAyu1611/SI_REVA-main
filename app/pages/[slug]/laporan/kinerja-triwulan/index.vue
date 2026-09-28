<template>
  <div class="max-w-6xl mx-auto pb-20 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Daftar Laporan Kinerja Triwulanan</h1>
        <p class="text-slate-500 font-medium text-sm mt-1">Kelola laporan kinerja triwulanan yang telah diajukan.</p>
      </div>
      <NuxtLink :to="`/${route.params.slug}/laporan/kinerja-triwulan/add`" class="px-5 py-2.5 bg-[#2663A3] text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2">
        <IconPlus :size="20" stroke-width="2.5" /> Tambah Laporan
      </NuxtLink>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-20 text-center flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-slate-200 border-t-[#2663A3] rounded-full animate-spin"></div>
        <span class="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat data...</span>
      </div>
      <div v-else>
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-black tracking-wider text-xs">
            <tr>
              <th class="px-6 py-4 text-center w-16">No</th>
              <th class="px-6 py-4">Triwulan</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(laporan, idx) in laporanList" :key="laporan.id" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 text-center font-bold text-slate-400">{{ idx + 1 }}</td>
              <td class="px-6 py-4 font-bold text-slate-800">
                {{ laporan.triwulan }}
                <span class="text-xs font-medium text-slate-500 block">Tahun {{ laporan.tahun || 2026 }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="laporan.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'" class="px-3 py-1 rounded-full text-xs font-bold border">
                  {{ laporan.status }}
                </span>
              </td>
              <td class="px-6 py-4 flex items-center justify-center gap-2">
                <NuxtLink :to="`/${route.params.slug}/laporan/kinerja-triwulan/view?id=${laporan.id}`" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Lihat Detail">
                  <IconEye :size="20" />
                </NuxtLink>
                <button @click="deleteLaporan(laporan.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip" title="Hapus Laporan">
                  <IconTrash :size="20" />
                </button>
              </td>
            </tr>
            <tr v-if="laporanList.length === 0">
              <td colspan="4" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <div class="p-4 bg-slate-50 rounded-full text-slate-400">
                    <IconFileOff :size="32" />
                  </div>
                  <p class="text-slate-500 font-medium">Belum ada laporan yang diajukan.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { IconPlus, IconEye, IconTrash, IconFileOff } from '@tabler/icons-vue'
import { useAuthUser } from '~/composables/useAuthUser'

const route = useRoute()
const { authUser } = useAuthUser()
const laporanList = ref<any[]>([])
const loading = ref(true)

async function fetchLaporan() {
  if (!authUser.value?.unit_kerja) return
  loading.value = true
  try {
    const data = await $fetch<any[]>('/api/laporan-kinerja-triwulan', {
      query: { unitKerja: authUser.value.unit_kerja }
    })
    laporanList.value = Array.isArray(data) ? data : ((data as any)?.data || [])
  } catch (e) {
    laporanList.value = []
  } finally {
    loading.value = false
  }
}

async function deleteLaporan(id: string) {
  if (!confirm('Yakin ingin menghapus laporan ini? Data yang dihapus tidak dapat dikembalikan.')) return
  try {
    await $fetch('/api/laporan-kinerja-triwulan', { method: 'DELETE', body: { id } })
    laporanList.value = laporanList.value.filter(l => l.id !== id)
    alert('Laporan berhasil dihapus.')
  } catch (e) {
    alert('Gagal menghapus laporan.')
  }
}

onMounted(() => {
  if (authUser.value?.unit_kerja) {
    fetchLaporan()
  } else {
    const unwatch = watch(() => authUser.value?.unit_kerja, (val) => {
      if (val) {
        fetchLaporan()
        unwatch()
      }
    })
  }
})
</script>
