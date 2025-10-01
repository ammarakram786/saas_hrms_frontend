<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Payroll Management</h1>
            <p class="text-600 mt-2 mb-0">Manage employee payroll and salary processing</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Generate Payslips" 
              icon="pi pi-file-pdf" 
              class="p-button-outlined"
              @click="generatePayslips"
            />
            <PButton 
              label="Process Payroll" 
              icon="pi pi-cog" 
              @click="showProcessDialog = true"
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
              <span class="block text-500 font-medium mb-3">Current Period</span>
              <div class="text-900 font-bold text-2xl m-0">{{ currentPeriod.name }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-calendar text-blue-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">Total Employees</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.totalEmployees }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-users text-green-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">Gross Payroll</span>
              <div class="text-900 font-bold text-2xl m-0">${{ formatCurrency(stats.grossPayroll) }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-wallet text-purple-500 text-xl"></i>
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
              <span class="block text-500 font-medium mb-3">Net Payroll</span>
              <div class="text-900 font-bold text-2xl m-0">${{ formatCurrency(stats.netPayroll) }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-money-bill text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Payroll Periods -->
    <div class="col-12 lg:col-6">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Payroll Periods</span>
            <PButton 
              label="New Period" 
              icon="pi pi-plus" 
              class="p-button-outlined p-button-sm"
              @click="showPeriodDialog = true"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div v-for="period in payrollPeriods" :key="period.id" class="flex justify-content-between align-items-center p-3 border-round" :class="getPeriodClass(period.status)">
              <div>
                <div class="font-medium">{{ period.name }}</div>
                <div class="text-sm text-500">{{ formatDate(period.start_date) }} - {{ formatDate(period.end_date) }}</div>
              </div>
              <div class="flex align-items-center gap-2">
                <PTag :value="period.status" :severity="getStatusSeverity(period.status)" />
                <PButton 
                  icon="pi pi-eye" 
                  class="p-button-text p-button-sm"
                  @click="viewPeriod(period)"
                />
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Payroll Summary Chart -->
    <div class="col-12 lg:col-6">
      <PCard>
        <template #title>Payroll Summary</template>
        <template #content>
          <PChart type="doughnut" :data="payrollChartData" :options="payrollChartOptions" style="height: 300px" />
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
                <label for="period" class="font-medium">Payroll Period</label>
                <PDropdown 
                  id="period"
                  v-model="filters.period" 
                  :options="periodOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Periods"
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
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="department" class="font-medium">Department</label>
                <PDropdown 
                  id="department"
                  v-model="filters.department" 
                  :options="departmentOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Departments"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Payroll Records Table -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Payroll Records</span>
            <div class="flex align-items-center gap-2">
              <PButton 
                icon="pi pi-refresh" 
                class="p-button-outlined p-button-sm"
                @click="refreshData"
                :loading="loading"
              />
              <PButton 
                label="Export" 
                icon="pi pi-download" 
                class="p-button-outlined p-button-sm"
                @click="exportPayroll"
              />
            </div>
          </div>
        </template>
        <template #content>
          <PDataTable 
            :value="payrollRecords" 
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
                <i class="pi pi-wallet text-4xl text-400 mb-3"></i>
                <p class="text-600">No payroll records found</p>
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
            
            <PColumn field="period.name" header="Period" sortable style="min-width: 150px">
              <template #body="{ data }">
                <span>{{ data.period.name }}</span>
              </template>
            </PColumn>
            
            <PColumn field="base_salary" header="Base Salary" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>${{ formatCurrency(data.base_salary) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="overtime_pay" header="Overtime" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>${{ formatCurrency(data.overtime_pay) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="allowances" header="Allowances" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>${{ formatCurrency(data.allowances) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="gross_pay" header="Gross Pay" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-medium">${{ formatCurrency(data.gross_pay) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="total_deductions" header="Deductions" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="text-red-500">-${{ formatCurrency(data.total_deductions) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="net_pay" header="Net Pay" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-bold text-green-600">${{ formatCurrency(data.net_pay) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="status" header="Status" sortable style="min-width: 120px">
              <template #body="{ data }">
                <PTag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 120px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'View Details'"
                    @click="viewRecord(data)" 
                  />
                  <PButton 
                    icon="pi pi-file-pdf" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Generate Payslip'"
                    @click="generatePayslip(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>
        </template>
      </PCard>
    </div>

    <!-- Process Payroll Dialog -->
    <PDialog 
      v-model:visible="showProcessDialog" 
      header="Process Payroll" 
      :style="{ width: '600px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="period" class="font-medium">Payroll Period *</label>
            <PDropdown 
              id="period"
              v-model="processForm.period_id" 
              :options="periodOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Period"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="payDate" class="font-medium">Pay Date *</label>
            <PCalendar 
              id="payDate"
              v-model="processForm.pay_date" 
              dateFormat="yy-mm-dd"
              placeholder="Select Pay Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <PCheckbox v-model="processForm.generate_payslips" inputId="generatePayslips" />
            <label for="generatePayslips" class="ml-2">Generate Payslips</label>
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <PCheckbox v-model="processForm.send_notifications" inputId="sendNotifications" />
            <label for="sendNotifications" class="ml-2">Send Email Notifications</label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <PButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="closeProcessDialog" 
        />
        <PButton 
          label="Process Payroll" 
          icon="pi pi-cog" 
          @click="processPayroll" 
          :loading="processing"
        />
      </template>
    </PDialog>

    <!-- New Period Dialog -->
    <PDialog 
      v-model:visible="showPeriodDialog" 
      header="Create Payroll Period" 
      :style="{ width: '500px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="periodName" class="font-medium">Period Name *</label>
            <PInputText 
              id="periodName"
              v-model="periodForm.name" 
              placeholder="e.g., January 2024"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="startDate" class="font-medium">Start Date *</label>
            <PCalendar 
              id="startDate"
              v-model="periodForm.start_date" 
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
              v-model="periodForm.end_date" 
              dateFormat="yy-mm-dd"
              placeholder="Select End Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="description" class="font-medium">Description</label>
            <PTextarea 
              id="description"
              v-model="periodForm.description" 
              placeholder="Period description"
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
          @click="closePeriodDialog" 
        />
        <PButton 
          label="Create Period" 
          icon="pi pi-check" 
          @click="createPeriod" 
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
const processing = ref(false)
const showProcessDialog = ref(false)
const showPeriodDialog = ref(false)

const filters = ref({
  period: null,
  employee: null,
  status: null,
  department: null
})

const processForm = ref({
  period_id: null,
  pay_date: null,
  generate_payslips: true,
  send_notifications: true
})

const periodForm = ref({
  name: '',
  start_date: null,
  end_date: null,
  description: ''
})

// Stats
const stats = ref({
  totalEmployees: 125,
  grossPayroll: 125000,
  netPayroll: 95000
})

// Current period
const currentPeriod = ref({
  name: 'January 2024',
  start_date: '2024-01-01',
  end_date: '2024-01-31'
})

// Options
const periodOptions = ref([
  { label: 'January 2024', value: 1 },
  { label: 'December 2023', value: 2 },
  { label: 'November 2023', value: 3 }
])

const employeeOptions = ref([
  { label: 'John Doe', value: 1 },
  { label: 'Jane Smith', value: 2 },
  { label: 'Mike Johnson', value: 3 }
])

const statusOptions = ref([
  { label: 'Draft', value: 'draft' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paid', value: 'paid' }
])

const departmentOptions = ref([
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'HR', value: 'HR' }
])

// Payroll periods
const payrollPeriods = ref([
  {
    id: 1,
    name: 'January 2024',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    status: 'completed'
  },
  {
    id: 2,
    name: 'December 2023',
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    status: 'paid'
  },
  {
    id: 3,
    name: 'November 2023',
    start_date: '2023-11-01',
    end_date: '2023-11-30',
    status: 'paid'
  }
])

// Mock data
const payrollRecords = ref([
  {
    id: 1,
    employee: {
      id: 1,
      full_name: 'John Doe',
      employee_id: 'EMP001'
    },
    period: {
      id: 1,
      name: 'January 2024'
    },
    base_salary: 5000,
    overtime_pay: 500,
    allowances: 200,
    gross_pay: 5700,
    total_deductions: 1200,
    net_pay: 4500,
    status: 'completed'
  },
  {
    id: 2,
    employee: {
      id: 2,
      full_name: 'Jane Smith',
      employee_id: 'EMP002'
    },
    period: {
      id: 1,
      name: 'January 2024'
    },
    base_salary: 4500,
    overtime_pay: 300,
    allowances: 150,
    gross_pay: 4950,
    total_deductions: 1000,
    net_pay: 3950,
    status: 'completed'
  },
  {
    id: 3,
    employee: {
      id: 3,
      full_name: 'Mike Johnson',
      employee_id: 'EMP003'
    },
    period: {
      id: 1,
      name: 'January 2024'
    },
    base_salary: 4000,
    overtime_pay: 200,
    allowances: 100,
    gross_pay: 4300,
    total_deductions: 800,
    net_pay: 3500,
    status: 'completed'
  }
])

// Chart data
const payrollChartData = computed(() => ({
  labels: ['Base Salary', 'Overtime', 'Allowances', 'Deductions'],
  datasets: [
    {
      data: [120000, 15000, 8000, 18000],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ]
    }
  ]
}))

const payrollChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

// Methods
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'processing': return 'warning'
    case 'draft': return 'info'
    case 'paid': return 'success'
    default: return 'info'
  }
}

const getPeriodClass = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-50 border-green-200'
    case 'processing': return 'bg-orange-50 border-orange-200'
    case 'draft': return 'bg-blue-50 border-blue-200'
    case 'paid': return 'bg-green-50 border-green-200'
    default: return 'bg-gray-50 border-gray-200'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const viewRecord = (record: any) => {
  // TODO: Implement view record details
  console.log('View record:', record)
}

const generatePayslip = (record: any) => {
  // TODO: Implement generate payslip
  toast.add({
    severity: 'info',
    summary: 'Generate Payslip',
    detail: 'Payslip generation will be implemented',
    life: 3000
  })
}

const generatePayslips = () => {
  // TODO: Implement generate all payslips
  toast.add({
    severity: 'info',
    summary: 'Generate Payslips',
    detail: 'Bulk payslip generation will be implemented',
    life: 3000
  })
}

const viewPeriod = (period: any) => {
  // TODO: Implement view period details
  console.log('View period:', period)
}

const closeProcessDialog = () => {
  showProcessDialog.value = false
  resetProcessForm()
}

const resetProcessForm = () => {
  processForm.value = {
    period_id: null,
    pay_date: null,
    generate_payslips: true,
    send_notifications: true
  }
}

const processPayroll = async () => {
  processing.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    closeProcessDialog()
    toast.add({
      severity: 'success',
      summary: 'Payroll Processed',
      detail: 'Payroll has been processed successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Processing Failed',
      detail: 'Failed to process payroll',
      life: 3000
    })
  } finally {
    processing.value = false
  }
}

const closePeriodDialog = () => {
  showPeriodDialog.value = false
  resetPeriodForm()
}

const resetPeriodForm = () => {
  periodForm.value = {
    name: '',
    start_date: null,
    end_date: null,
    description: ''
  }
}

const createPeriod = async () => {
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newPeriod = {
      ...periodForm.value,
      id: payrollPeriods.value.length + 1,
      status: 'draft'
    }
    payrollPeriods.value.unshift(newPeriod)
    closePeriodDialog()
    toast.add({
      severity: 'success',
      summary: 'Period Created',
      detail: 'Payroll period has been created successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Creation Failed',
      detail: 'Failed to create payroll period',
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
      detail: 'Payroll data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh payroll data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const exportPayroll = () => {
  // TODO: Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality will be implemented',
    life: 3000
  })
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
</style>
