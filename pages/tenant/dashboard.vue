<template>
  <div>
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Welcome back, {{ authStore.userFullName }}!</h1>
          <p class="text-indigo-100 mt-1">{{ tenantName }} - {{ planName }} Plan</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-indigo-100">{{ currentDate }}</p>
          <p class="text-lg font-semibold">{{ currentTime }}</p>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="bg-blue-50 border-blue-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Total Users</p>
              <p class="text-3xl font-bold text-blue-900">{{ stats.totalUsers }}</p>
              <p class="text-xs text-blue-500 mt-1">{{ userUsagePercentage }}% of limit</p>
            </div>
            <div class="bg-blue-500 p-3 rounded-full">
              <i class="pi pi-users text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="bg-green-50 border-green-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">Active Employees</p>
              <p class="text-3xl font-bold text-green-900">{{ stats.activeEmployees }}</p>
              <p class="text-xs text-green-500 mt-1">{{ employeeUsagePercentage }}% of limit</p>
            </div>
            <div class="bg-green-500 p-3 rounded-full">
              <i class="pi pi-id-card text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="bg-purple-50 border-purple-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">Present Today</p>
              <p class="text-3xl font-bold text-purple-900">{{ stats.presentToday }}</p>
              <p class="text-xs text-purple-500 mt-1">{{ attendanceRate }}% attendance</p>
            </div>
            <div class="bg-purple-500 p-3 rounded-full">
              <i class="pi pi-clock text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="bg-orange-50 border-orange-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">Pending Leaves</p>
              <p class="text-3xl font-bold text-orange-900">{{ stats.pendingLeaves }}</p>
              <p class="text-xs text-orange-500 mt-1">Require approval</p>
            </div>
            <div class="bg-orange-500 p-3 rounded-full">
              <i class="pi pi-calendar text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Usage Warnings -->
    <div v-if="showUsageWarnings" class="mb-6">
      <Message 
        v-if="userUsagePercentage > 80" 
        severity="warn" 
        class="mb-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <strong>User Limit Warning:</strong> You're using {{ userUsagePercentage }}% of your user limit ({{ stats.totalUsers }}/{{ authStore.tenant?.max_users }}).
          </div>
          <Button 
            label="Upgrade Plan" 
            class="p-button-sm p-button-warning" 
            @click="$router.push('/tenant/settings/subscription')"
          />
        </div>
      </Message>
      
      <Message 
        v-if="employeeUsagePercentage > 80" 
        severity="warn"
      >
        <div class="flex items-center justify-between">
          <div>
            <strong>Employee Limit Warning:</strong> You're using {{ employeeUsagePercentage }}% of your employee limit ({{ stats.activeEmployees }}/{{ authStore.tenant?.max_employees }}).
          </div>
          <Button 
            label="Upgrade Plan" 
            class="p-button-sm p-button-warning" 
            @click="$router.push('/tenant/settings/subscription')"
          />
        </div>
      </Message>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Activities -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Recent Activities</h3>
            <Button 
              label="View All" 
              class="p-button-text p-button-sm" 
              @click="$router.push('/tenant/audit')"
            />
          </div>
        </template>
        <template #content>
          <Timeline :value="recentActivities" class="w-full">
            <template #marker="slotProps">
              <span 
                class="flex w-6 h-6 items-center justify-center text-white rounded-full z-10 shadow"
                :class="getActivityColor(slotProps.item.type)"
              >
                <i :class="getActivityIcon(slotProps.item.type)" class="text-xs"></i>
              </span>
            </template>
            <template #content="slotProps">
              <div class="ml-4">
                <p class="font-medium text-sm">{{ slotProps.item.title }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ slotProps.item.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTimeAgo(slotProps.item.created_at) }}</p>
              </div>
            </template>
          </Timeline>
        </template>
      </Card>
      
      <!-- Attendance Overview -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Attendance Overview</h3>
            <Button 
              label="View Details" 
              class="p-button-text p-button-sm" 
              @click="$router.push('/tenant/attendance')"
            />
          </div>
        </template>
        <template #content>
          <Chart 
            type="line" 
            :data="attendanceChartData" 
            :options="attendanceChartOptions"
            class="w-full h-64"
          />
        </template>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pending Actions -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Pending Actions</h3>
            <Badge :value="pendingActions.length" severity="warning" />
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="action in pendingActions" 
              :key="action.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              @click="handlePendingAction(action)"
            >
              <div class="flex items-center space-x-3">
                <i :class="action.icon" class="text-orange-500"></i>
                <div>
                  <p class="text-sm font-medium">{{ action.title }}</p>
                  <p class="text-xs text-gray-500">{{ action.description }}</p>
                </div>
              </div>
              <i class="pi pi-chevron-right text-gray-400"></i>
            </div>
            <div v-if="pendingActions.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-check-circle text-4xl mb-4"></i>
              <p>No pending actions</p>
            </div>
          </div>
        </template>
      </Card>
      
      <!-- Quick Stats -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Quick Stats</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">This Month's Payroll</span>
              <span class="font-semibold">${{ stats.monthlyPayroll?.toLocaleString() || '0' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Avg. Work Hours</span>
              <span class="font-semibold">{{ stats.avgWorkHours || '0' }}h</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Leave Requests</span>
              <span class="font-semibold">{{ stats.leaveRequests || '0' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">New Hires (MTD)</span>
              <span class="font-semibold">{{ stats.newHires || '0' }}</span>
            </div>
          </div>
        </template>
      </Card>
      
      <!-- Quick Actions -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Quick Actions</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <Button 
              v-if="canManageUsers"
              label="Add User" 
              icon="pi pi-user-plus" 
              class="w-full p-button-outlined"
              @click="$router.push('/tenant/users/create')"
            />
            <Button 
              v-if="canManageEmployees"
              label="Add Employee" 
              icon="pi pi-id-card" 
              class="w-full p-button-outlined"
              @click="$router.push('/tenant/employees/create')"
            />
            <Button 
              v-if="canViewPayroll"
              label="Run Payroll" 
              icon="pi pi-wallet" 
              class="w-full p-button-outlined"
              @click="$router.push('/tenant/payroll/run')"
            />
            <Button 
              label="View Reports" 
              icon="pi pi-chart-line" 
              class="w-full p-button-outlined"
              @click="$router.push('/tenant/reports')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'tenant',
  middleware: 'tenant-admin'
})

const authStore = useAuthStore()
const { $api } = useNuxtApp()

// Reactive data
const currentTime = ref(new Date().toLocaleTimeString())
const loading = ref(true)
const stats = ref({
  totalUsers: 0,
  activeEmployees: 0,
  presentToday: 0,
  pendingLeaves: 0,
  monthlyPayroll: 0,
  avgWorkHours: 0,
  leaveRequests: 0,
  newHires: 0
})
const recentActivities = ref<any[]>([])
const attendanceData = ref<any[]>([])
const pendingActions = ref<any[]>([])

// Computed properties
const tenantName = computed(() => authStore.tenant?.name || 'Organization')
const planName = computed(() => authStore.tenant?.plan?.charAt(0).toUpperCase() + authStore.tenant?.plan?.slice(1) || 'Free')
const currentDate = computed(() => new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

const userUsagePercentage = computed(() => {
  if (!authStore.tenant || authStore.tenant.max_users === -1) return 0
  return Math.round((stats.value.totalUsers / authStore.tenant.max_users) * 100)
})

const employeeUsagePercentage = computed(() => {
  if (!authStore.tenant || authStore.tenant.max_employees === -1) return 0
  return Math.round((stats.value.activeEmployees / authStore.tenant.max_employees) * 100)
})

const attendanceRate = computed(() => {
  if (stats.value.activeEmployees === 0) return 0
  return Math.round((stats.value.presentToday / stats.value.activeEmployees) * 100)
})

const showUsageWarnings = computed(() => {
  return userUsagePercentage.value > 80 || employeeUsagePercentage.value > 80
})

// Permission checks
const canManageUsers = computed(() => authStore.hasPermission('user.manage'))
const canManageEmployees = computed(() => authStore.hasPermission('employee.create'))
const canViewPayroll = computed(() => authStore.hasPermission('payroll.view'))

// Chart data
const attendanceChartData = computed(() => ({
  labels: attendanceData.value.map(item => item.date),
  datasets: [
    {
      label: 'Present',
      data: attendanceData.value.map(item => item.present),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    },
    {
      label: 'Absent',
      data: attendanceData.value.map(item => item.absent),
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4
    }
  ]
}))

const attendanceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Methods
const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    const [statsResponse, activitiesResponse, attendanceResponse, actionsResponse] = await Promise.all([
      $api('/api/v1/tenant/dashboard/stats/'),
      $api('/api/v1/tenant/dashboard/activities/'),
      $api('/api/v1/tenant/dashboard/attendance/'),
      $api('/api/v1/tenant/dashboard/pending-actions/')
    ])
    
    stats.value = statsResponse
    recentActivities.value = activitiesResponse.results || []
    attendanceData.value = attendanceResponse.results || []
    pendingActions.value = actionsResponse.results || []
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'user': return 'bg-blue-500'
    case 'employee': return 'bg-green-500'
    case 'attendance': return 'bg-purple-500'
    case 'payroll': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user': return 'pi pi-user'
    case 'employee': return 'pi pi-id-card'
    case 'attendance': return 'pi pi-clock'
    case 'payroll': return 'pi pi-wallet'
    default: return 'pi pi-info-circle'
  }
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

const handlePendingAction = (action: any) => {
  // Navigate to appropriate page based on action type
  switch (action.type) {
    case 'leave_approval':
      navigateTo('/tenant/attendance/leaves')
      break
    case 'user_invitation':
      navigateTo('/tenant/users')
      break
    case 'payroll_review':
      navigateTo('/tenant/payroll')
      break
    default:
      console.log('Unknown action type:', action.type)
  }
}

// Time update interval
let timeInterval: NodeJS.Timeout

onMounted(() => {
  fetchDashboardData()
  
  // Update time every second
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
  
  // Auto-refresh dashboard data every 5 minutes
  setInterval(fetchDashboardData, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.p-timeline .p-timeline-event-content {
  padding-left: 1rem;
}
</style>
