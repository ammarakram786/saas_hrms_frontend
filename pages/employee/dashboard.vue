<template>
  <div>
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Good {{ timeOfDay }}, {{ authStore.userFullName }}!</h1>
          <p class="text-green-100 mt-1">{{ currentDate }}</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-semibold">{{ currentTime }}</p>
          <div class="mt-2">
            <Button 
              v-if="!todayAttendance?.check_in"
              label="Clock In" 
              icon="pi pi-play"
              class="p-button-success p-button-sm"
              @click="clockIn"
            />
            <Button 
              v-else-if="!todayAttendance?.check_out"
              label="Clock Out" 
              icon="pi pi-stop"
              class="p-button-danger p-button-sm"
              @click="clockOut"
            />
            <Badge 
              v-else
              value="Day Complete" 
              severity="success"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card class="bg-blue-50 border-blue-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Hours Today</p>
              <p class="text-3xl font-bold text-blue-900">{{ todayHours }}</p>
              <p class="text-xs text-blue-500 mt-1">{{ todayAttendance?.status || 'Not clocked in' }}</p>
            </div>
            <i class="pi pi-clock text-blue-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-green-50 border-green-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">This Month</p>
              <p class="text-3xl font-bold text-green-900">{{ monthlyHours }}</p>
              <p class="text-xs text-green-500 mt-1">Total hours</p>
            </div>
            <i class="pi pi-calendar text-green-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-orange-50 border-orange-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">Leave Balance</p>
              <p class="text-3xl font-bold text-orange-900">{{ leaveBalance }}</p>
              <p class="text-xs text-orange-500 mt-1">Days remaining</p>
            </div>
            <i class="pi pi-calendar-times text-orange-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-purple-50 border-purple-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">Last Payslip</p>
              <p class="text-3xl font-bold text-purple-900">{{ formatCurrency(lastPayslip?.net_pay || 0) }}</p>
              <p class="text-xs text-purple-500 mt-1">{{ lastPayslip ? formatDate(lastPayslip.pay_date) : 'No payslip' }}</p>
            </div>
            <i class="pi pi-wallet text-purple-500 text-2xl"></i>
          </div>
        </template>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Today's Schedule -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Today's Schedule</h3>
            <Badge 
              :value="todayAttendance?.status || 'Not started'" 
              :severity="getStatusSeverity(todayAttendance?.status)"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="bg-blue-500 p-2 rounded-full">
                  <i class="pi pi-play text-white"></i>
                </div>
                <div>
                  <p class="font-medium">Shift Start</p>
                  <p class="text-sm text-gray-500">{{ shift?.start_time || '09:00 AM' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium">{{ todayAttendance?.check_in ? formatTime(todayAttendance.check_in) : '--:--' }}</p>
                <p class="text-xs text-gray-500">Actual</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="bg-red-500 p-2 rounded-full">
                  <i class="pi pi-stop text-white"></i>
                </div>
                <div>
                  <p class="font-medium">Shift End</p>
                  <p class="text-sm text-gray-500">{{ shift?.end_time || '05:00 PM' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium">{{ todayAttendance?.check_out ? formatTime(todayAttendance.check_out) : '--:--' }}</p>
                <p class="text-xs text-gray-500">Actual</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="bg-green-500 p-2 rounded-full">
                  <i class="pi pi-clock text-white"></i>
                </div>
                <div>
                  <p class="font-medium">Total Hours</p>
                  <p class="text-sm text-gray-500">Expected: 8.00</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium">{{ todayHours }}</p>
                <p class="text-xs text-gray-500">Actual</p>
              </div>
            </div>
          </div>
        </template>
      </Card>
      
      <!-- Recent Payslips -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Recent Payslips</h3>
            <Button 
              label="View All" 
              class="p-button-text p-button-sm" 
              @click="$router.push('/employee/payslips')"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="payslip in recentPayslips" 
              :key="payslip.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              @click="viewPayslip(payslip)"
            >
              <div>
                <p class="font-medium">{{ formatPayrollPeriod(payslip.payroll_period) }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(payslip.pay_date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-green-600">{{ formatCurrency(payslip.net_pay) }}</p>
                <Badge 
                  :value="payslip.status" 
                  :severity="getPayrollStatusSeverity(payslip.status)"
                  class="text-xs"
                />
              </div>
            </div>
            <div v-if="recentPayslips.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-wallet text-4xl mb-4"></i>
              <p>No payslips available</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pending Requests -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Pending Requests</h3>
            <Badge :value="pendingRequests.length" severity="warning" />
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="request in pendingRequests" 
              :key="request.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <i :class="getRequestIcon(request.type)" class="text-orange-500"></i>
                <div>
                  <p class="text-sm font-medium">{{ request.title }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(request.created_at) }}</p>
                </div>
              </div>
              <Badge :value="request.status" severity="warning" class="text-xs" />
            </div>
            <div v-if="pendingRequests.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-check-circle text-4xl mb-4"></i>
              <p>No pending requests</p>
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
              label="Request Leave" 
              icon="pi pi-calendar-times" 
              class="w-full p-button-outlined"
              @click="$router.push('/employee/leave/request')"
            />
            <Button 
              label="View Attendance" 
              icon="pi pi-clock" 
              class="w-full p-button-outlined"
              @click="$router.push('/employee/attendance')"
            />
            <Button 
              label="View Payslips" 
              icon="pi pi-wallet" 
              class="w-full p-button-outlined"
              @click="$router.push('/employee/payslips')"
            />
            <Button 
              label="Update Profile" 
              icon="pi pi-user-edit" 
              class="w-full p-button-outlined"
              @click="$router.push('/employee/profile')"
            />
          </div>
        </template>
      </Card>
      
      <!-- Upcoming Events -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Upcoming Events</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="event in upcomingEvents" 
              :key="event.id"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div class="bg-purple-500 p-2 rounded-full">
                <i class="pi pi-calendar text-white text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ event.title }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(event.date) }}</p>
              </div>
              <Badge :value="event.type" severity="info" class="text-xs" />
            </div>
            <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-calendar text-4xl mb-4"></i>
              <p>No upcoming events</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()

// Reactive data
const currentTime = ref(new Date().toLocaleTimeString())
const todayAttendance = ref<any>(null)
const shift = ref<any>(null)
const recentPayslips = ref<any[]>([])
const lastPayslip = ref<any>(null)
const pendingRequests = ref<any[]>([])
const upcomingEvents = ref<any[]>([])
const leaveBalance = ref(0)
const monthlyHours = ref(0)

// Computed properties
const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
})

const currentDate = computed(() => new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

const todayHours = computed(() => {
  if (!todayAttendance.value?.total_hours) return '0.00'
  return todayAttendance.value.total_hours.toFixed(2)
})

// Methods
const fetchDashboardData = async () => {
  try {
    const [attendanceResponse, payslipsResponse, requestsResponse, eventsResponse, balanceResponse] = await Promise.all([
      $api('/api/v1/employee/attendance/today/'),
      $api('/api/v1/employee/payslips/recent/'),
      $api('/api/v1/employee/requests/pending/'),
      $api('/api/v1/employee/events/upcoming/'),
      $api('/api/v1/employee/leave/balance/')
    ])
    
    todayAttendance.value = attendanceResponse.attendance
    shift.value = attendanceResponse.shift
    recentPayslips.value = payslipsResponse.results || []
    lastPayslip.value = recentPayslips.value[0] || null
    pendingRequests.value = requestsResponse.results || []
    upcomingEvents.value = eventsResponse.results || []
    leaveBalance.value = balanceResponse.total_balance || 0
    monthlyHours.value = attendanceResponse.monthly_hours || 0
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
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

const viewPayslip = (payslip: any) => {
  navigateTo(`/employee/payslips/${payslip.id}`)
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'present': return 'success'
    case 'absent': return 'danger'
    case 'late': return 'warning'
    default: return 'info'
  }
}

const getPayrollStatusSeverity = (status: string) => {
  switch (status) {
    case 'paid': return 'success'
    case 'approved': return 'info'
    case 'draft': return 'warning'
    default: return 'secondary'
  }
}

const getRequestIcon = (type: string) => {
  switch (type) {
    case 'leave': return 'pi pi-calendar-times'
    case 'expense': return 'pi pi-money-bill'
    case 'profile': return 'pi pi-user-edit'
    default: return 'pi pi-file'
  }
}

const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatPayrollPeriod = (period: any) => {
  if (!period) return 'Unknown'
  return `${formatDate(period.start_date)} - ${formatDate(period.end_date)}`
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
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
:deep(.p-card) {
  height: 100%;
}
</style>
