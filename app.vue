<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Global components -->
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
// Initialize auth store on app start
const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>
