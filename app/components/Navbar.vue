<template>
<header class="cd-main-header menu indo-new-menu w-full bg-[#1F4F85] sticky top-0 z-50" style="box-shadow: none;">
  <div class="flex items-center justify-between px-4 py-1.5">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink id="hdr_logo" class="cd-logo flex items-center shrink-0" to="/" title="SIREVA - NG">
          <img id="hdr_img_logo" alt="Logo" width="160" height="96" src="/logolanwhite.png" class="navbar-logo" />
        </NuxtLink>
        <div class="hidden sm:flex flex-col justify-center leading-tight">
          <span class="text-white font-bold text-lg tracking-wide">SIREVA - NG</span>
          <span class="font-normal text-xs" style="color: #F7D628">{{ t('slogan') }}</span>
        </div>
      </div>
      <!-- Desktop Menu Links -->
      <ul class="hidden lg:flex cd-header-buttons before-login-header-comp items-center gap-2 ml-8" id="ul_main_menu">
        <li>
          <NuxtLink to="/" class="text-white hover:text-yellow-400 font-medium px-3 py-1">{{ t('home') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/visi-misi' }" class="text-white hover:text-yellow-400 font-medium px-3 py-1">{{ t('visionMission') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/produk-hukum' }" class="text-white hover:text-yellow-400 font-medium px-3 py-1">{{ t('legalProducts') }}</NuxtLink>
        </li>
        <li>
          <a href="https://ppid.lan.go.id/" target="_blank" rel="noopener" class="text-white hover:text-yellow-400 font-medium px-3 py-1">{{ t('ppid') }}</a>
        </li>
        <li>
          <button
            id="hdr_login"
            class="beforelogin-btn px-4 py-1 rounded font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            style="background-color: #F7D628; color: #1F1F1F; border: 1px solid #F7D628;"
            type="button"
            @click="showLogin = true"
          >
            <span>{{ t('login') }}</span>
          </button>
        </li>
      </ul>

      <!-- Hamburger Menu Button (visible on mobile/tablet) -->
      <button 
        class="lg:hidden text-white hover:text-yellow-400 p-2 focus:outline-none active:scale-95 transition-transform" 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        type="button"
        aria-label="Toggle menu"
      >
        <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Drawer (visible when open) -->
    <div 
      v-show="isMobileMenuOpen" 
      class="lg:hidden bg-[#1F4F85] border-t border-white/10 px-4 py-4 space-y-3"
    >
      <ul class="flex flex-col gap-2">
        <li>
          <NuxtLink to="/" class="block text-white hover:text-yellow-400 font-medium py-2 border-b border-white/5" @click="isMobileMenuOpen = false">{{ t('home') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/visi-misi' }" class="block text-white hover:text-yellow-400 font-medium py-2 border-b border-white/5" @click="isMobileMenuOpen = false">{{ t('visionMission') }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/produk-hukum' }" class="block text-white hover:text-yellow-400 font-medium py-2 border-b border-white/5" @click="isMobileMenuOpen = false">{{ t('legalProducts') }}</NuxtLink>
        </li>
        <li>
          <a href="https://ppid.lan.go.id/" target="_blank" rel="noopener" class="block text-white hover:text-yellow-400 font-medium py-2 border-b border-white/5" @click="isMobileMenuOpen = false">{{ t('ppid') }}</a>
        </li>
        <li class="pt-2">
          <button
            class="beforelogin-btn w-full py-2.5 rounded font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            style="background-color: #F7D628; color: #1F1F1F; border: 1px solid #F7D628;"
            type="button"
            @click="showLogin = true; isMobileMenuOpen = false"
          >
            {{ t('login') }}
          </button>
        </li>
      </ul>
    </div>
    
    <!-- Language switcher - minimal text only, white bg -->
    <div class="flex justify-end px-4 py-0.5 bg-white">
      <div class="flex items-center text-xs text-gray-700 gap-0.5 font-sans">
        <a 
          id="hdr_lang_id" 
          href="javascript:void(0);" 
          class="px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer"
          :class="locale === 'id' ? 'font-bold text-gray-900 active bg-gray-100' : 'text-gray-500 hover:text-gray-900'"
          @click="setLocale('id')"
        >ID</a>
        <span class="text-gray-400">|</span>
        <a 
          id="hdr_lang_en" 
          href="javascript:void(0);" 
          class="px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer"
          :class="locale === 'en' ? 'font-bold text-gray-900 active bg-gray-100' : 'text-gray-500 hover:text-gray-900'"
          @click="setLocale('en')"
        >EN</a>
      </div>
    </div>
  </header>

  <LoginModal v-model="showLogin" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'

const showLogin = ref(false)
const isMobileMenuOpen = ref(false)
const { locale, setLocale, t } = useI18n()
</script>

<style scoped>
.navbar-logo {
  display: block;
  width: 120px;
  height: 72px;
  border: none;
  border-radius: 8px;
  background: transparent;
  padding: 0;
  margin-right: 12px;
  object-fit: contain;
  box-shadow: none;
}
.beforelogin-btn {
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.beforelogin-btn:hover {
  background-color: #ffe066 !important;
  color: #1F1F1F !important;
  box-shadow: 0 2px 8px 0 #f7d62844;
  border-color: #ffe066 !important;
}
.beforelogin-btn:active {
  background-color: #f9d923 !important;
  color: #1F1F1F !important;
  box-shadow: 0 1px 4px 0 #f7d62833;
  border-color: #f9d923 !important;
}
.indo-register-btn {
  transition: background 0.2s, color 0.2s;
}
</style>
