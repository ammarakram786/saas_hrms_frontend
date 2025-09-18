<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="bg-blue-50 border-blue-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Total Tenants</p>
              <p class="text-3xl font-bold text-blue-900">{{ stats.totalTenants }}</p>
            </div>
            <div class="bg-blue-500 p-3 rounded-full">
              <i class="pi pi-building text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="bg-green-50 border-green-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">Active Tenants</p>
              <p class="text-3xl font-bold text-green-900">{{ stats.activeTenants }}</p>
            </div>
            <div class="bg-green-500 p-3 rounded-full">
              <i class="pi pi-check-circle text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="bg-purple-50 border-purple-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">Total Users</p>
              <p class="text-3xl font-bold text-purple-900">{{ stats.totalUsers }}</p>
            </div>
            <div class="bg-purple-500 p-3 rounded-full">
              <i class="pi pi-users text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="bg-orange-50 border-orange-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">Active Subscriptions</p>
              <p class="text-3xl font-bold text-orange-900">{{ stats.activeSubscriptions }}</p>
            </div>
            <div class="bg-orange-500 p-3 rounded-full">
              <i class="pi pi-credit-card text-white text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Tenants -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Recent Tenants</h3>
            <Button 
              label="View All" 
              class="p-button-text p-button-sm" 
              @click="$router.push('/admin/tenants')"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div 
              v-for="tenant in recentTenants" 
              :key="tenant.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <Avatar 
                  :label="tenant.name.charAt(0)" 
                  size="normal" 
                  shape="circle" 
                  class="bg-blue-500"
                />
                <div>
                  <p class="font-medium">{{ tenant.name }}</p>
                  <p class="text-sm text-gray-500">{{ tenant.plan }} plan</p>
                </div>
              </div>
              <div class="text-right">
                <Badge 
                  :value="tenant.status" 
                  :severity="getStatusSeverity(tenant.status)"
                  class="text-xs"
                />
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(tenant.created_at) }}</p>
              </div>
            </div>
          </div>
        </template>
      </Card>
      
      <!-- Subscription Analytics -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">Plan Distribution</h3>
          </div>
        </template>
        <template #content>
          <Chart 
            type="doughnut" 
            :data="planChartData" 
            :options="chartOptions"
            class="w-full h-64"
          />
        </template>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- System Alerts -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <h3 class="text-lg font-semibold">System Alerts</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="alert in systemAlerts" 
              :key="alert.id"
              class="flex items-start space-x-3 p-3 rounded-lg"
              :class="getAlertClass(alert.type)"
            >
              <i 
                :class="getAlertIcon(alert.type)" 
                class="text-lg mt-0.5"
              ></i>
              <div class="flex-1">
                <p class="font-medium">{{ alert.title }}</p>
                <p class="text-sm opacity-75">{{ alert.message }}</p>
                <p class="text-xs opacity-50 mt-1">{{ formatDate(alert.created_at) }}</p>
              </div>
            </div>
            <div v-if="systemAlerts.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-check-circle text-4xl mb-4"></i>
              <p>No system alerts</p>
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
          <div class="grid grid-cols-2 gap-4">
            <Button 
              label="Create Tenant" 
              icon="pi pi-building" 
              class="p-button-outlined h-20 flex-col"
              @click="$router.push('/admin/tenants/create')"
            />
            <Button 
              label="Add User" 
              icon="pi pi-user-plus" 
              class="p-button-outlined h-20 flex-col"
              @click="$router.push('/admin/users/create')"
            />
            <Button 
              label="View Reports" 
              icon="pi pi-chart-line" 
              class="p-button-outlined h-20 flex-col"
              @click="$router.push('/admin/reports')"
            />
            <Button 
              label="System Settings" 
              icon="pi pi-cog" 
              class="p-button-outlined h-20 flex-col"
              @click="$router.push('/admin/settings')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Tenant } from '~/types/auth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-only'
})

const { $api } = useNuxtApp()

// Reactive data
const loading = ref(true)
const stats = ref({
  totalTenants: 0,
  activeTenants: 0,
  totalUsers: 0,
  activeSubscriptions: 0
})
const recentTenants = ref<Tenant[]>([])
const planDistribution = ref<Record<string, number>>({})
const systemAlerts = ref<any[]>([])

// Chart data
const planChartData = computed(() => ({
  labels: Object.keys(planDistribution.value),
  datasets: [
    {
      data: Object.values(planDistribution.value),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

// Methods
const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    const [statsResponse, tenantsResponse, alertsResponse] = await Promise.all([
      $api('/api/v1/admin/stats/'),
      $api('/api/v1/admin/tenants/recent/'),
      $api('/api/v1/admin/alerts/')
    ])
    
    stats.value = statsResponse
    recentTenants.value = tenantsResponse.results || []
    systemAlerts.value = alertsResponse.results || []
    
    // Calculate plan distribution
    const distribution: Record<string, number> = {}
    recentTenants.value.forEach(tenant => {
      distribution[tenant.plan] = (distribution[tenant.plan] || 0) + 1
    })
    planDistribution.value = distribution
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'suspended': return 'danger'
    case 'pending': return 'warning'
    default: return 'info'
  }
}

const getAlertClass = (type: string) => {
  switch (type) {
    case 'error': return 'bg-red-50 text-red-800'
    case 'warning': return 'bg-yellow-50 text-yellow-800'
    case 'info': return 'bg-blue-50 text-blue-800'
    default: return 'bg-gray-50 text-gray-800'
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'error': return 'pi pi-times-circle text-red-500'
    case 'warning': return 'pi pi-exclamation-triangle text-yellow-500'
    case 'info': return 'pi pi-info-circle text-blue-500'
    default: return 'pi pi-info-circle text-gray-500'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})

// Auto-refresh every 5 minutes
setInterval(fetchDashboardData, 5 * 60 * 1000)
</script>

<style scoped>
.flex-col {
  flex-direction: column;
}
</style>
