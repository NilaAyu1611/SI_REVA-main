<template>
  <div class="space-y-0 pb-20">

    <!-- ===================== TOP BAR ===================== -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-1.5 flex-wrap min-w-0">
          <button
            @click="drillTo('ss', null)"
            class="flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors shrink-0"
          >
            <IconHierarchy2 :size="16" />
            <span>Cascading Kinerja</span>
          </button>

          <template v-if="selectedSS">
            <IconChevronRight :size="14" class="text-slate-300 shrink-0" />
            <button
              @click="drillTo('is', null)"
              :class="[
                'text-sm font-bold transition-colors truncate max-w-xs',
                selectedIS ? 'text-blue-700 hover:text-blue-900' : 'text-slate-700 cursor-default'
              ]"
            >
              {{ selectedSS.sasaranText }}
            </button>
          </template>

          <template v-if="selectedIS">
            <IconChevronRight :size="14" class="text-slate-300 shrink-0" />
            <button
              @click="drillTo('sp', null)"
              :class="[
                'text-sm font-bold transition-colors truncate max-w-xs',
                selectedSP ? 'text-amber-600 hover:text-amber-800' : 'text-slate-700 cursor-default'
              ]"
            >
              {{ selectedIS.nama }}
            </button>
          </template>

          <template v-if="selectedSP">
            <IconChevronRight :size="14" class="text-slate-300 shrink-0" />
            <span class="text-sm font-bold text-slate-700 truncate max-w-xs">
              {{ selectedSP.sasaranText }}
            </span>
          </template>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-2 shrink-0">
          <FilterDropdown v-model="selectedYear" :options="['2025', '2026', '2027', '2028', '2029']" :icon="IconCalendar" />
          <button
            @click="printCascading"
            :disabled="printLoading"
            class="px-4 py-2 bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            <span v-if="printLoading" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <IconDownload v-else :size="14" />
            {{ printLoading ? 'Menyiapkan...' : 'Cetak / PDF' }}
          </button>
        </div>
      </div>

      <!-- Level Indicator Pills -->
      <div class="px-6 pb-3 flex items-center gap-2">
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer', !selectedSS ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200']" @click="drillTo('ss', null)">
          Sasaran Strategis
        </span>
        <IconChevronRight :size="12" class="text-slate-300" />
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all', (selectedSS && !selectedIS) ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-slate-100 text-slate-400']">
          Indikator Strategis
        </span>
        <IconChevronRight :size="12" class="text-slate-300" />
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all', (selectedIS && !selectedSP) ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100 text-slate-400']">
          Sasaran Program
        </span>
        <IconChevronRight :size="12" class="text-slate-300" />
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all', selectedSP ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-100 text-slate-400']">
          Sasaran Kegiatan
        </span>
      </div>
    </div>

    <!-- ===================== CONTENT AREA ===================== -->
    <div class="px-4 sm:px-6 pt-6">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin"></div>
        <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Menyusun Hirarki Kinerja...</p>
      </div>

      <template v-else>

        <!-- ===== LEVEL 1: SASARAN STRATEGIS ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="!selectedSS" key="level-ss">
            <div class="mb-6">
              <h2 class="text-lg font-black text-slate-800">Sasaran Strategis</h2>
              <p class="text-sm text-slate-500 mt-1">Klik pada salah satu sasaran strategis untuk melihat cascading program di bawahnya.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="ss in uniqueStrategis"
                :key="ss.id"
                @click="drillTo('is', ss)"
                class="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <!-- Top accent bar -->
                <div class="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500"></div>

                <div class="p-6">
                  <!-- Badge -->
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Sasaran Strategis
                    </span>
                    <div class="w-9 h-9 rounded-xl bg-blue-700 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-blue-700/30">
                      <IconStar :size="18" class="text-yellow-300" />
                    </div>
                  </div>

                  <!-- Title -->
                  <p class="font-bold text-slate-800 leading-snug text-base mb-5 min-h-[3rem] group-hover:text-blue-700 transition-colors line-clamp-3">
                    {{ ss.sasaranText }}
                  </p>

                  <!-- Stats -->
                  <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div class="text-center">
                      <p class="text-2xl font-black text-blue-700">{{ getChildrenProgram(ss.id).length }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Program</p>
                    </div>
                    <div class="h-8 w-px bg-slate-200"></div>
                    <div class="text-center">
                      <p class="text-2xl font-black text-indigo-600">{{ getTotalKegiatan(ss.id) }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kegiatan</p>
                    </div>
                    <div class="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Lihat Detail <IconChevronRight :size="14" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="uniqueStrategis.length === 0" class="col-span-3 py-20 text-center text-slate-400">
                <IconHierarchy2 :size="40" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada data sasaran strategis</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- ===== LEVEL 2: INDIKATOR STRATEGIS ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="selectedSS && !selectedIS" key="level-is">
            <!-- Parent SS Summary Card -->
            <div class="mb-6 bg-blue-700 text-white rounded-2xl p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <IconStar :size="20" class="text-yellow-300" />
              </div>
              <div class="min-w-0">
                <p class="text-blue-200 text-[11px] font-black uppercase tracking-widest mb-1">Sasaran Strategis</p>
                <h2 class="font-black text-base leading-snug">{{ selectedSS.sasaranText }}</h2>
              </div>
            </div>

            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-black text-slate-800">Indikator Strategis ({{ isDrilled.length }})</h3>
                <p class="text-xs text-slate-500 mt-0.5">Klik indikator untuk melihat Sasaran Program di bawahnya.</p>
              </div>
              <button @click="drillTo('ss', null)" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                <IconChevronLeft :size="14" /> Kembali
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="is in isDrilled"
                :key="is.id"
                @click="drillTo('sp', is)"
                class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div class="h-1.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Indikator Strategis
                    </span>
                    <div class="w-8 h-8 rounded-xl bg-amber-500 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <IconChartBar :size="15" class="text-white" />
                    </div>
                  </div>

                  <p class="font-bold text-slate-800 leading-snug text-sm mb-3 min-h-[3rem] group-hover:text-amber-700 transition-colors line-clamp-3">
                    {{ is.nama }}
                  </p>

                  <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div v-if="is.satuan" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                      {{ is.satuan }}
                    </div>
                    <div v-if="is.kode" class="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      {{ is.kode }}
                    </div>
                    <div class="ml-auto flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                      <IconChevronRight :size="14" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="isDrilled.length === 0" class="col-span-3 py-16 text-center text-slate-400">
                <IconChartBar :size="36" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada Indikator Strategis untuk Sasaran Strategis ini</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- ===== LEVEL 3: SASARAN PROGRAM ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="selectedIS && !selectedSP" key="level-sp">
            <!-- Parent SS + IS Summary -->
            <div class="mb-4 bg-blue-700 text-white rounded-2xl p-4 flex items-center gap-3">
              <IconStar :size="16" class="text-yellow-300 shrink-0" />
              <span class="text-blue-200 text-xs font-bold truncate">{{ selectedSS?.sasaranText }}</span>
            </div>
            <div class="mb-6 bg-amber-500 text-white rounded-2xl p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <IconChartBar :size="20" class="text-white" />
              </div>
              <div class="min-w-0">
                <p class="text-amber-100 text-[11px] font-black uppercase tracking-widest mb-1">Indikator Strategis</p>
                <h2 class="font-black text-base leading-snug">{{ selectedIS.nama }}</h2>
                <span v-if="selectedIS.satuan" class="text-amber-200 text-xs">Satuan: {{ selectedIS.satuan }}</span>
              </div>
            </div>

            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-black text-slate-800">Sasaran Program ({{ programDrilled.length }})</h3>
                <p class="text-xs text-slate-500 mt-0.5">Klik program untuk melihat Sasaran Kegiatan di bawahnya.</p>
              </div>
              <button @click="drillTo('is', null)" class="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors">
                <IconChevronLeft :size="14" /> Kembali ke Indikator
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="sp in programDrilled"
                :key="sp.id"
                @click="drillTo('sk', sp)"
                class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div class="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Sasaran Program
                    </span>
                    <div class="w-8 h-8 rounded-xl bg-indigo-600 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-indigo-600/30">
                      <IconBuilding :size="15" class="text-white" />
                    </div>
                  </div>

                  <p class="font-bold text-slate-800 leading-snug text-sm mb-5 min-h-[3rem] group-hover:text-indigo-700 transition-colors line-clamp-3">
                    {{ sp.sasaranText }}
                  </p>

                  <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div class="text-center">
                      <p class="text-xl font-black text-indigo-600">{{ getChildrenKegiatan(sp.id).length }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kegiatan</p>
                    </div>
                    <div class="h-8 w-px bg-slate-200"></div>
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 truncate flex-1">
                      <IconUsers :size="11" class="shrink-0" />
                      {{ sp.unitKerja || 'Semua Unit' }}
                    </div>
                    <div class="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform shrink-0">
                      <IconChevronRight :size="14" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="programDrilled.length === 0" class="col-span-3 py-16 text-center text-slate-400">
                <IconBuilding :size="36" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada Sasaran Program untuk Indikator ini</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- ===== LEVEL 4: SASARAN KEGIATAN ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="selectedSP" key="level-sk">
            <!-- SP Summary Card -->
            <div class="mb-6 bg-indigo-600 text-white rounded-2xl p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <IconBuilding :size="20" class="text-white" />
              </div>
              <div class="min-w-0">
                <p class="text-indigo-200 text-[11px] font-black uppercase tracking-widest mb-1">Sasaran Program</p>
                <h2 class="font-black text-base leading-snug">{{ selectedSP.sasaranText }}</h2>
                <div class="flex items-center gap-1.5 mt-2 text-indigo-200 text-xs font-bold">
                  <IconUsers :size="12" />
                  {{ selectedSP.unitKerja || 'Semua Unit' }}
                </div>
              </div>
            </div>

            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-black text-slate-800">Sasaran Kegiatan & Indikator ({{ kegiatanDrilled.length }})</h3>
                <p class="text-xs text-slate-500 mt-0.5">Klik kartu untuk melihat detail lengkap Sasaran Kegiatan.</p>
              </div>
              <button @click="drillTo('sp', null)" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                <IconChevronLeft :size="14" /> Kembali ke Program
              </button>
            </div>

            <!-- SK Cards Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div
                v-for="sk in kegiatanDrilled"
                :key="sk.id"
                @click="router.push(`/${route.params.slug}/sasaran-kegiatan/view?id=${sk.id}`)"
                class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <div class="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                <!-- SK Header -->
                <div class="p-5 border-b border-slate-100">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-md shadow-emerald-600/30">
                      <IconTarget :size="15" class="text-white" />
                    </div>
                    <div class="min-w-0">
                      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Sasaran Kegiatan</span>
                      <p class="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors mt-0.5">
                        {{ sk.sasaranText }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Indicators Table -->
                <div class="flex-1 divide-y divide-slate-100">
                  <div
                    v-for="ind in sk.indicators"
                    :key="ind.id"
                    class="flex items-center px-5 py-3 gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                    <p class="text-xs font-medium text-slate-600 flex-1 leading-snug">{{ ind.nama }}</p>
                    <div class="shrink-0 text-right">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target {{ selectedYear }}</p>
                      <p class="text-sm font-black text-emerald-600">{{ ind.target ?? '-' }}</p>
                    </div>
                  </div>

                  <div v-if="sk.indicators.length === 0" class="px-5 py-4 text-xs text-slate-400 italic text-center">
                    Belum ada Indikator Kinerja
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <IconBuilding :size="12" class="text-slate-400" />
                    <span class="truncate max-w-[200px]">{{ sk.unitKerja }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Detail <IconChevronRight :size="12" />
                  </span>
                </div>
              </div>

              <div v-if="kegiatanDrilled.length === 0" class="col-span-2 py-16 text-center text-slate-400">
                <IconTargetArrow :size="36" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada Sasaran Kegiatan untuk Program ini</p>
              </div>
            </div>
          </div>
        </Transition>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconHierarchy2,
  IconCalendar,
  IconDownload,
  IconStar,
  IconBuilding,
  IconUsers,
  IconChevronRight,
  IconChevronLeft,
  IconTarget,
  IconChartBar,
  IconTargetArrow,
  IconBuildingBank
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import useSWRV from 'swrv'

/**
 * Cascading Kinerja — Interactive Drill-Down Edition
 * Hirarki 4 Level:
 * Sasaran Strategis → Indikator Strategis → Sasaran Program → Sasaran Kegiatan
 */

definePageMeta({ layout: 'dashboard' })

// ──────────────────── State ────────────────────
const selectedYear = ref('2025')
const selectedSS = ref<any>(null)
const selectedIS = ref<any>(null)  // Indikator Strategis
const selectedSP = ref<any>(null)
const router = useRouter()
const route = useRoute()

// ──────────────────── Data Fetching ────────────────────
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: strategisList } = useSWRV('/api/sasaran-strategis', fetcher)
const { data: programList }   = useSWRV('/api/sasaran-program', fetcher)
const { data: kegiatanList }  = useSWRV('/api/sasaran-kegiatan', fetcher)
// Fetch Indikator Strategis berdasarkan SS yang dipilih
const { data: isRaw } = useSWRV(
  () => selectedSS.value?.id ? `/api/indikator-strategis?sasaranStrategisId=${selectedSS.value.id}` : null,
  fetcher
)

const loading = computed(() => !strategisList.value || !programList.value || !kegiatanList.value)

// ──────────────────── Drill-Down Navigation ────────────────────
function drillTo(level: 'ss' | 'is' | 'sp' | 'sk', item: any) {
  if (level === 'ss') {
    selectedSS.value = null
    selectedIS.value = null
    selectedSP.value = null
  } else if (level === 'is') {
    // Klik SS → tampilkan IS level
    if (item !== null) selectedSS.value = item
    selectedIS.value = null
    selectedSP.value = null
  } else if (level === 'sp') {
    // Klik IS → tampilkan SP level
    if (item !== null) selectedIS.value = item
    selectedSP.value = null
  } else if (level === 'sk') {
    selectedSP.value = item
  }
}

// ──────────────────── Computed Lists ────────────────────
const uniqueStrategis = computed(() => {
  if (!strategisList.value) return []
  // Handle error response object
  const val = strategisList.value as any
  if (val?.success === false) {
    console.warn('[cascading] /api/sasaran-strategis error:', val.message)
    return []
  }
  const raw = Array.isArray(val) ? val : (val?.data || val?.rows || [])
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.reduce((acc: any[], item: any) => {
    const id = Number(item.ssId || item.id)
    if (id && !seen.has(id)) {
      seen.add(id)
      acc.push({ id, sasaranText: item.sasaranText || item.namaSs, unitKerja: item.unit_kerja || item.pengampu || '' })
    }
    return acc
  }, [])
})

// Indikator Strategis untuk SS yang dipilih
const isDrilled = computed(() => {
  if (!isRaw.value) return []
  const raw = Array.isArray(isRaw.value) ? isRaw.value : []
  return raw.map((item: any) => ({
    id: item.id,
    nama: item.nama || '-',
    kode: item.kode || '',
    satuan: item.satuan || '',
    ssId: item.sasaranStrategisId || item.sasaran_strategis_id
  }))
})

const uniqueProgram = computed(() => {
  if (!programList.value) return []
  const val = programList.value as any
  if (val?.success === false) return []
  const raw = Array.isArray(val) ? val : (val?.data || val?.rows || [])
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.reduce((acc: any[], item: any) => {
    const spId = Number(item.id)
    if (spId && !seen.has(spId)) {
      seen.add(spId)
      acc.push({
        id: spId,
        ssId: Number(item.ssId),
        sasaranText: item.sasaran_program_text || item.namaSp,
        unitKerja: item.unit_kerja || item.unitKerjaNama || ''
      })
    }
    return acc
  }, [])
})

const uniqueKegiatan = computed(() => {
  if (!kegiatanList.value) return []
  const val = kegiatanList.value as any
  if (val?.success === false) return []
  const raw = Array.isArray(val) ? val : (val?.data || val?.rows || [])
  if (!Array.isArray(raw)) return []
  const map = new Map()
  raw.forEach((item: any) => {
    const id = Number(item.id)
    if (!id) return
    if (!map.has(id)) {
      map.set(id, {
        id,
        spId: Number(item.spId),
        sasaranText: item.sasaran_kegiatan_text || item.sasaranText || item.namaSk,
        unitKerja: item.unit_kerja || item.unitKerjaNama || '-',
        indicators: []
      })
    }
    if (item.indikatorId) {
      const yearIdx = ['2025','2026','2027','2028','2029'].indexOf(selectedYear.value)
      const targetKey = `target_${yearIdx + 1}`
      const entry = map.get(id)
      if (!entry.indicators.find((i: any) => i.id === item.indikatorId)) {
        entry.indicators.push({
          id: item.indikatorId,
          nama: item.indikator_kinerja || item.indikatorNama,
          target: item[targetKey] ?? null
        })
      }
    }
  })
  return Array.from(map.values())
})

// ──────────────────── Filtered for drill-down ────────────────────
// SP difilter berdasarkan SS yang dipilih (relasi IS→SP belum ada di DB)
const programDrilled  = computed(() => uniqueProgram.value.filter(p => p.ssId === Number(selectedSS.value?.id)))
const kegiatanDrilled = computed(() => uniqueKegiatan.value.filter(k => k.spId === Number(selectedSP.value?.id)))

// ──────────────────── Helpers ────────────────────
const getChildrenProgram  = (ssId: number)  => uniqueProgram.value.filter(p => p.ssId === Number(ssId))
const getChildrenKegiatan = (spId: number)  => uniqueKegiatan.value.filter(k => k.spId === Number(spId))
const getTotalKegiatan    = (ssId: number) => {
  const pIds = getChildrenProgram(ssId).map((p: any) => p.id)
  return uniqueKegiatan.value.filter(k => pIds.includes(k.spId)).length
}
// ──────────────────── Print / Export PDF ────────────────────
const printLoading = ref(false)

const printCascading = async () => {
  if (printLoading.value) return
  printLoading.value = true
  try {
    const year = selectedYear.value

    // ── Build org-chart HTML ──
    const ssBlocks = uniqueStrategis.value.map((ss: any) => {
      const programs = getChildrenProgram(ss.id)
      const totalSk = getTotalKegiatan(ss.id)

      const spItems = programs.map((sp: any) => {
        const kegiatans = getChildrenKegiatan(sp.id)
        const targets = kegiatans.flatMap((k: any) => k.indicators)
          .map((i: any) => parseFloat(i.target || '0'))
          .filter((v: number) => !isNaN(v))
        const targetStr = targets.length
          ? (targets.length === 1 ? String(targets[0]) : `${Math.min(...targets)}&ndash;${Math.max(...targets)}`)
          : '-'

        const skItems = kegiatans.map((sk: any) => {
          const inds = sk.indicators
          const indHTML = inds.length
            ? inds.map((ind: any) => `
                <div class="ik-row">
                  <span class="ik-label">IKK:</span>
                  <span class="ik-text">${ind.nama ?? '-'}</span>
                </div>
                <div class="target-row">
                  <span class="target-badge">Target ${year}: ${ind.target ?? '-'}</span>
                </div>`).join('<hr class="ik-hr">')
            : '<div class="ik-empty">Belum ada indikator</div>'

          return `<li class="sk-item">
            <div class="sk-card">
              <div class="badge sk-badge">SK</div>
              <div class="card-text">${sk.sasaranText ?? '-'}</div>
              <div class="ik-section">${indHTML}</div>
              <div class="card-pengampu">&#128100; ${sk.unitKerja ?? '-'}</div>
            </div>
          </li>`
        }).join('')

        const skLevelHtml = skItems ? `<ul class="sk-level">${skItems}</ul>` : ''

        return `<li class="sp-item">
          <div class="sp-card">
            <div class="badge sp-badge">SP</div>
            <div class="card-text">${sp.sasaranText ?? '-'}</div>
            <div class="card-pengampu">&#128100; ${sp.unitKerja ?? '-'}</div>
            <div class="card-stats">
              <span class="stat">&#128203; SK: <b>${kegiatans.length}</b></span>
              <span class="stat green">&#127919; Target ${year}: <b>${targetStr}</b></span>
            </div>
          </div>
          ${skLevelHtml}
        </li>`
      }).join('')

      const spLevelHtml = spItems ? `<ul class="sp-level">${spItems}</ul>` : '<p class="empty-msg">Belum ada Sasaran Program</p>'

      return `<div class="ss-block">
        <div class="ss-card">
          <div class="badge ss-badge">SS</div>
          <div class="ss-title">${ss.sasaranText ?? '-'}</div>
          <div class="ss-sub">&#128100; Pengampu: ${ss.unitKerja || 'Kepala Lembaga'}</div>
          <div class="ss-stats">
            <span class="stat light">SP: <b>${programs.length}</b></span>
            <span class="stat light">SK: <b>${totalSk}</b></span>
          </div>
        </div>
        ${spLevelHtml}
      </div>`
    }).join('')

    const printDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Peta Cascading Kinerja — ${year}</title>
<style>
  @page { size: A3 landscape; margin: 8mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #fff; color: #1e293b; font-size: 6.5pt;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* ── HEADER ── */
  .hdr {
    background: linear-gradient(135deg,#1e3a8a,#2563eb);
    color:#fff; text-align:center; padding:8px 16px; border-radius:8px; margin-bottom:10px;
  }
  .hdr h1 { font-size:12pt; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
  .hdr p  { font-size:7pt; color:#bfdbfe; margin-top:2px; }

  /* ── LEGEND ── */
  .legend { display:flex; gap:14px; justify-content:center; margin-bottom:10px; }
  .legend-item { display:flex; align-items:center; gap:4px; font-size:6pt; font-weight:700; }
  .dot { width:9px; height:9px; border-radius:2px; }
  .dot.ss { background:#1e3a8a; }
  .dot.sp { background:#7c3aed; }
  .dot.sk { background:#059669; }

  /* ── BADGES ── */
  .badge {
    display:inline-block; font-size:5pt; font-weight:900; padding:1px 4px;
    border-radius:3px; margin-bottom:3px; letter-spacing:.3px; text-transform:uppercase;
  }
  .ss-badge { background:#fef3c7; color:#92400e; border:1px solid #fcd34d; }
  .sp-badge { background:#ede9fe; color:#4c1d95; border:1px solid #a78bfa; }
  .sk-badge { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }

  /* ── SS CARD ── */
  .ss-block { display:flex; flex-direction:column; align-items:center; margin-bottom:16px; }
  .ss-card {
    background:linear-gradient(135deg,#1e3a8a,#1d4ed8);
    color:#fff; border-radius:8px; padding:9px 14px;
    min-width:240px; max-width:320px;
    border-left:4px solid #fbbf24;
    box-shadow:0 3px 10px rgba(30,58,138,.25);
  }
  .ss-title { font-size:8.5pt; font-weight:800; line-height:1.35; margin-bottom:4px; }
  .ss-sub   { font-size:6pt; color:#bfdbfe; }
  .ss-stats { display:flex; gap:8px; margin-top:5px; }

  /* ── SP CARD ── */
  .sp-card {
    background:#fff; border:1.5px solid #7c3aed; border-radius:7px;
    padding:7px 9px; min-width:150px; max-width:200px;
    box-shadow:0 2px 6px rgba(124,58,237,.1);
  }
  .card-text     { font-size:6.5pt; font-weight:700; line-height:1.4; color:#1e293b; margin-bottom:4px; }
  .card-pengampu { font-size:5pt; color:#64748b; margin-top:3px; }
  .card-stats    { display:flex; gap:5px; margin-top:5px; padding-top:4px; border-top:1px solid #e2e8f0; flex-wrap:wrap; }
  .stat          { font-size:5pt; color:#475569; }
  .stat.green    { color:#059669; font-weight:700; }
  .stat.light    { color:#bfdbfe; }

  /* ── SK CARD ── */
  .sk-card {
    background:#fff; border:1.5px solid #059669; border-radius:6px;
    padding:6px 8px; min-width:130px; max-width:175px;
    box-shadow:0 1px 4px rgba(5,150,105,.09);
  }

  /* ── IK SECTION ── */
  .ik-section   { margin-top:4px; padding-top:3px; border-top:1px dashed #a7f3d0; }
  .ik-row       { display:flex; gap:2px; align-items:flex-start; }
  .ik-label     { font-size:5pt; font-weight:900; color:#065f46; flex-shrink:0; }
  .ik-text      { font-size:5pt; color:#374151; line-height:1.3; }
  .target-badge { display:inline-block; font-size:5pt; font-weight:700; color:#065f46; background:#d1fae5; border-radius:3px; padding:0 3px; margin-top:2px; }
  .ik-hr        { border:none; border-top:1px dashed #d1fae5; margin:2px 0; }
  .ik-empty     { font-size:5pt; color:#94a3b8; font-style:italic; }

  /* ════════════════════════════════════════
     ORTHOGONAL TREE CONNECTORS
     Technique: ::before/::after on <li> draw
     the horizontal arms; ::before on <ul>
     draws the vertical drop from parent;
     margin-top on card + negative ::before
     creates the vertical stub up to the bar.
  ════════════════════════════════════════ */

  /* ── SP level (children of SS) ── */
  .sp-level {
    display: flex;
    list-style: none;
    padding-top: 24px;   /* room for the vertical drop line from SS */
    position: relative;
    gap: 0;
  }

  /* Vertical line dropping from SS card bottom to the horizontal bar */
  .sp-level::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 24px;
    border-left: 1.5px solid #7c3aed;
  }

  /* Each SP item */
  .sp-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 8px;
  }

  /* Left horizontal arm (toward left sibling) */
  .sp-item::before {
    content: '';
    position: absolute;
    top: 0; right: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #7c3aed;
  }
  /* Right horizontal arm (toward right sibling) */
  .sp-item::after {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #7c3aed;
  }
  /* Single child — no horizontal arms */
  .sp-item:only-child::before,
  .sp-item:only-child::after  { display: none; }
  /* First child — no left arm */
  .sp-item:first-child::before { display: none; }
  /* Last child  — no right arm */
  .sp-item:last-child::after   { display: none; }

  /* SP card — vertical stub from horizontal bar down to card top */
  .sp-card {
    margin-top: 24px;   /* space for stub */
    position: relative;
  }
  .sp-card::before {
    content: '';
    position: absolute;
    top: -24px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 24px;
    border-left: 1.5px solid #7c3aed;
  }

  /* ── SK level (children of SP) ── */
  .sk-level {
    display: flex;
    list-style: none;
    padding-top: 18px;
    position: relative;
    gap: 0;
    margin-top: 0;
  }

  /* Vertical drop from SP card bottom */
  .sk-level::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 18px;
    border-left: 1.5px solid #059669;
  }

  .sk-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 6px;
  }

  .sk-item::before {
    content: '';
    position: absolute;
    top: 0; right: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #059669;
  }
  .sk-item::after {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    width: 50%; height: 0;
    border-top: 1.5px solid #059669;
  }
  .sk-item:only-child::before,
  .sk-item:only-child::after  { display: none; }
  .sk-item:first-child::before { display: none; }
  .sk-item:last-child::after   { display: none; }

  .sk-card {
    margin-top: 18px;
    position: relative;
  }
  .sk-card::before {
    content: '';
    position: absolute;
    top: -18px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 18px;
    border-left: 1.5px solid #059669;
  }

  .empty-msg { color:#94a3b8; font-style:italic; font-size:6pt; margin-top:8px; }

  /* ── PRINT BUTTON ── */
  .btn-wrap { text-align:center; margin-top:20px; padding-bottom:12px; }
  .btn-print {
    padding:8px 24px; background:#1e3a8a; color:#fff; border:none;
    border-radius:7px; font-weight:700; font-size:9pt; cursor:pointer;
  }
  #cascade-tree {
    min-width: max-content;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  @media print {
    .btn-wrap { display:none; }
    body { background:white; }
    #cascade-tree {
      min-width: max-content;
      padding: 0;
    }
  }

  /* ── MOBILE RESPONSIVE STYLES ── */
  @media screen and (max-width: 768px), print and (max-width: 768px) {
    body {
      font-size: 8pt !important;
      padding: 10px !important;
    }
    .hdr {
      padding: 12px !important;
      margin-bottom: 15px !important;
    }
    .hdr h1 {
      font-size: 13pt !important;
    }
    .hdr p {
      font-size: 8pt !important;
    }
    .legend {
      flex-wrap: wrap !important;
      gap: 10px !important;
      margin-bottom: 15px !important;
    }
    .legend-item {
      font-size: 7.5pt !important;
    }
    .dot {
      width: 12px !important;
      height: 12px !important;
    }
    
    .tree-wrapper {
      padding: 10px 0 !important;
      overflow-x: visible !important;
    }
    
    #cascade-tree {
      min-width: 100% !important;
      width: 100% !important;
      transform: none !important;
      margin-bottom: 0 !important;
    }
    
    .ss-level, .sp-level, .sk-level {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      padding-top: 20px !important;
      gap: 20px !important;
      width: 100% !important;
    }
    
    .ss-level::before, .sp-level::before, .sk-level::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 0 !important;
      height: 100% !important;
      z-index: 1 !important;
    }
    .ss-level::before { border-left: 2px solid #1e3a8a !important; }
    .sp-level::before { border-left: 2px solid #7c3aed !important; }
    .sk-level::before { border-left: 2px solid #059669 !important; }
    
    .ss-item, .sp-item, .sk-item {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: 100% !important;
      padding: 0 !important;
    }
    
    .ss-item::before, .ss-item::after,
    .sp-item::before, .sp-item::after,
    .sk-item::before, .sk-item::after {
      display: none !important;
    }
    
    .lan-card, .ss-card, .sp-card, .sk-card {
      position: relative !important;
      z-index: 5 !important;
      margin-top: 0 !important;
      width: 95% !important;
      max-width: 340px !important;
      min-width: auto !important;
    }
    
    .ss-card::before, .sp-card::before, .sk-card::before {
      display: none !important;
    }
    
    .sp-level {
      margin-top: 10px !important;
    }
    .sk-level {
      margin-top: 10px !important;
    }
  }
</style>
</head>
<body>
<div class="hdr">
  <h1>&#127979; Peta Cascading Kinerja</h1>
  <p>Tahun ${year} &nbsp;&bull;&nbsp; Dicetak: ${printDate}</p>
</div>

<div class="legend">
  <div class="legend-item"><div class="dot ss"></div> Sasaran Strategis (SS)</div>
  <div class="legend-item"><div class="dot sp"></div> Sasaran Program (SP)</div>
  <div class="legend-item"><div class="dot sk"></div> Sasaran Kegiatan (SK)</div>
</div>

<div id="cascade-tree">
  ${ssBlocks || '<p style="text-align:center;color:#94a3b8;padding:40px;">Tidak ada data untuk ditampilkan.</p>'}
</div>

<div class="btn-wrap">
  <button class="btn-print" onclick="window.print()">&#128424; Cetak / Simpan PDF</button>
</div>

${'<' + 'script>'}
function adjustScale() {
  var tree = document.getElementById('cascade-tree');
  if (!tree) return;
  tree.style.transform = 'none';
  tree.style.transformOrigin = 'top center';
  tree.style.marginBottom = '0px';

  if (window.innerWidth <= 768) return;

  var tw = tree.scrollWidth;
  var pw = document.documentElement.clientWidth;
  if (tw > pw) {
    var scale = pw / tw;
    tree.style.transform = 'scale(' + scale + ')';
    tree.style.marginBottom = ((scale - 1) * tree.scrollHeight) + 'px';
  }
}
adjustScale();
setTimeout(adjustScale, 100);
if (document.readyState === 'complete') {
  adjustScale();
} else {
  window.addEventListener('DOMContentLoaded', adjustScale);
  window.addEventListener('load', adjustScale);
}
window.addEventListener('resize', adjustScale);
window.addEventListener('beforeprint', adjustScale);
window.addEventListener('afterprint', adjustScale);
${'</' + 'script>'}
</body>
</html>`

    const win = window.open('', '_blank', 'width=1400,height=900')
    if (!win) {
      alert('Popup diblokir browser. Mohon izinkan popup untuk halaman ini.')
      return
    }
    win.document.write(html)
    win.document.close()
  } finally {
    printLoading.value = false
  }
}




</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
