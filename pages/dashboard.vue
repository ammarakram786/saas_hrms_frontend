<template>
  <div class="grid">
    <!-- Welcome header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">
              Welcome back, {{ authStore.userFullName }}!
            </h1>
            <p class="text-600 mt-2 mb-0">
              Here's what's happening in your organization today.
            </p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton
              icon="pi pi-refresh"
              class="p-button-outlined"
              @click="refreshData"
              :loading="isLoading"
              :aria-label="isLoading ? 'Refreshing dashboard data' : 'Refresh dashboard data'"
              v-tooltip.bottom="'Refresh Data'"
            />
            <PButton
              icon="pi pi-cog"
              class="p-button-outlined"
              @click="showSettings = true"
              aria-label="Open dashboard settings"
              v-tooltip.bottom="'Settings'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="col-12 sm:col-6 md:col-6 lg:col-3 xl:col-3">
      <SkeletonCard v-if="isLoading" />
      <PCard v-else class="stat-card" role="region" aria-labelledby="total-employees-heading">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span id="total-employees-heading" class="block text-500 font-medium mb-3">Total Employees</span>
              <div class="text-900 font-bold text-5xl m-0" aria-label="Total number of employees">{{ stats.totalEmployees }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem;"
              role="img"
              aria-label="Employees icon"
            >
              <i class="pi pi-users text-blue-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium" aria-label="12% increase">+12% </span>
          <span class="text-500">from last month</span>
        </template>
      </PCard>
    </div>

    <div class="col-12 sm:col-6 md:col-6 lg:col-3 xl:col-3">
      <SkeletonCard v-if="isLoading" />
      <PCard v-else class="stat-card" role="region" aria-labelledby="present-today-heading">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span id="present-today-heading" class="block text-500 font-medium mb-3">Present Today</span>
              <div class="text-900 font-bold text-5xl m-0" aria-label="Employees present today">{{ stats.presentToday }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-green-100 border-round"
              style="width: 2.5rem; height: 2.5rem;"
              role="img"
              aria-label="Present employees icon"
            >
              <i class="pi pi-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium" aria-label="5% increase">+5% </span>
          <span class="text-500">from yesterday</span>
        </template>
      </PCard>
    </div>

    <div class="col-12 sm:col-6 md:col-6 lg:col-3 xl:col-3">
      <SkeletonCard v-if="isLoading" />
      <PCard v-else class="stat-card" role="region" aria-labelledby="on-leave-heading">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span id="on-leave-heading" class="block text-500 font-medium mb-3">On Leave</span>
              <div class="text-900 font-bold text-5xl m-0" aria-label="Employees on leave">{{ stats.onLeave }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-orange-100 border-round"
              style="width: 2.5rem; height: 2.5rem;"
              role="img"
              aria-label="On leave icon"
            >
              <i class="pi pi-calendar text-orange-500 text-xl"></i>
            </div>
          </div>
          <span class="text-orange-500 font-medium" aria-label="2 new employees">+2 </span>
          <span class="text-500">this week</span>
        </template>
      </PCard>
    </div>

    <div class="col-12 sm:col-6 md:col-6 lg:col-3 xl:col-3">
      <SkeletonCard v-if="isLoading" />
      <PCard v-else class="stat-card" role="region" aria-labelledby="pending-requests-heading">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span id="pending-requests-heading" class="block text-500 font-medium mb-3">Pending Requests</span>
              <div class="text-900 font-bold text-5xl m-0" aria-label="Pending requests">{{ stats.pendingRequests }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-purple-100 border-round"
              style="width: 2.5rem; height: 2.5rem;"
              role="img"
              aria-label="Pending requests icon"
            >
              <i class="pi pi-clock text-purple-500 text-xl"></i>
            </div>
          </div>
          <span class="text-purple-500 font-medium" aria-label="3 new requests">+3 </span>
          <span class="text-500">awaiting approval</span>
        </template>
      </PCard>
    </div>

    <!-- Charts Row -->
    <div class="col-12 xl:col-8 lg:col-8 md:col-12">
      <PCard>
        <template #title>
          <div class="flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between gap-3">
            <span class="text-lg font-semibold">Employee Attendance Trend</span>
            <PDropdown
              v-model="selectedPeriod"
              :options="periodOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full sm:w-8rem"
            />
          </div>
        </template>
        <template #content>
          <PChart type="line" :data="chartData" :options="chartOptions" style="height: 300px" />
        </template>
      </PCard>
    </div>

    <div class="col-12 xl:col-4 lg:col-4 md:col-12">
      <PCard>
        <template #title>
          <span class="text-lg font-semibold">Department Distribution</span>
        </template>
        <template #content>
          <PChart type="doughnut" :data="departmentData" :options="departmentOptions" style="height: 300px" />
        </template>
      </PCard>
    </div>

    <!-- Recent Activities and Quick Actions -->
    <div class="col-12 xl:col-6 lg:col-6 md:col-12">
      <PCard>
        <template #title>
          <div class="flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between gap-3">
            <span class="text-lg font-semibold">Recent Activities</span>
            <PButton
              label="View All"
              icon="pi pi-arrow-right"
              class="p-button-text p-button-sm w-full sm:w-auto"
              @click="navigateTo('/audit')"
            />
          </div>
        </template>
        <template #content>
          <div class="timeline">
            <div v-for="activity in recentActivities" :key="activity.id" class="timeline-item">
              <div class="timeline-marker">
                <i :class="['pi', activity.icon, 'text-500']"></i>
              </div>
              <div class="timeline-content">
                <div class="font-medium text-900">{{ activity.description }}</div>
                <div class="text-500 text-sm">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 xl:col-6 lg:col-6 md:col-12">
      <PCard>
        <template #title>
          <span class="text-lg font-semibold">Quick Actions</span>
        </template>
        <template #content>
          <div class="grid gap-3">
            <div class="col-12 sm:col-6">
              <PButton
                v-can="'employee.create'"
                label="Add Employee"
                icon="pi pi-user-plus"
                class="w-full p-button-outlined"
                @click="navigateTo('/employees/new')"
                aria-label="Navigate to add new employee page"
              />
            </div>
            <div class="col-12 sm:col-6">
              <PButton
                v-can="'attendance.view'"
                label="Clock In/Out"
                icon="pi pi-clock"
                class="w-full p-button-outlined"
                @click="clockIn"
                aria-label="Clock in or out for attendance tracking"
              />
            </div>
            <div class="col-12 sm:col-6">
              <PButton
                v-can="'leave.request'"
                label="Request Leave"
                icon="pi pi-calendar"
                class="w-full p-button-outlined"
                @click="navigateTo('/leave/request')"
                aria-label="Navigate to leave request page"
              />
            </div>
            <div class="col-12 sm:col-6">
              <PButton
                v-can="'payroll.view'"
                label="View Payroll"
                icon="pi pi-wallet"
                class="w-full p-button-outlined"
                @click="navigateTo('/payroll')"
                aria-label="Navigate to payroll management page"
              />
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Settings Dialog -->
    <PDialog 
      v-model:visible="showSettings" 
      header="Dashboard Settings" 
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div class="field">
        <label for="refreshInterval" class="font-medium">Auto Refresh Interval (minutes)</label>
        <PDropdown 
          id="refreshInterval"
          v-model="refreshInterval" 
          :options="refreshOptions" 
          optionLabel="label" 
          optionValue="value"
          class="w-full"
        />
      </div>
      <div class="field">
        <PCheckbox v-model="autoRefresh" inputId="autoRefresh" />
        <label for="autoRefresh" class="ml-2">Enable Auto Refresh</label>
      </div>
      <template #footer>
        <PButton label="Cancel" icon="pi pi-times" class="p-button-text" @click="showSettings = false" />
        <PButton label="Save" icon="pi pi-check" @click="saveSettings" />
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()

// Reactive data
const isLoading = ref(false)
const showSettings = ref(false)
const selectedPeriod = ref('week')
const refreshInterval = ref(5)
const autoRefresh = ref(false)

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

// Chart data
const chartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Present',
      data: [95, 98, 92, 96, 94, 88, 85],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: 'Absent',
      data: [5, 2, 8, 4, 6, 12, 15],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4
    }
  ]
}))

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
})

