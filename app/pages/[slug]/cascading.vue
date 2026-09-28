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
import { printCascading as printCascadingUtil } from '~/utils/printCascading.js'
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
import { useAuthUser } from '~/composables/useAuthUser'

/**
 * Cascading Kinerja — Interactive Drill-Down Edition
 * Hirarki 4 Level:
 * Sasaran Strategis → Indikator Strategis → Sasaran Program → Sasaran Kegiatan
 */

definePageMeta({ layout: 'dashboard' })

const { role, authUser } = useAuthUser()
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isAdmin = computed(() => normalizedRole.value === 'admin')
const isUser = computed(() => normalizedRole.value === 'user')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

// ──────────────────── State ────────────────────
const selectedYear = ref('2025')
const selectedSS = ref<any>(null)
const selectedIS = ref<any>(null)  // Indikator Strategis
const selectedSP = ref<any>(null)
const router = useRouter()
const route = useRoute()

// ──────────────────── Data Fetching ────────────────────
// Fetch Indikator Strategis berdasarkan SS yang dipilih
const { data: isRaw } = useFetch(() => selectedSS.value?.id ? `/api/indikator-strategis?sasaranStrategisId=${selectedSS.value.id}` : (null as any), { lazy: true, default: () => [] })

const { data: strategisList } = useFetch('/api/sasaran-strategis', { lazy: true, default: () => [] })
const { data: programList } = useFetch('/api/sasaran-program', { lazy: true, default: () => [] })
const { data: kegiatanList } = useFetch('/api/sasaran-kegiatan', { lazy: true, default: () => [] })

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
const allUniqueStrategis = computed(() => {
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

const allUniqueProgram = computed(() => {
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

const allUniqueKegiatan = computed(() => {
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
        programUnitKerja: item.programUnitKerja || '',
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

// ──────────────────── Filtered for Cascading ────────────────────
const uniqueKegiatan = computed(() => {
  const list = allUniqueKegiatan.value
  if (isSuperAdmin.value || !loggedUnitKerjaName.value) return list

  const loggedUk = loggedUnitKerjaName.value.toLowerCase()
  if (isAdmin.value) {
    return list.filter((k: any) => {
      const progUk = (k.programUnitKerja || '').trim().toLowerCase()
      const ownUk = (k.unitKerja || '').trim().toLowerCase()
      return progUk === loggedUk || ownUk === loggedUk
    })
  } else {
    return list.filter((k: any) => {
      const ownUk = (k.unitKerja || '').trim().toLowerCase()
      return ownUk === loggedUk
    })
  }
})

const uniqueProgram = computed(() => {
  const list = allUniqueProgram.value
  if (isSuperAdmin.value || !loggedUnitKerjaName.value) return list

  const loggedUk = loggedUnitKerjaName.value.toLowerCase()
  if (isAdmin.value) {
    return list.filter((p: any) => {
      const ownUk = (p.unitKerja || '').trim().toLowerCase()
      return ownUk === loggedUk
    })
  } else {
    const parentSpIds = new Set(uniqueKegiatan.value.map(k => k.spId))
    return list.filter((p: any) => parentSpIds.has(p.id))
  }
})

const uniqueStrategis = computed(() => {
  const list = allUniqueStrategis.value
  if (isSuperAdmin.value || !loggedUnitKerjaName.value) return list

  const parentSsIds = new Set(uniqueProgram.value.map(p => p.ssId))
  return list.filter((ss: any) => parentSsIds.has(ss.id))
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
// Print / Export PDF
const printLoading = ref(false)

const printCascading = async () => {
  if (printLoading.value) return
  printLoading.value = true
  try {
    const year = selectedYear.value
    const ssHtml = uniqueStrategis.value.map((ss: any) => {
      const programs = getChildrenProgram(ss.id)
      const totalSk = getTotalKegiatan(ss.id)
      const spItems = programs.map((sp: any) => {
        const kegiatans = getChildrenKegiatan(sp.id)
        const targets = kegiatans.flatMap((k: any) => k.indicators)
          .map((i: any) => parseFloat(i.target || "0"))
          .filter((v: number) => !isNaN(v))
        const targetStr = targets.length
          ? (targets.length === 1 ? String(targets[0]) : `${Math.min(...targets)}&ndash;${Math.max(...targets)}`)
          : "-"
        const skItems = kegiatans.map((sk: any) => {
          const inds = sk.indicators
          const indHTML = inds.length
            ? inds.map((ind: any) => `<div class="ik-row"><span class="ik-label">IKK:</span><span class="ik-text">${ind.nama ?? "-"}</span></div><div class="target-row"><span class="target-badge">Target ${year}: ${ind.target ?? "-"}</span></div>`).join(`<hr class="ik-hr">`)
            : `<div class="ik-empty">Belum ada indikator</div>`
          return `<li class="sk-item"><div class="sk-card"><div class="badge sk-badge">SK</div><div class="card-text">${sk.sasaranText ?? "-"}</div><div class="ik-section">${indHTML}</div><div class="card-pengampu">&#128100; ${sk.unitKerja ?? "-"}</div></div></li>`
        }).join("")
        const skLevelHtml = skItems ? `<ul class="sk-level">${skItems}</ul>` : ""
        return `<li class="sp-item"><div class="sp-card"><div class="badge sp-badge">SP</div><div class="card-text">${sp.sasaranText ?? "-"}</div><div class="card-pengampu">&#128100; ${sp.unitKerja ?? "-"}</div><div class="card-stats"><span class="stat">&#128203; SK: <b>${kegiatans.length}</b></span><span class="stat green">&#127919; Target ${year}: <b>${targetStr}</b></span></div></div>${skLevelHtml}</li>`
      }).join("")
      const spLevelHtml = spItems ? `<ul class="sp-level">${spItems}</ul>` : `<p class="empty-msg">Belum ada Sasaran Program</p>`
      return `<li class="ss-item"><div class="ss-card"><div class="badge ss-badge">SS</div><div class="ss-title">${ss.sasaranText ?? "-"}</div><div class="ss-sub">&#128100; Pengampu: ${ss.unitKerja || "Kepala Lembaga"}</div><div class="ss-stats"><span class="stat light">SP: <b>${programs.length}</b></span><span class="stat light">SK: <b>${totalSk}</b></span></div></div>${spLevelHtml}</li>`
    }).join("")
    printCascadingUtil(ssHtml, year)
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
