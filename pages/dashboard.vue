<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {{ authStore.userFullName }}!</p>
        </div>
        <div class="flex gap-3">
          <Button 
            icon="pi pi-refresh" 
            label="Refresh" 
            @click="refreshData"
            :loading="isLoading"
            severity="secondary"
          />
          <Button 
            icon="pi pi-download" 
            label="Export" 
            severity="secondary"
            @click="exportData"
          />
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <PCard class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.total_employees || 0 }}</p>
              <p class="text-sm text-green-600 dark:text-green-400">
                <i class="pi pi-arrow-up mr-1"></i>
                +{{ stats.new_employees_this_month || 0 }} this month
              </p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <i class="pi pi-users text-2xl text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </template>
      </PCard>

      <PCard class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Employees</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active_employees || 0 }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ Math.round((stats.active_employees / stats.total_employees) * 100) || 0 }}% of total
              </p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <i class="pi pi-check-circle text-2xl text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </template>
      </PCard>

      <PCard class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.attendance_rate || 0 }}%</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Today's attendance</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <i class="pi pi-clock text-2xl text-orange-600 dark:text-orange-400"></i>
            </div>
          </div>
        </template>
      </PCard>

      <PCard class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Leave Requests</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.leave_requests_pending || 0 }}</p>
              <p class="text-sm text-red-600 dark:text-red-400">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Needs attention
              </p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <i class="pi pi-calendar-times text-2xl text-red-600 dark:text-red-400"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Charts and Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Attendance Chart -->
      <PCard>
        <template #title>
          <div class="flex items-center justify-between">
            <span>Attendance Overview</span>
            <PDropdown 
              v-model="selectedAttendancePeriod" 
              :options="attendancePeriods" 
              option-label="label"
              option-value="value"
              @change="loadAttendanceData"
            />
          </div>
        </template>
        <template #content>
          <div class="h-80">
            <PChart 
              type="line" 
              :data="attendanceChartData" 
              :options="chartOptions"
              v-if="attendanceChartData"
            />
            <div v-else class="flex items-center justify-center h-full">
              <PProgressSpinner />
            </div>
          </div>
        </template>
      </PCard>

      <!-- Department Distribution -->
      <PCard>
        <template #title>
          <span>Department Distribution</span>
        </template>
        <template #content>
          <div class="h-80">
            <PChart 
              type="doughnut" 
              :data="departmentChartData" 
              :options="doughnutOptions"
              v-if="departmentChartData"
            />
            <div v-else class="flex items-center justify-center h-full">
              <PProgressSpinner />
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Recent Activities and Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activities -->
      <PCard class="lg:col-span-2">
        <template #title>
          <div class="flex items-center justify-between">
            <span>Recent Activities</span>
            <Button 
              icon="pi pi-eye" 
              label="View All" 
              text
              size="small"
              @click="navigateTo('/audit')"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex-shrink-0">
                <PAvatar 
                  :label="activity.user?.charAt(0) || 'U'" 
                  size="small"
                  :class="getActivityIconClass(activity.action)"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.user }} {{ activity.action }} {{ activity.model_name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(activity.created_at) }}
                </p>
              </div>
            </div>
            <div v-if="recentActivities.length === 0" class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400">No recent activities</p>
            </div>
          </div>
        </template>
      </PCard>

      <!-- Quick Actions -->
      <PCard>
        <template #title>
          <span>Quick Actions</span>
        </template>
        <template #content>
          <div class="space-y-3">
            <Button 
              icon="pi pi-user-plus" 
              label="Add Employee" 
              class="w-full justify-start"
              @click="navigateTo('/employees/create')"
            />
            <Button 
              icon="pi pi-clock" 
              label="Clock In/Out" 
              class="w-full justify-start"
              severity="secondary"
              @click="toggleClockInOut"
            />
            <Button 
              icon="pi pi-calendar-plus" 
              label="Request Leave" 
              class="w-full justify-start"
              severity="secondary"
              @click="navigateTo('/leave/request')"
            />
            <Button 
              icon="pi pi-file-export" 
              label="Generate Report" 
              class="w-full justify-start"
              severity="secondary"
              @click="navigateTo('/reports')"
            />
            <Button 
              icon="pi pi-cog" 
              label="Settings" 
              class="w-full justify-start"
              severity="secondary"
              @click="navigateTo('/settings')"
            />
          </div>
        </template>
      </PCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { DashboardStats, AttendanceStats } from '~/types/hrms'

// Meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Stores
const authStore = useAuthStore()

// State
const isLoading = ref(false)
const stats = ref<DashboardStats>({
  total_employees: 0,
  active_employees: 0,
  new_employees_this_month: 0,
  total_departments: 0,
  attendance_rate: 0,
  leave_requests_pending: 0,
  payroll_processed: 0,
  recent_activities: []
})

