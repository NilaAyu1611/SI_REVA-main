<template>
  <div class="max-w-6xl mx-auto pb-20 space-y-8 print:max-w-full print:pb-0 print:space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 print:hidden">
      <div class="flex items-start gap-4">
        <NuxtLink :to="`/${route.params.slug}/laporan/kinerja-triwulan`" class="mt-1 p-2 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all">
          <IconArrowLeft :size="24" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Tambah Laporan Kinerja</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Formulir pelaporan kinerja triwulanan unit kerja Anda.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">
            {{ roleTitle }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Alerts -->
    <div v-if="submittedStatusMessage" class="mx-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between print:hidden">
      <div class="flex items-center gap-3 text-emerald-800 font-semibold text-sm">
        <IconCheck :size="20" class="text-emerald-600" />
        <span>{{ submittedStatusMessage }}</span>
      </div>
      <button @click="submittedStatusMessage = ''" class="text-emerald-500 hover:text-emerald-700">
        <IconX :size="16" />
      </button>
    </div>

    <!-- Toolbar / Status Indicator -->
    <div class="mx-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-white text-slate-500 border border-slate-200">
          Status: {{ form.status }}
        </span>
        <span class="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-white text-slate-500 border border-slate-200">
          Draft Lokal: {{ isDraftExist ? 'Tersimpan' : 'Kosong' }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="saveDraft"
          class="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <IconDeviceFloppy :size="16" /> Simpan Draft
        </button>
      </div>
    </div>

    <form @submit.prevent="submitReport" class="space-y-8">
      <!-- Section 1: Setup Laporan -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconSettings class="text-slate-500" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">SECTION 1: SETUP LAPORAN</h2>
        </div>
        
        <div class="p-6 md:p-8 space-y-4">
          <div class="max-w-md space-y-2">
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
              Pilih Periode Triwulan <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.triwulan"
                @change="handlePeriodChange"
                class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all text-sm"
              >
                <option value="Triwulan I">Triwulan I</option>
                <option value="Triwulan II">Triwulan II</option>
                <option value="Triwulan III">Triwulan III</option>
                <option value="Triwulan IV">Triwulan IV</option>
              </select>
              <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Bagian Awal Dokumen -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconClipboardList class="text-slate-500" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">SECTION 2: BAGIAN AWAL DOKUMEN</h2>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
                Ringkasan Eksekutif <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.ringkasanEksekutif"
                rows="8"
                required
                maxlength="1500"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 text-sm focus:outline-none focus:border-[#2663A3] transition-all"
                placeholder="Tuliskan ringkasan eksekutif laporan..."
              ></textarea>
              <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Minimal 10 karakter</span>
                <span>{{ form.ringkasanEksekutif.length }} / 1500</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
                Kata Pengantar <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.kataPengantar"
                rows="8"
                required
                maxlength="1500"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 text-sm focus:outline-none focus:border-[#2663A3] transition-all"
                placeholder="Tuliskan kata pengantar laporan..."
              ></textarea>
              <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Minimal 10 karakter</span>
                <span>{{ form.kataPengantar.length }} / 1500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: BAB 1 - Perencanaan Kinerja -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText class="text-slate-500" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">
            SECTION 3: BAB 1 - PERENCANAAN KINERJA TAHUN BERJALAN
          </h2>
        </div>

        <div class="p-6 md:p-8 space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-slate-500">
              Berikut adalah Target Perjanjian Kinerja (PK) tahun berjalan milik Anda yang ditarik otomatis.
            </p>
            <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 text-slate-600 border border-slate-200">
              Sistem Auto-Pull
            </span>
          </div>

          <div v-if="loadingPk" class="py-12 text-center flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-2 border-slate-200 border-t-[#2663A3] rounded-full animate-spin"></div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Menarik Data PK...</span>
          </div>
          <div v-else class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-xs text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider">
                  <th class="px-6 py-4 text-center w-12 border-r border-slate-200">No</th>
                  <th class="px-6 py-4 w-1/2 border-r border-slate-200">Sasaran Kinerja</th>
                  <th class="px-6 py-4 w-1/3 border-r border-slate-200">Indikator Kinerja</th>
                  <th class="px-6 py-4 text-center">Target PK</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in targetPkList" :key="item.id || index" class="border-b border-slate-100 hover:bg-slate-50/50">
                  <td class="px-6 py-4 text-center font-bold text-slate-400 border-r border-slate-100">{{ index + 1 }}</td>
                  <td class="px-6 py-4 font-semibold text-slate-800 border-r border-slate-100 leading-relaxed">{{ item.sasaranText || item.sasaranKinerja || '-' }}</td>
                  <td class="px-6 py-4 text-slate-600 border-r border-slate-100 leading-relaxed">{{ item.indikatorName || item.indikatorKinerja || '-' }}</td>
                  <td class="px-6 py-4 text-center font-black text-[#2663A3]">{{ item.target || '-' }}</td>
                </tr>
                <tr v-if="targetPkList.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic font-medium">
                    Tidak ada data Perjanjian Kinerja (PK) yang ditemukan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 4: BAB 2 - Capaian Kinerja -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText class="text-slate-500" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">
            SECTION 4: BAB 2 - CAPAIAN KINERJA S.D. TRIWULAN
          </h2>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 class="text-xs font-black text-[#2663A3] uppercase tracking-widest">
              Sub-section 2.1: Matriks Capaian dan Rencana Tindak Lanjut
            </h3>
            <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 text-slate-600 border border-slate-200">
              Sistem Auto-Pull
            </span>
          </div>

          <div v-if="loadingCapaian" class="py-12 text-center flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-2 border-slate-200 border-t-[#2663A3] rounded-full animate-spin"></div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Menarik Data Capaian...</span>
          </div>
          <div v-else class="space-y-6">
            <div v-for="(item, index) in capaianKinerjaList" :key="item.id || index" class="border border-slate-200 rounded-2xl p-6 space-y-4">
              <div>
                <h4 class="font-bold text-slate-800">{{ item.indikatorName || item.indikatorNama || '-' }}</h4>
                <p class="text-sm font-medium text-slate-500 mt-1">Target: <span class="text-slate-800">{{ item.target || '-' }}</span> | Capaian: <span class="text-[#2663A3]">{{ item.capaian || '-' }}</span></p>
              </div>
            </div>
            
            <div v-if="capaianKinerjaList.length === 0" class="py-12 text-center text-slate-400 italic font-medium border border-slate-200 rounded-2xl">
              Tidak ada data capaian kinerja yang ditemukan untuk triwulan ini.
            </div>

            <!-- Single text area for kesimpulan / rencana kedepannya -->
            <div v-if="capaianKinerjaList.length > 0" class="space-y-2 border-t border-slate-100 pt-6 mt-6">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
                Kesimpulan / Rencana Kedepannya <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.rencanaTindakLanjut"
                rows="6"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 text-sm focus:outline-none focus:border-[#2663A3] transition-all"
                placeholder="Tuliskan kesimpulan atau rencana kedepannya apa yang akan dilakukan oleh instansi terkait kegiatan tersebut..."
              ></textarea>
              <div class="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Minimal 10 karakter</span>
                <span>{{ (form.rencanaTindakLanjut || '').length }} Karakter</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Lampiran -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconPaperclip class="text-slate-500" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">
            SECTION 5: LAMPIRAN (OPSIONAL)
          </h2>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <div
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all',
              dragOver ? 'border-[#2663A3] bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
            ]"
          >
            <div class="p-4 bg-white rounded-full shadow-sm text-slate-400">
              <IconUpload :size="32" />
            </div>
            <div class="text-center space-y-1">
              <p class="font-bold text-slate-700">Drag & drop file di sini</p>
              <p class="text-xs font-medium text-slate-500">atau klik untuk memilih (Max 5MB)</p>
            </div>
            <input
              type="file"
              multiple
              class="hidden"
              ref="fileInput"
              @change="handleFileSelected"
            />
            <button
              type="button"
              @click="triggerFileInput"
              class="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-600 text-sm hover:border-[#2663A3] hover:text-[#2663A3] transition-all"
            >
              Browse Files
            </button>
          </div>

          <div v-if="form.lampiranFiles.length > 0" class="space-y-3">
            <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Daftar Lampiran</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="(file, idx) in form.lampiranFiles" :key="idx" class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                <div class="flex items-center gap-3 overflow-hidden">
                  <IconFileText class="text-[#2663A3] flex-shrink-0" :size="20" />
                  <span class="text-sm font-medium text-slate-700 truncate">{{ file.name }}</span>
                </div>
                <button type="button" @click="removeAttachment(idx)" class="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <IconX :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 bg-[#2663A3] text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ submitting ? 'Menyimpan...' : 'Submit Laporan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthUser } from '~/composables/useAuthUser'
import { 
  IconFileText, IconSettings, IconChevronDown, IconClipboardList, 
  IconCheck, IconX, IconDeviceFloppy, IconUpload, IconPaperclip, IconArrowLeft 
} from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()
const { authUser } = useAuthUser()

const authUnitKerja = computed(() => (authUser.value?.unit_kerja || '').trim())
const roleTitle = computed(() => (authUser.value as any)?.role_name || 'Unit Kerja')

const form = ref({
  status: 'Draft',
  triwulan: 'Triwulan I',
  ringkasanEksekutif: '',
  kataPengantar: '',
  rencanaTindakLanjut: '',
  informasiTambahan: '',
  lampiranFiles: [] as {name: string, url: string}[]
})

const draftStorageKey = computed(() => `draft_laporan_${authUnitKerja.value}_${form.value.triwulan}`)
const isDraftExist = ref(false)
const submittedStatusMessage = ref('')

const loadingPk = ref(false)
const targetPkList = ref<any[]>([])

const loadingCapaian = ref(false)
const capaianKinerjaList = ref<any[]>([])

const dragOver = ref(false)
const submitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

async function checkSubmittedRecord() {
  try {
    const res = await $fetch<any[]>('/api/laporan-kinerja-triwulan', {
      query: { unitKerja: authUnitKerja.value, triwulan: form.value.triwulan }
    })
    
    const data = Array.isArray(res) ? res : ((res as any)?.data || [])
    if (data && data.length > 0) {
      submittedStatusMessage.value = `Laporan untuk ${form.value.triwulan} sudah diajukan.`
      form.value.status = data[0].status
    } else {
      submittedStatusMessage.value = ''
      loadDraft()
    }
  } catch (error) {
    console.error('Error checking submitted report:', error)
    loadDraft()
  }
}

function loadDraft() {
  const d = localStorage.getItem(draftStorageKey.value)
  if (d) {
    try {
      const data = JSON.parse(d)
      if (data.ringkasanEksekutif) form.value.ringkasanEksekutif = data.ringkasanEksekutif
      if (data.kataPengantar) form.value.kataPengantar = data.kataPengantar
      if (data.rencanaTindakLanjut) form.value.rencanaTindakLanjut = data.rencanaTindakLanjut
      if (data.informasiTambahan) form.value.informasiTambahan = data.informasiTambahan
      if (data.lampiranFiles) form.value.lampiranFiles = data.lampiranFiles
      isDraftExist.value = true
    } catch(e) {}
  } else {
    isDraftExist.value = false
    form.value.ringkasanEksekutif = ''
    form.value.kataPengantar = ''
    form.value.rencanaTindakLanjut = ''
    form.value.informasiTambahan = ''
    form.value.lampiranFiles = []
  }
}

async function fetchTargetAndCapaian() {
  loadingPk.value = true
  loadingCapaian.value = true
  try {
    const unitKerja = authUnitKerja.value
    const year = new Date().getFullYear()
    const triwulan = form.value.triwulan
    const yearIndex = ['2025','2026','2027','2028','2029'].indexOf(String(year)) + 1
    const targetKey = `target_${yearIndex}`
    
    const [ssRaw, spRaw, skRaw, capaianRaw] = await Promise.all([
      $fetch<any[]>('/api/sasaran-strategis').catch(() => []),
      $fetch<any[]>('/api/sasaran-program').catch(() => []),
      $fetch<any[]>('/api/sasaran-kegiatan').catch(() => []),
      $fetch<any[]>('/api/capaian-kinerja', { query: { unitKerja, triwulan } }).catch(() => [])
    ])
    
    const cleanUnitKerja = unitKerja.trim().toLowerCase()
    const combined: any[] = []
    
    const ssList = Array.isArray(ssRaw) ? ssRaw : ((ssRaw as any)?.data || [])
    ssList.forEach((ss: any) => {
      const ssPengampu = (ss.pengampu || ss.unit_kerja || '').trim().toLowerCase()
      if (ssPengampu === cleanUnitKerja) {
        let targetVal = 0
        if (ss.targets && Array.isArray(ss.targets)) {
           const t = ss.targets.find((x: any) => String(x.tahun) === String(year))
           if (t) targetVal = t.target
        }
        combined.push({
          id: `ss-${ss.id}`,
          sasaranKinerja: `[SS] ${ss.sasaranText || ss.namaSs || '-'}`,
          indikatorName: ss.indikatorNama || '-',
          target: targetVal || '-'
        })
      }
    })

    const spList = Array.isArray(spRaw) ? spRaw : ((spRaw as any)?.data || [])
    spList.forEach((sp: any) => {
       const spUnit = (sp.unit_kerja || sp.unitKerjaNama || sp.pengampu || '').trim().toLowerCase()
       if (spUnit === cleanUnitKerja) {
         combined.push({
           id: `sp-${sp.id}`,
           sasaranKinerja: `[SP] ${sp.sasaran_program_text || sp.namaSp || '-'}`,
           indikatorName: sp.indikator_kinerja || sp.indikatorNama || '-',
           target: sp[targetKey] || '-'
         })
       }
    })

    const skList = Array.isArray(skRaw) ? skRaw : ((skRaw as any)?.data || [])
    skList.forEach((sk: any) => {
       const skUnit = (sk.unit_kerja || sk.unitKerjaNama || sk.pengampu || '').trim().toLowerCase()
       if (skUnit === cleanUnitKerja) {
         combined.push({
           id: `sk-${sk.id}`,
           sasaranKinerja: `[SK] ${sk.sasaran_kegiatan_text || sk.namaSk || '-'}`,
           indikatorName: sk.indikator_kinerja || sk.indikatorNama || '-',
           target: sk[targetKey] || '-'
         })
       }
    })

    targetPkList.value = combined

    const capaianData = Array.isArray(capaianRaw) ? capaianRaw : ((capaianRaw as any)?.data || [])
    capaianKinerjaList.value = combined.map(pk => {
      const found = capaianData.find((c: any) => 
        (c.indikatorName && c.indikatorName === pk.indikatorName) || 
        (c.indikatorNama && c.indikatorNama === pk.indikatorName)
      )
      return {
        ...pk,
        capaian: found ? found.capaian : '-'
      }
    })
  } catch(e) {
    console.error('Gagal memuat target PK dan capaian', e)
  } finally {
    loadingPk.value = false
    loadingCapaian.value = false
  }
}

function handlePeriodChange() {
  checkSubmittedRecord()
  fetchTargetAndCapaian()
}

function saveDraft() {
  const payload = {
    ringkasanEksekutif:    form.value.ringkasanEksekutif,
    kataPengantar:         form.value.kataPengantar,
    rencanaTindakLanjut:   form.value.rencanaTindakLanjut,
    informasiTambahan:     form.value.informasiTambahan,
    lampiranFiles:         form.value.lampiranFiles,
    status:                'Draft'
  }
  localStorage.setItem(draftStorageKey.value, JSON.stringify(payload))
  isDraftExist.value = true
  alert(`Draft ${form.value.triwulan} berhasil disimpan secara lokal!`)
}

function handleDrop(e: DragEvent) {
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (f) processFile(f as File)
    }
  }
}

function handleFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (f) processFile(f as File)
    }
  }
  // Reset input so the same file can be selected again
  target.value = ''
}

