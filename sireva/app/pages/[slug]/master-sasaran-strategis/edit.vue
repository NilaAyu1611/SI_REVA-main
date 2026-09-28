<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Edit Sasaran Strategis</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data master (kamus) sasaran strategis, hierarki cascading, dan target periode Renstra.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Data Master...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 1: Hierarki & Relasi Data (Cascading) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconSitemap :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Hierarki & Relasi Data (Cascading)</h2>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kode -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Kode <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.kode"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                placeholder="Contoh: SS-001"
              />
            </div>



          </div>
        </div>
      </div>

      <!-- Section 2: Rincian Sasaran Strategis Master -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Rincian Sasaran Strategis Master</h2>
        </div>
        <div class="p-8 space-y-6">
          <!-- Sasaran Strategis -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
              Sasaran Strategis <span class="text-red-500">*</span>
            </label>
            <div class="relative group">
              <textarea
                v-model="form.sasaranText"
                required
                rows="3"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none"
                placeholder="Deskripsikan sasaran strategis..."
              ></textarea>
              <div class="absolute bottom-4 right-4 text-slate-300 pointer-events-none">
                <IconPencil :size="20" />
              </div>
            </div>
          </div>

          <!-- Indikator Kinerja -->
          <div v-for="(ind, idx) in form.indikatorList" :key="idx" class="space-y-6 pt-8 border-t border-slate-100 first:pt-0 first:border-0">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Indikator Kinerja {{ idx + 1 }} <span class="text-red-500">*</span>
              </label>
              <button 
                v-if="idx > 0"
                type="button" 
                @click="removeIndikator(idx)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <IconTrash :size="18" />
              </button>
            </div>
            <div class="relative group">
              <textarea
                v-model="ind.nama"
                required
                rows="2"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none"
                placeholder="Deskripsikan indikator kinerja..."
              ></textarea>
              <div class="absolute bottom-4 right-4 text-slate-300 pointer-events-none">
                <IconPencil :size="20" />
              </div>
            </div>

            <!-- Targets for this indicator -->
            <div class="space-y-4 pt-4 border-t border-slate-50">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Target Capaian (5 Periode)</label>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div v-for="n in 5" :key="n" class="space-y-2 text-center">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun {{ n }}</span>
                  <input
                    v-model="ind.targets[n-1]"
                    type="text"
                    required
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-center text-sm font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] focus:bg-white transition-all shadow-inner"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="addIndikator"
            class="inline-flex items-center gap-2 text-sm font-bold text-[#2663A3] hover:underline bg-blue-50 px-4 py-2 rounded-xl"
          >
            <IconPlus :size="16" stroke-width="3" />
            Tambah Indikator Lainnya
          </button>
        </div>
      </div>

      <!-- Section 3: Pengukuran (Global for all indicators in this SS) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconTarget :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Pengukuran</h2>
        </div>
        <div class="p-8">
          <div class="max-w-md space-y-2">
            <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
              Satuan Pengukuran <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.satuan"
              type="text"
              required
              class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              placeholder="Contoh: Persen, Dokumen, Nilai..."
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-strategis`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" />
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Simpan Perubahan Master
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPencil, IconSitemap, IconFileText, IconTarget,
  IconPlus, IconTrash, IconChevronDown,
  IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const id = route.query.id
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching } = useSWRV(id ? `/api/sasaran-strategis/${id}` : null, fetcher)

const form = ref({
  kode: '',
  sasaranText: '',
  satuan: '',
  indikatorList: [] as any[]
})

watchEffect(() => {
  if (detail.value) {
    form.value.kode = detail.value.kode || ''
    form.value.sasaranText = detail.value.sasaranText || ''
    
    // Map indicators and targets
    const firstInd = detail.value.indikatorStrategis?.[0]
    form.value.satuan = firstInd?.satuan || ''
    
    form.value.indikatorList = (detail.value.indikatorStrategis || []).map((ind: any) => {
      const targetsArr = ['', '', '', '', '']
      const startYear = 2025
      const actualTargets = ind.targets || []
      for (let i = 0; i < 5; i++) {
        const found = actualTargets.find((t: any) => t.tahun === startYear + i)
        targetsArr[i] = found ? String(found.target) : '0'
      }
      return {
        id: ind.id,
        nama: ind.nama,
        targets: targetsArr
      }
    })

    if (form.value.indikatorList.length === 0) {
      form.value.indikatorList.push({ nama: '', targets: ['0', '0', '0', '0', '0'] })
    }
  }
})

function addIndikator() {
  form.value.indikatorList.push({ nama: '', targets: ['0', '0', '0', '0', '0'] })
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true

  try {
    // 1. Update sasaran strategis
    await $fetch(`/api/sasaran-strategis/${id}`, {
      method: 'PUT',
      body: {
        kode: form.value.kode,
        sasaranText: form.value.sasaranText,
      },
    })

    // 2. Update/Create indicators and targets
    // Note: Simple implementation, in real app might need more complex sync logic
    for (const [idx, ind] of form.value.indikatorList.entries()) {
      if (!ind.nama) continue

      let indId = ind.id
      if (indId) {
        await $fetch(`/api/indikator-strategis`, {
          method: 'PUT',
          body: { id: indId, nama: ind.nama, satuan: form.value.satuan }
        })
      } else {
        const newInd = await $fetch<any[]>('/api/indikator-strategis', {
          method: 'POST',
          body: { sasaranStrategisId: id, nama: ind.nama, satuan: form.value.satuan }
        })
        indId = newInd[0]?.id
      }

      if (indId) {
        // Update targets (Delete first then re-insert for simplicity in master data)
        // Or update if exists. Here we assume we only manage targets for the primary/first ind in this view
        const startYear = 2025 // Adjusted to match DB constraint (2025-2029)
        for (let i = 0; i < 5; i++) {
          await $fetch('/api/target-indikator-strategis', {
            method: 'POST', // Assuming POST handles upsert
            body: {
              indikatorId: indId,
              tahun: startYear + i,
              target: ind.targets[i] || '0',
            },
          })
        }
      }
    }

    router.push(`/${route.params.slug}/master-sasaran-strategis`)
  } catch (error: any) {
    console.error('Error saving data:', error)
    const msg = error.data?.statusMessage || error.message || 'Terjadi kesalahan sistem'
    alert(`Gagal memperbarui data master: ${msg}`)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
.group:focus-within {
  transform: translateY(-2px);
}

textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;
}
textarea::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
textarea::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

select:focus + div {
  transform: rotate(180deg);
}
</style>
