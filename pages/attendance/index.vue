<template>
  <div class="attendance-page">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Track and manage employee attendance</p>
        </div>
        <div class="flex gap-3">
          <Button 
            icon="pi pi-clock" 
            :label="isClockedIn ? 'Clock Out' : 'Clock In'"
            :severity="isClockedIn ? 'danger' : 'success'"
            @click="toggleClockInOut"
            :loading="isClockLoading"
          />
          <Button 
            icon="pi pi-plus" 
            label="Add Attendance" 
            @click="showAddDialog = true"
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Present Today</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.present_today || 0 }}</p>
            </div>
            <i class="pi pi-check-circle text-3xl text-green-500"></i>
          </div>
        </template>
      </PCard>

      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Absent Today</p>
              <p class="text-3xl font-bold text-red-600">{{ stats.absent_today || 0 }}</p>
            </div>
            <i class="pi pi-times-circle text-3xl text-red-500"></i>
          </div>
        </template>
      </PCard>

      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Late Today</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.late_today || 0 }}</p>
            </div>
            <i class="pi pi-clock text-3xl text-orange-500"></i>
          </div>
        </template>
      </PCard>

      <PCard>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.attendance_rate || 0 }}%</p>
            </div>
            <i class="pi pi-chart-line text-3xl text-blue-500"></i>
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
                placeholder="Search employees..."
                class="w-full"
                @input="onSearch"
              />
            </div>
          </div>
          <PCalendar 
            v-model="filters.date" 
            placeholder="Select Date"
            date-format="yy-mm-dd"
            @date-select="loadAttendance"
          />
          <PDropdown 
            v-model="filters.status" 
            :options="statusOptions" 
            option-label="label"
            option-value="value"
            placeholder="All Status"
            @change="loadAttendance"
          />
          <PDropdown 
            v-model="filters.department" 
            :options="departmentOptions" 
            option-label="name"
            option-value="id"
            placeholder="All Departments"
            @change="loadAttendance"
          />
        </div>
      </template>
    </PCard>

    <!-- Attendance Table -->
    <PCard>
      <template #title>
        <div class="flex justify-between items-center">
          <span>Attendance Records ({{ totalRecords }})</span>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-refresh" 
              @click="loadAttendance"
              :loading="isLoading"
              text
              size="small"
            />
            <Button 
              icon="pi pi-download" 
              @click="exportAttendance"
              text
              size="small"
            />
          </div>
        </div>
      </template>
      <template #content>
        <PDataTable 
          :value="attendanceRecords" 
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
          current-page-report-template="Showing {first} to {last} of {totalRecords} records"
        >
          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-clock text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400">No attendance records found</p>
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
                    {{ data.employee_id }}
                  </div>
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="date" header="Date" :sortable="true">
            <template #body="{ data }">
              <div>
                <div class="font-medium">{{ formatDate(data.date) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getDayOfWeek(data.date) }}
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="check_in" header="Check In" :sortable="true">
            <template #body="{ data }">
              <div v-if="data.check_in">
                <div class="font-medium">{{ formatTime(data.check_in) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getTimeAgo(data.check_in) }}
                </div>
              </div>
              <span v-else class="text-gray-400">-</span>
            </template>
          </PColumn>

          <PColumn field="check_out" header="Check Out" :sortable="true">
            <template #body="{ data }">
              <div v-if="data.check_out">
                <div class="font-medium">{{ formatTime(data.check_out) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getTimeAgo(data.check_out) }}
                </div>
              </div>
              <span v-else class="text-gray-400">-</span>
            </template>
          </PColumn>

          <PColumn field="hours_worked" header="Hours Worked" :sortable="true">
            <template #body="{ data }">
              <div v-if="data.hours_worked">
                <div class="font-medium">{{ data.hours_worked }}h</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ data.overtime_hours || '0' }}h overtime
                </div>
              </div>
              <span v-else class="text-gray-400">-</span>
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

          <PColumn field="shift" header="Shift">
            <template #body="{ data }">
              <span v-if="data.shift" class="text-sm">{{ data.shift }}</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </PColumn>

          <PColumn header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-eye" 
                  size="small"
                  text
                  @click="viewAttendance(data)"
                  v-tooltip.top="'View Details'"
                />
                <Button 
                  icon="pi pi-pencil" 
                  size="small"
                  text
                  @click="editAttendance(data)"
                  v-tooltip.top="'Edit'"
                />
                <Button 
                  icon="pi pi-trash" 
                  size="small"
                  text
                  severity="danger"
                  @click="confirmDelete(data)"
                  v-tooltip.top="'Delete'"
                />
              </div>
            </template>
          </PColumn>
        </PDataTable>
      </template>
    </PCard>

    <!-- Add/Edit Attendance Dialog -->
    <PDialog 
      v-model:visible="showAddDialog" 
      :header="editingAttendance ? 'Edit Attendance' : 'Add Attendance'"
      :modal="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <AttendanceForm 
        :attendance="editingAttendance"
        @close="showAddDialog = false"
        @save="onAttendanceSave"
      />
    </PDialog>

    <!-- Attendance Details Dialog -->
    <PDialog 
      v-model:visible="showDetailsDialog" 
      :header="selectedAttendance?.employee_name + ' - ' + formatDate(selectedAttendance?.date)"
      :modal="true"
      :style="{ width: '40rem' }"
    >
      <AttendanceDetails 
        v-if="selectedAttendance" 
        :attendance="selectedAttendance"
        @close="showDetailsDialog = false"
        @edit="editAttendance"
      />
    </PDialog>

    <!-- Delete Confirmation -->
    <PConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/auth'
