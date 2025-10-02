<template>
  <div class="leave-page">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Manage employee leave requests and balances</p>
        </div>
        <div class="flex gap-3">
          <Button 
            icon="pi pi-calendar-plus" 
            label="Request Leave" 
            @click="showRequestDialog = true"
          />
          <Button 
            icon="pi pi-cog" 
            label="Manage Leave Types" 
            severity="secondary"
            @click="navigateTo('/leave/types')"
          />
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.pending_requests || 0 }}</p>
            </div>
            <i class="pi pi-clock text-3xl text-orange-500"></i>
          </div>
        </template>
      </PCard>

      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Approved This Month</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.approved_this_month || 0 }}</p>
            </div>
            <i class="pi pi-check-circle text-3xl text-green-500"></i>
          </div>
        </template>
      </PCard>

      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leave Days</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.total_leave_days || 0 }}</p>
            </div>
            <i class="pi pi-calendar text-3xl text-blue-500"></i>
          </div>
        </template>
      </PCard>

      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Leave Balance</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.leave_balance || 0 }}</p>
            </div>
            <i class="pi pi-wallet text-3xl text-purple-500"></i>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Filters and Search -->
    <PCard class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="md:col-span-2">
            <div class="p-input-icon-left">
              <i class="pi pi-search" />
              <PInputText 
                v-model="filters.search" 
                placeholder="Search leave requests..."
                class="w-full"
                @input="onSearch"
              />
            </div>
          </div>
          <PDropdown 
            v-model="filters.status" 
            :options="statusOptions" 
            option-label="label"
            option-value="value"
            placeholder="All Status"
            @change="loadLeaveRequests"
          />
          <PDropdown 
            v-model="filters.leave_type" 
            :options="leaveTypeOptions" 
            option-label="name"
            option-value="id"
            placeholder="All Leave Types"
            @change="loadLeaveRequests"
          />
          <PDropdown 
            v-model="filters.employee" 
            :options="employeeOptions" 
            option-label="full_name"
            option-value="id"
            placeholder="All Employees"
            @change="loadLeaveRequests"
          />
        </div>
      </template>
    </PCard>

    <!-- Leave Requests Table -->
    <PCard>
      <template #title>
        <div class="flex justify-between items-center">
          <span>Leave Requests ({{ totalRecords }})</span>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-refresh" 
              @click="loadLeaveRequests"
              :loading="isLoading"
              text
              size="small"
            />
            <Button 
              icon="pi pi-download" 
              @click="exportLeaveRequests"
              text
              size="small"
            />
          </div>
        </div>
      </template>
      <template #content>
        <PDataTable 
          :value="leaveRequests" 
          :loading="isLoading"
          :paginator="true"
          :rows="pagination.rows"
          :total-records="totalRecords"
          :lazy="true"
          @page="onPageChange"
          @sort="onSort"
          :sort-field="pagination.sortField"
          :sort-order="pagination.sortOrder"
          :rows-per-page-options="[10, 25, 50]"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          current-page-report-template="Showing {first} to {last} of {totalRecords} requests"
        >
          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-calendar-times text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400">No leave requests found</p>
            </div>
          </template>

          <PColumn field="employee_name" header="Employee" :sortable="true">
            <template #body="{ data }">
              <div class="flex items-center space-x-3">
                <PAvatar 
                  :label="data.employee_name?.charAt(0) || 'E'" 
                  size="small"
                  :class="getStatusColor(data.status)"
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ data.employee_name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ data.leave_type_name }}
                  </div>
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="start_date" header="Start Date" :sortable="true">
            <template #body="{ data }">
              <div>
                <div class="font-medium">{{ formatDate(data.start_date) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getDayOfWeek(data.start_date) }}
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="end_date" header="End Date" :sortable="true">
            <template #body="{ data }">
              <div>
                <div class="font-medium">{{ formatDate(data.end_date) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getDayOfWeek(data.end_date) }}
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="days_requested" header="Days" :sortable="true">
            <template #body="{ data }">
              <div class="text-center">
                <div class="text-lg font-bold text-blue-600">{{ data.days_requested }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">days</div>
              </div>
            </template>
          </PColumn>

          <PColumn field="status" header="Status" :sortable="true">
            <template #body="{ data }">
              <PTag 
                :value="formatStatus(data.status)" 
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </PColumn>

          <PColumn field="reason" header="Reason">
            <template #body="{ data }">
              <div class="max-w-xs">
                <p class="truncate" :title="data.reason">{{ data.reason }}</p>
              </div>
            </template>
          </PColumn>

          <PColumn field="created_at" header="Requested" :sortable="true">
            <template #body="{ data }">
              <div>
                <div class="text-sm">{{ formatDate(data.created_at) }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getTimeAgo(data.created_at) }}
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn header="Actions" :exportable="false" style="min-width: 10rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-eye" 
                  size="small"
                  text
                  @click="viewLeaveRequest(data)"
                  v-tooltip.top="'View Details'"
                />
                <Button 
                  v-if="data.status === 'pending'"
                  icon="pi pi-check" 
                  size="small"
                  text
                  severity="success"
                  @click="approveLeaveRequest(data)"
                  v-tooltip.top="'Approve'"
                />
                <Button 
                  v-if="data.status === 'pending'"
                  icon="pi pi-times" 
                  size="small"
                  text
                  severity="danger"
                  @click="rejectLeaveRequest(data)"
                  v-tooltip.top="'Reject'"
                />
                <Button 
                  icon="pi pi-pencil" 
                  size="small"
                  text
                  @click="editLeaveRequest(data)"
                  v-tooltip.top="'Edit'"
                />
              </div>
            </template>
          </PColumn>
        </PDataTable>
      </template>
    </PCard>

    <!-- Leave Request Dialog -->
    <PDialog 
      v-model:visible="showRequestDialog" 
      :header="editingRequest ? 'Edit Leave Request' : 'Request Leave'"
      :modal="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <LeaveRequestForm 
        :request="editingRequest"
        @close="showRequestDialog = false"
        @save="onLeaveRequestSave"
      />
    </PDialog>

    <!-- Leave Request Details Dialog -->
    <PDialog 
      v-model:visible="showDetailsDialog" 
      :header="selectedRequest?.employee_name + ' - Leave Request'"
      :modal="true"
      :style="{ width: '50rem' }"
    >
      <LeaveRequestDetails 
        v-if="selectedRequest" 
        :request="selectedRequest"
        @close="showDetailsDialog = false"
        @edit="editLeaveRequest"
        @approve="approveLeaveRequest"
        @reject="rejectLeaveRequest"
      />
    </PDialog>

    <!-- Approve/Reject Dialog -->
    <PDialog 
      v-model:visible="showActionDialog" 
      :header="actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'"
      :modal="true"
      :style="{ width: '30rem' }"
    >
      <div class="space-y-4">
        <FormField
          v-model="actionReason"
          label="Reason"
          type="textarea"
          :error="actionErrors.reason"
        />
        <div class="flex justify-end gap-3">
          <Button 
            label="Cancel" 
            severity="secondary"
            @click="showActionDialog = false"
          />
          <Button 
            :label="actionType === 'approve' ? 'Approve' : 'Reject'"
            :severity="actionType === 'approve' ? 'success' : 'danger'"
            @click="confirmAction"
            :loading="isActionLoading"
          />
        </div>
      </div>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useFormValidation } from '~/composables/formValidation'
