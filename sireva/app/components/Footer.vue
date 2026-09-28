<template>
  <footer id="contact-us" class="bg-[#1F4F85] text-gray-100 pt-8 pb-4 mt-8">
    <div class="container mx-auto px-4">
      <div class="footer-content">
        <div class="flex flex-col md:flex-row md:space-x-8">
          <!-- Left: Logo/Image -->
          <div class="md:w-1/2 w-full flex justify-center md:justify-start mb-6 md:mb-0">
            <img src="/LANRI-ORG.png" width="300" alt="Logo" style="margin-left: 32px;" />
          </div>
          <!-- Right: Info & Social -->
          <div class="md:w-1/2 w-full flex flex-col justify-center">
            <h2 class="text-2xl font-bold mb-2">Tentang <em class="not-italic" style="color: #F7D628">Sireva</em></h2>
            <p class="mb-4">Sireva merupakan Sistem Informasi Laporan Akuntabilitas Kinerja Instansi Pemerintah Online Lembaga Administrasi Negara</p>
            <ul class="flex space-x-4 text-xl">
              <li>
                <a href="https://www.facebook.com/HumasLANRI" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <IconBrandFacebook :size="22" stroke="1.8" />
                </a>
              </li>
              <li>
                <a href="https://x.com/lan_ri" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <IconBrandX :size="22" stroke="1.8" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/humas_lan/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <IconBrandInstagram :size="22" stroke="1.8" />
                </a>
              </li>
              <li>
                <a href="https://lan.go.id" target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <IconWorld :size="22" stroke="1.8" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-8 border-t border-white pt-4 text-center">
        <p class="text-sm">Copyright © 2026 Lembaga Administrasi Negara
          <!--| Designed by <a rel="nofollow" href="https://templatemo.com">TemplateMo</a> -->
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconWorld } from '@tabler/icons-vue'
</script>

<style scoped>
.footer-content em {
  font-style: normal;
  color: #facc15;
}
</style>
