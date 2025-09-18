<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-900 text-white flex flex-col">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-xl font-bold">HRMS Admin</h1>
        <p class="text-sm text-gray-400">System Administration</p>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink 
              to="/admin/dashboard" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700': $route.path === '/admin/dashboard' }"
            >
              <i class="pi pi-th-large mr-3"></i>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/tenants" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700': $route.path.startsWith('/admin/tenants') }"
            >
              <i class="pi pi-building mr-3"></i>
              Tenants
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/users" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700': $route.path.startsWith('/admin/users') }"
            >
              <i class="pi pi-users mr-3"></i>
              Users
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/subscriptions" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700': $route.path.startsWith('/admin/subscriptions') }"
            >
              <i class="pi pi-credit-card mr-3"></i>
              Subscriptions
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/reports" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700': $route.path.startsWith('/admin/reports') }"
            >
              <i class="pi pi-chart-line mr-3"></i>
              Reports
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/admin/settings" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700': $route.path.startsWith('/admin/settings') }"
            >
              <i class="pi pi-cog mr-3"></i>
              Settings
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- User Menu -->
      <div class="p-4 border-t border-gray-700">
        <div class="flex items-center space-x-3">
          <Avatar 
            :label="authStore.userInitials" 
            size="normal" 
            shape="circle" 
            class="bg-blue-500"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ authStore.userFullName }}</p>
            <p class="text-xs text-gray-400">Super Admin</p>
          </div>
          <Button 
            icon="pi pi-sign-out" 
            class="p-button-text p-button-sm" 
            @click="handleLogout"
            v-tooltip.top="'Logout'"
          />
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
            <Breadcrumb :model="breadcrumbItems" class="mt-1" />
          </div>
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <Button 
              icon="pi pi-bell" 
              class="p-button-text p-button-rounded" 
              badge="3" 
              badgeClass="p-badge-danger"
              v-tooltip.bottom="'Notifications'"
            />
            
            <!-- Quick Actions -->
            <SplitButton 
              label="Quick Actions" 
              icon="pi pi-plus" 
              :model="quickActions"
              class="p-button-sm"
            />
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="flex-1 p-6 bg-gray-50 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length >= 2) {
    return pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1)
  }
  return 'Dashboard'
})

const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = []
  
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    const path = '/' + pathSegments.slice(0, i + 1).join('/')
    
    items.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      to: path
    })
  }
  
  return items
})

const quickActions = [
  {
    label: 'Create Tenant',
    icon: 'pi pi-building',
    command: () => router.push('/admin/tenants/create')
  },
  {
    label: 'Add User',
    icon: 'pi pi-user-plus',
    command: () => router.push('/admin/users/create')
  },
  {
    label: 'System Settings',
    icon: 'pi pi-cog',
    command: () => router.push('/admin/settings')
  }
]

const handleLogout = () => {
  authStore.logout()
}

// Middleware check
definePageMeta({
  middleware: 'admin-only'
})
</script>

<style scoped>
.router-link-exact-active {
  @apply bg-gray-700;
}
</style>