import type { LeaveRequest, PaginatedResponse } from '~/types/hrms'

// Meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Composables
const toast = useToast()
const { validateForm, errors: actionErrors, clearErrors } = useFormValidation()

// State
const leaveRequests = ref<LeaveRequest[]>([])
const employees = ref<any[]>([])
const leaveTypes = ref<any[]>([])
const isLoading = ref(false)
const isActionLoading = ref(false)
const totalRecords = ref(0)
const showRequestDialog = ref(false)
const showDetailsDialog = ref(false)
const showActionDialog = ref(false)
const selectedRequest = ref<LeaveRequest | null>(null)
const editingRequest = ref<LeaveRequest | null>(null)
const actionType = ref<'approve' | 'reject'>('approve')
const actionReason = ref('')

const stats = ref({
  pending_requests: 0,
  approved_this_month: 0,
  total_leave_days: 0,
  leave_balance: 0
})

const filters = ref({
  search: '',
  status: null,
  leave_type: null,
  employee: null
})

const pagination = ref({
  first: 0,
  rows: 25,
  sortField: 'created_at',
  sortOrder: -1
})

// Options
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' }
]

const employeeOptions = computed(() => [
  { id: null, full_name: 'All Employees' },
  ...employees.value
])

const leaveTypeOptions = computed(() => [
  { id: null, name: 'All Leave Types' },
  ...leaveTypes.value
])

