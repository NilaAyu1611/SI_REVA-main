<template>
  <div class="space-y-6">
    <!-- Top Header Bar -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
      <!-- Title & Subtitle -->
      <div class="space-y-1">
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Kinerja SI-REVA</h1>
        <p class="text-sm font-medium text-slate-500">Sistem Perencanaan dan Evaluasi Kinerja LAN RI</p>
        
        <!-- Last updated -->
        <div class="flex items-center gap-2 text-xs text-slate-400 mt-2">
          <IconClock :size="14" class="text-slate-400" />
          <span>Last updated: {{ lastUpdate }}</span>
        </div>
      </div>
      
      <!-- Right Side Tools -->
      <div class="flex items-center gap-2 self-end md:self-start mt-2 md:mt-0">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tahun</span>
        <div class="relative min-w-[90px]">
          <select class="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer w-full shadow-sm">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
          <IconChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="14" />
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      
      <!-- Card 1: Total Sasaran Strategis -->
      <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
        <div class="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] shrink-0">
          <IconTarget :size="24" stroke-width="2" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-extrabold text-[#1A73E8] leading-none mb-1">
            {{ stats?.ss ?? 2 }}
          </div>
          <div class="text-xs font-bold text-slate-800 leading-tight">Total Sasaran Strategis</div>
          <div class="text-[10px] text-slate-400 mt-0.5">100% dari target tahunan</div>
        </div>
      </div>

      <!-- Card 2: Total Sasaran Program -->
      <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
        <div class="w-12 h-12 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#137333] shrink-0">
          <IconChartPie :size="24" stroke-width="2" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-extrabold text-[#137333] leading-none mb-1">
            {{ stats?.sp ?? 10 }}
          </div>
          <div class="text-xs font-bold text-slate-800 leading-tight">Total Sasaran Program</div>
          <div class="text-[10px] text-slate-400 mt-0.5">100% dari target tahunan</div>
        </div>
      </div>

      <!-- Card 3: Total Sasaran Kegiatan -->
      <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
        <div class="w-12 h-12 rounded-full bg-[#FEF7E0] flex items-center justify-center text-[#B06000] shrink-0">
          <IconLayoutGrid :size="24" stroke-width="2" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-extrabold text-[#B06000] leading-none mb-1">
            {{ stats?.sk ?? 23 }}
          </div>
          <div class="text-xs font-bold text-slate-800 leading-tight">Total Sasaran Kegiatan</div>
          <div class="text-[10px] text-slate-400 mt-0.5">100% dari target tahunan</div>
        </div>
      </div>

      <!-- Card 4: Total IKU -->
      <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
        <div class="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED] shrink-0">
          <IconTrendingUp :size="24" stroke-width="2" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-extrabold text-[#7C3AED] leading-none mb-1">
            {{ stats?.totalIku ?? 46 }}
          </div>
          <div class="text-xs font-bold text-slate-800 leading-tight">Total IKU</div>
          <div class="text-[10px] text-slate-400 mt-0.5">100% dari target tahunan</div>
        </div>
      </div>

      <!-- Card 5: Rerata Capaian IKU -->
      <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
        <div class="w-12 h-12 rounded-full bg-[#E6FFFA] flex items-center justify-center text-[#0D9488] shrink-0">
          <IconPercentage :size="20" stroke-width="2.5" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-extrabold text-[#0D9488] leading-none mb-1">
            {{ (stats?.capaian ?? 82) + '%' }}
          </div>
          <div class="text-xs font-bold text-slate-800 leading-tight">Rerata Capaian IKU</div>
          <div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span class="text-[#137333] font-bold">▲ 2,6%</span>
            <span>vs periode lalu</span>
          </div>
        </div>
      </div>

      <!-- Card 6: IKU Belum Tercapai -->
      <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
        <div class="w-12 h-12 rounded-full bg-[#FCE8E6] flex items-center justify-center text-[#C5221F] shrink-0">
          <IconAlertCircle :size="24" stroke-width="2" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-extrabold text-[#C5221F] leading-none mb-1">
            {{ stats?.belumTercapai ?? 6 }}
          </div>
          <div class="text-xs font-bold text-slate-800 leading-tight">IKU Belum Tercapai</div>
          <div class="text-[10px] text-slate-400 mt-0.5">
            {{ stats?.totalIku ? Math.round((stats.belumTercapai / stats.totalIku) * 100) : 0 }}% dari total IKU
          </div>
        </div>
      </div>

    </div>

    <!-- Charts/Metrics Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Card: Capaian per Unit Kerja -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-800">Capaian per Unit Kerja</h3>
              <div class="relative group">
                <IconInfoCircle :size="15" class="text-slate-400 hover:text-slate-600 cursor-pointer" />
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 leading-tight">
                  Menampilkan rata-rata capaian IKU untuk setiap unit kerja yang dikelola.
                </div>
              </div>
            </div>
            
            <div class="relative">
              <select 
                v-model="sortOrder"
                class="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[150px]"
              >
                <option value="tertinggi">Urutkan: Capaian Tertinggi</option>
                <option value="terendah">Urutkan: Capaian Terendah</option>
              </select>
              <IconChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="12" />
            </div>
          </div>

          <!-- Unit List -->
          <div class="space-y-3.5">
            <div 
              v-for="(unit, idx) in sortedCapaianUnit" 
              :key="unit.name"
              class="flex items-center gap-3"
            >
              <span class="text-xs font-bold text-slate-400 w-5 shrink-0">{{ sortOrder === 'tertinggi' ? idx + 1 : sortedCapaianUnit.length - idx }}</span>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold text-slate-700 truncate mb-1" :title="unit.name">
                  {{ unit.name }}
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      class="bg-[#1A73E8] h-full rounded-full transition-all duration-500"
                      :style="{ width: `${unit.value}%` }"
                    ></div>
                  </div>
                  <span class="text-xs font-extrabold text-slate-800 w-9 text-right shrink-0">
                    {{ unit.value }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scale at the bottom -->
        <div class="flex justify-between text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3 mt-4 ml-8">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <!-- Card: Cascading Kinerja -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-7 flex flex-col">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
          <h3 class="text-base font-bold text-slate-800">Cascading Kinerja</h3>
          <div class="relative group">
            <IconInfoCircle :size="15" class="text-slate-400 hover:text-slate-600 cursor-pointer" />
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 leading-tight">
              Alur penjabaran kinerja dari level Strategis hingga IKU.
            </div>
          </div>
        </div>

        <!-- Flow Container -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3 flex-1 py-4">
          
          <!-- Box 1: Sasaran Strategis -->
          <NuxtLink :to="`/${$route.params.slug}/sasaran-strategis`" class="border border-[#4285F4] bg-[#E8F0FE]/10 rounded-xl p-4 flex flex-col items-center justify-center text-center w-full sm:w-[22%] min-h-[160px] cursor-pointer hover:shadow-md transition-shadow">
            <IconTarget :size="24" class="text-[#1A73E8] mb-2" stroke-width="2" />
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sasaran Strategis</div>
            <div class="text-3xl font-black text-slate-800">{{ stats?.ss ?? 2 }}</div>
            <div 
              class="text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full"
              :class="!stats || (stats.capaianSs ?? 0) === 0 ? 'text-slate-400 bg-slate-100' : (stats.capaianSs ?? 0) >= 100 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'"
            >
              {{ (stats?.capaianSs ?? 0) }}% Capaian
            </div>
          </NuxtLink>
 
           <!-- Arrow 1 -->
           <div class="text-[#1A73E8] font-black py-1 sm:py-0 shrink-0">
             <IconChevronRight class="hidden sm:block" :size="20" stroke-width="3" />
             <IconChevronDown class="block sm:hidden" :size="20" stroke-width="3" />
           </div>
 
           <!-- Box 2: Sasaran Program -->
          <NuxtLink :to="`/${$route.params.slug}/pemantauan-kinerja/sasaran-program`" class="border border-[#34A853] bg-[#E6F4EA]/10 rounded-xl p-4 flex flex-col items-center justify-center text-center w-full sm:w-[22%] min-h-[160px] cursor-pointer hover:shadow-md transition-shadow">
            <IconChartPie :size="24" class="text-[#137333] mb-2" stroke-width="2" />
             <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sasaran Program</div>
             <div class="text-3xl font-black text-slate-800">{{ stats?.sp ?? 10 }}</div>
            <div 
              class="text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full"
              :class="!stats || (stats.capaianSp ?? 0) === 0 ? 'text-slate-400 bg-slate-100' : (stats.capaianSp ?? 0) >= 100 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'"
            >
              {{ (stats?.capaianSp ?? 0) }}% Capaian
            </div>
          </NuxtLink>
 
           <!-- Arrow 2 -->
           <div class="text-[#1A73E8] font-black py-1 sm:py-0 shrink-0">
             <IconChevronRight class="hidden sm:block" :size="20" stroke-width="3" />
             <IconChevronDown class="block sm:hidden" :size="20" stroke-width="3" />
           </div>
 
           <!-- Box 3: Sasaran Kegiatan -->
          <NuxtLink :to="`/${$route.params.slug}/pemantauan-kinerja/sasaran-kegiatan`" class="border border-[#FBBC05] bg-[#FEF7E0]/10 rounded-xl p-4 flex flex-col items-center justify-center text-center w-full sm:w-[22%] min-h-[160px] cursor-pointer hover:shadow-md transition-shadow">
            <IconLayoutGrid :size="24" class="text-[#B06000] mb-2" stroke-width="2" />
             <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sasaran Kegiatan</div>
             <div class="text-3xl font-black text-slate-800">{{ stats?.sk ?? 23 }}</div>
            <div 
              class="text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full"
              :class="!stats || (stats.capaianSk ?? 0) === 0 ? 'text-slate-400 bg-slate-100' : (stats.capaianSk ?? 0) >= 100 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'"
            >
              {{ (stats?.capaianSk ?? 0) }}% Capaian
            </div>
          </NuxtLink>
 
           <!-- Arrow 3 -->
           <div class="text-[#1A73E8] font-black py-1 sm:py-0 shrink-0">
             <IconChevronRight class="hidden sm:block" :size="20" stroke-width="3" />
             <IconChevronDown class="block sm:hidden" :size="20" stroke-width="3" />
           </div>
 
           <!-- Box 4: Indikator Kinerja Utama -->
          <div class="border border-[#A142F4] bg-[#F3E8FF]/10 rounded-xl p-4 flex flex-col items-center justify-center text-center w-full sm:w-[22%] min-h-[160px] transition-shadow">
             <IconTrendingUp :size="24" class="text-[#7C3AED] mb-2" stroke-width="2" />
             <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Indikator Kinerja</div>
            <div class="text-3xl font-black text-slate-800">{{ (stats?.capaian ?? 82) }}%</div>
            <div class="text-[10px] font-bold text-[#7C3AED] mt-2 bg-[#F3E8FF] px-2 py-0.5 rounded-full">Rerata Capaian</div>
          </div>


        </div>
      </div>

    </div>

    <!-- Table: IKU Prioritas / Perlu Perhatian -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
        <h3 class="text-base font-bold text-slate-800">IKU Prioritas / Perlu Perhatian</h3>
        <div class="relative group">
          <IconInfoCircle :size="15" class="text-slate-400 hover:text-slate-600 cursor-pointer" />
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 leading-tight">
            Daftar Indikator Kinerja Utama yang pencapaiannya belum memenuhi target (di bawah 100%).
          </div>
        </div>
      </div>

      <!-- Table Wrapper -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">No.</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">IKU</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Kerja</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Target 2026</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Realisasi</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Capaian</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Deviasi</th>
              <th class="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-36">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr 
              v-for="row in (stats?.ikuPrioritas || []).slice(0, 4)" 
              :key="row.no"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="py-3.5 px-4 text-sm font-semibold text-slate-500">{{ row.no }}</td>
              <td class="py-3.5 px-4 text-sm font-bold text-slate-800 leading-normal">{{ row.iku }}</td>
              <td class="py-3.5 px-4 text-xs font-semibold text-slate-600">{{ row.unit }}</td>
              <td class="py-3.5 px-4 text-sm font-bold text-slate-700 text-center">{{ row.target }}</td>
              <td class="py-3.5 px-4 text-sm font-bold text-slate-700 text-center">{{ row.realisasi }}</td>
              <td class="py-3.5 px-4 text-sm font-extrabold text-slate-800 text-center">{{ row.capaian }}</td>
              <td class="py-3.5 px-4 text-sm font-extrabold text-center" :class="parseFloat(row.deviasi) < 0 ? 'text-red-500' : 'text-emerald-600'">
                {{ row.deviasi }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <span 
                  class="inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border"
                  :class="row.status === 'Belum Tercapai' 
                    ? 'bg-red-50 text-red-600 border-red-100' 
                    : 'bg-amber-50 text-amber-700 border-amber-100'"
                >
                  {{ row.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Lihat Semua IKU Prioritas -->
      <div class="flex items-center justify-between mt-5 border-t border-slate-100 pt-3">
        <span class="text-xs text-slate-400 font-medium">Menampilkan 4 dari {{ stats?.ikuPrioritas?.length ?? 0 }} IKU</span>
        <button 
          @click="showIkuModal = true"
          class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider cursor-pointer"
        >
          Lihat Semua <span class="ml-0.5">&gt;</span>
        </button>
      </div>
    </div>

    <!-- Modal: Detail IKU Belum Tercapai / Perlu Perhatian -->
    <div v-if="showIkuModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden border border-slate-100 m-4 flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div class="space-y-0.5">
            <h2 class="text-base font-extrabold text-slate-800">Detail IKU Belum Tercapai / Perlu Perhatian</h2>
            <p class="text-xs text-slate-500 font-medium">Seluruh Indikator Kinerja yang pencapaiannya belum memenuhi target (di bawah 100%)</p>
          </div>
          <button @click="showIkuModal = false" class="text-slate-400 hover:text-slate-600 transition-colors text-2xl font-semibold leading-none">&times;</button>
        </div>

        <!-- Search & Sort Controls -->
        <div class="px-6 py-3 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <input
              v-model="ikuSearchQuery"
              type="text"
              placeholder="Cari nama IKU atau unit kerja..."
              class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-medium placeholder:text-slate-400"
            />
            <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
          </div>
          <div class="relative">
            <select
              v-model="ikuSortOrder"
              class="appearance-none w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all cursor-pointer"
            >
              <option value="terendah">Urutkan: Capaian Terendah</option>
              <option value="tertinggi">Urutkan: Capaian Tertinggi</option>
              <option value="abjad_iku">Urutkan: Nama IKU (A-Z)</option>
              <option value="abjad_unit">Urutkan: Unit Kerja (A-Z)</option>
            </select>
            <IconChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
          </div>
        </div>

        <!-- Summary badges -->
        <div class="px-6 py-3 border-b border-slate-100 bg-red-50/40 flex items-center gap-4 flex-wrap">
          <span class="text-xs font-semibold text-slate-600">Total ditemukan: <span class="font-extrabold text-red-600">{{ filteredIkuPrioritas.length }}</span> IKU</span>
          <span v-if="filteredIkuPrioritas.filter(r => r.status === 'Belum Tercapai').length > 0" class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold border border-red-200">
            {{ filteredIkuPrioritas.filter(r => r.status === 'Belum Tercapai').length }} Belum Tercapai
          </span>
          <span v-if="filteredIkuPrioritas.filter(r => r.status === 'Perlu Perhatian').length > 0" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold border border-amber-200">
            {{ filteredIkuPrioritas.filter(r => r.status === 'Perlu Perhatian').length }} Perlu Perhatian
          </span>
        </div>

        <!-- Scrollable Table -->
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-10">No.</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Indikator Kinerja</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Kerja</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Target</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Realisasi</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Capaian</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Deviasi</th>
                <th class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="(row, idx) in filteredIkuPrioritas"
                :key="row.no"
                class="hover:bg-slate-50/60 transition-colors"
              >
                <td class="py-3 px-4 text-sm font-semibold text-slate-400">{{ idx + 1 }}</td>
                <td class="py-3 px-4 text-sm font-bold text-slate-800 leading-snug max-w-xs">{{ row.iku }}</td>
                <td class="py-3 px-4 text-xs font-semibold text-slate-500">{{ row.unit }}</td>
                <td class="py-3 px-4 text-sm font-bold text-slate-700 text-center">{{ row.target }}</td>
                <td class="py-3 px-4 text-sm font-bold text-slate-700 text-center">{{ row.realisasi }}</td>
                <td class="py-3 px-4 text-sm font-extrabold text-center" :class="parseFloat(row.capaian) >= 70 ? 'text-amber-600' : 'text-red-600'">
                  {{ row.capaian }}
                </td>
                <td class="py-3 px-4 text-sm font-extrabold text-center" :class="parseFloat(row.deviasi) < 0 ? 'text-red-500' : 'text-emerald-600'">
                  {{ row.deviasi }}
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="inline-block px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border"
                    :class="row.status === 'Belum Tercapai' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
                  >{{ row.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredIkuPrioritas.length === 0" class="text-center py-12 text-sm text-slate-400 font-medium">
            Tidak ditemukan IKU yang cocok dengan pencarian.
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button @click="showIkuModal = false" class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all shadow-sm">Tutup</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  IconClock, IconChevronDown, IconTarget, 
  IconChartPie, IconLayoutGrid, IconTrendingUp,
  IconPercentage, IconAlertCircle,
  IconInfoCircle, IconChevronRight, IconSearch
} from '@tabler/icons-vue';

const lastUpdate = ref(new Date().toLocaleString('id-ID', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
}) + ' WIB');

// Fetch Real Data from API
const { data: stats } = useFetch<any>('/api/dashboard/stats', { lazy: true });

const sortOrder = ref('tertinggi');

const sortedCapaianUnit = computed(() => {
  const units = stats.value?.capaianUnit || [];
  return [...units].sort((a, b) => {
    return sortOrder.value === 'tertinggi' ? b.value - a.value : a.value - b.value;
  });
});

// Modal & Filter States for IKU Prioritas
const showIkuModal = ref(false);
const ikuSearchQuery = ref('');
const ikuSortOrder = ref('terendah');

const filteredIkuPrioritas = computed(() => {
  const all = stats.value?.ikuPrioritas || [];
  let result = [...all];
  if (ikuSearchQuery.value.trim()) {
    const q = ikuSearchQuery.value.toLowerCase();
    result = result.filter(r =>
      r.iku?.toLowerCase().includes(q) ||
      r.unit?.toLowerCase().includes(q)
    );
  }
  if (ikuSortOrder.value === 'terendah') {
    result.sort((a, b) => (a.capNum ?? 0) - (b.capNum ?? 0));
  } else if (ikuSortOrder.value === 'tertinggi') {
    result.sort((a, b) => (b.capNum ?? 0) - (a.capNum ?? 0));
  } else if (ikuSortOrder.value === 'abjad_iku') {
    result.sort((a, b) => a.iku?.localeCompare(b.iku, 'id', { sensitivity: 'base' }) ?? 0);
  } else if (ikuSortOrder.value === 'abjad_unit') {
    result.sort((a, b) => a.unit?.localeCompare(b.unit, 'id', { sensitivity: 'base' }) ?? 0);
  }
  return result;
});
</script>
