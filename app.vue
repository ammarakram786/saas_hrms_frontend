<script setup>
import Toast from 'primevue/toast'
</script>

<template>
  <div>
    <Toast :base-z-index="999" />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
