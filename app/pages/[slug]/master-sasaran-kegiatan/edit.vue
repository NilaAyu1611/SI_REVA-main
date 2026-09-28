<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Edit Sasaran Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data master sasaran kegiatan beserta hierarki cascading dan target periode Renstra.
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
      <!-- Section: Data Sasaran Kegiatan -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Edit Sasaran Kegiatan</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Kode -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Kode <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode"
                  type="text"
                  required
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- 2. Sasaran Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_sp"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Program --</option>
                    <option v-for="sp in filteredSasaranProgram" :key="sp.id" :value="sp.id">
                      [{{ sp.kode }}] {{ sp.text }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Indikator Program (read-only) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Program</td>
              <td class="px-8 py-5">
                <input
                  type="text"
                  disabled
                  :value="selectedProgramIndicatorName"
                  class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-500 cursor-not-allowed"
                  placeholder="Akan terisi otomatis setelah memilih Sasaran Program"
                />
              </td>
            </tr>

            <!-- 4. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unit_kerja"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option value="" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.nama">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 5. Sasaran Kegiatan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Sasaran Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <textarea
                  v-model="form.sasaran_kegiatan_text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] min-h-[100px] transition-all"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section: Dynamic Indikator Kinerja -->
      <div class="space-y-6 mt-6">
        <div
          v-for="(ind, index) in indikators"
          :key="ind._key"
          class="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-8 space-y-6 relative"
          :class="ind._markedDelete ? 'opacity-40 pointer-events-none' : ''"
        >
          <!-- Remove Button -->
          <button
            v-if="!ind._markedDelete"
            type="button"
            @click="markDelete(index)"
            class="absolute top-6 right-6 p-2 rounded-xl text-red-500 hover:bg-red-50 hover:scale-105 active:scale-95 transition-all"
            :title="ind.id ? 'Hapus Indikator' : 'Batal Tambah'"
          >
            <IconTrash :size="20" />
          </button>

          <!-- Undo delete -->
          <button
            v-if="ind._markedDelete"
            type="button"
            @click="ind._markedDelete = false"
            class="absolute top-6 right-6 px-3 py-1.5 rounded-xl text-emerald-600 bg-emerald-50 text-xs font-bold"
          >
            Batalkan Hapus
          </button>

          <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">INDIKATOR #{{ index + 1 }}</span>
            <span v-if="ind.kodeIku" class="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-md">{{ ind.kodeIku }}</span>
            <span v-if="ind._markedDelete" class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black rounded-md uppercase">Akan Dihapus</span>
            <span v-if="!ind.id" class="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black rounded-md uppercase">Baru</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kode Unik Indikator -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Kode Unik Indikator <span class="text-red-500">*</span></label>
              <input
                v-model="ind.kode_unik"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Contoh: IKU-1.1"
              />
            </div>

            <!-- Satuan -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Satuan <span class="text-red-500">*</span></label>
              <input
                v-model="ind.satuan"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Contoh: Persen, Dokumen, dll"
              />
            </div>

            <!-- Nama Indikator -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Nama Indikator <span class="text-red-500">*</span></label>
              <input
                v-model="ind.nama"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Nama Indikator Kinerja"
              />
            </div>
          </div>

          <!-- Target Capaian per Tahun -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Target Capaian Per Tahun <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-5 gap-4">
              <div v-for="n in 5" :key="n" class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">{{ [2025,2026,2027,2028,2029][n-1] }}</label>
                <input
                  v-model="ind[`target_${n}`]"
                  type="number"
                  step="any"
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center font-bold text-slate-700 focus:bg-white focus:border-[#2663A3] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Add Indicator Button -->
        <button
          type="button"
          @click="addIndikator"
          class="w-full py-4 rounded-3xl border-2 border-dashed border-slate-300 text-slate-500 font-bold hover:border-[#2663A3] hover:text-[#2663A3] transition-all flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/10 active:scale-[0.99]"
        >
          <IconPlus :size="18" /> Tambah Indikator Kinerja Lainnya
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-6">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan`)"
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
          Simpan Perubahan Master
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watchEffect, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconPencil, IconFileText, IconChevronDown, IconTrash, IconPlus, IconX, IconDeviceFloppy
} from '@tabler/icons-vue'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = route.query.id
const skId = Number(id)
const submitting = ref(false)

const { data: detail, pending: fetching } = useFetch(id ? `/api/sasaran-kegiatan?id=${id}${route.query.indId ? '&indId=' + route.query.indId : ''}` : null, { lazy: true, default: () => [] })
const { data: spData } = useFetch('/api/sasaran-program', { lazy: true, default: () => [] })
const { data: unitData } = useFetch('/api/unit-kerja', { lazy: true, default: () => [] })
const unitList = computed(() => Array.isArray(unitData.value) ? unitData.value : (unitData.value?.data || []))

// ─── Form State ─────────────────────────────────
const form = ref<Record<string, any>>({
  id_sp: null as number | null,
  kode: '',
  unit_kerja: '',
  sasaran_kegiatan_text: '',
})

// ─── Dynamic Indikators ─────────────────────────
interface EditableIndikator {
  _key: number
  id: number | null       // null = new (to be POSTed)
  kodeIku: string
  kode_unik: string
  nama: string
  satuan: string
  target_1: string | number
  target_2: string | number
  target_3: string | number
  target_4: string | number
  target_5: string | number
  _markedDelete: boolean
  [key: string]: any
}

let _keyCounter = 0
const indikators = ref<EditableIndikator[]>([])

const addIndikator = () => {
  indikators.value.push({
    _key: ++_keyCounter,
    id: null,
    kodeIku: '',
    kode_unik: '',
    nama: '',
    satuan: '',
    target_1: 0, target_2: 0, target_3: 0, target_4: 0, target_5: 0,
    _markedDelete: false
  })
}

const markDelete = (index: number) => {
  const ind = indikators.value[index]
  if (!ind) return
  if (!ind.id) {
    // New (unsaved) → remove immediately
    indikators.value.splice(index, 1)
  } else {
    ind._markedDelete = true
  }
}

// ─── Load initial data ──────────────────────────
const initialized = ref(false)
watchEffect(async () => {
  if (detail.value && !initialized.value) {
    const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
    if (!item) return
    initialized.value = true

    form.value.id_sp   = item.spId   ? Number(item.spId)   : null
    form.value.kode    = item.kode   || item.kodeSk || ''
    form.value.unit_kerja = item.unit_kerja || item.unitKerjaNama || item.pengampu || ''
    form.value.sasaran_kegiatan_text = item.sasaran_kegiatan_text || item.sasaranText || item.namaSk || ''

    // Load all IKs for this SK
    try {
      const iks = await fetch(`/api/indikator-kinerja?sk_id=${skId}`).then(r => r.json())
      let list = Array.isArray(iks) ? iks : []
      const indIdQuery = route.query.indId ? Number(route.query.indId) : null
      if (indIdQuery) {
        list = list.filter((ik: any) => Number(ik.id) === indIdQuery)
      }
      indikators.value = list.map((ik: any) => ({
        _key: ++_keyCounter,
        id: ik.id,
        kodeIku: ik.kodeIku || '',
        kode_unik: ik.kodeIku || '',
        nama: ik.namaIku || '',
        satuan: ik.satuan || '',
        target_1: ik.target_1 ?? 0,
        target_2: ik.target_2 ?? 0,
        target_3: ik.target_3 ?? 0,
        target_4: ik.target_4 ?? 0,
        target_5: ik.target_5 ?? 0,
        _markedDelete: false
      }))
      // If no IKs loaded yet, add one empty
      if (indikators.value.length === 0) addIndikator()
    } catch (e) {
      console.error('Failed to load indikators:', e)
      addIndikator()
    }
  }
})

// ─── Sasaran Program Options ────────────────────
const filteredSasaranProgram = computed(() => {
  if (!spData.value) return []
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const seen = new Set()
  return source.filter((item: any) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  }).map((item: any) => ({
    id: item.id,
    kode: item.kode || '-',
    text: item.sasaran_program_text || item.namaSp || ''
  }))
})

