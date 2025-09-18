<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-green-900 text-white flex flex-col">
      <!-- Logo -->
      <div class="p-4 border-b border-green-700">
        <h1 class="text-xl font-bold">Employee Portal</h1>
        <p class="text-sm text-green-300">{{ authStore.tenant?.name || 'HRMS' }}</p>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink 
              to="/employee/dashboard" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path === '/employee/dashboard' }"
            >
              <i class="pi pi-th-large mr-3"></i>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/employee/profile" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path.startsWith('/employee/profile') }"
            >
              <i class="pi pi-user mr-3"></i>
              My Profile
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/employee/attendance" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path.startsWith('/employee/attendance') }"
            >
              <i class="pi pi-clock mr-3"></i>
              My Attendance
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/employee/leave" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path.startsWith('/employee/leave') }"
            >
              <i class="pi pi-calendar-times mr-3"></i>
              Leave Management
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/employee/payslips" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path.startsWith('/employee/payslips') }"
            >
              <i class="pi pi-wallet mr-3"></i>
              Payslips
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/employee/documents" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path.startsWith('/employee/documents') }"
            >
              <i class="pi pi-file mr-3"></i>
              Documents
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/employee/directory" 
              class="flex items-center px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              :class="{ 'bg-green-700': $route.path.startsWith('/employee/directory') }"
            >
              <i class="pi pi-users mr-3"></i>
              Directory
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- Clock In/Out Widget -->
      <div class="p-4 border-t border-green-700">
        <div class="bg-green-800 p-3 rounded-lg text-center">
          <p class="text-sm text-green-200 mb-2">{{ currentDate }}</p>
          <p class="text-lg font-bold mb-3">{{ currentTime }}</p>
          
          <Button 
            v-if="!todayAttendance?.check_in"
            label="Clock In" 
            icon="pi pi-play"
            class="p-button-success p-button-sm w-full"
            @click="clockIn"
          />
          <Button 
            v-else-if="!todayAttendance?.check_out"
            label="Clock Out" 
            icon="pi pi-stop"
            class="p-button-danger p-button-sm w-full"
            @click="clockOut"
          />
          <div v-else class="text-center">
            <Badge value="Day Complete" severity="success" />
            <p class="text-xs text-green-200 mt-1">{{ todayHours }} hours worked</p>
          </div>
        </div>
      </div>
      
      <!-- User Menu -->
      <div class="p-4 border-t border-green-700">
        <div class="flex items-center space-x-3">
          <Avatar 
            :label="authStore.userInitials" 
            size="normal" 
            shape="circle" 
            class="bg-green-500"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ authStore.userFullName }}</p>
            <p class="text-xs text-green-300">Employee</p>
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
              :badge="notificationCount > 0 ? notificationCount.toString() : undefined"
              badgeClass="p-badge-danger"
              v-tooltip.bottom="'Notifications'"
              @click="showNotifications = true"
            />
            
            <!-- Quick Clock In/Out -->
            <div v-if="!todayAttendance?.check_out" class="flex items-center space-x-2">
              <Button 
                v-if="!todayAttendance?.check_in"
                label="Clock In" 
                icon="pi pi-play"
                class="p-button-success p-button-sm"
                @click="clockIn"
              />
              <Button 
                v-else
                label="Clock Out" 
                icon="pi pi-stop"
                class="p-button-danger p-button-sm"
                @click="clockOut"
              />
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="flex-1 p-6 bg-gray-50 overflow-auto">
        <slot />
      </main>
    </div>
    
    <!-- Notifications Sidebar -->
    <Sidebar 
      v-model:visible="showNotifications" 
      header="Notifications"
      position="right"
      class="w-80"
    >
      <div class="space-y-4">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="p-3 border border-gray-200 rounded-lg"
        >
          <div class="flex items-start space-x-3">
            <i :class="getNotificationIcon(notification.type)" class="text-blue-500 mt-1"></i>
            <div class="flex-1">
              <p class="font-medium text-sm">{{ notification.title }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ formatTimeAgo(notification.created_at) }}</p>
            </div>
          </div>
        </div>
        <div v-if="notifications.length === 0" class="text-center py-8 text-gray-500">
          <i class="pi pi-bell text-4xl mb-4"></i>
          <p>No notifications</p>
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const toast = useToast()
const route = useRoute()
const { $api } = useNuxtApp()

// Reactive data
const currentTime = ref(new Date().toLocaleTimeString())
const todayAttendance = ref<any>(null)
const notifications = ref<any[]>([])
const showNotifications = ref(false)

// Computed
const currentDate = computed(() => new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  month: 'long', 
  day: 'numeric' 
}))

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

const todayHours = computed(() => {
  if (!todayAttendance.value?.total_hours) return '0.00'
  return todayAttendance.value.total_hours.toFixed(2)
})

const notificationCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

// Methods
const fetchTodayAttendance = async () => {
  try {
    const response = await $api('/api/v1/employee/attendance/today/')
    todayAttendance.value = response.attendance
  } catch (error) {
    console.error('Failed to fetch today attendance:', error)
  }
}

const fetchNotifications = async () => {
  try {
    const response = await $api('/api/v1/employee/notifications/')
    notifications.value = response.results || []
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

const clockIn = async () => {
  try {
    const response = await $api('/api/v1/employee/attendance/clock-in/', {
      method: 'POST'
    })
    
    todayAttendance.value = response
    
    toast.add({
      severity: 'success',
      summary: 'Clocked In',
      detail: `Welcome! You clocked in at ${formatTime(response.check_in)}`,
      life: 3000
    })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Clock In Failed',
      detail: error.message || 'Failed to clock in',
      life: 3000
    })
  }
}

const clockOut = async () => {
  try {
    const response = await $api('/api/v1/employee/attendance/clock-out/', {
      method: 'POST'
    })
    
    todayAttendance.value = response
    
    toast.add({
      severity: 'success',
      summary: 'Clocked Out',
      detail: `Good job! You worked ${response.total_hours.toFixed(2)} hours today`,
      life: 5000
    })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Clock Out Failed',
      detail: error.message || 'Failed to clock out',
      life: 3000
    })
  }
}

const handleLogout = () => {
  authStore.logout()
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'attendance': return 'pi pi-clock'
    case 'leave': return 'pi pi-calendar-times'
    case 'payroll': return 'pi pi-wallet'
    case 'announcement': return 'pi pi-megaphone'
    default: return 'pi pi-info-circle'
  }
}

const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Time update interval
let timeInterval: NodeJS.Timeout

onMounted(() => {
  fetchTodayAttendance()
  fetchNotifications()
  
  // Update time every second
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Middleware check
definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.router-link-exact-active {
  @apply bg-green-700;
}
</style>
