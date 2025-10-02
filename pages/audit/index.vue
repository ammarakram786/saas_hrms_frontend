<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>Audit Logs</h5>
          <div class="flex gap-2">
            <Button 
              label="Export" 
              icon="pi pi-download" 
              severity="secondary"
              @click="exportLogs"
            />
            <Button 
              label="Refresh" 
              icon="pi pi-refresh" 
              @click="fetchAuditLogs"
              :loading="loading"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="grid mb-4">
          <div class="col-12 md:col-3">
            <FormField label="User">
              <PDropdown 
                v-model="filters.user" 
                :options="users" 
                optionLabel="full_name" 
                optionValue="id" 
                placeholder="All Users" 
                showClear
              />
            </FormField>
          </div>
          <div class="col-12 md:col-3">
            <FormField label="Action">
              <PDropdown 
                v-model="filters.action" 
                :options="actionOptions" 
                placeholder="All Actions" 
                showClear
              />
            </FormField>
          </div>
          <div class="col-12 md:col-3">
            <FormField label="Resource">
              <PDropdown 
                v-model="filters.resource" 
                :options="resourceOptions" 
                placeholder="All Resources" 
                showClear
              />
            </FormField>
          </div>
          <div class="col-12 md:col-3">
            <FormField label="Date Range">
              <PCalendar 
                v-model="filters.dateRange" 
                selectionMode="range" 
                dateFormat="yy-mm-dd" 
                placeholder="Select date range"
                showClear
              />
            </FormField>
          </div>
        </div>

        <PDataTable
          :value="auditLogs"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="dataTableFilters"
          dataKey="id"
          :loading="loading"
          :globalFilterFields="['user_name', 'action', 'resource_type', 'resource_name']"
          filterDisplay="row"
          stripedRows
          removableSort
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <PInputText v-model="dataTableFilters['global'].value" placeholder="Search Audit Logs" />
              </span>
            </div>
          </template>
          <template #empty>
            No audit logs found.
          </template>
          <template #loading>
            Loading audit logs data. Please wait.
          </template>
          <PColumn field="timestamp" header="Timestamp" sortable>
            <template #body="{ data }">
              {{ formatDateTime(data.timestamp) }}
            </template>
          </PColumn>
          <PColumn field="user_name" header="User" sortable>
            <template #body="{ data }">
              <div class="flex align-items-center">
                <div class="user-avatar mr-2">
                  <i class="pi pi-user text-sm text-gray-400"></i>
                </div>
                <span>{{ data.user_name }}</span>
              </div>
            </template>
          </PColumn>
          <PColumn field="action" header="Action" sortable>
            <template #body="{ data }">
              <PTag :value="data.action" :severity="getActionSeverity(data.action)" />
            </template>
          </PColumn>
          <PColumn field="resource_type" header="Resource" sortable>
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.resource_type }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ data.resource_name }}</div>
              </div>
            </template>
          </PColumn>
          <PColumn field="ip_address" header="IP Address" sortable></PColumn>
          <PColumn field="user_agent" header="User Agent" sortable>
            <template #body="{ data }">
              <div class="max-w-xs truncate" :title="data.user_agent">
                {{ data.user_agent }}
              </div>
            </template>
          </PColumn>
          <PColumn :exportable="false" header="Actions" style="min-width:6rem">
            <template #body="{ data }">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewLog(data)" />
            </template>
          </PColumn>
        </PDataTable>

        <PDialog v-model:visible="logDialog" :style="{width: '900px'}" header="Audit Log Details" :modal="true" class="p-fluid">
          <AuditLogDetails :log="selectedLog" v-if="selectedLog" />
          <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          </template>
        </PDialog>
      </div>
    </div>

    <!-- Audit Statistics -->
    <div class="col-12">
      <div class="card">
        <h5>Audit Statistics</h5>
        <div class="grid">
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-blue-500">{{ statistics.totalLogs }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Logs</div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-green-500">{{ statistics.todayLogs }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Today's Logs</div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-orange-500">{{ statistics.uniqueUsers }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-purple-500">{{ statistics.topAction }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Most Common Action</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { AuditLogService, UserService } from '~/services/api'
import type { AuditLog, User } from '~/types/hrms'
import AuditLogDetails from '~/components/AuditLogDetails.vue'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

const auditLogs = ref<AuditLog[]>([])
const users = ref<User[]>([])
const logDialog = ref(false)
const selectedLog = ref<AuditLog | null>(null)
const loading = ref(true)

const filters = reactive({
  user: null,
  action: null,
  resource: null,
  dateRange: null
})

const dataTableFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const actionOptions = ref([
  { label: 'Create', value: 'create' },
  { label: 'Read', value: 'read' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Login', value: 'login' },
  { label: 'Logout', value: 'logout' }
])

const resourceOptions = ref([
  { label: 'User', value: 'user' },
  { label: 'Employee', value: 'employee' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Leave Request', value: 'leave_request' },
  { label: 'Payroll', value: 'payroll' },
  { label: 'Role', value: 'role' }
])

const statistics = computed(() => {
  const logs = auditLogs.value
  const today = new Date().toDateString()
  
  return {
    totalLogs: logs.length,
    todayLogs: logs.filter(log => new Date(log.timestamp).toDateString() === today).length,
    uniqueUsers: new Set(logs.map(log => log.user_id)).size,
    topAction: getTopAction(logs)
  }
})

onMounted(() => {
  fetchAuditLogs()
  fetchUsers()
})

const fetchAuditLogs = async () => {
  loading.value = true
  try {
    const response = await AuditLogService.getAuditLogs()
    auditLogs.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch audit logs', life: 3000 })
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const response = await UserService.getUsers()
    users.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users', life: 3000 })
  }
}

const viewLog = (log: AuditLog) => {
  selectedLog.value = { ...log }
  logDialog.value = true
}

const hideDialog = () => {
  logDialog.value = false
  selectedLog.value = null
}

const exportLogs = () => {
  // TODO: Implement audit logs export
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Audit logs export functionality coming soon',
    life: 3000
  })
}

const formatDateTime = (dateTimeString: string | null | undefined) => {
  if (!dateTimeString) return 'N/A'
  const date = new Date(dateTimeString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getActionSeverity = (action: string) => {
  switch (action) {
    case 'create': return 'success'
    case 'update': return 'info'
    case 'delete': return 'danger'
    case 'login': return 'success'
    case 'logout': return 'warning'
    default: return 'secondary'
  }
}

const getTopAction = (logs: AuditLog[]) => {
  if (logs.length === 0) return 'N/A'
  
  const actionCounts = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(actionCounts)
    .sort(([,a], [,b]) => b - a)[0][0]
}
</script>

<style scoped>
.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}
</style>
