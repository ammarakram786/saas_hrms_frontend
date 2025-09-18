<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome back, {{ authStore.userFullName }}!
      </h1>
      <p class="text-gray-600 mt-1">
        Here's what's happening in your organization today.
      </p>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Employees</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalEmployees }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="pi pi-users text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Present Today</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.presentToday }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <i class="pi pi-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">On Leave</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.onLeave }}</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-full">
            <i class="pi pi-calendar text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pending Requests</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingRequests }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="pi pi-clock text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Activities -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <i :class="['pi', activity.icon, 'text-gray-400']"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <NuxtLink to="/audit" class="text-sm text-primary-600 hover:text-primary-500">
            View all activities →
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink 
            v-can="'employee.create'"
            to="/employees/new" 
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-user-plus text-primary-600 text-xl block mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Add Employee</span>
          </NuxtLink>
          
          <button 
            v-can="'attendance.view'"
            @click="clockIn"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <i class="pi pi-clock text-green-600 text-xl block mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Clock In/Out</span>
          </button>
          
          <NuxtLink 
            v-can="'leave.request'"
            to="/leave/request" 
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-calendar text-orange-600 text-xl block mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Request Leave</span>
          </NuxtLink>
          
          <NuxtLink 
            v-can="'payroll.view'"
            to="/payroll" 
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-wallet text-purple-600 text-xl block mb-2"></i>
            <span class="text-sm font-medium text-gray-900">View Payroll</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()

// Mock data - replace with real API calls
const stats = ref({
  totalEmployees: 125,
  presentToday: 108,
  onLeave: 12,
  pendingRequests: 5
})

const recentActivities = ref([
  {
    id: 1,
    icon: 'pi-user-plus',
    description: 'New employee John Doe was added',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: 'pi-check',
    description: 'Leave request by Jane Smith was approved',
    time: '4 hours ago'
  },
  {
    id: 3,
    icon: 'pi-clock',
    description: 'Payroll for October was processed',
    time: '1 day ago'
  },
  {
    id: 4,
    icon: 'pi-calendar',
    description: 'Holiday "Diwali" was added for Nov 12',
    time: '2 days ago'
  }
])

const clockIn = () => {
  // Mock clock in functionality
  toast.add({
    severity: 'success',
    summary: 'Clock In Successful',
    detail: 'You have been clocked in at ' + new Date().toLocaleTimeString(),
    life: 3000
  })
}

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    // TODO: Implement real API calls
    // const response = await $api('/api/v1/dashboard/stats/')
    // stats.value = response
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
