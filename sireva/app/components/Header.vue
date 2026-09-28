<template>
  <header class="h-18 border-b border-blue-800 flex items-center px-8 justify-between shadow-sm" style="background-color: #1F4F85;">
    <!-- Left: Hamburger + Filters -->
    <div class="flex items-center gap-4 flex-1">
      <button
        class="mr-2 p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        aria-label="Toggle sidebar"
        @click="$emit('toggle-sidebar')"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect y="5" width="24" height="2.5" rx="1.25" fill="#ffffff" />
          <rect y="11" width="24" height="2.5" rx="1.25" fill="#ffffff" />
          <rect y="17" width="24" height="2.5" rx="1.25" fill="#ffffff" />
        </svg>
      </button>

      <!-- Filter Tahun removed -->
    </div>

    <div class="flex-1" />

    <!-- Right: Notif & User -->
    <div class="flex items-center gap-3 min-w-55 justify-end">
      <button class="relative p-2 rounded-full hover:bg-blue-800 transition-colors mr-2">
        <!-- Heroicons Bell -->
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#ffffff" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.243A2 2 0 0 1 12 19a2 2 0 0 1-2.857-1.757M6.5 8.75V8a5.5 5.5 0 1 1 11 0v.75c0 2.086.522 4.13 1.5 5.75H5c.978-1.62 1.5-3.664 1.5-5.75z" />
        </svg>
      </button>
      <button class="relative p-2 rounded-full hover:bg-blue-800 transition-colors mr-2">
        <component :is="iconMap.IconMail" :size="20" :stroke="'2'" class="text-white" />
      </button>

      <div class="relative" ref="dropdownRef">
        <button 
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-3 hover:bg-blue-800/50 p-1.5 pr-2 rounded-xl transition-all outline-none"
        >
          <div class="text-right hidden sm:block">
            <div class="text-sm font-bold text-white leading-tight">{{ user?.username || '-' }}</div>
            <div class="text-xs text-blue-200 font-medium">{{ user?.unit || '-' }}</div>
          </div>
          <component :is="iconMap.IconChevronDown" :size="16" :stroke="'2'" :class="['text-blue-200 transition-transform duration-200', isDropdownOpen ? 'rotate-180' : '']" />
        </button>

        <!-- Dropdown Menu -->
        <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 pt-0 pb-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <!-- User Info Header -->
          <div class="px-6 py-5 flex items-center gap-4 rounded-t-2xl" style="background-color: #1F4F85;">
            <div class="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-base shadow border border-emerald-400/40 shrink-0">
              {{ user?.username ? user.username.slice(0, 2).toUpperCase() : '--' }}
            </div>
            <div class="min-w-0">
              <div class="text-sm font-bold text-white leading-tight truncate">{{ user?.username || '-' }}</div>
              <div class="text-xs text-blue-200 font-medium truncate">{{ user?.unit || '-' }}</div>
            </div>
          </div>
          <div class="p-2 flex flex-col gap-1">
            <NuxtLink
              to="/ubah-password"
              class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
              @click="isDropdownOpen = false"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 17v1m-6 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2Zm6-7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M7 9V7a5 5 0 0 1 10 0v2"/></svg>
              Ubah Password
            </NuxtLink>
            <NuxtLink 
              to="/login" 
              class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              @click="handleLogout"
            >
              <component :is="iconMap.IconLogout" :size="18" :stroke="'2'" />
              Logout 
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthUser } from '@/composables/useAuthUser';
import {
  IconChevronDown,
  IconLogout,
  IconCalendar,
  IconCalendarStats,
  IconMail
} from '@tabler/icons-vue';

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const { authUser, clearAuthUser } = useAuthUser();

const user = computed(() => ({
  username: authUser.value?.username || authUser.value?.alias || 'User',
  unit: authUser.value?.unit_kerja || 'Unit Kerja',
}));

const iconMap = {
  IconChevronDown,
  IconLogout,
  IconCalendar,
  IconCalendarStats,
  IconMail
};

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !(dropdownRef.value as HTMLElement).contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
}

function handleLogout() {
  clearAuthUser();
  isDropdownOpen.value = false;
  navigateTo('/');
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
