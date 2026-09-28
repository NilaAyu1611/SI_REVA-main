<template>
<header class="cd-main-header menu indo-new-menu w-full bg-[#1F4F85] sticky top-0 z-50" style="box-shadow: none;">
  <div class="flex items-center justify-between px-4 py-1.5">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink id="hdr_logo" class="cd-logo flex items-center shrink-0" to="/" title="SIREVA - NG">
          <img id="hdr_img_logo" alt="Logo" width="160" height="96" src="/logolanwhite.png" class="navbar-logo" />
        </NuxtLink>
        <div class="hidden sm:flex flex-col justify-center leading-tight">
          <span class="text-white font-bold text-lg tracking-wide">SIREVA - NG</span>
          <span class="font-normal text-xs" style="color: #F7D628">Sistem Informasi Perencanaan dan Evaluasi - New Generation</span>
        </div>
      </div>
      <ul class="cd-header-buttons before-login-header-comp flex items-center gap-2 ml-8" id="ul_main_menu">
        <li>
          <NuxtLink to="/" class="text-white hover:text-yellow-400 font-medium px-3 py-1">Beranda</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/visi-misi' }" class="text-white hover:text-yellow-400 font-medium px-3 py-1">Visi & Misi</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/produk-hukum' }" class="text-white hover:text-yellow-400 font-medium px-3 py-1">Produk Hukum</NuxtLink>
        </li>
        <li>
          <a href="https://ppid.lan.go.id/" target="_blank" rel="noopener" class="text-white hover:text-yellow-400 font-medium px-3 py-1">PPID</a>
        </li>
        <li>
          <button
            id="hdr_login"
            class="beforelogin-btn px-4 py-1 rounded font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            style="background-color: #F7D628; color: #1F1F1F; border: 1px solid #F7D628;"
            type="button"
            @click="showLogin = true"
          >
            <span>MASUK</span>
          </button>
        </li>


      </ul>
    </div>
    
    <!-- Language switcher - minimal text only, white bg -->
    <div class="flex justify-end px-4 py-0.5 bg-white">
      <div class="flex items-center text-xs text-gray-700 gap-0.5">
        <a id="hdr_lang_id" href="javascript:void(0);" class="font-medium text-gray-900 hover:text-black px-1.5 py-0.5 rounded-sm transition-colors active">ID</a>
        <span class="text-gray-400">|</span>
        <a id="hdr_lang_en" href="javascript:void(0);" class="text-gray-500 hover:text-gray-900 px-1.5 py-0.5 rounded-sm transition-colors">EN</a>
      </div>
    </div>
  </header>

  <LoginModal v-model="showLogin" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showLogin = ref(false)
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
