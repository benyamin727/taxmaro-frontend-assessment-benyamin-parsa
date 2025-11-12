<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- global toast renderer -->
  <ToastHost />
</template>
<script setup lang="ts">
import ToastHost from "./components/ui/ToastHost.vue";
</script>