const departmentData = computed(() => ({
  labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
  datasets: [
    {
      data: [35, 25, 20, 12, 8],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ]
    }
  ]
}))

const departmentOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

// Options
const periodOptions = ref([
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'This Year', value: 'year' }
])

const refreshOptions = ref([
  { label: '1 minute', value: 1 },
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 }
])

// Methods
const clockIn = () => {
  toast.add({
    severity: 'success',
    summary: 'Clock In Successful',
    detail: 'You have been clocked in at ' + new Date().toLocaleTimeString(),
    life: 3000
  })
}

const refreshData = async () => {
  isLoading.value = true
  try {
    // Fetch real dashboard data
    const { $api } = useNuxtApp()

    const response = await $api('/api/v1/dashboard/stats/')
    stats.value = response

    // Fetch recent activities
    const activitiesResponse = await $api('/api/v1/audit/recent/')
    recentActivities.value = activitiesResponse

    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'Dashboard data has been updated',
      life: 3000
    })
  } catch (error) {
    // Error is already handled by the API client error handler
    console.error('Failed to refresh dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

const saveSettings = () => {
  showSettings.value = false
  toast.add({
    severity: 'success',
    summary: 'Settings Saved',
    detail: 'Dashboard settings have been updated',
    life: 3000
  })
}

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const { $api } = useNuxtApp()

    // Fetch dashboard statistics
    const statsResponse = await $api('/api/v1/dashboard/stats/')
    stats.value = statsResponse

    // Fetch recent activities
    const activitiesResponse = await $api('/api/v1/audit/recent/')
    recentActivities.value = activitiesResponse

  } catch (error) {
    // Error is already handled by the API client error handler
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 1rem;
  top: 2rem;
  bottom: -1.5rem;
  width: 2px;
  background-color: var(--surface-200);
}

.timeline-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--surface-100);
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
  min-width: 0;
}
</style>
