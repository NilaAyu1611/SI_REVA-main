<template>
  <div class="min-h-screen flex flex-col bg-white font-sans">

    <Navbar />
    <main class="flex-1 px-4 sm:px-6 lg:px-8 py-4">
      <Breadcrumb />
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">

import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
</script>