<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Attendance Management</h1>
            <p class="text-600 mt-2 mb-0">Track and manage employee attendance</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Export Report" 
              icon="pi pi-download" 
              class="p-button-outlined"
              @click="exportReport"
            />
            <PButton 
              label="Clock In/Out" 
              icon="pi pi-clock" 
              @click="showClockDialog = true"
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
              <span class="block text-500 font-medium mb-3">Present Today</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.presentToday }}</div>
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
              <span class="block text-500 font-medium mb-3">Absent Today</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.absentToday }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-times-circle text-red-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">Late Arrivals</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.lateArrivals }}</div>
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
              <span class="block text-500 font-medium mb-3">On Leave</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.onLeave }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-calendar text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Clock In/Out Section -->
    <div class="col-12 lg:col-4">
      <PCard>
        <template #title>Quick Clock In/Out</template>
        <template #content>
          <div class="text-center">
            <div class="mb-4">
              <i class="pi pi-clock text-6xl text-primary-500"></i>
            </div>
            <div class="text-2xl font-bold text-900 mb-2">{{ currentTime }}</div>
            <div class="text-600 mb-4">{{ currentDate }}</div>
            
            <div v-if="!isClockedIn" class="mb-4">
              <PButton 
                label="Clock In" 
                icon="pi pi-play" 
                class="w-full"
                @click="clockIn"
                :loading="clockingIn"
              />
            </div>
            
            <div v-else class="mb-4">
              <PButton 
                label="Clock Out" 
                icon="pi pi-stop" 
                class="w-full p-button-danger"
                @click="clockOut"
                :loading="clockingOut"
              />
            </div>
            
            <div v-if="isClockedIn" class="text-center">
              <div class="text-600 text-sm">Clocked in at:</div>
              <div class="font-medium">{{ clockInTime }}</div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Attendance Chart -->
    <div class="col-12 lg:col-8">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Attendance Trend</span>
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
          <PChart type="line" :data="chartData" :options="chartOptions" style="height: 300px" />
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
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="employee" class="font-medium">Employee</label>
                <PDropdown 
                  id="employee"
                  v-model="filters.employee" 
                  :options="employeeOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Employees"
                  class="w-full"
                />
              </div>
            </div>
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
          </div>
        </template>
      </PCard>
    </div>

    <!-- Attendance Records -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Attendance Records</span>
            <div class="flex align-items-center gap-2">
              <PButton 
                icon="pi pi-refresh" 
                class="p-button-outlined p-button-sm"
                @click="refreshData"
                :loading="loading"
              />
              <PButton 
                label="Add Record" 
                icon="pi pi-plus" 
                class="p-button-outlined p-button-sm"
                @click="showAddDialog = true"
              />
            </div>
          </div>
        </template>
        <template #content>
          <PDataTable 
            :value="attendanceRecords" 
            :paginator="true" 
            :rows="20"
            :filters="filters"
            filterDisplay="row"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['employee.full_name', 'employee.employee_id']"
            responsiveLayout="scroll"
            :scrollable="true"
            scrollHeight="600px"
          >
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-calendar text-4xl text-400 mb-3"></i>
                <p class="text-600">No attendance records found</p>
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
            
            <PColumn field="date" header="Date" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>{{ formatDate(data.date) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="check_in" header="Check In" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span v-if="data.check_in">{{ formatTime(data.check_in) }}</span>
                <span v-else class="text-500">-</span>
              </template>
            </PColumn>
            
            <PColumn field="check_out" header="Check Out" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span v-if="data.check_out">{{ formatTime(data.check_out) }}</span>
                <span v-else class="text-500">-</span>
              </template>
            </PColumn>
            
            <PColumn field="hours_worked" header="Hours" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span>{{ data.hours_worked || '-' }}</span>
              </template>
            </PColumn>
            
            <PColumn field="status" header="Status" sortable style="min-width: 120px">
              <template #body="{ data }">
                <PTag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
            </PColumn>
            
            <PColumn field="overtime_hours" header="Overtime" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span>{{ data.overtime_hours || '-' }}</span>
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 120px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-pencil" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Edit Record'"
                    @click="editRecord(data)" 
                  />
                  <PButton 
                    icon="pi pi-trash" 
                    class="p-button-text p-button-sm p-button-danger"
                    v-tooltip.top="'Delete Record'"
                    @click="deleteRecord(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>
        </template>
      </PCard>
    </div>

    <!-- Clock In/Out Dialog -->
    <PDialog 
      v-model:visible="showClockDialog" 
      header="Clock In/Out" 
      :style="{ width: '400px' }"
      :modal="true"
    >
      <div class="text-center">
        <div class="mb-4">
          <i class="pi pi-clock text-6xl text-primary-500"></i>
        </div>
        <div class="text-2xl font-bold text-900 mb-2">{{ currentTime }}</div>
        <div class="text-600 mb-4">{{ currentDate }}</div>
        
        <div class="field">
          <label for="notes" class="font-medium">Notes (Optional)</label>
          <PTextarea 
            id="notes"
            v-model="clockNotes" 
            placeholder="Add any notes..."
            rows="3"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <PButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="showClockDialog = false" 
        />
        <PButton 
          :label="isClockedIn ? 'Clock Out' : 'Clock In'" 
          :icon="isClockedIn ? 'pi pi-stop' : 'pi pi-play'"
          :class="isClockedIn ? 'p-button-danger' : ''"
          @click="isClockedIn ? clockOut() : clockIn()" 
        />
      </template>
    </PDialog>

    <!-- Add/Edit Record Dialog -->
    <PDialog 
      v-model:visible="showAddDialog" 
      :header="editingRecord ? 'Edit Attendance Record' : 'Add Attendance Record'" 
      :style="{ width: '600px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="employee" class="font-medium">Employee *</label>
            <PDropdown 
              id="employee"
              v-model="recordForm.employee_id" 
              :options="employeeOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Employee"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="date" class="font-medium">Date *</label>
            <PCalendar 
              id="date"
              v-model="recordForm.date" 
              dateFormat="yy-mm-dd"
              placeholder="Select Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="checkIn" class="font-medium">Check In Time</label>
            <PCalendar 
              id="checkIn"
              v-model="recordForm.check_in" 
              timeOnly
              placeholder="Select Time"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="checkOut" class="font-medium">Check Out Time</label>
            <PCalendar 
              id="checkOut"
              v-model="recordForm.check_out" 
              timeOnly
              placeholder="Select Time"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="status" class="font-medium">Status *</label>
            <PDropdown 
              id="status"
              v-model="recordForm.status" 
              :options="statusOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Status"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="overtime" class="font-medium">Overtime Hours</label>
            <PInputNumber 
              id="overtime"
              v-model="recordForm.overtime_hours" 
              placeholder="0"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="notes" class="font-medium">Notes</label>
            <PTextarea 
              id="notes"
              v-model="recordForm.notes" 
              placeholder="Add any notes..."
              rows="3"
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
          @click="closeRecordDialog" 
        />
        <PButton 
          :label="editingRecord ? 'Update' : 'Create'" 
          icon="pi pi-check" 
          @click="saveRecord" 
        />
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

// Reactive data
const loading = ref(false)
const showClockDialog = ref(false)
const showAddDialog = ref(false)
const editingRecord = ref(false)
const clockingIn = ref(false)
const clockingOut = ref(false)
const isClockedIn = ref(false)
const clockInTime = ref('')
const currentTime = ref('')
const currentDate = ref('')
const clockNotes = ref('')

const selectedPeriod = ref('week')

const filters = ref({
  dateFrom: null,
  dateTo: null,
  employee: null,
  status: null
})

const recordForm = ref({
  employee_id: null,
  date: null,
  check_in: null,
  check_out: null,
  status: 'present',
  overtime_hours: null,
  notes: ''
})

// Stats
const stats = ref({
  presentToday: 108,
  absentToday: 12,
  lateArrivals: 5,
  onLeave: 8
})

// Options
const periodOptions = ref([
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 3 Months', value: 'quarter' },
  { label: 'This Year', value: 'year' }
])

const employeeOptions = ref([
  { label: 'John Doe', value: 1 },
  { label: 'Jane Smith', value: 2 },
  { label: 'Mike Johnson', value: 3 }
])

const statusOptions = ref([
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Half Day', value: 'half_day' },
  { label: 'On Leave', value: 'on_leave' }
])

// Mock data
const attendanceRecords = ref([
  {
    id: 1,
    employee: {
      id: 1,
      full_name: 'John Doe',
      employee_id: 'EMP001'
    },
    date: '2024-01-15',
    check_in: '09:00:00',
    check_out: '17:30:00',
    hours_worked: 8.5,
    status: 'present',
    overtime_hours: 0.5,
    notes: ''
  },
  {
    id: 2,
    employee: {
      id: 2,
      full_name: 'Jane Smith',
      employee_id: 'EMP002'
    },
    date: '2024-01-15',
    check_in: '09:15:00',
    check_out: '18:00:00',
    hours_worked: 8.75,
    status: 'late',
    overtime_hours: 0.75,
    notes: 'Traffic delay'
  },
  {
    id: 3,
    employee: {
      id: 3,
      full_name: 'Mike Johnson',
      employee_id: 'EMP003'
    },
    date: '2024-01-15',
    check_in: null,
    check_out: null,
    hours_worked: 0,
    status: 'on_leave',
    overtime_hours: 0,
    notes: 'Sick leave'
  }
])

// Chart data
const chartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Present',
      data: [95, 98, 92, 96, 94, 88, 85],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
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

// Methods
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'present': return 'success'
    case 'absent': return 'danger'
    case 'late': return 'warning'
    case 'half_day': return 'info'
    case 'on_leave': return 'info'
    default: return 'info'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
  currentDate.value = now.toLocaleDateString()
}

const clockIn = async () => {
  clockingIn.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    isClockedIn.value = true
    clockInTime.value = currentTime.value
    showClockDialog.value = false
    clockNotes.value = ''
    toast.add({
      severity: 'success',
      summary: 'Clock In Successful',
      detail: 'You have been clocked in at ' + currentTime.value,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Clock In Failed',
      detail: 'Failed to clock in',
      life: 3000
    })
  } finally {
    clockingIn.value = false
  }
}

