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
      <NuxtLink
        :to="`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`"
        class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
      >
        <IconArrowLeft :size="18" /> Kembali
      </NuxtLink>
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

            <!-- 2. Rencana Kegiatan (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Rencana Kegiatan</td>
              <td class="px-8 py-5 font-bold text-slate-800">{{ rencanaAksiNama || '-' }}</td>
            </tr>

            <!-- 3. Indikator Kinerja (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Kinerja</td>
              <td class="px-8 py-5 font-bold text-[#2663A3]">{{ indikatorName || '-' }}</td>
            </tr>

            <!-- 4. Target (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Target (Database)</td>
              <td class="px-8 py-5 font-black text-slate-700 text-lg">{{ targetValue || 0 }}</td>
            </tr>

            <!-- 5. Keterangan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">5. Keterangan <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.keterangan"
                  required
                  maxlength="800"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Tuliskan keterangan progres rencana kegiatan ini (Min 100, Max 800 karakter)..."
                ></textarea>
                <div class="flex justify-between items-center px-1">
                  <span :class="form.keterangan.length < 100 ? 'text-red-500 font-bold' : 'text-slate-400 font-bold'" class="text-[10px] uppercase tracking-widest">
                    {{ form.keterangan.length }} / 800 Karakter (Min. 100)
                  </span>
                </div>
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
          :disabled="submitting || !isFormValid"
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

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconChartBar, IconFileText, IconX, IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-vue'

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
const rencanaAksiNama = ref('')
const indikatorName = ref('')
const targetValue = ref(0)

onMounted(async () => {
  if (!id) return
  try {
    const data = await $fetch<any>(`/api/pemantauan-rencana-aksi?id=${id}`)
    if (data) {
      form.value.rencanaAksiId = data.rencanaAksiId
      form.value.keterangan = data.keteranganRencanaAksi || data.keterangan || ''
      
      unitName.value = data.unitKerjaNama || '-'
      rencanaAksiNama.value = data.rencanaAksiNama || '-'
      indikatorName.value = data.indikatorNama || '-'
      targetValue.value = Number(data.targetValue || 0)
    }
  } catch (error) {
    console.error('Error fetching pemantauan rencana aksi:', error)
  } finally {
    loadingRecord.value = false
  }
})

const isFormValid = computed(() => {
  const val = String(form.value.keterangan || '').trim()
  return val.length >= 100 && val.length <= 800
})

const handleSubmit = async () => {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  try {
    await $fetch(`/api/pemantauan-rencana-aksi`, { 
      method: 'PUT', 
      body: {
        id: Number(id),
        realisasi: 100,
        analisaPencapaian: 'Laporan Progres Rencana Aksi',
        analisaPermasalahan: '-',
        keterangan: form.value.keterangan
      } 
    })
    router.push(`/${route.params.slug}/pemantauan-kinerja/rencana-aksi`)
  } catch (error) {
    console.error('Error updating pemantauan:', error)
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
