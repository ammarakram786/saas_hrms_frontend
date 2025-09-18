<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Global components -->
    <PToast />
    <PConfirmDialog />
  </div>
</template>

<script setup lang="ts">
// Initialize auth store on app start
const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>
