<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Audit & Reports</h1>
            <p class="text-600 mt-2 mb-0">Track system activities and generate reports</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Export Report" 
              icon="pi pi-download" 
              class="p-button-outlined"
              @click="exportReport"
            />
            <PButton 
              label="Generate Report" 
              icon="pi pi-file-pdf" 
              @click="showReportDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Total Logs</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.totalLogs }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-history text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Today's Activities</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.todayActivities }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-calendar text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Active Users</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.activeUsers }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-users text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">System Health</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.systemHealth }}%</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-heart text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Activity Chart -->
    <div class="col-12 lg:col-8">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Activity Trends</span>
            <PDropdown 
              v-model="selectedPeriod" 
              :options="periodOptions" 
              optionLabel="label" 
              optionValue="value"
              class="w-8rem"
            />
          </div>
        </template>
        <template #content>
          <PChart type="line" :data="activityChartData" :options="activityChartOptions" style="height: 300px" />
        </template>
      </PCard>
    </div>

    <!-- Top Actions -->
    <div class="col-12 lg:col-4">
      <PCard>
        <template #title>Top Actions</template>
        <template #content>
          <div class="space-y-3">
            <div v-for="action in topActions" :key="action.name" class="flex justify-content-between align-items-center">
              <div class="flex align-items-center gap-2">
                <i :class="['pi', action.icon, 'text-primary-500']"></i>
                <span class="font-medium">{{ action.name }}</span>
              </div>
              <PTag :value="action.count" severity="info" />
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Filters -->
    <div class="col-12">
      <PCard>
        <template #title>Filters</template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="user" class="font-medium">User</label>
                <PDropdown 
                  id="user"
                  v-model="filters.user" 
                  :options="userOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Users"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="action" class="font-medium">Action</label>
                <PDropdown 
                  id="action"
                  v-model="filters.action" 
                  :options="actionOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Actions"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="dateFrom" class="font-medium">From Date</label>
                <PCalendar 
                  id="dateFrom"
                  v-model="filters.dateFrom" 
                  dateFormat="yy-mm-dd"
                  placeholder="Select Date"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="dateTo" class="font-medium">To Date</label>
                <PCalendar 
                  id="dateTo"
                  v-model="filters.dateTo" 
                  dateFormat="yy-mm-dd"
                  placeholder="Select Date"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Audit Logs Table -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Audit Logs</span>
            <div class="flex align-items-center gap-2">
              <PButton 
                icon="pi pi-refresh" 
                class="p-button-outlined p-button-sm"
                @click="refreshData"
                :loading="loading"
              />
              <PButton 
                label="Clear Logs" 
                icon="pi pi-trash" 
                class="p-button-outlined p-button-sm p-button-danger"
                @click="clearLogs"
              />
            </div>
          </div>
        </template>
        <template #content>
          <PDataTable 
            :value="auditLogs" 
            :paginator="true" 
            :rows="20"
            :filters="filters"
            filterDisplay="row"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['actor_username', 'action', 'model_name', 'description']"
            responsiveLayout="scroll"
            :scrollable="true"
            scrollHeight="600px"
          >
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-history text-4xl text-400 mb-3"></i>
                <p class="text-600">No audit logs found</p>
              </div>
            </template>
            
            <PColumn field="actor_username" header="User" sortable style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <PAvatar 
                    :label="data.actor_username?.charAt(0).toUpperCase()" 
                    shape="circle" 
                    size="normal"
                    class="bg-primary-100 text-primary-700"
                  />
                  <span>{{ data.actor_username }}</span>
                </div>
              </template>
            </PColumn>
            
            <PColumn field="action" header="Action" sortable style="min-width: 120px">
              <template #body="{ data }">
                <PTag :value="data.action" :severity="getActionSeverity(data.action)" />
              </template>
            </PColumn>
            
            <PColumn field="model_name" header="Model" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.model_name }}</span>
              </template>
            </PColumn>
            
            <PColumn field="description" header="Description" sortable style="min-width: 300px">
              <template #body="{ data }">
                <span>{{ data.description }}</span>
              </template>
            </PColumn>
            
            <PColumn field="ip_address" header="IP Address" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-mono text-sm">{{ data.ip_address }}</span>
              </template>
            </PColumn>
            
            <PColumn field="created_at" header="Date & Time" sortable style="min-width: 150px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ formatDate(data.created_at) }}</div>
                  <div class="text-sm text-500">{{ formatTime(data.created_at) }}</div>
                </div>
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 100px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'View Details'"
                    @click="viewLog(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>
        </template>
      </PCard>
    </div>

    <!-- Generate Report Dialog -->
    <PDialog 
      v-model:visible="showReportDialog" 
      header="Generate Report" 
      :style="{ width: '600px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="reportType" class="font-medium">Report Type *</label>
            <PDropdown 
              id="reportType"
              v-model="reportForm.type" 
              :options="reportTypeOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Report Type"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="reportDateFrom" class="font-medium">From Date *</label>
            <PCalendar 
              id="reportDateFrom"
              v-model="reportForm.dateFrom" 
              dateFormat="yy-mm-dd"
              placeholder="Select Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="reportDateTo" class="font-medium">To Date *</label>
            <PCalendar 
              id="reportDateTo"
              v-model="reportForm.dateTo" 
              dateFormat="yy-mm-dd"
              placeholder="Select Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="reportFormat" class="font-medium">Format</label>
            <PDropdown 
              id="reportFormat"
              v-model="reportForm.format" 
              :options="formatOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Format"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <PCheckbox v-model="reportForm.includeCharts" inputId="includeCharts" />
            <label for="includeCharts" class="ml-2">Include Charts and Graphs</label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <PButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="closeReportDialog" 
        />
        <PButton 
          label="Generate Report" 
          icon="pi pi-file-pdf" 
          @click="generateReport" 
          :loading="generating"
        />
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