function processFile(file: File) {
  if (file.size > 5 * 1024 * 1024) { alert(`File "${file.name}" melebihi 5MB!`); return }
  const reader = new FileReader()
  reader.onload = (e) => form.value.lampiranFiles.push({ name: file.name, url: e.target?.result as string })
  reader.readAsDataURL(file)
}

function removeAttachment(idx: number) {
  form.value.lampiranFiles.splice(idx, 1)
}

async function submitReport() {
  if (form.value.ringkasanEksekutif.trim().length < 10 || form.value.kataPengantar.trim().length < 10) {
    alert('Validasi Gagal: Ringkasan Eksekutif dan Kata Pengantar wajib diisi minimal 10 karakter.')
    return
  }
  
  if (form.value.rencanaTindakLanjut.trim().length < 10) {
    alert('Validasi Gagal: Kesimpulan / Rencana Kedepannya wajib diisi minimal 10 karakter.')
    return
  }
  
  submitting.value = true
  try {
    await $fetch<any>('/api/laporan-kinerja-triwulan', {
      method: 'POST',
      body: {
        tahun:                new Date().getFullYear(),
        triwulan:             form.value.triwulan,
        unitKerja:            authUnitKerja.value,
        ringkasanEksekutif:   form.value.ringkasanEksekutif,
        kataPengantar:        form.value.kataPengantar,
        rencanaTindakLanjut:  form.value.rencanaTindakLanjut,
        informasiTambahan:    form.value.informasiTambahan,
        lampiranUrl:          JSON.stringify(form.value.lampiranFiles),
        status:               'Submitted'
      }
    })
    
    form.value.status = 'Submitted'
    localStorage.removeItem(draftStorageKey.value)
    isDraftExist.value = false
    alert(`Laporan ${form.value.triwulan} berhasil disubmit!`)
    
    router.push(`/${route.params.slug}/laporan/kinerja-triwulan`) // back to list
  } catch (err: any) {
    console.error('Error submitting report:', err)
    alert('Gagal mengirimkan laporan. Silakan periksa jaringan Anda.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (authUnitKerja.value) {
    checkSubmittedRecord()
    fetchTargetAndCapaian()
  } else {
    const unwatch = watch(authUnitKerja, (val) => {
      if (val) {
        checkSubmittedRecord()
        fetchTargetAndCapaian()
        unwatch()
      }
    }, { immediate: false })
  }
})
</script>
