<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Attendance & Time Tracking</h1>
        <p class="text-gray-600 mt-1">Monitor employee attendance and manage time records</p>
      </div>
      <div class="flex space-x-2">
        <Button 
          label="Manual Entry" 
          icon="pi pi-plus" 
          @click="showManualEntryDialog = true"
        />
        <SplitButton 
          label="More Actions" 
          :model="moreActions"
          class="p-button-outlined"
        />
      </div>
    </div>
    
    <!-- Today's Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card class="bg-green-50 border-green-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">Present Today</p>
              <p class="text-2xl font-bold text-green-900">{{ todayStats.present }}</p>
              <p class="text-xs text-green-500 mt-1">{{ attendanceRate }}% attendance</p>
            </div>
            <i class="pi pi-check-circle text-green-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-red-50 border-red-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-600 text-sm font-medium">Absent Today</p>
              <p class="text-2xl font-bold text-red-900">{{ todayStats.absent }}</p>
              <p class="text-xs text-red-500 mt-1">{{ absentRate }}% absent</p>
            </div>
            <i class="pi pi-times-circle text-red-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-orange-50 border-orange-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">Late Arrivals</p>
              <p class="text-2xl font-bold text-orange-900">{{ todayStats.late }}</p>
              <p class="text-xs text-orange-500 mt-1">Late check-ins</p>
            </div>
            <i class="pi pi-clock text-orange-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-purple-50 border-purple-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">On Leave</p>
              <p class="text-2xl font-bold text-purple-900">{{ todayStats.onLeave }}</p>
              <p class="text-xs text-purple-500 mt-1">Approved leaves</p>
            </div>
            <i class="pi pi-calendar text-purple-500 text-2xl"></i>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Date Range and Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Date Range</label>
            <Calendar 
              v-model="dateRange" 
              selectionMode="range" 
              :manualInput="false"
              dateFormat="mm/dd/yy"
              placeholder="Select date range"
              class="w-full"
              @date-select="fetchAttendanceRecords"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Department</label>
            <Dropdown 
              v-model="filters.department" 
              :options="departmentOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Departments"
              class="w-full"
              @change="fetchAttendanceRecords"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <Dropdown 
              v-model="filters.status" 
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              class="w-full"
              @change="fetchAttendanceRecords"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Employee</label>
            <AutoComplete 
              v-model="filters.employee" 
              :suggestions="employeeSuggestions"
              @complete="searchEmployees"
              field="name"
              placeholder="Search employee"
              class="w-full"
              @item-select="fetchAttendanceRecords"
            />
          </div>
          <div class="flex items-end">
            <Button 
              label="Clear Filters" 
              class="p-button-outlined w-full"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>
    </Card>
    
    <!-- Attendance Records -->
    <Card>
      <template #header>
        <div class="flex justify-between items-center p-6 pb-0">
          <h3 class="text-lg font-semibold">Attendance Records</h3>
          <div class="flex items-center space-x-2">
            <Button 
              icon="pi pi-refresh" 
              class="p-button-text p-button-sm" 
              @click="fetchAttendanceRecords"
              v-tooltip="'Refresh'"
            />
            <Button 
              icon="pi pi-download" 
              class="p-button-text p-button-sm" 
              @click="exportAttendance"
              v-tooltip="'Export'"
            />
          </div>
        </div>
      </template>
      
      <template #content>
        <DataTable 
          :value="attendanceRecords" 
          :loading="loading"
          paginator 
          :rows="20"
          :totalRecords="totalRecords"
          :lazy="true"
          @page="onPage"
          @sort="onSort"
          sortMode="single"
          dataKey="id"
          :rowHover="true"
          class="p-datatable-sm"
        >
          <Column field="employee" header="Employee" sortable>
            <template #body="slotProps">
              <div class="flex items-center space-x-3">
                <Avatar 
                  :label="getEmployeeInitials(slotProps.data.employee)" 
                  size="normal" 
                  shape="circle" 
                  :class="getAvatarColor(slotProps.data.employee.email)"
                />
                <div>
                  <p class="font-medium">{{ slotProps.data.employee.first_name }} {{ slotProps.data.employee.last_name }}</p>
                  <p class="text-sm text-gray-500">{{ slotProps.data.employee.employee_id }}</p>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="date" header="Date" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ formatDate(slotProps.data.date) }}
              </div>
            </template>
          </Column>
          
          <Column field="check_in" header="Check In" sortable>
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-mono">
                  {{ slotProps.data.check_in ? formatTime(slotProps.data.check_in) : '--:--' }}
                </span>
                <Badge 
                  v-if="slotProps.data.check_in && isLateCheckIn(slotProps.data)"
                  value="Late" 
                  severity="warning"
                  class="text-xs"
                />
              </div>
            </template>
          </Column>
          
          <Column field="check_out" header="Check Out" sortable>
            <template #body="slotProps">
              <span class="text-sm font-mono">
                {{ slotProps.data.check_out ? formatTime(slotProps.data.check_out) : '--:--' }}
              </span>
            </template>
          </Column>
          
          <Column field="total_hours" header="Total Hours" sortable>
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium">
                  {{ slotProps.data.total_hours ? formatHours(slotProps.data.total_hours) : '0.00' }}
                </span>
                <Badge 
                  v-if="slotProps.data.overtime_hours > 0"
                  :value="`+${formatHours(slotProps.data.overtime_hours)} OT`" 
                  severity="info"
                  class="text-xs"
                />
              </div>
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Badge 
                :value="getStatusLabel(slotProps.data.status)" 
                :severity="getStatusSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
          
          <Column field="break_duration" header="Break Time">
            <template #body="slotProps">
              <span class="text-sm">
                {{ slotProps.data.break_duration ? formatMinutes(slotProps.data.break_duration) : '0m' }}
              </span>
            </template>
          </Column>
          
          <Column header="Actions" :exportable="false">
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-eye" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'View Details'"
                  @click="viewAttendanceDetail(slotProps.data)"
                />
                <Button 
                  icon="pi pi-pencil" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'Edit'"
                  @click="editAttendance(slotProps.data)"
                  v-if="canEditAttendance(slotProps.data)"
                />
                <SplitButton 
                  :model="getAttendanceActions(slotProps.data)"
                  class="p-button-text p-button-sm"
                  icon="pi pi-ellipsis-v"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Manual Entry Dialog -->
    <Dialog 
      v-model:visible="showManualEntryDialog" 
      header="Manual Attendance Entry" 
      :modal="true"
      class="w-full max-w-md"
    >
      <form @submit.prevent="createManualEntry" class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Employee *</label>
          <Dropdown
            v-model="manualEntryForm.employee"
            :options="employees"
            optionLabel="name"
            optionValue="id"
            placeholder="Select employee"
            :class="{ 'p-invalid': manualEntryErrors.employee }"
            class="w-full"
            filter
          />
          <small v-if="manualEntryErrors.employee" class="p-error">{{ manualEntryErrors.employee }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Date *</label>
          <Calendar
            v-model="manualEntryForm.date"
            dateFormat="mm/dd/yy"
            :class="{ 'p-invalid': manualEntryErrors.date }"
            class="w-full"
          />
          <small v-if="manualEntryErrors.date" class="p-error">{{ manualEntryErrors.date }}</small>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Check In</label>
            <Calendar
              v-model="manualEntryForm.check_in"
              timeOnly
              hourFormat="12"
              placeholder="Select time"
              class="w-full"
            />
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Check Out</label>
            <Calendar
              v-model="manualEntryForm.check_out"
              timeOnly
              hourFormat="12"
              placeholder="Select time"
              class="w-full"
            />
          </div>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Break Duration (minutes)</label>
          <InputNumber
            v-model="manualEntryForm.break_duration"
            placeholder="0"
            :min="0"
            :max="480"
            class="w-full"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Notes</label>
          <Textarea
            v-model="manualEntryForm.notes"
            placeholder="Optional notes..."
            rows="3"
            class="w-full"
          />
        </div>
      </form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="Cancel"
            class="p-button-secondary"
            @click="closeManualEntryDialog"
          />
          <Button
            label="Create Entry"
            :loading="creatingEntry"
            @click="createManualEntry"
          />
        </div>
      </template>
    </Dialog>
    
    <!-- Attendance Detail Dialog -->
    <Dialog 
      v-model:visible="showDetailDialog" 
      header="Attendance Details" 
      :modal="true"
      class="w-full max-w-2xl"
    >
      <div v-if="selectedRecord" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3">Employee Information</h4>
            <div class="flex items-center space-x-3 mb-4">
              <Avatar 
                :label="getEmployeeInitials(selectedRecord.employee)" 
                size="large" 
                shape="circle" 
                :class="getAvatarColor(selectedRecord.employee.email)"
              />
              <div>
                <p class="font-medium">{{ selectedRecord.employee.first_name }} {{ selectedRecord.employee.last_name }}</p>
                <p class="text-sm text-gray-500">{{ selectedRecord.employee.employee_id }}</p>
                <p class="text-sm text-gray-500">{{ selectedRecord.employee.department?.name }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold mb-3">Time Details</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium">{{ formatDate(selectedRecord.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Check In:</span>
                <span class="font-medium font-mono">{{ selectedRecord.check_in ? formatTime(selectedRecord.check_in) : 'Not recorded' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Check Out:</span>
                <span class="font-medium font-mono">{{ selectedRecord.check_out ? formatTime(selectedRecord.check_out) : 'Not recorded' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Hours:</span>
                <span class="font-medium">{{ selectedRecord.total_hours ? formatHours(selectedRecord.total_hours) : '0.00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Break Time:</span>
                <span class="font-medium">{{ selectedRecord.break_duration ? formatMinutes(selectedRecord.break_duration) : '0m' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Overtime:</span>
                <span class="font-medium">{{ selectedRecord.overtime_hours ? formatHours(selectedRecord.overtime_hours) : '0.00' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedRecord.notes">
          <h4 class="font-semibold mb-2">Notes</h4>
          <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded">{{ selectedRecord.notes }}</p>
        </div>
        
        <div>
          <h4 class="font-semibold mb-2">Status</h4>
          <Badge 
            :value="getStatusLabel(selectedRecord.status)" 
            :severity="getStatusSeverity(selectedRecord.status)"
            class="text-sm"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button 
            label="Edit" 
            icon="pi pi-pencil" 
            @click="editAttendance(selectedRecord)"
            v-if="canEditAttendance(selectedRecord)"
          />
          <Button label="Close" class="p-button-secondary" @click="showDetailDialog = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'tenant',
  middleware: 'tenant-admin'
})

const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()

// Reactive data
const attendanceRecords = ref<any[]>([])
const employees = ref<any[]>([])
const employeeSuggestions = ref<any[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const selectedRecord = ref<any>(null)
const dateRange = ref<Date[]>([])

// Stats
const todayStats = ref({
  present: 0,
  absent: 0,
  late: 0,
  onLeave: 0
})

// Dialogs
const showManualEntryDialog = ref(false)
const showDetailDialog = ref(false)

// Forms
const manualEntryForm = ref({
  employee: null,
  date: new Date(),
  check_in: null,
  check_out: null,
  break_duration: 0,
  notes: ''
})
const manualEntryErrors = ref<Record<string, string>>({})
const creatingEntry = ref(false)

// Filters
const filters = ref({
  department: '',
  status: '',
  employee: null
})

// Pagination
const pagination = ref({
  page: 0,
  rows: 20,
  sortField: 'date',
  sortOrder: -1
})

// Options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Half Day', value: 'half_day' },
  { label: 'On Leave', value: 'on_leave' }
]

const departmentOptions = ref([
  { label: 'All Departments', value: '' }
])

const moreActions = [
  {
    label: 'Import Attendance',
    icon: 'pi pi-upload',
    command: () => console.log('Import attendance')
  },
  {
    label: 'Attendance Report',
    icon: 'pi pi-file-pdf',
    command: () => console.log('Generate report')
  },
  {
    label: 'Leave Management',
    icon: 'pi pi-calendar',
    command: () => navigateTo('/tenant/attendance/leaves')
  }
]

// Computed
const attendanceRate = computed(() => {
  const total = todayStats.value.present + todayStats.value.absent
  if (total === 0) return 0
  return Math.round((todayStats.value.present / total) * 100)
})

const absentRate = computed(() => {
  const total = todayStats.value.present + todayStats.value.absent
  if (total === 0) return 0
  return Math.round((todayStats.value.absent / total) * 100)
})

// Methods
const fetchAttendanceRecords = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: (pagination.value.page + 1).toString(),
      page_size: pagination.value.rows.toString()
    })
    
    if (dateRange.value.length === 2) {
      params.append('date_from', formatDateForAPI(dateRange.value[0]))
      params.append('date_to', formatDateForAPI(dateRange.value[1]))
    }
    if (filters.value.department) params.append('department', filters.value.department)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.employee) params.append('employee', filters.value.employee.id)
    if (pagination.value.sortField) {
      const sortOrder = pagination.value.sortOrder === 1 ? '' : '-'
      params.append('ordering', `${sortOrder}${pagination.value.sortField}`)
    }
    
    const response = await $api(`/api/v1/tenant/attendance/?${params.toString()}`)
    
    attendanceRecords.value = response.results
    totalRecords.value = response.count
    
    // Update today's stats if no date filter
    if (dateRange.value.length === 0) {
      todayStats.value = response.today_stats || todayStats.value
    }
    
  } catch (error) {
    console.error('Failed to fetch attendance records:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch attendance records',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const fetchEmployees = async () => {
  try {
    const response = await $api('/api/v1/tenant/employees/?active=true')
    employees.value = response.results.map((emp: any) => ({
      ...emp,
      name: `${emp.first_name} ${emp.last_name}`
    }))
  } catch (error) {
    console.error('Failed to fetch employees:', error)
  }
}

const fetchDepartments = async () => {
  try {
    const response = await $api('/api/v1/tenant/departments/')
    departmentOptions.value = [
      { label: 'All Departments', value: '' },
      ...(response.results || []).map((dept: any) => ({ label: dept.name, value: dept.id }))
    ]
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  }
}

const searchEmployees = (event: any) => {
  const query = event.query.toLowerCase()
  employeeSuggestions.value = employees.value.filter(emp => 
    emp.name.toLowerCase().includes(query)
  )
}

const onPage = (event: any) => {
  pagination.value.page = event.page
  pagination.value.rows = event.rows
  fetchAttendanceRecords()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  fetchAttendanceRecords()
}

const clearFilters = () => {
  filters.value = {
    department: '',
    status: '',
    employee: null
  }
  dateRange.value = []
  pagination.value.page = 0
  fetchAttendanceRecords()
}

const viewAttendanceDetail = (record: any) => {
  selectedRecord.value = record
  showDetailDialog.value = true
}

const editAttendance = (record: any) => {
  navigateTo(`/tenant/attendance/${record.id}/edit`)
}

const canEditAttendance = (record: any) => {
  // Allow editing if record is within last 7 days and user has permission
  const recordDate = new Date(record.date)
  const daysDiff = Math.floor((Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= 7 && authStore.hasPermission('attendance.update')
}

const getAttendanceActions = (record: any) => {
  const actions = []
  
  actions.push({
    label: 'View Employee Profile',
    icon: 'pi pi-user',
    command: () => navigateTo(`/tenant/employees/${record.employee.id}`)
  })
  
  if (record.status === 'absent') {
    actions.push({
      label: 'Mark Present',
      icon: 'pi pi-check',
      command: () => updateAttendanceStatus(record, 'present')
    })
  }
  
  if (canEditAttendance(record)) {
    actions.push({
      label: 'Add Note',
      icon: 'pi pi-comment',
      command: () => console.log('Add note to', record.id)
    })
  }
  
  return actions
}

const updateAttendanceStatus = async (record: any, status: string) => {
  try {
    await $api(`/api/v1/tenant/attendance/${record.id}/`, {
      method: 'PATCH',
      body: { status }
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Attendance status updated',
      life: 3000
    })
    
    fetchAttendanceRecords()
  } catch (error) {
    console.error('Failed to update attendance status:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update attendance status',
      life: 3000
    })
  }
}

const createManualEntry = async () => {
  try {
    creatingEntry.value = true
    manualEntryErrors.value = {}
    
    await $api('/api/v1/tenant/attendance/', {
      method: 'POST',
      body: {
        ...manualEntryForm.value,
        date: formatDateForAPI(manualEntryForm.value.date),
        check_in: manualEntryForm.value.check_in ? formatTimeForAPI(manualEntryForm.value.check_in) : null,
        check_out: manualEntryForm.value.check_out ? formatTimeForAPI(manualEntryForm.value.check_out) : null
      }
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Manual attendance entry created',
      life: 3000
    })
    
    closeManualEntryDialog()
    fetchAttendanceRecords()
  } catch (error: any) {
    if (error.data?.errors) {
      manualEntryErrors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create attendance entry',
        life: 3000
      })
    }
  } finally {
    creatingEntry.value = false
  }
}

const closeManualEntryDialog = () => {
  showManualEntryDialog.value = false
  manualEntryForm.value = {
    employee: null,
    date: new Date(),
    check_in: null,
    check_out: null,
    break_duration: 0,
    notes: ''
  }
  manualEntryErrors.value = {}
}

const exportAttendance = () => {
  // TODO: Implement attendance export
  console.log('Export attendance')
}

// Utility functions
const getEmployeeInitials = (employee: any) => {
  return (employee.first_name?.charAt(0) || '') + (employee.last_name?.charAt(0) || '')
}

const getAvatarColor = (email: string) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500']
  const index = email.length % colors.length
  return colors[index]
}

const getStatusLabel = (status: string) => {
  const labels = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    half_day: 'Half Day',
    on_leave: 'On Leave'
  }
  return labels[status] || status
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'present': return 'success'
    case 'absent': return 'danger'
    case 'late': return 'warning'
    case 'half_day': return 'info'
    case 'on_leave': return 'secondary'
    default: return 'secondary'
  }
}

const isLateCheckIn = (record: any) => {
  if (!record.check_in || !record.employee.shift?.start_time) return false
  
  const checkIn = new Date(`${record.date}T${record.check_in}`)
  const shiftStart = new Date(`${record.date}T${record.employee.shift.start_time}`)
  
  return checkIn > shiftStart
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatHours = (hours: number) => {
  return hours.toFixed(2)
}

const formatMinutes = (minutes: number) => {
  return `${minutes}m`
}

const formatDateForAPI = (date: Date) => {
  return date.toISOString().split('T')[0]
}

const formatTimeForAPI = (date: Date) => {
  return date.toTimeString().split(' ')[0]
}

// Initialize date range to current week
const initializeDateRange = () => {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
  dateRange.value = [startOfWeek, endOfWeek]
}

// Lifecycle
onMounted(() => {
  initializeDateRange()
  fetchAttendanceRecords()
  fetchEmployees()
  fetchDepartments()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-calendar) {
  width: 100%;
}
</style>