const clockOut = async () => {
  clockingOut.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    isClockedIn.value = false
    clockInTime.value = ''
    showClockDialog.value = false
    clockNotes.value = ''
    toast.add({
      severity: 'success',
      summary: 'Clock Out Successful',
      detail: 'You have been clocked out at ' + currentTime.value,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Clock Out Failed',
      detail: 'Failed to clock out',
      life: 3000
    })
  } finally {
    clockingOut.value = false
  }
}

const editRecord = (record: any) => {
  editingRecord.value = true
  recordForm.value = { ...record }
  showAddDialog.value = true
}

const deleteRecord = (record: any) => {
  // TODO: Implement delete functionality
  console.log('Delete record:', record)
}

const closeRecordDialog = () => {
  showAddDialog.value = false
  editingRecord.value = false
  resetRecordForm()
}

const resetRecordForm = () => {
  recordForm.value = {
    employee_id: null,
    date: null,
    check_in: null,
    check_out: null,
    status: 'present',
    overtime_hours: null,
    notes: ''
  }
}

const saveRecord = () => {
  if (editingRecord.value) {
    // Update existing record
    const index = attendanceRecords.value.findIndex(record => record.id === recordForm.value.id)
    if (index !== -1) {
      attendanceRecords.value[index] = { ...recordForm.value }
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Attendance record updated successfully',
      life: 3000
    })
  } else {
    // Create new record
    const newRecord = {
      ...recordForm.value,
      id: attendanceRecords.value.length + 1,
      employee: employeeOptions.value.find(emp => emp.value === recordForm.value.employee_id)
    }
    attendanceRecords.value.unshift(newRecord)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Attendance record created successfully',
      life: 3000
    })
  }
  closeRecordDialog()
}

const refreshData = async () => {
  loading.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'Attendance data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh attendance data',
      life: 3000
    })
  } finally {
    loading.value = false
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

let timeInterval: NodeJS.Timeout

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}
</style>
