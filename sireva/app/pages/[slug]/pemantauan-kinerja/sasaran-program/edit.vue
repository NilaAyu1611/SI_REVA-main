<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-amber-100 rounded-2xl text-amber-700">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Edit Laporan: Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data realisasi dan analisa capaian kinerja program.
          </p>
        </div>
      </div>
      <NuxtLink
        :to="`/${route.params.slug}/pemantauan-kinerja/sasaran-program`"
        class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
      >
        <IconArrowLeft :size="18" /> Kembali
      </NuxtLink>
    </div>

    <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-slate-100 border-t-[#2663A3] rounded-full animate-spin"></div>
      <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Data Laporan...</p>
    </div>

    <form v-else @submit.prevent="handleUpdate" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Pembaruan Data</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- Static Info -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Unit Kerja</td>
              <td class="px-8 py-5 text-slate-500 font-medium">{{ form.unitKerjaNama }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Sasaran Program</td>
              <td class="px-8 py-5 text-slate-500 font-medium">{{ form.sasaranText }}</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Indikator Kinerja</td>
              <td class="px-8 py-5 text-slate-500 font-medium">{{ form.indikatorNama }}</td>
            </tr>

            <!-- Target (Locked) -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Target (Database)</td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div class="px-6 py-2.5 bg-slate-100 border-2 border-slate-200 rounded-xl font-black text-[#2663A3] text-lg">
                    {{ form.targetValue || 0 }}
                  </div>
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Satuan: {{ form.satuan || '-' }}</span>
                </div>
              </td>
            </tr>

            <!-- Realisasi -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">Realisasi <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasi"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-[#2663A3] focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- Realisasi KIK -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 italic">Realisasi KIK</td>
              <td class="px-8 py-5">
                <input
                  v-model="form.realisasiKik"
                  :disabled="!form.kikId"
                  type="text"
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all disabled:bg-slate-50"
                />
              </td>
            </tr>

            <!-- Analisa Pencapaian -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">Analisa Pencapaian <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPencapaian"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                ></textarea>
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {{ form.analisaPencapaian.length }} / 200 Karakter
                </span>
              </td>
            </tr>

            <!-- Analisa Permasalahan -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">Analisa Permasalahan <span class="text-red-500">*</span></td>
              <td class="px-8 py-8 space-y-3">
                <textarea
                  v-model="form.analisaPermasalahan"
                  required
                  maxlength="200"
                  rows="4"
                  class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                ></textarea>
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {{ form.analisaPermasalahan.length }} / 200 Karakter
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-end gap-4">
        <button
          type="submit"
          :disabled="submitting"
          class="px-10 py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
        >
          <IconDeviceFloppy :size="20" />
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconPencil, IconArrowLeft, IconFileText, IconDeviceFloppy } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const id = route.query.id
const loading = ref(true)
const submitting = ref(false)

const form = ref<any>({
  realisasi: '',
  realisasiKik: '',
  analisaPencapaian: '',
  analisaPermasalahan: ''
})

onMounted(async () => {
  if (!id) return
  try {
    const data = await $fetch<any>(`/api/pemantauan-program/${id}`)
    form.value = { ...data }
  } catch (error) {
    console.error('Error fetching:', error)
  } finally {
    loading.value = false
  }
})

const handleUpdate = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch(`/api/pemantauan-program/${id}`, {
      method: 'PUT',
      body: form.value
    })
    router.push(`/${route.params.slug}/pemantauan-kinerja/sasaran-program`)
  } catch (error) {
    console.error('Error updating:', error)
  } finally {
    submitting.value = false
  }
}
</script>
