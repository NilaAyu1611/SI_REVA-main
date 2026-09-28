<template>
  <div class="bg-white flex overflow-hidden" style="height: 100vh;">
    <!-- Backdrop overlay for mobile -->
    <div 
      v-if="sidebarOpen && isMobile" 
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar di kiri fixed -->
    <Sidebar
      :open="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
      class="shrink-0 border-r-2 border-white/50 bg-blue-900/95 backdrop-blur-xl transition-all duration-300 z-50"
      :class="[
        isMobile ? 'fixed inset-y-0 left-0' : 'relative',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'
      ]"
      :style="{ 
        boxShadow: sidebarOpen ? '4px 0 20px 0 rgba(0,0,0,0.08)' : 'none',
        width: sidebarOpen ? '280px' : '0px',
        overflow: 'hidden'
      }"
    />
    
    <!-- Content area -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Header fixed top -->
      <Header
        @toggle-sidebar="toggleSidebar"
        class="h-20 shrink-0 border-b-2 border-white/30 shadow-lg"
        style="z-index: 40; background-color: #1F4F85;"
      />
      <!-- Topbar di bawah Header -->
      <Topbar class="shrink-0" />
      
      <!-- Main content scrollable -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-8 pb-20 bg-white custom-content-scroll">
        <Breadcrumb class="mb-6" />
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.custom-content-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.custom-content-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-content-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-content-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>

<script setup lang="ts">
// Layout dashboard: Sidebar kiri + Header atas konten
// tanpa Navbar/Footer
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import Topbar from '~/components/Topbar.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';

const sidebarOpen = ref(true)
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

