<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and navigation -->
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center">
              <h1 class="text-xl font-bold text-primary-600">HRMS SaaS</h1>
            </NuxtLink>
            
            <!-- Main navigation -->
            <div v-if="authStore.isAuthenticated" class="hidden md:flex ml-10 space-x-8">
              <NuxtLink 
                to="/dashboard" 
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary-600 bg-primary-50"
              >
                Dashboard
              </NuxtLink>
              
              <NuxtLink 
                v-can="'employee.view'"
                to="/employees" 
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary-600 bg-primary-50"
              >
                Employees
              </NuxtLink>
              
              <NuxtLink 
                v-can="'attendance.view'"
                to="/attendance" 
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary-600 bg-primary-50"
              >
                Attendance
              </NuxtLink>
              
              <NuxtLink 
                v-can="'payroll.view'"
                to="/payroll" 
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary-600 bg-primary-50"
              >
                Payroll
              </NuxtLink>
            </div>
          </div>
          
          <!-- User menu -->
          <div v-if="authStore.isAuthenticated" class="flex items-center">
            <!-- Tenant info -->
            <div v-if="authStore.tenant" class="hidden md:flex items-center mr-4 text-sm text-gray-500">
              <span>{{ authStore.tenant.name }}</span>
            </div>
            
            <!-- User avatar and menu -->
            <div class="relative">
              <PButton 
                type="button"
                class="flex items-center text-sm rounded-full focus:outline-none"
                @click="toggleUserMenu"
              >
                <PAvatar 
                  :label="authStore.userInitials" 
                  size="normal" 
                  shape="circle"
                  class="bg-primary-600 text-white"
                />
              </PButton>
              
              <!-- User menu dropdown -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
              >
                <NuxtLink 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Profile
                </NuxtLink>
                
                <NuxtLink 
                  v-can="'tenant.settings.update'"
                  to="/settings" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Settings
                </NuxtLink>
                
                <div class="border-t border-gray-100"></div>
                
                <button 
                  @click="logout" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          <!-- Login button for guests -->
          <div v-else class="flex items-center">
            <NuxtLink 
              to="/login" 
              class="btn-primary"
            >
              Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  showUserMenu.value = false
  authStore.logout()
}

// Close user menu when clicking outside
const closeUserMenu = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>
