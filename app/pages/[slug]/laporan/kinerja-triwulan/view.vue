<template>
  <div class="max-w-6xl mx-auto pb-20 space-y-8 print:max-w-full print:pb-0 print:space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 print:hidden">
      <div class="flex items-start gap-4">
        <NuxtLink :to="`/${route.params.slug}/laporan/kinerja-triwulan`" class="mt-1 p-2 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all">
          <IconArrowLeft :size="24" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Detail Laporan Kinerja</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Melihat detail laporan yang telah diajukan.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="printReport"
          class="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
        >
          <IconPrinter :size="16" /> Cetak / PDF
        </button>
      </div>
    </div>

    <!-- Print Only Document Title Header -->
    <div class="hidden print:block text-center border-b-2 border-slate-950 pb-4 mb-8">
      <h1 class="text-2xl font-black uppercase tracking-wide text-slate-900">Laporan Kinerja Triwulanan</h1>
      <p class="text-sm font-bold text-slate-600 mt-1">Tahun Anggaran {{ reportData?.tahun || 2026 }} — {{ reportData?.triwulan || '-' }}</p>
      <p class="text-xs font-semibold text-slate-500">Unit Kerja: {{ reportData?.unitKerja || '-' }}</p>
    </div>

    <div v-if="loading" class="py-20 text-center flex flex-col items-center gap-3 print:hidden">
      <div class="w-10 h-10 border-4 border-slate-200 border-t-[#2663A3] rounded-full animate-spin"></div>
      <span class="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat data laporan...</span>
    </div>

    <div v-else-if="!reportData" class="py-20 text-center text-slate-500 font-medium print:hidden">
      Data laporan tidak ditemukan.
    </div>

    <div v-else class="space-y-8">
      <!-- Section 1: Setup Laporan -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none print:mb-8">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 print:bg-white print:px-0">
          <IconSettings class="text-slate-500 print:text-[#2663A3]" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">INFORMASI UMUM</h2>
        </div>
        <div class="p-6 md:p-8 print:p-0">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Periode Triwulan</p>
              <p class="text-base font-bold text-slate-800">{{ reportData.triwulan }}</p>
            </div>
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tahun</p>
              <p class="text-base font-bold text-slate-800">{{ reportData.tahun }}</p>
            </div>
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status Laporan</p>
              <p class="text-base font-bold text-emerald-600">{{ reportData.status }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Bagian Awal Dokumen -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none print:mb-8">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 print:bg-white print:px-0">
          <IconClipboardList class="text-slate-500 print:text-[#2663A3]" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">BAGIAN AWAL DOKUMEN</h2>
        </div>
        <div class="p-6 md:p-8 space-y-6 print:p-0">
          <div class="space-y-2">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Ringkasan Eksekutif</p>
            <div class="p-4 bg-slate-50 rounded-2xl text-sm font-medium text-slate-700 whitespace-pre-wrap print:bg-white print:p-0 print:text-justify">{{ reportData.ringkasanEksekutif }}</div>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Kata Pengantar</p>
            <div class="p-4 bg-slate-50 rounded-2xl text-sm font-medium text-slate-700 whitespace-pre-wrap print:bg-white print:p-0 print:text-justify">{{ reportData.kataPengantar }}</div>
          </div>
        </div>
      </div>

      <!-- Section 3: BAB 1 -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none print:mb-8">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 print:bg-white print:px-0">
          <IconFileText class="text-slate-500 print:text-[#2663A3]" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">PERENCANAAN KINERJA TAHUN BERJALAN</h2>
        </div>
        <div class="p-6 md:p-8 print:p-0">
          <div class="overflow-x-auto border border-slate-200 rounded-2xl print:border-slate-800">
            <table class="w-full text-xs text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider print:bg-slate-100">
                  <th class="px-6 py-4 text-center w-12 border-r border-slate-200">No</th>
                  <th class="px-6 py-4 w-1/2 border-r border-slate-200">Sasaran Kinerja</th>
                  <th class="px-6 py-4 w-1/3 border-r border-slate-200">Indikator Kinerja</th>
                  <th class="px-6 py-4 text-center">Target PK</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in targetPkList" :key="index" class="border-b border-slate-100">
                  <td class="px-6 py-4 text-center font-bold text-slate-400 border-r border-slate-100">{{ index + 1 }}</td>
                  <td class="px-6 py-4 font-semibold text-slate-800 border-r border-slate-100 leading-relaxed">{{ item.sasaranText || item.sasaranKinerja || '-' }}</td>
                  <td class="px-6 py-4 text-slate-600 border-r border-slate-100 leading-relaxed">{{ item.indikatorName || item.indikatorKinerja || '-' }}</td>
                  <td class="px-6 py-4 text-center font-black text-[#2663A3]">{{ item.target || '-' }}</td>
                </tr>
                <tr v-if="targetPkList.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-slate-400 italic font-medium">Tidak ada data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 4: BAB 2 -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none print:mb-8">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 print:bg-white print:px-0">
          <IconFileText class="text-slate-500 print:text-[#2663A3]" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">CAPAIAN KINERJA DAN TINDAK LANJUT</h2>
        </div>
        <div class="p-6 md:p-8 space-y-6 print:p-0">
          <div v-for="(item, index) in capaianKinerjaList" :key="index" class="border border-slate-200 rounded-2xl p-6 space-y-4 print:border-b print:rounded-none print:px-0 print:py-4 print:border-t-0 print:border-l-0 print:border-r-0">
            <div>
              <h4 class="font-bold text-slate-800">{{ item.indikatorName || item.indikatorNama || '-' }}</h4>
              <p class="text-sm font-medium text-slate-500 mt-1">Target: <span class="text-slate-800">{{ item.target || '-' }}</span> | Capaian: <span class="text-[#2663A3]">{{ item.capaian || '-' }}</span></p>
            </div>
            <!-- Display under indicator only if it is legacy JSON -->
            <div v-if="isLegacyJson" class="space-y-2 mt-4 pt-4 border-t border-slate-100">
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Rencana Tindak Lanjut (Legacy)</p>
              <div class="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 whitespace-pre-wrap print:bg-white print:p-0 print:text-justify">{{ tindakLanjutIndikator[item.id || item.indikatorName || item.indikatorNama] || '-' }}</div>
            </div>
          </div>
          
          <!-- Single block for Kesimpulan / Rencana Kedepannya -->
          <div v-if="!isLegacyJson" class="border border-slate-200 rounded-2xl p-6 space-y-3 mt-6 print:border-none print:px-0 print:py-4">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Kesimpulan / Rencana Kedepannya</p>
            <div class="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 whitespace-pre-wrap print:bg-white print:p-0 print:text-justify">{{ rawRencanaText || '-' }}</div>
          </div>
          <div v-if="capaianKinerjaList.length === 0" class="py-8 text-center text-slate-400 italic font-medium">
            Tidak ada data capaian kinerja.
          </div>
        </div>
      </div>

      <!-- Section 5: Lampiran -->
      <div v-if="lampiranFiles.length > 0" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none print:mb-8">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 print:bg-white print:px-0">
          <IconPaperclip class="text-slate-500 print:text-[#2663A3]" :size="20" stroke-width="2.5" />
          <h2 class="text-slate-800 font-extrabold text-sm uppercase tracking-wider">LAMPIRAN</h2>
        </div>
        <div class="p-6 md:p-8 print:p-0">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1">
            <div v-for="(file, idx) in lampiranFiles" :key="idx" class="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-2xl print:bg-white print:border-none print:p-0 print:mb-6">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-3 overflow-hidden">
                  <IconFileText class="text-[#2663A3] flex-shrink-0" :size="20" />
                  <span class="text-sm font-bold text-slate-700 truncate print:text-xs">{{ file.name }}</span>
                </div>
                <a :href="file.url" download class="text-blue-500 hover:text-blue-700 transition-colors p-1 font-bold text-xs print:hidden">
                  Download
                </a>
              </div>
              <div v-if="isImage(file)" class="mt-3 overflow-hidden rounded-xl border border-slate-200 max-w-full print:max-w-2xl print:border-slate-300">
                <img :src="file.url" :alt="file.name" class="w-full h-auto object-cover max-h-[350px] print:max-h-none" />
              </div>
              <div v-else-if="isPdf(file)" class="mt-3 overflow-hidden rounded-xl border border-slate-200 w-full h-[450px] print:hidden">
                <iframe :src="file.url" class="w-full h-full" frameborder="0"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconArrowLeft, IconFileText, IconClipboardList, IconPrinter, IconPaperclip, IconSettings } from '@tabler/icons-vue'