const recentActivities = ref<any[]>([])
const selectedAttendancePeriod = ref('week')
const attendancePeriods = [
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
  { label: 'Last 3 months', value: 'quarter' }
]

// Chart data
const attendanceChartData = ref(null)
const departmentChartData = ref(null)

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Methods
const loadDashboardData = async () => {
  isLoading.value = true
  try {
    // Load employee statistics
    const employeeStats = await $fetch('/api/v1/employees/employees/statistics/', {
      baseURL: useRuntimeConfig().public.apiUrl
    })
    
    // Load attendance statistics
    const attendanceStats = await $fetch('/api/v1/attendance/attendance/statistics/', {
      baseURL: useRuntimeConfig().public.apiUrl
    })
    
    // Load department statistics
    const departmentStats = await $fetch('/api/v1/employees/departments/statistics/', {
      baseURL: useRuntimeConfig().public.apiUrl
    })
    
    // Load recent activities
    const activities = await $fetch('/api/v1/audit/logs/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 5 }
    })
    
    // Update stats
    stats.value = {
      total_employees: employeeStats.total_employees || 0,
      active_employees: employeeStats.active_employees || 0,
      new_employees_this_month: employeeStats.new_employees_this_month || 0,
      total_departments: departmentStats.total_departments || 0,
      attendance_rate: attendanceStats.attendance_rate || 0,
      leave_requests_pending: attendanceStats.pending_leave_requests || 0,
      payroll_processed: 0, // TODO: Add payroll stats
      recent_activities: activities.results || []
    }
    
    recentActivities.value = activities.results || []
    
    // Load chart data
    await loadAttendanceData()
    await loadDepartmentData()
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    const toast = useToast()
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load dashboard data',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const loadAttendanceData = async () => {
  try {
    const response = await $fetch('/api/v1/attendance/attendance/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: {
        page_size: 7,
        ordering: '-date'
      }
    })
    
    const labels = response.results.map((item: any) => 
      new Date(item.date).toLocaleDateString()
    ).reverse()
    
    const data = response.results.map((item: any) => 
      item.status === 'present' ? 100 : 0
    ).reverse()
    
    attendanceChartData.value = {
      labels,
      datasets: [{
        label: 'Attendance Rate',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    }
  } catch (error) {
    console.error('Error loading attendance data:', error)
  }
}

const loadDepartmentData = async () => {
  try {
    const response = await $fetch('/api/v1/employees/departments/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 10 }
    })
    
    const labels = response.results.map((dept: any) => dept.name)
    const data = response.results.map((dept: any) => parseInt(dept.employee_count) || 0)
    
    departmentChartData.value = {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316'
        ]
      }]
    }
  } catch (error) {
    console.error('Error loading department data:', error)
  }
}

const refreshData = () => {
  loadDashboardData()
}

const exportData = () => {
  // TODO: Implement data export
  const toast = useToast()
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality coming soon',
    life: 3000
  })
}

const toggleClockInOut = async () => {
  try {
    // Check if user is already clocked in
    const today = new Date().toISOString().split('T')[0]
    const attendance = await $fetch('/api/v1/attendance/attendance/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: {
        date: today,
        employee: authStore.user?.id
      }
    })
    
    if (attendance.results.length > 0 && attendance.results[0].check_in && !attendance.results[0].check_out) {
      // Clock out
      await $fetch('/api/v1/attendance/clock-out/', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiUrl
      })
      
      const toast = useToast()
      toast.add({
        severity: 'success',
        summary: 'Clocked Out',
        detail: 'You have been clocked out successfully',
        life: 3000
      })
    } else {
      // Clock in
      await $fetch('/api/v1/attendance/clock-in/', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiUrl
      })
      
      const toast = useToast()
      toast.add({
        severity: 'success',
        summary: 'Clocked In',
        detail: 'You have been clocked in successfully',
        life: 3000
      })
    }
    
    // Refresh data
    loadDashboardData()
  } catch (error) {
    console.error('Error toggling clock in/out:', error)
    const toast = useToast()
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to clock in/out',
      life: 3000
    })
  }
}

const getActivityIconClass = (action: string) => {
  const classes = {
    create: 'bg-green-100 text-green-600',
    update: 'bg-blue-100 text-blue-600',
    delete: 'bg-red-100 text-red-600',
    login: 'bg-purple-100 text-purple-600',
    logout: 'bg-gray-100 text-gray-600'
  }
  return classes[action as keyof typeof classes] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-card {
  transition: transform 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1.5rem;
}
</style>
