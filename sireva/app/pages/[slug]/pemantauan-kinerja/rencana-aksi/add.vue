<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Pemantauan: Input Rencana Aksi</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Pelaporan progres aktivitas berdasarkan rencana aksi yang telah disusun.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Pemantauan Aktivitas</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unitKerjaId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.id">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 2. Sasaran Kegiatan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.sasaranKegiatanId"
                    required
                    :disabled="!form.unitKerjaId"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Kegiatan --</option>
                    <option v-for="sk in uniqueSasaranKegiatan" :key="sk.id" :value="sk.id">{{ sk.sasaranText }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Indikator Kinerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Kinerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.indikatorId"
                    required
                    :disabled="!form.sasaranKegiatanId"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                  >
                    <option :value="null" disabled>-- Pilih Indikator --</option>
                    <option v-for="ind in filteredIndikators" :key="ind.id" :value="ind.id">{{ ind.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Rencana Kegiatan (Dropdown from Planning) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Rencana Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.rencanaAksiId"
                    required
                    :disabled="!form.indikatorId"
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                  >
                    <option :value="null" disabled>-- Pilih Rencana Aksi --</option>
                    <option v-for="ra in filteredRencanaAksi" :key="ra.id" :value="ra.id">{{ ra.rencanaAksi }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 5. Keterangan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Keterangan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.keterangan"
                  type="text"
                  required
                  maxlength="50"
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Keterangan singkat (Max 50 karakter)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" /> Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Simpan Pemantauan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconChartBar, IconFileText, IconChevronDown, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const { authUser, role } = useAuthUser()

const { data: unitList } = useFetch<any[]>('/api/unit-kerja', { lazy: true, default: () => [] })
const { data: skMaster } = useFetch<any>('/api/sasaran-kegiatan', { lazy: true, default: () => [] })
const { data: raPlanning } = useFetch<any[]>('/api/rencana-aksi', { lazy: true, default: () => [] })

const form = ref({
  unitKerjaId: null as number | null,
  sasaranKegiatanId: null as number | null,
  indikatorId: null as number | null,
  rencanaAksiId: null as number | null,
  keterangan: ''
})

const sasaranKegiatanList = computed(() => {
  if (!skMaster.value) return []
  return Array.isArray(skMaster.value?.data) ? skMaster.value.data : (skMaster.value || [])
})

const uniqueSasaranKegiatan = computed(() => {
  if (!form.value.unitKerjaId) return []
  const seen = new Set()
  return sasaranKegiatanList.value
    .filter((sk: any) => sk.unitKerjaId === form.value.unitKerjaId)
    .filter((sk: any) => {
      if (seen.has(sk.id)) return false
      seen.add(sk.id)
      return true
    })
})

const filteredIndikators = computed(() => {
  if (!form.value.sasaranKegiatanId) return []
  return sasaranKegiatanList.value
    .filter((sk: any) => sk.id === form.value.sasaranKegiatanId)
    .flatMap((sk: any) => sk.indikators || [])
})

const filteredRencanaAksi = computed(() => {
  if (!form.value.indikatorId) return []
  const raList = Array.isArray(raPlanning.value) ? raPlanning.value : []
  return raList.filter((ra: any) => ra.indikatorId === form.value.indikatorId)
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/pemantauan-rencana-aksi', {
      method: 'POST',
      body: {
        rencanaAksiId: form.value.rencanaAksiId,
        realisasi: 100, // Placeholder or calculate based on logic if needed
        analisaPencapaian: 'Laporan Progres Rencana Aksi', // Placeholder
        analisaPermasalahan: '-', // Placeholder
        keterangan: form.value.keterangan
      }
    })
    router.push(`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`)
  } catch (error) {
    console.error('Error saving:', error)
    alert('Gagal menyimpan pemantauan. Silakan periksa koneksi atau data input.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
table tr:last-child {
  border-bottom: none;
}
</style>
