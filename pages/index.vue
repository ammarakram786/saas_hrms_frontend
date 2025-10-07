<script setup>
// Page metadata for additional protection
definePageMeta({
  middleware: 'auth',
  layout: false
})

// Auth is handled by global middleware, just use composables for data
const { user, userFullName, isSuperUser, permissions, logout } = useAuth()

const onThrow = () => {
  throw createError({ statusCode: 500, statusMessage: 'This is a test error', fatal: true })
}

const handleLogout = () => {
  logout()
}
</script>

<template>
  <div class="card">
    </div>
      <h2>Welcome to HRMS Dashboard</h2>
      <div class="flex items-center gap-4">
        <span class="text-lg">Hello, {{ userFullName || 'User' }}!</span>
     
        
    </div>
  
</template>