const route = useRoute()
const laporanId = route.query.id as string

function isImage(file: any) {
  if (!file || !file.url) return false
  if (file.url.startsWith('data:image/')) return true
  const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg)$/i
  return imageExtensions.test(file.name)
}

function isPdf(file: any) {
  if (!file || !file.url) return false
  if (file.url.startsWith('data:application/pdf') || file.url.startsWith('data:application/octet-stream;base64,JVBERi')) return true
  return /\.pdf$/i.test(file.name)
}

const loading = ref(true)
const reportData = ref<any>(null)
const tindakLanjutIndikator = ref<Record<string, string>>({})
const isLegacyJson = ref(false)
const rawRencanaText = ref('')
const lampiranFiles = ref<any[]>([])

const targetPkList = ref<any[]>([])
const capaianKinerjaList = ref<any[]>([])

async function fetchReport() {
  if (!laporanId) return
  loading.value = true
  try {
    const data = await $fetch<any>(`/api/laporan-kinerja-triwulan?id=${laporanId}`)
    reportData.value = data?.data || data
    
    if (reportData.value) {
      if (reportData.value.rencanaTindakLanjut) {
        try { 
          tindakLanjutIndikator.value = JSON.parse(reportData.value.rencanaTindakLanjut)
          isLegacyJson.value = typeof tindakLanjutIndikator.value === 'object' && tindakLanjutIndikator.value !== null && !Array.isArray(tindakLanjutIndikator.value)
        } catch(e) {
          isLegacyJson.value = false
        }
        if (!isLegacyJson.value) {
          rawRencanaText.value = reportData.value.rencanaTindakLanjut
        }
      }
      if (reportData.value.lampiranUrl) {
        try { lampiranFiles.value = JSON.parse(reportData.value.lampiranUrl) } catch(e){}
      }
      await fetchTargetAndCapaian(reportData.value.unitKerja, reportData.value.triwulan)
    }
  } catch (e) {
    console.error('Failed to fetch report', e)
  } finally {
    loading.value = false
  }
}

async function fetchTargetAndCapaian(unitKerja: string, triwulan: string) {
  if (!unitKerja) return
  try {
    const year = reportData.value?.tahun || new Date().getFullYear()
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
    console.error('Failed fetching PK and Capaian', e)
  }
}

function printReport() {
  window.print()
}

onMounted(fetchReport)
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .print\:max-w-full {
    visibility: visible;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .print\:max-w-full * {
    visibility: visible;
  }
}
</style>
