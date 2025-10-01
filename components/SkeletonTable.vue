<template>
  <div class="skeleton-table">
    <!-- Table header -->
    <div class="flex border-bottom-1 border-200 pb-3 mb-3">
      <PSkeleton v-for="i in columns" :key="i" class="mr-4" width="120px" height="1rem" />
    </div>

    <!-- Table rows -->
    <div v-for="row in rows" :key="row" class="flex py-3 border-bottom-1 border-100">
      <PSkeleton v-for="i in columns" :key="i" class="mr-4" width="120px" height="1rem" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  columns?: number
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 4,
  rows: 5
})
</script>

<style scoped>
.skeleton-table {
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