const selectedProgramIndicatorName = computed(() => {
  if (!form.value.id_sp || !spData.value) return ''
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const sel = source.find((item: any) => Number(item.id) === Number(form.value.id_sp))
  return sel ? (sel.kode_iku || sel.indikatorNama || '-') : ''
})

// ─── Submit ─────────────────────────────────────
const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    // 1. Update Sasaran Kegiatan
    const skRes = await $fetch<any>(`/api/sasaran-kegiatan/${skId}`, {
      method: 'PUT',
      body: {
        nama_sk: form.value.sasaran_kegiatan_text,
        pengampu: form.value.unit_kerja || null,
      }
    })
    if (skRes?.success === false) {
      toast.error(skRes.message || 'Gagal memperbarui sasaran kegiatan.')
      return
    }

    // 2. Process each indikator
    for (const ind of indikators.value) {
      if (ind._markedDelete && ind.id) {
        // Soft-delete
        await $fetch(`/api/indikator-kinerja/${ind.id}`, { method: 'DELETE' })
        continue
      }
      if (ind._markedDelete) continue

      const targetPayload = {
        '2025': ind.target_1,
        '2026': ind.target_2,
        '2027': ind.target_3,
        '2028': ind.target_4,
        '2029': ind.target_5,
      }

      if (ind.id) {
        // Update existing
        await $fetch<any>(`/api/indikator-kinerja/${ind.id}`, {
          method: 'PUT',
          body: {
            nama_iku: ind.nama,
            satuan: ind.satuan,
            targets: targetPayload
          }
        })
      } else {
        // Insert new IK
        const newRes = await $fetch<any>('/api/indikator-kinerja', {
          method: 'POST',
          body: { sk_id: skId, nama_iku: ind.nama, satuan: ind.satuan }
        })
        const newId = newRes?.data?.id || newRes?.id
        if (newId) {
          for (const [year, val] of Object.entries(targetPayload)) {
            await $fetch('/api/target-indikator', {
              method: 'POST',
              body: { idIku: newId, tahun: Number(year), targetNilai: String(val || 0) }
            })
          }
        }
      }
    }

    toast.success('Data master sasaran kegiatan berhasil diperbarui.')
    router.push(`/${route.params.slug}/master-sasaran-kegiatan`)
  } catch (error: any) {
    console.error('Error:', error)
    toast.error(error?.data?.message || error?.message || 'Gagal memperbarui data master.')
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
