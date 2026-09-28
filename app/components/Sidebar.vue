<template>
  <transition name="fade">
    <aside
      v-show="open"
      class="shrink-0 border-r-2 border-white/50" style="background-color: #1F4F85; backdrop-filter: blur(12px); transition: all 0.3s; z-index: 50;"
      aria-hidden="false"
    >
      <div class="w-64 h-full flex flex-col py-6 px-4">
      <!-- Branding -->
      <div class="flex flex-col items-center mb-8 shrink-0">
        <img src="/logolanwhite.png" alt="Logo LAN RI" width="120" height="120" class="object-contain mb-3" />
        <div class="text-[15px] text-yellow-400 font-bold mt-1 tracking-widest px-2.5 py-0.5 rounded-full border border-yellow-400/20">SI-REVA</div>
      </div>

      <!-- Navigation -->
      <div class="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        <div class="text-[10px] text-blue-300/60 font-bold mb-3 px-2 tracking-widest uppercase shrink-0">{{ menuTitle }}</div>
        <nav class="flex flex-col gap-1.5 pb-4">
          <template v-for="item in menuItems" :key="item.label">
            <SidebarMenuItem :item="item" :iconMap="iconMap" :activePath="activePath" />
          </template>
        </nav>
      </div>

      <!-- Logout -->
      <div class="mt-8 shrink-0 pt-4 border-t border-white/5">
        <NuxtLink to="/" @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all duration-200 group">
          <IconLogout :size="18" :stroke="'2'" class="transition-transform group-hover:-translate-x-1" />
          Logout
        </NuxtLink>
      </div>
    </div>
  </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { navigateTo } from '#app';
import { useSidebarMenu } from '@/composables/useSidebarMenu';
import { useRoute } from 'vue-router';

import {
  IconDashboard,
  IconClipboardList,
  IconChartBar,
  IconChevronDown,
  IconChecklist,
  IconFileText,
  IconFlag,
  IconTargetArrow,
  IconFocus2,
  IconListDetails,
  IconActivity,
  IconSitemap,
  IconDatabase,
  IconUser,
  IconLogout,
  IconReport,
  IconSettings
} from '@tabler/icons-vue';

const iconMap = {
  IconDashboard,
  IconClipboardList,
  IconChartBar,
  IconChevronDown,
  IconChecklist,
  IconFileText,
  IconFlag,
  IconTargetArrow,
  IconFocus2,
  IconListDetails,
  IconActivity,
  IconSitemap,
  IconDatabase,
  IconUser,
  IconLogout,
  IconReport,
  IconSettings
};


const props = defineProps({
  open: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['close-sidebar']);

const { menuItems, menuTitle } = useSidebarMenu();
const route = useRoute();
const activePath = computed(() => route.path);

import SidebarMenuItem from './SidebarMenuItem.vue';
import { useAuthUser } from '@/composables/useAuthUser';

const { clearAuthUser } = useAuthUser();

function handleLogout() {
  clearAuthUser();
  navigateTo('/');
}
</script>

<style scoped>
/* Hide scrollbar but keep scroll functionality */
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.custom-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
