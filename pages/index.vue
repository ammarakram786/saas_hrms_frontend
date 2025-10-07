<script setup>
// Page metadata for additional protection
definePageMeta({
  middleware: 'auth',
  layout: 'default',
})
</script>

<template>
  <div class="card" />
  <h2>Welcome to HRMS Dashboard</h2>
  <div class="flex items-center gap-4">
    <!-- <span class="text-lg">Hello, {{ userFullName || 'User' }}!</span> -->
  </div>
</template>
