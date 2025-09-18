<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Welcome to HRMS SaaS
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Complete Human Resource Management System for modern businesses. 
          Manage employees, attendance, payroll, and more in one place.
        </p>
        
        <div class="space-x-4">
          <NuxtLink to="/login" class="btn-primary text-lg px-8 py-3">
            Get Started
          </NuxtLink>
          <NuxtLink to="/about" class="btn-secondary text-lg px-8 py-3">
            Learn More
          </NuxtLink>
        </div>
      </div>
      
      <!-- Features -->
      <div class="mt-20 grid md:grid-cols-3 gap-8">
        <div class="text-center p-6 bg-white rounded-lg shadow">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-users text-primary-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">Employee Management</h3>
          <p class="text-gray-600">Complete employee lifecycle management with onboarding, profiles, and organizational structure.</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-clock text-primary-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">Time & Attendance</h3>
          <p class="text-gray-600">Track working hours, manage shifts, handle leave requests and attendance monitoring.</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-wallet text-primary-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">Payroll Management</h3>
          <p class="text-gray-600">Automated payroll processing, salary calculations, tax management, and payslip generation.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Redirect authenticated users to appropriate dashboard
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    let redirectPath = '/dashboard'
    
    if (authStore.isSuperUser) {
      redirectPath = '/admin/dashboard'
    } else if (authStore.hasRole('tenant_admin') || authStore.user?.is_staff) {
      redirectPath = '/tenant/dashboard'
    } else {
      redirectPath = '/employee/dashboard'
    }
    
    navigateTo(redirectPath)
  }
})
</script>
