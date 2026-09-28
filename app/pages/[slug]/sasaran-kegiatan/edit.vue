<template>
  <div class="max-w-4xl mx-auto pb-10 space-y-6 mt-4">
    <div class="flex items-center gap-3 mb-2">
      <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
        <IconPencil :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Edit Perencanaan Kinerja</h1>
        <p class="text-sm text-slate-500 mt-1">Ubah target capaian untuk sasaran kegiatan dan indikator terpilih.</p>
      </div>
    </div>

    <div v-if="fetching" class="py-8 text-center text-slate-500">Memuat data...</div>

    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
        <IconTarget :size="20" class="text-blue-600" />
        <h2 class="text-sm font-bold text-blue-700">Perencanaan - Sasaran Kegiatan</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Sasaran Kegiatan -->
        <div class="space-y-2">
          <label for="sasaranId" class="block text-sm font-semibold text-slate-700">Sasaran Kegiatan <span class="text-red-500">*</span></label>
          <select id="sasaranId" v-model="form.sasaranId" required class="field-input" disabled>
            <option :value="null" disabled>-- Pilih Sasaran Kegiatan --</option>
            <option v-for="s in sasaranOptions" :key="s.id" :value="s.id">
              {{ s.kode ? `${s.kode} - ${s.sasaranText}` : s.sasaranText }}
            </option>
          </select>
          <p class="text-[10px] text-slate-400 mt-1">*Teks sasaran kegiatan hanya dapat diubah melalui menu Master Data.</p>
        </div>

        <!-- Indikator Kinerja -->
        <div class="space-y-2">
          <label for="indikatorId" class="block text-sm font-semibold text-slate-700">Indikator Kinerja <span class="text-red-500">*</span></label>
          <select id="indikatorId" v-model="form.indikatorId" required class="field-input" :disabled="!form.sasaranId">
            <option :value="null" disabled>-- Pilih Indikator Kinerja --</option>
            <option v-for="i in indikatorOptions" :key="i.id" :value="i.id">
              {{ i.nama }}
            </option>
          </select>
        </div>

        <!-- Target Capaian -->
        <div class="space-y-2">
          <label for="target" class="block text-sm font-semibold text-slate-700">Target Capaian <span class="text-red-500">*</span></label>
          <div class="flex items-center gap-3">
            <input
              id="target"
              v-model="form.target"
              type="text"
              required
              class="field-input flex-1"
              placeholder="Masukkan nilai target (contoh: 100, Baik, dsb.)"
            />
            <div class="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
              <IconCalendar :size="18" />
              Tahun {{ currentYear }}
            </div>
          </div>
          <p class="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <IconInfoCircle :size="14" />
            Nilai di atas akan memperbarui target untuk tahun berjalan.
          </p>
        </div>

        <div class="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            @click="handleDelete"
            class="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Hapus Kaitan Target
          </button>
          
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
              class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting || !isValid"
              class="px-5 py-2.5 rounded-xl bg-[#2663A3] text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconPencil, IconTarget, IconCalendar, IconInfoCircle } from '@tabler/icons-vue'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const sasaranId = Number(route.query.id)
const fetching = ref(true)
const submitting = ref(false)
const currentYear = new Date().getFullYear()


const targetRecord = ref<any>(null)

const sasaranOptions = computed(() => {
  const raw = sasaranRaw.value?.data || sasaranRaw.value || []
  return raw.map((s: any) => ({
    ...s,
    sasaranText: s.sasaran_kegiatan_text || s.sasaranText || '-'
  }))
})

const form = ref({
  sasaranId: null as number | null,
  indikatorId: null as number | null,
  target: '',
})

const indikatorOptions = computed(() => {
  if (!form.value.sasaranId) return []
  const sasaran = sasaranOptions.value.find((s: any) => s.id === form.value.sasaranId)
  if (!sasaran) return []
  return [{
    id: sasaran.id,
    nama: sasaran.indikator_kinerja || sasaran.indikatorNama || '-'
  }]
})

watch(() => form.value.indikatorId, (newIndId) => {
  if (newIndId && targetRecord.value) {
    const yearIdx = ['2025', '2026', '2027', '2028', '2029'].indexOf(currentYear.toString())
    if (yearIdx !== -1) {
      form.value.target = targetRecord.value[`target_${yearIdx + 1}`]?.toString() || ''
    }
  }
})

onMounted(async () => {
  if (!sasaranId) {
    toast.error('ID Sasaran Kegiatan tidak valid.')
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
    return
  }

  try {
    fetching.value = true
    
    const detail = await $fetch<any>(`/api/sasaran-kegiatan?id=${sasaranId}`)
    if (!detail) throw new Error('Data tidak ditemukan')
    
    targetRecord.value = detail
    form.value.sasaranId = sasaranId
    form.value.indikatorId = sasaranId
    
    const yearIdx = ['2025', '2026', '2027', '2028', '2029'].indexOf(currentYear.toString())
    if (yearIdx !== -1) {
      form.value.target = detail[`target_${yearIdx + 1}`]?.toString() || ''
    }
  } catch (err: any) {
    console.error('Error fetching details:', err)
    toast.error(err.message || 'Gagal memuat detail sasaran')
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
  } finally {
    fetching.value = false
  }
})

const isValid = computed(() => !!form.value.sasaranId && !!form.value.indikatorId && form.value.target !== '')

const handleSubmit = async () => {
  if (!isValid.value || !targetRecord.value) return

  submitting.value = true
  try {
    const yearIdx = ['2025', '2026', '2027', '2028', '2029'].indexOf(currentYear.toString())
    const updateBody = {
      ...targetRecord.value,
    }
    if (yearIdx !== -1) {
      updateBody[`target_${yearIdx + 1}`] = form.value.target
    }

    await $fetch('/api/sasaran-kegiatan', {
      method: 'PUT',
      body: updateBody
    })
    
    toast.success('Perubahan target capaian berhasil disimpan!')
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
  } catch (err: any) {
    console.error('Error updating target:', err)
    toast.error(err.data?.message || 'Gagal menyimpan target capaian')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus keterkaitan target ini? Data target capaian akan dihapus dari database.')) return

  if (!targetRecord.value) {
    toast.error('Data tidak valid.')
    return
  }

  const indikatorId = targetRecord.value.indikatorId
  if (!indikatorId) {
    toast.error('Indikator Kinerja tidak ditemukan.')
    return
  }

  try {
    // Hapus semua target tahun berjalan untuk IKU ini
    const deleted = await $fetch('/api/target-indikator', {
      method: 'DELETE',
      body: {
        id_iku: indikatorId,
        tahun: currentYear
      }
    })

    toast.success('Keterkaitan target berhasil dihapus dari database.')
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
  } catch (err: any) {
    console.error(err)
    toast.error(err?.data?.message || err?.message || 'Gagal menghapus keterkaitan target.')
  }
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input:focus {
  outline: none;
  border-color: #2663A3;
  box-shadow: 0 0 0 4px rgba(38, 99, 163, 0.1);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
  opacity: 0.8;
}

.field-input::placeholder {
  color: rgb(203 213 225);
}

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>
