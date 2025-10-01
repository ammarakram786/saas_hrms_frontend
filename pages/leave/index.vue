<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Leave Management</h1>
            <p class="text-600 mt-2 mb-0">Manage employee leave requests and approvals</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Leave Calendar" 
              icon="pi pi-calendar" 
              class="p-button-outlined"
              @click="showCalendar = true"
            />
            <PButton 
              label="Request Leave" 
              icon="pi pi-plus" 
              @click="showRequestDialog = true"
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
              <span class="block text-500 font-medium mb-3">Pending Requests</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.pendingRequests }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-clock text-orange-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">Approved This Month</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.approvedThisMonth }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-check-circle text-green-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">On Leave Today</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.onLeaveToday }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-calendar-minus text-blue-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">Leave Balance</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.leaveBalance }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-wallet text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Leave Balance Overview -->
    <div class="col-12 lg:col-6">
      <PCard>
        <template #title>My Leave Balance</template>
        <template #content>
          <div class="space-y-4">
            <div v-for="balance in leaveBalances" :key="balance.type" class="flex justify-content-between align-items-center">
              <div>
                <div class="font-medium">{{ balance.type }}</div>
                <div class="text-sm text-500">{{ balance.description }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-lg">{{ balance.available }}/{{ balance.total }}</div>
                <div class="text-sm text-500">days</div>
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Recent Requests -->
    <div class="col-12 lg:col-6">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Recent Requests</span>
            <PButton 
              label="View All" 
              icon="pi pi-arrow-right" 
              class="p-button-text p-button-sm"
              @click="navigateTo('/leave/requests')"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div v-for="request in recentRequests" :key="request.id" class="flex justify-content-between align-items-center p-3 border-round" :class="getRequestClass(request.status)">
              <div>
                <div class="font-medium">{{ request.leave_type }}</div>
                <div class="text-sm text-500">{{ formatDate(request.start_date) }} - {{ formatDate(request.end_date) }}</div>
              </div>
              <PTag :value="request.status" :severity="getStatusSeverity(request.status)" />
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
                <label for="status" class="font-medium">Status</label>
                <PDropdown 
                  id="status"
                  v-model="filters.status" 
                  :options="statusOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Statuses"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="leaveType" class="font-medium">Leave Type</label>
                <PDropdown 
                  id="leaveType"
                  v-model="filters.leaveType" 
                  :options="leaveTypeOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Types"
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

    <!-- Leave Requests Table -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Leave Requests</span>
            <div class="flex align-items-center gap-2">
              <PButton 
                icon="pi pi-refresh" 
                class="p-button-outlined p-button-sm"
                @click="refreshData"
                :loading="loading"
              />
              <PDropdown 
                v-model="selectedView" 
                :options="viewOptions" 
                optionLabel="label" 
                optionValue="value"
                class="w-8rem"
              />
            </div>
          </div>
        </template>
        <template #content>
          <PDataTable 
            :value="leaveRequests" 
            :paginator="true" 
            :rows="20"
            :filters="filters"
            filterDisplay="row"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['employee.full_name', 'leave_type', 'reason']"
            responsiveLayout="scroll"
            :scrollable="true"
            scrollHeight="600px"
          >
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-calendar text-4xl text-400 mb-3"></i>
                <p class="text-600">No leave requests found</p>
              </div>
            </template>
            
            <PColumn field="employee.full_name" header="Employee" sortable style="min-width: 200px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <PAvatar 
                    :label="data.employee.full_name.split(' ').map(n => n[0]).join('')" 
                    shape="circle" 
                    size="normal"
                    class="bg-primary-100 text-primary-700"
                  />
                  <div>
                    <div class="font-medium">{{ data.employee.full_name }}</div>
                    <div class="text-sm text-500">{{ data.employee.employee_id }}</div>
                  </div>
                </div>
              </template>
            </PColumn>
            
            <PColumn field="leave_type" header="Leave Type" sortable style="min-width: 150px">
              <template #body="{ data }">
                <PTag :value="data.leave_type" severity="info" />
              </template>
            </PColumn>
            
            <PColumn field="start_date" header="Start Date" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>{{ formatDate(data.start_date) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="end_date" header="End Date" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>{{ formatDate(data.end_date) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="days" header="Days" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span>{{ data.days }}</span>
              </template>
            </PColumn>
            
            <PColumn field="status" header="Status" sortable style="min-width: 120px">
              <template #body="{ data }">
                <PTag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
            </PColumn>
            
            <PColumn field="reason" header="Reason" sortable style="min-width: 200px">
              <template #body="{ data }">
                <span class="text-ellipsis">{{ data.reason || '-' }}</span>
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'View Details'"
                    @click="viewRequest(data)" 
                  />
                  <PButton 
                    v-if="data.status === 'pending'"
                    icon="pi pi-check" 
                    class="p-button-text p-button-sm p-button-success"
                    v-tooltip.top="'Approve'"
                    @click="approveRequest(data)" 
                  />
                  <PButton 
                    v-if="data.status === 'pending'"
                    icon="pi pi-times" 
                    class="p-button-text p-button-sm p-button-danger"
                    v-tooltip.top="'Reject'"
                    @click="rejectRequest(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>
        </template>
      </PCard>
    </div>

    <!-- Request Leave Dialog -->
    <PDialog 
      v-model:visible="showRequestDialog" 
      header="Request Leave" 
      :style="{ width: '600px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="leaveType" class="font-medium">Leave Type *</label>
            <PDropdown 
              id="leaveType"
              v-model="requestForm.leave_type" 
              :options="leaveTypeOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Leave Type"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="days" class="font-medium">Days *</label>
            <PInputNumber 
              id="days"
              v-model="requestForm.days" 
              :min="1"
              :max="30"
              placeholder="Number of days"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="startDate" class="font-medium">Start Date *</label>
            <PCalendar 
              id="startDate"
              v-model="requestForm.start_date" 
              dateFormat="yy-mm-dd"
              placeholder="Select Start Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="endDate" class="font-medium">End Date *</label>
            <PCalendar 
              id="endDate"
              v-model="requestForm.end_date" 
              dateFormat="yy-mm-dd"
              placeholder="Select End Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="reason" class="font-medium">Reason *</label>
            <PTextarea 
              id="reason"
              v-model="requestForm.reason" 
              placeholder="Please provide a reason for your leave request"
              rows="4"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="emergencyContact" class="font-medium">Emergency Contact</label>
            <PInputText 
              id="emergencyContact"
              v-model="requestForm.emergency_contact" 
              placeholder="Emergency contact information"
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <PButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="closeRequestDialog" 
        />
        <PButton 
          label="Submit Request" 
          icon="pi pi-check" 
          @click="submitRequest" 
        />
      </template>
    </PDialog>

    <!-- Leave Calendar Dialog -->
    <PDialog 
      v-model:visible="showCalendar" 
      header="Leave Calendar" 
      :style="{ width: '800px' }"
      :modal="true"
    >
      <div class="text-center">
        <PCalendar 
          v-model="selectedDate" 
          :inline="true"
          :showWeek="true"
          :showOtherMonths="true"
          :selectOtherMonths="true"
        />
      </div>
      
      <template #footer>
        <PButton 
          label="Close" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="showCalendar = false" 
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
const loading = ref(false)
const showRequestDialog = ref(false)
const showCalendar = ref(false)
const selectedView = ref('table')
const selectedDate = ref(new Date())

const filters = ref({
  status: null,
  leaveType: null,
  dateFrom: null,
  dateTo: null
})

const requestForm = ref({
  leave_type: null,
  days: null,
  start_date: null,
  end_date: null,
  reason: '',
  emergency_contact: ''
})

// Stats
const stats = ref({
  pendingRequests: 8,
  approvedThisMonth: 25,
  onLeaveToday: 12,
  leaveBalance: 15
})

// Leave balances
const leaveBalances = ref([
  {
    type: 'Annual Leave',
    description: 'Vacation days',
    available: 15,
    total: 25
  },
  {
    type: 'Sick Leave',
    description: 'Medical leave',
    available: 8,
    total: 12
  },
  {
    type: 'Personal Leave',
    description: 'Personal matters',
    available: 3,
    total: 5
  },
  {
    type: 'Maternity Leave',
    description: 'Maternity leave',
    available: 90,
    total: 90
  }
])

// Recent requests
const recentRequests = ref([
  {
    id: 1,
    leave_type: 'Annual Leave',
    start_date: '2024-01-20',
    end_date: '2024-01-25',
    status: 'approved'
  },
  {
    id: 2,
    leave_type: 'Sick Leave',
    start_date: '2024-01-15',
    end_date: '2024-01-16',
    status: 'pending'
  },
  {
    id: 3,
    leave_type: 'Personal Leave',
    start_date: '2024-01-10',
    end_date: '2024-01-10',
    status: 'rejected'
  }
])

// Options
const statusOptions = ref([
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' }
])

const leaveTypeOptions = ref([
  { label: 'Annual Leave', value: 'annual' },
  { label: 'Sick Leave', value: 'sick' },
  { label: 'Personal Leave', value: 'personal' },
  { label: 'Maternity Leave', value: 'maternity' },
  { label: 'Paternity Leave', value: 'paternity' },
  { label: 'Emergency Leave', value: 'emergency' }
])

const viewOptions = ref([
  { label: 'Table View', value: 'table' },
  { label: 'Card View', value: 'card' }
])

// Mock data
const leaveRequests = ref([
  {
    id: 1,
    employee: {
      id: 1,
      full_name: 'John Doe',
      employee_id: 'EMP001'
    },
    leave_type: 'Annual Leave',
    start_date: '2024-01-20',
    end_date: '2024-01-25',
    days: 5,
    status: 'pending',
    reason: 'Family vacation',
    emergency_contact: '+1 234 567 8900',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    employee: {
      id: 2,
      full_name: 'Jane Smith',
      employee_id: 'EMP002'
    },
    leave_type: 'Sick Leave',
    start_date: '2024-01-18',
    end_date: '2024-01-19',
    days: 2,
    status: 'approved',
    reason: 'Medical appointment',
    emergency_contact: '+1 234 567 8901',
    created_at: '2024-01-17T14:20:00Z'
  },
  {
    id: 3,
    employee: {
      id: 3,
      full_name: 'Mike Johnson',
      employee_id: 'EMP003'
    },
    leave_type: 'Personal Leave',
    start_date: '2024-01-22',
    end_date: '2024-01-22',
    days: 1,
    status: 'rejected',
    reason: 'Personal matters',
    emergency_contact: '+1 234 567 8902',
    created_at: '2024-01-21T09:15:00Z'
  }
])

// Methods
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'
    case 'cancelled': return 'info'
    default: return 'info'
  }
}

const getRequestClass = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-50 border-green-200'
    case 'pending': return 'bg-orange-50 border-orange-200'
    case 'rejected': return 'bg-red-50 border-red-200'
    case 'cancelled': return 'bg-gray-50 border-gray-200'
    default: return 'bg-gray-50 border-gray-200'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewRequest = (request: any) => {
  // TODO: Implement view request details
  console.log('View request:', request)
}

const approveRequest = async (request: any) => {
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    request.status = 'approved'
    toast.add({
      severity: 'success',
      summary: 'Request Approved',
      detail: 'Leave request has been approved',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Approval Failed',
      detail: 'Failed to approve leave request',
      life: 3000
    })
  }
}

const rejectRequest = async (request: any) => {
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    request.status = 'rejected'
    toast.add({
      severity: 'success',
      summary: 'Request Rejected',
      detail: 'Leave request has been rejected',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Rejection Failed',
      detail: 'Failed to reject leave request',
      life: 3000
    })
  }
}

const closeRequestDialog = () => {
  showRequestDialog.value = false
  resetRequestForm()
}

const resetRequestForm = () => {
  requestForm.value = {
    leave_type: null,
    days: null,
    start_date: null,
    end_date: null,
    reason: '',
    emergency_contact: ''
  }
}

const submitRequest = async () => {
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newRequest = {
      ...requestForm.value,
      id: leaveRequests.value.length + 1,
      employee: {
        id: 1,
        full_name: 'Current User',
        employee_id: 'EMP001'
      },
      status: 'pending',
      created_at: new Date().toISOString()
    }
    leaveRequests.value.unshift(newRequest)
    closeRequestDialog()
    toast.add({
      severity: 'success',
      summary: 'Request Submitted',
      detail: 'Your leave request has been submitted for approval',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: 'Failed to submit leave request',
      life: 3000
    })
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'Leave data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh leave data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Initialize data
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
