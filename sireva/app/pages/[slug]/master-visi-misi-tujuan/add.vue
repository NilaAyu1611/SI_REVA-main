<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconDatabase :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Tambah Visi/Misi/Tujuan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Formulir kustomisasi master data Visi, Misi, dan Tujuan organisasi.
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
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Data Master</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Tipe -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Tipe Data <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="flex gap-4">
                  <label v-for="t in ['VISI', 'MISI', 'TUJUAN']" :key="t" class="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" v-model="form.tipe" :value="t" class="w-4 h-4 text-[#2663A3] focus:ring-[#2663A3]" />
                    <span class="font-bold text-slate-600 group-hover:text-[#2663A3] transition-colors">{{ t }}</span>
                  </label>
                </div>
              </td>
            </tr>

            <!-- 2. Kode -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Kode <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  placeholder="Contoh: V-1"
                />
              </td>
            </tr>

            <!-- 3. Relasi Induk (Conditional) -->
            <tr v-if="form.tipe !== 'VISI'" class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">
                3. {{ form.tipe === 'MISI' ? 'Visi Induk' : 'Misi Induk' }} <span class="text-red-500">*</span>
              </td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.parentId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih {{ form.tipe === 'MISI' ? 'Visi' : 'Misi' }} --</option>
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
                {{ form.tipe !== 'VISI' ? '4' : '3' }}. Pernyataan <span class="text-red-500">*</span>
              </td>
              <td class="px-8 py-5">
                <input
                  v-model="form.text"
                  type="text"
                  required
                  maxlength="100"
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  :placeholder="`Isi pernyataan ${form.tipe.toLowerCase()}...`"
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
          Simpan Data Master
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
  IconDatabase, IconFileText, IconChevronDown, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)

const form = ref({
  tipe: 'VISI',
  kode: '',
  parentId: null as number | null,
  text: ''
})

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: visiData } = useSWRV('/api/visi', fetcher)
const { data: misiData } = useSWRV('/api/misi', fetcher)

const parentList = computed(() => {
  if (form.value.tipe === 'MISI') {
    const list = Array.isArray(visiData.value) ? visiData.value : (visiData.value?.data || [])
    return list.map((v: any) => ({ id: v.id, text: v.visiText }))
  }
  if (form.value.tipe === 'TUJUAN') {
    const list = Array.isArray(misiData.value) ? misiData.value : (misiData.value?.data || [])
    return list.map((m: any) => ({ id: m.id, text: m.misiText }))
  }
  return []
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const endpoint = `/api/${form.value.tipe.toLowerCase()}`
    const body: any = { kode: form.value.kode }
    
    if (form.value.tipe === 'VISI') body.visiText = form.value.text
    if (form.value.tipe === 'MISI') {
      body.misiText = form.value.text
      body.visiId = form.value.parentId
    }
    if (form.value.tipe === 'TUJUAN') {
      body.tujuanText = form.value.text
      body.misiId = form.value.parentId
    }

    await $fetch(endpoint, { method: 'POST', body })
    router.push(`/${route.params.slug}/master-visi-misi-tujuan`)
  } catch (error) {
    console.error('Error saving:', error)
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
