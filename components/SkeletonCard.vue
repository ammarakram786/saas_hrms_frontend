<template>
  <PCard class="skeleton-card">
    <template #content>
      <div class="flex align-items-center justify-content-between">
        <div class="flex-1">
          <PSkeleton class="mb-3" width="60%" height="1rem" />
          <PSkeleton width="40%" height="2rem" />
        </div>
        <PSkeleton size="2.5rem" shape="circle" />
      </div>
      <div class="mt-3">
        <PSkeleton width="30%" height="0.75rem" />
        <PSkeleton class="mt-1" width="50%" height="0.75rem" />
      </div>
    </template>
  </PCard>
</template>

<script setup lang="ts">
// This component provides a skeleton loading state for cards
// It matches the structure of stat cards in the dashboard
</script>

<style scoped>
.skeleton-card {
  height: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
