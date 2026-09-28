<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconChartBar :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Pemantauan: Edit Rencana Aksi</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui laporan pemantauan aktivitas dan progres rencana aksi.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <div v-if="loadingRecord" class="p-20 text-center flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-slate-100 border-t-[#2663A3] rounded-full animate-spin"></div>
      <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Data Laporan...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Perubahan Pemantauan</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Unit Kerja (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Unit Kerja</td>
              <td class="px-8 py-5 font-bold text-slate-800">{{ unitName || '-' }}</td>
            </tr>

            <!-- 2. Sasaran Kegiatan (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Kegiatan</td>
              <td class="px-8 py-5 font-bold text-slate-800">{{ skName || '-' }}</td>
            </tr>

            <!-- 3. Indikator Kinerja (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Kinerja</td>
              <td class="px-8 py-5 font-bold text-slate-800">{{ indikatorName || '-' }}</td>
            </tr>

            <!-- 4. Rencana Kegiatan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Rencana Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.rencanaAksiId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Rencana Aksi --</option>
                    <option v-for="ra in raPlanningList" :key="ra.id" :value="ra.id">{{ ra.namaRencanaAksi }}</option>
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
          Perbarui Pemantauan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconChartBar, IconFileText, IconChevronDown, IconX, IconDeviceFloppy } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const loadingRecord = ref(true)

const id = route.query.id
const form = ref({
  rencanaAksiId: null as number | null,
  keterangan: ''
})

const unitName = ref('')
const skName = ref('')
const indikatorName = ref('')
const raPlanningList = ref<any[]>([])

onMounted(async () => {
  if (!id) return
  try {
    const data = await $fetch<any>(`/api/pemantauan-rencana-aksi/${id}`)
    if (data) {
      form.value.rencanaAksiId = data.rencanaAksiId
      form.value.keterangan = data.keterangan
      
      unitName.value = data.unitKerjaNama
      skName.value = data.sasaranText
      indikatorName.value = data.indikatorNama
      
      // Fetch available planning actions for this indicator
      const raData = await $fetch<any[]>('/api/rencana-aksi')
      raPlanningList.value = raData.filter((ra: any) => ra.idIndikator === data.indikatorId)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingRecord.value = false
  }
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch(`/api/pemantauan-rencana-aksi/${id}`, { method: 'PUT', body: form.value })
    router.push(`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`)
  } catch (error) {
    console.error('Error:', error)
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