// Methods
const loadLeaveRequests = async () => {
  isLoading.value = true
  try {
    const params: any = {
      page: Math.floor(pagination.value.first / pagination.value.rows) + 1,
      per_page: pagination.value.rows,
      ordering: pagination.value.sortOrder === 1 ? pagination.value.sortField : `-${pagination.value.sortField}`
    }

    if (filters.value.search) {
      params.search = filters.value.search
    }
    if (filters.value.status) {
      params.status = filters.value.status
    }
    if (filters.value.leave_type) {
      params.leave_type = filters.value.leave_type
    }
    if (filters.value.employee) {
      params.employee = filters.value.employee
    }

    const response = await $fetch<PaginatedResponse<LeaveRequest>>('/api/v1/attendance/leave-requests/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params
    })

    leaveRequests.value = response.results
    totalRecords.value = response.count
  } catch (error) {
    console.error('Error loading leave requests:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load leave requests',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const loadEmployees = async () => {
  try {
    const response = await $fetch<PaginatedResponse<any>>('/api/v1/employees/employees/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100, status: 'active' }
    })
    employees.value = response.results
  } catch (error) {
    console.error('Error loading employees:', error)
  }
}

const loadLeaveTypes = async () => {
  try {
    const response = await $fetch<PaginatedResponse<any>>('/api/v1/attendance/leave-types/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100 }
    })
    leaveTypes.value = response.results
  } catch (error) {
    console.error('Error loading leave types:', error)
  }
}

const onSearch = useDebounceFn(() => {
  pagination.value.first = 0
  loadLeaveRequests()
}, 500)

const onPageChange = (event: any) => {
  pagination.value.first = event.first
  pagination.value.rows = event.rows
  loadLeaveRequests()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  loadLeaveRequests()
}

const viewLeaveRequest = (request: LeaveRequest) => {
  selectedRequest.value = request
  showDetailsDialog.value = true
}

const editLeaveRequest = (request: LeaveRequest) => {
  editingRequest.value = request
  showRequestDialog.value = true
}

const approveLeaveRequest = (request: LeaveRequest) => {
  selectedRequest.value = request
  actionType.value = 'approve'
  actionReason.value = ''
  showActionDialog.value = true
}

const rejectLeaveRequest = (request: LeaveRequest) => {
  selectedRequest.value = request
  actionType.value = 'reject'
  actionReason.value = ''
  showActionDialog.value = true
}

const confirmAction = async () => {
  if (!selectedRequest.value) return

  clearErrors()
  
  const validation = validateForm({ reason: actionReason.value }, {
    reason: { required: actionType.value === 'reject' }
  })

  if (!validation.isValid) {
    actionErrors.value = validation.errors
    return
  }

  isActionLoading.value = true

  try {
    const endpoint = actionType.value === 'approve' 
      ? `/api/v1/attendance/leave-requests/${selectedRequest.value.id}/approve/`
      : `/api/v1/attendance/leave-requests/${selectedRequest.value.id}/reject/`

    await $fetch(endpoint, {
      method: 'POST',
      baseURL: useRuntimeConfig().public.apiUrl,
      body: {
        action: actionType.value,
        reason: actionReason.value
      }
    })

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Leave request ${actionType.value}d successfully`,
      life: 3000
    })

    showActionDialog.value = false
    loadLeaveRequests()
  } catch (error) {
    console.error(`Error ${actionType.value}ing leave request:`, error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to ${actionType.value} leave request`,
      life: 3000
    })
  } finally {
    isActionLoading.value = false
  }
}

const onLeaveRequestSave = () => {
  showRequestDialog.value = false
  editingRequest.value = null
  loadLeaveRequests()
}

const exportLeaveRequests = () => {
  // TODO: Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality coming soon',
    life: 3000
  })
}

// Utility functions
const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusSeverity = (status: string) => {
  const severities = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    cancelled: 'secondary'
  }
  return severities[status as keyof typeof severities] || 'secondary'
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
    cancelled: 'bg-gray-100 text-gray-600'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getDayOfWeek = (dateString: string) => {
  return new Date(dateString).toLocaleDateString([], { weekday: 'long' })
}

const getTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

// Lifecycle
onMounted(() => {
  loadLeaveRequests()
  loadEmployees()
  loadLeaveTypes()
})
</script>

<style scoped>
.leave-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1.5rem;
}
</style>
