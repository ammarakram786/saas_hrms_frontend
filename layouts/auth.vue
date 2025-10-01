<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Auth layout for login/register pages
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>