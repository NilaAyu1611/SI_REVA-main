<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-start justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Edit Sasaran Strategis</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui detail sasaran strategis, indikator, dan target capaian Anda.
          </p>
        </div>
      </div>
      
      <button 
        @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-[#2663A3] transition-colors bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200"
      >
        <IconArrowLeft :size="18" />
        Kembali
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Data...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 1: Pemetaan Sasaran Strategis -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-[#2663A3] flex items-center gap-3">
          <IconTarget :size="20" class="text-white" stroke-width="2.5" />
          <h2 class="text-white font-bold text-sm uppercase tracking-wider">Pemetaan Sasaran Strategis</h2>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Sasaran Strategis -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Sasaran Strategis <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.sasaranText"
                required
                rows="1"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Masukkan sasaran strategis..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Indikator Kinerja & Target -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconChartBar :size="20" class="text-[#2663A3]" stroke-width="2.5" />
            <h2 class="text-slate-800 font-black text-sm uppercase tracking-wider">Indikator Kinerja & Target</h2>
          </div>
          <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
            Total: {{ form.indikatorList.length }} Indikator
          </span>
        </div>

        <div class="p-8 space-y-6">
          <div
            v-for="(indikator, idx) in form.indikatorList"
            :key="idx"
            class="relative p-6 border-2 border-blue-100 rounded-3xl bg-blue-50/10 space-y-6"
          >
            <!-- Badge Number -->
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#2663A3] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-700/20">
              {{ idx + 1 }}
            </div>

            <!-- Remove Button (Only if new, or you can implement delete from DB too) -->
            <button
              v-if="form.indikatorList.length > 1"
              type="button"
              @click="removeIndikator(idx)"
              class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
            >
              <IconTrash :size="16" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Indikator Kinerja <span class="text-red-500">*</span></label>
                <input
                  v-model="indikator.nama"
                  required
                  class="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Nama indikator..."
                />
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Capaian <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-3">
                  <div class="relative flex-1">
                    <input
                      v-model="indikator.target"
                      type="text"
                      required
                      placeholder="Nilai target..."
                      class="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div class="px-4 py-3.5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-600">
                    <IconCalendar :size="18" stroke-width="2.5" />
                    <span class="text-sm font-black">{{ currentYear }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Indicator Button -->
          <button
            type="button"
            @click="addIndikator"
            class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#2663A3] hover:border-[#2663A3] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold text-sm group"
          >
            <IconPlus :size="20" class="group-hover:scale-110 transition-transform" />
            Tambah Indikator Kinerja (Opsional)
          </button>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          @click="handleDelete"
          class="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-red-50 text-red-500 font-black text-sm hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <IconTrash :size="18" stroke-width="3" />
          Hapus Data
        </button>

        <div class="flex items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
            class="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <IconX :size="18" stroke-width="3" />
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-black text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconDeviceFloppy v-if="!submitting" :size="18" stroke-width="3" />
            <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPencil, IconTarget, IconChartBar, 
  IconPlus, IconTrash, IconChevronDown, 
  IconCalendar, IconX, IconDeviceFloppy, IconArrowLeft 
} from '@tabler/icons-vue'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const route = useRoute()
const ssId = Number(route.query.id)
const fetching = ref(true)
const submitting = ref(false)
const currentYear = ref(2026)
const { data: unitList } = useFetch('/api/unit-kerja', { default: () => [] })

const { authUser, role } = useAuthUser()

// Role & Unit Logic
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

const userUnitKerjaId = computed(() => {
  if (!unitList.value) return null
  const found = unitList.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

const form = ref({
  sasaranText: '',
  kode: '',
  unitKerjaId: null as number | null,
  indikatorList: [] as any[]
})

// Initialize Unit for Non-SuperAdmin
watchEffect(() => {
  if (!isSuperAdmin.value && userUnitKerjaId.value && !form.value.unitKerjaId) {
    form.value.unitKerjaId = userUnitKerjaId.value
  }
})

onMounted(async () => {
  if (!ssId) {
    router.push(`/${route.params.slug}/sasaran-strategis`)
    return
  }

  try {
    fetching.value = true
    const detail = await $fetch<any>(`/api/sasaran-strategis/${ssId}`)
    
    form.value.sasaranText = detail.sasaranText
    form.value.kode = detail.kode
    form.value.unitKerjaId = detail.unitKerjaId
    
    // Map indikators and their target for currentYear
    const indIdQuery = route.query.indId ? Number(route.query.indId) : null
    let rawInds = detail.indikatorStrategis || []
    if (indIdQuery) {
      rawInds = rawInds.filter((ind: any) => Number(ind.id) === indIdQuery)
    }

    form.value.indikatorList = rawInds.map((ind: any) => ({
      id: ind.id,
      nama: ind.nama,
      target: ind.targets?.find((t: any) => Number(t.tahun) === currentYear.value)?.target || ''
    }))

    // If empty, add one
    if (form.value.indikatorList.length === 0) {
      addIndikator()
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data.')
  } finally {
    fetching.value = false
  }
})

function addIndikator() {
  form.value.indikatorList.push({ id: null, nama: '', target: '' })
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.sasaranText) return

  submitting.value = true

  try {
    // 1. Update sasaran strategis
    await $fetch(`/api/sasaran-strategis/${ssId}`, {
      method: 'PUT',
      body: {
        sasaranText: form.value.sasaranText,
        kode: form.value.kode,
        unitKerjaId: form.value.unitKerjaId,
      },
    })

    // 2. Handle indikators (Simplification: just create/update for simplicity in this demo)
    for (const indikator of form.value.indikatorList) {
      if (!indikator.nama) continue

      let indId = indikator.id
      if (!indId) {
        // Create new
        const newInd = await $fetch<{ id: number }[]>('/api/indikator-strategis', {
          method: 'POST',
          body: {
            sasaranStrategisId: ssId,
            nama: indikator.nama,
            satuan: 'Poin'
          },
        })
        indId = newInd[0]?.id
      } else {
        // Update existing
        await $fetch('/api/indikator-strategis', {
          method: 'PUT',
          body: {
            id: indId,
            nama: indikator.nama
          },
        })
      }

      if (indId) {
        // Update/Create target for currentYear
        // We'll use a specific endpoint or just assume it handles both
        await $fetch('/api/target-indikator-strategis', {
          method: 'POST', // Assuming POST handles upsert or we can use PUT if exists
          body: {
            indikatorId: indId,
            tahun: currentYear.value,
            target: indikator.target,
          },
        })
      }
    }

    router.push(`/${route.params.slug}/sasaran-strategis`)
  } catch (error) {
    console.error('Error updating data:', error)
    alert('Gagal menyimpan perubahan.')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Hapus data sasaran strategis ini?')) return
  try {
    await $fetch(`/api/sasaran-strategis/${ssId}`, { method: 'DELETE' })
    router.push(`/${route.params.slug}/sasaran-strategis`)
  } catch (error) {
    alert('Gagal menghapus data.')
  }
}
</script>

