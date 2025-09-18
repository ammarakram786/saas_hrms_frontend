<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-indigo-900 text-white flex flex-col">
      <!-- Logo -->
      <div class="p-4 border-b border-indigo-700">
        <h1 class="text-xl font-bold">{{ tenantName }}</h1>
        <p class="text-sm text-indigo-300">{{ planName }} Plan</p>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink 
              to="/tenant/dashboard" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path === '/tenant/dashboard' }"
            >
              <i class="pi pi-th-large mr-3"></i>
              Dashboard
            </NuxtLink>
          </li>
          <li v-if="canManageUsers">
            <NuxtLink 
              to="/tenant/users" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/users') }"
            >
              <i class="pi pi-users mr-3"></i>
              Users
            </NuxtLink>
          </li>
          <li v-if="canManageEmployees">
            <NuxtLink 
              to="/tenant/employees" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/employees') }"
            >
              <i class="pi pi-id-card mr-3"></i>
              Employees
            </NuxtLink>
          </li>
          <li v-if="canViewAttendance">
            <NuxtLink 
              to="/tenant/attendance" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/attendance') }"
            >
              <i class="pi pi-clock mr-3"></i>
              Attendance
            </NuxtLink>
          </li>
          <li v-if="canViewPayroll">
            <NuxtLink 
              to="/tenant/payroll" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/payroll') }"
            >
              <i class="pi pi-wallet mr-3"></i>
              Payroll
            </NuxtLink>
          </li>
          <li v-if="canViewReports">
            <NuxtLink 
              to="/tenant/reports" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/reports') }"
            >
              <i class="pi pi-chart-line mr-3"></i>
              Reports
            </NuxtLink>
          </li>
          <li v-if="canManageRoles">
            <NuxtLink 
              to="/tenant/roles" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/roles') }"
            >
              <i class="pi pi-shield mr-3"></i>
              Roles & Permissions
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/tenant/settings" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              :class="{ 'bg-indigo-700': $route.path.startsWith('/tenant/settings') }"
            >
              <i class="pi pi-cog mr-3"></i>
              Settings
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- Usage Stats -->
      <div class="p-4 border-t border-indigo-700" v-if="authStore.tenant">
        <div class="text-xs text-indigo-300 mb-2">Usage</div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Users</span>
            <span>{{ authStore.tenant.current_user_count }}/{{ authStore.tenant.max_users }}</span>
          </div>
          <ProgressBar 
            :value="userUsagePercentage" 
            :showValue="false" 
            class="h-1"
            :class="userUsagePercentage > 80 ? 'p-progressbar-danger' : 'p-progressbar-success'"
          />
          <div class="flex justify-between text-sm">
            <span>Employees</span>
            <span>{{ authStore.tenant.current_employee_count }}/{{ authStore.tenant.max_employees }}</span>
          </div>
          <ProgressBar 
            :value="employeeUsagePercentage" 
            :showValue="false" 
            class="h-1"
            :class="employeeUsagePercentage > 80 ? 'p-progressbar-danger' : 'p-progressbar-success'"
          />
        </div>
      </div>
      
      <!-- User Menu -->
      <div class="p-4 border-t border-indigo-700">
        <div class="flex items-center space-x-3">
          <Avatar 
            :label="authStore.userInitials" 
            size="normal" 
            shape="circle" 
            class="bg-indigo-500"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ authStore.userFullName }}</p>
            <p class="text-xs text-indigo-300">Tenant Admin</p>
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
            <!-- Usage Warning -->
            <div v-if="showUsageWarning" class="flex items-center text-orange-600">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              <span class="text-sm">Approaching usage limits</span>
            </div>
            
            <!-- Notifications -->
            <Button 
              icon="pi pi-bell" 
              class="p-button-text p-button-rounded" 
              :badge="notificationCount > 0 ? notificationCount.toString() : undefined"
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

const tenantName = computed(() => authStore.tenant?.name || 'Organization')
const planName = computed(() => authStore.tenant?.plan?.charAt(0).toUpperCase() + authStore.tenant?.plan?.slice(1) || 'Free')

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

// Permission checks
const canManageUsers = computed(() => authStore.hasPermission('user.manage'))
const canManageEmployees = computed(() => authStore.hasPermission('employee.create'))
const canViewAttendance = computed(() => authStore.hasPermission('attendance.view'))
const canViewPayroll = computed(() => authStore.hasPermission('payroll.view'))
const canViewReports = computed(() => authStore.hasPermission('reports.view'))
const canManageRoles = computed(() => authStore.hasPermission('role.manage'))

// Usage calculations
const userUsagePercentage = computed(() => {
  if (!authStore.tenant || authStore.tenant.max_users === -1) return 0
  return Math.round((authStore.tenant.current_user_count / authStore.tenant.max_users) * 100)
})

const employeeUsagePercentage = computed(() => {
  if (!authStore.tenant || authStore.tenant.max_employees === -1) return 0
  return Math.round((authStore.tenant.current_employee_count / authStore.tenant.max_employees) * 100)
})

const showUsageWarning = computed(() => {
  return userUsagePercentage.value > 80 || employeeUsagePercentage.value > 80
})

const notificationCount = computed(() => {
  // TODO: Implement real notification count
  return showUsageWarning.value ? 1 : 0
})

const quickActions = computed(() => {
  const actions = []
  
  if (canManageUsers.value) {
    actions.push({
      label: 'Add User',
      icon: 'pi pi-user-plus',
      command: () => router.push('/tenant/users/create')
    })
  }
  
  if (canManageEmployees.value) {
    actions.push({
      label: 'Add Employee',
      icon: 'pi pi-id-card',
      command: () => router.push('/tenant/employees/create')
    })
  }
  
  if (canViewPayroll.value) {
    actions.push({
      label: 'Run Payroll',
      icon: 'pi pi-wallet',
      command: () => router.push('/tenant/payroll/run')
    })
  }
  
  return actions
})

const handleLogout = () => {
  authStore.logout()
}

// Middleware check
definePageMeta({
  middleware: 'tenant-admin'
})
</script>

<style scoped>
.router-link-exact-active {
  @apply bg-indigo-700;
}
</style>