import type { Attendance, PaginatedResponse, AttendanceStats } from '~/types/hrms'

// Meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Composables
const confirm = useConfirm()
const toast = useToast()
const authStore = useAuthStore()

// State
const attendanceRecords = ref<Attendance[]>([])
const departments = ref<any[]>([])
const isLoading = ref(false)
const isClockLoading = ref(false)
const totalRecords = ref(0)
const showAddDialog = ref(false)
const showDetailsDialog = ref(false)
const selectedAttendance = ref<Attendance | null>(null)
const editingAttendance = ref<Attendance | null>(null)

const stats = ref<AttendanceStats>({
  present_today: 0,
  absent_today: 0,
  late_today: 0,
  on_leave_today: 0,
  attendance_rate: 0,
  average_hours_worked: 0,
  overtime_hours: 0
})

const filters = ref({
  search: '',
  date: new Date(),
  status: null,
  department: null
})

const pagination = ref({
  first: 0,
  rows: 25,
  sortField: 'date',
  sortOrder: -1
})

// Options
const statusOptions = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Half Day', value: 'half_day' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Holiday', value: 'holiday' },
  { label: 'Weekend', value: 'weekend' }
]

const departmentOptions = computed(() => [
  { id: null, name: 'All Departments' },
  ...departments.value
])

// Computed
const isClockedIn = computed(() => {
  // TODO: Check if current user is clocked in
  return false
})

// Methods
const loadAttendance = async () => {
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
    if (filters.value.date) {
      params.date = filters.value.date.toISOString().split('T')[0]
    }
    if (filters.value.status) {
      params.status = filters.value.status
    }
    if (filters.value.department) {
      params.department = filters.value.department
    }

    const response = await $fetch<PaginatedResponse<Attendance>>('/api/v1/attendance/attendance/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params
    })

    attendanceRecords.value = response.results
    totalRecords.value = response.count
  } catch (error) {
    console.error('Error loading attendance:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load attendance records',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await $fetch<AttendanceStats>('/api/v1/attendance/attendance/statistics/', {
      baseURL: useRuntimeConfig().public.apiUrl
    })
    stats.value = response
  } catch (error) {
    console.error('Error loading attendance stats:', error)
  }
}

const loadDepartments = async () => {
  try {
    const response = await $fetch<PaginatedResponse<any>>('/api/v1/employees/departments/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100 }
    })
    departments.value = response.results
  } catch (error) {
    console.error('Error loading departments:', error)
  }
}

const onSearch = useDebounceFn(() => {
  pagination.value.first = 0
  loadAttendance()
}, 500)

const onPageChange = (event: any) => {
  pagination.value.first = event.first
  pagination.value.rows = event.rows
  loadAttendance()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  loadAttendance()
}

const toggleClockInOut = async () => {
  isClockLoading.value = true
  try {
    if (isClockedIn.value) {
      await $fetch('/api/v1/attendance/clock-out/', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiUrl
      })
      
      toast.add({
        severity: 'success',
        summary: 'Clocked Out',
        detail: 'You have been clocked out successfully',
        life: 3000
      })
    } else {
      await $fetch('/api/v1/attendance/clock-in/', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiUrl
      })
      
      toast.add({
        severity: 'success',
        summary: 'Clocked In',
        detail: 'You have been clocked in successfully',
        life: 3000
      })
    }
    
    loadAttendance()
    loadStats()
  } catch (error) {
    console.error('Error toggling clock in/out:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to clock in/out',
      life: 3000
    })
  } finally {
    isClockLoading.value = false
  }
}

const viewAttendance = (attendance: Attendance) => {
  selectedAttendance.value = attendance
  showDetailsDialog.value = true
}

const editAttendance = (attendance: Attendance) => {
  editingAttendance.value = attendance
  showAddDialog.value = true
}

const confirmDelete = (attendance: Attendance) => {
  confirm.require({
    message: `Are you sure you want to delete this attendance record?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteAttendance(attendance.id)
  })
}

const deleteAttendance = async (id: string) => {
  try {
    await $fetch(`/api/v1/attendance/attendance/${id}/`, {
      method: 'DELETE',
      baseURL: useRuntimeConfig().public.apiUrl
    })

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Attendance record deleted successfully',
      life: 3000
    })

    loadAttendance()
  } catch (error) {
    console.error('Error deleting attendance:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete attendance record',
      life: 3000
    })
  }
}

const onAttendanceSave = () => {
  showAddDialog.value = false
  editingAttendance.value = null
  loadAttendance()
  loadStats()
}

const exportAttendance = () => {
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
    present: 'success',
    absent: 'danger',
    late: 'warning',
    half_day: 'info',
    on_leave: 'secondary',
    holiday: 'info',
    weekend: 'secondary'
  }
  return severities[status as keyof typeof severities] || 'secondary'
}

const getStatusColor = (status: string) => {
  const colors = {
    present: 'bg-green-100 text-green-600',
    absent: 'bg-red-100 text-red-600',
    late: 'bg-orange-100 text-orange-600',
    half_day: 'bg-blue-100 text-blue-600',
    on_leave: 'bg-yellow-100 text-yellow-600',
    holiday: 'bg-purple-100 text-purple-600',
    weekend: 'bg-gray-100 text-gray-600'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getDayOfWeek = (dateString: string) => {
  return new Date(dateString).toLocaleDateString([], { weekday: 'long' })
}

const getTimeAgo = (timeString: string) => {
  const now = new Date()
  const time = new Date(timeString)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
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
  loadAttendance()
  loadStats()
  loadDepartments()
})
</script>

<style scoped>
.attendance-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1.5rem;
}
</style>
