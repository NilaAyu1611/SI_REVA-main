<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Edit Visi/Misi/Tujuan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data master Visi, Misi, atau Tujuan organisasi.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Data Master...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Edit Data Master</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Tipe (Disabled, because we can't change tipe of existing record) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Tipe Data</td>
              <td class="px-8 py-5 font-bold text-slate-600 uppercase">
                {{ tipe }}
              </td>
            </tr>

            <!-- 2. Kode (Only if not VISI) -->
            <tr v-if="tipe !== 'visi'" class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Kode <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Contoh: M-1"
                />
              </td>
            </tr>

            <!-- 3. Relasi Induk (Conditional) -->
            <tr v-if="tipe !== 'visi'" class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">
                3. {{ tipe === 'misi' ? 'Visi Induk' : 'Misi Induk' }} <span class="text-red-500">*</span>
              </td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.parentId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih {{ tipe === 'misi' ? 'Visi' : 'Misi' }} --</option>
                    <option v-for="item in parentList" :key="item.id" :value="item.id">
                      {{ item.text }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Pernyataan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">
                {{ tipe !== 'visi' ? '4' : '2' }}. Pernyataan <span class="text-red-500">*</span>
              </td>
              <td class="px-8 py-5">
                <input
                  v-model="form.text"
                  type="text"
                  required
                  maxlength="255"
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  :placeholder="`Isi pernyataan ${tipe.toLowerCase()}...`"
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
          @click="router.push(`/${route.params.slug}/master-visi-misi-tujuan`)"
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
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPencil, IconFileText, IconChevronDown, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)

const id = Number(route.query.id)
const tipe = String(route.query.tipe || '').toLowerCase()

const { data: visiData, pending: vPending } = useFetch('/api/visi', { default: () => ({ data: [] }) })
const { data: misiData, pending: mPending } = useFetch('/api/misi', { default: () => [] })
const { data: tujuanData, pending: tPending } = useFetch('/api/tujuan', { default: () => [] })

const loading = computed(() => vPending.value || mPending.value || tPending.value)

const form = ref({
  kode: '',
  parentId: null as number | null,
  text: ''
})

const detail = computed(() => {
  if (tipe === 'visi') {
    const list = Array.isArray(visiData.value) ? visiData.value : (visiData.value?.data || [])
    return list.find((v: any) => v.id === id)
  }
  if (tipe === 'misi') {
    const list = Array.isArray(misiData.value) ? misiData.value : (misiData.value?.data || [])
    return list.find((m: any) => m.id === id)
  }
  if (tipe === 'tujuan') {
    const list = Array.isArray(tujuanData.value) ? tujuanData.value : (tujuanData.value?.data || [])
    return list.find((t: any) => t.id === id)
  }
  return null
})

watchEffect(() => {
  if (detail.value) {
    form.value.kode = detail.value.kode || ''
    if (tipe === 'visi') {
      form.value.text = detail.value.visiText || ''
      form.value.parentId = null
    } else if (tipe === 'misi') {
      form.value.text = detail.value.misiText || ''
      form.value.parentId = detail.value.visiId || null
    } else if (tipe === 'tujuan') {
      form.value.text = detail.value.tujuanText || ''
      form.value.parentId = detail.value.misiId || null
    }
  }
})

const parentList = computed(() => {
  if (tipe === 'misi') {
    const list = Array.isArray(visiData.value) ? visiData.value : (visiData.value?.data || [])
    return list.map((v: any) => ({ id: v.id, text: v.visiText }))
  }
  if (tipe === 'tujuan') {
    const list = Array.isArray(misiData.value) ? misiData.value : (misiData.value?.data || [])
    return list.map((m: any) => ({ id: m.id, text: m.misiText }))
  }
  return []
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const endpoint = `/api/${tipe}`
    const body: any = { id }
    
    if (tipe === 'visi') {
      body.visiText = form.value.text
    } else if (tipe === 'misi') {
      body.kode = form.value.kode
      body.misiText = form.value.text
      body.visiId = form.value.parentId
    } else if (tipe === 'tujuan') {
      body.kode = form.value.kode
      body.tujuanText = form.value.text
      body.misiId = form.value.parentId
    }

    await $fetch(endpoint, { method: 'PUT', body })
    router.push(`/${route.params.slug}/master-visi-misi-tujuan`)
  } catch (error: any) {
    console.error('Error saving:', error)
    alert('Gagal memperbarui data master: ' + (error.data?.message || error.message || 'Terjadi kesalahan'))
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