const toast = useToast()

// Reactive data
const auditLogs = ref([])
const loading = ref(false)
const generating = ref(false)
const showReportDialog = ref(false)
const selectedPeriod = ref('week')

const filters = ref({
  user: null,
  action: null,
  dateFrom: null,
  dateTo: null
})

const reportForm = ref({
  type: null,
  dateFrom: null,
  dateTo: null,
  format: 'pdf',
  includeCharts: true
})

// Stats
const stats = ref({
  totalLogs: 15420,
  todayActivities: 156,
  activeUsers: 23,
  systemHealth: 98
})

// Options
const periodOptions = ref([
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
  { label: 'Last 90 days', value: 'quarter' },
  { label: 'Last year', value: 'year' }
])

const userOptions = ref([
  { label: 'All Users', value: null },
  { label: 'John Admin', value: 'admin' },
  { label: 'Jane Smith', value: 'jane.smith' },
  { label: 'Mike Johnson', value: 'mike.johnson' }
])

const actionOptions = ref([
  { label: 'All Actions', value: null },
  { label: 'Create', value: 'create' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Login', value: 'login' },
  { label: 'Logout', value: 'logout' }
])

const reportTypeOptions = ref([
  { label: 'User Activity Report', value: 'user_activity' },
  { label: 'System Usage Report', value: 'system_usage' },
  { label: 'Security Audit Report', value: 'security_audit' },
  { label: 'Performance Report', value: 'performance' },
  { label: 'Compliance Report', value: 'compliance' }
])

const formatOptions = ref([
  { label: 'PDF', value: 'pdf' },
  { label: 'Excel', value: 'excel' },
  { label: 'CSV', value: 'csv' }
])

// Top actions
const topActions = ref([
  { name: 'User Login', count: 245, icon: 'pi-sign-in' },
  { name: 'Employee Update', count: 89, icon: 'pi-user-edit' },
  { name: 'Attendance Clock In', count: 156, icon: 'pi-clock' },
  { name: 'Leave Request', count: 34, icon: 'pi-calendar-plus' },
  { name: 'Payroll Process', count: 12, icon: 'pi-wallet' }
])

// Mock data
const mockAuditLogs = ref([
  {
    id: 1,
    actor_username: 'admin',
    action: 'create',
    model_name: 'Employee',
    description: 'Created new employee John Doe',
    ip_address: '192.168.1.100',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    actor_username: 'jane.smith',
    action: 'update',
    model_name: 'Attendance',
    description: 'Updated attendance record for EMP001',
    ip_address: '192.168.1.101',
    created_at: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    actor_username: 'mike.johnson',
    action: 'login',
    model_name: 'User',
    description: 'User logged in successfully',
    ip_address: '192.168.1.102',
    created_at: '2024-01-15T08:45:00Z'
  },
  {
    id: 4,
    actor_username: 'admin',
    action: 'delete',
    model_name: 'Leave Request',
    description: 'Deleted leave request #1234',
    ip_address: '192.168.1.100',
    created_at: '2024-01-15T07:20:00Z'
  },
  {
    id: 5,
    actor_username: 'jane.smith',
    action: 'create',
    model_name: 'Payroll',
    description: 'Processed payroll for January 2024',
    ip_address: '192.168.1.101',
    created_at: '2024-01-14T16:30:00Z'
  }
])

// Chart data
const activityChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'User Activities',
      data: [45, 52, 38, 67, 89, 23, 15],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: 'System Events',
      data: [12, 18, 25, 32, 28, 8, 5],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }
  ]
}))

const activityChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

// Methods
const getActionSeverity = (action: string) => {
  switch (action) {
    case 'create': return 'success'
    case 'update': return 'info'
    case 'delete': return 'danger'
    case 'login': return 'success'
    case 'logout': return 'warning'
    default: return 'info'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString()
}

const viewLog = (log: any) => {
  // TODO: Implement view log details
  console.log('View log:', log)
}

const closeReportDialog = () => {
  showReportDialog.value = false
  resetReportForm()
}

const resetReportForm = () => {
  reportForm.value = {
    type: null,
    dateFrom: null,
    dateTo: null,
    format: 'pdf',
    includeCharts: true
  }
}

const generateReport = async () => {
  generating.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    closeReportDialog()
    toast.add({
      severity: 'success',
      summary: 'Report Generated',
      detail: 'Your report has been generated successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Generation Failed',
      detail: 'Failed to generate report',
      life: 3000
    })
  } finally {
    generating.value = false
  }
}

const exportReport = () => {
  // TODO: Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality will be implemented',
    life: 3000
  })
}

const clearLogs = () => {
  // TODO: Implement clear logs functionality
  toast.add({
    severity: 'info',
    summary: 'Clear Logs',
    detail: 'Clear logs functionality will be implemented',
    life: 3000
  })
}

const refreshData = async () => {
  loading.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'Audit data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh audit data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  auditLogs.value = mockAuditLogs.value
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>
