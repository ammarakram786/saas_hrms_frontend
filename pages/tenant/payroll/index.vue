<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <p class="text-gray-600 mt-1">Process payroll and manage employee compensation</p>
      </div>
      <div class="flex space-x-2">
        <Button 
          label="Run Payroll" 
          icon="pi pi-play" 
          @click="showRunPayrollDialog = true"
          :disabled="!canRunPayroll"
        />
        <SplitButton 
          label="More Actions" 
          :model="moreActions"
          class="p-button-outlined"
        />
      </div>
    </div>
    
    <!-- Payroll Status Banner -->
    <div v-if="currentPayrollPeriod" class="mb-6">
      <Card class="border-l-4 border-l-blue-500">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-lg">Current Payroll Period</h3>
              <p class="text-gray-600">{{ formatPayrollPeriod(currentPayrollPeriod) }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <Badge 
                  :value="currentPayrollPeriod.status" 
                  :severity="getPayrollStatusSeverity(currentPayrollPeriod.status)"
                />
                <span class="text-sm text-gray-500">
                  {{ currentPayrollPeriod.processed_employees || 0 }}/{{ currentPayrollPeriod.total_employees || 0 }} employees processed
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">
                {{ formatCurrency(currentPayrollPeriod.total_amount || 0) }}
              </p>
              <p class="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card class="bg-green-50 border-green-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">This Month</p>
              <p class="text-2xl font-bold text-green-900">{{ formatCurrency(stats.thisMonth) }}</p>
              <p class="text-xs text-green-500 mt-1">Total payroll</p>
            </div>
            <i class="pi pi-wallet text-green-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-blue-50 border-blue-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Employees Paid</p>
              <p class="text-2xl font-bold text-blue-900">{{ stats.employeesPaid }}</p>
              <p class="text-xs text-blue-500 mt-1">This period</p>
            </div>
            <i class="pi pi-users text-blue-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-orange-50 border-orange-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">Pending</p>
              <p class="text-2xl font-bold text-orange-900">{{ stats.pending }}</p>
              <p class="text-xs text-orange-500 mt-1">Awaiting approval</p>
            </div>
            <i class="pi pi-clock text-orange-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-purple-50 border-purple-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">Overtime</p>
              <p class="text-2xl font-bold text-purple-900">{{ formatCurrency(stats.overtime) }}</p>
              <p class="text-xs text-purple-500 mt-1">This month</p>
            </div>
            <i class="pi pi-stopwatch text-purple-500 text-2xl"></i>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Payroll Period</label>
            <Dropdown 
              v-model="filters.payrollPeriod" 
              :options="payrollPeriodOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select period"
              class="w-full"
              @change="fetchPayrollRecords"
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
              @change="fetchPayrollRecords"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <Dropdown 
              v-model="filters.status" 
              :options="payrollStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              class="w-full"
              @change="fetchPayrollRecords"
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
              @item-select="fetchPayrollRecords"
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
    
    <!-- Payroll Records -->
    <Card>
      <template #header>
        <div class="flex justify-between items-center p-6 pb-0">
          <h3 class="text-lg font-semibold">Payroll Records</h3>
          <div class="flex items-center space-x-2">
            <Button 
              icon="pi pi-refresh" 
              class="p-button-text p-button-sm" 
              @click="fetchPayrollRecords"
              v-tooltip="'Refresh'"
            />
            <Button 
              icon="pi pi-download" 
              class="p-button-text p-button-sm" 
              @click="exportPayroll"
              v-tooltip="'Export'"
            />
          </div>
        </div>
      </template>
      
      <template #content>
        <DataTable 
          :value="payrollRecords" 
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
          
          <Column field="payroll_period" header="Period" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ formatPayrollPeriod(slotProps.data.payroll_period) }}
              </div>
            </template>
          </Column>
          
          <Column field="basic_salary" header="Basic Salary" sortable>
            <template #body="slotProps">
              <span class="text-sm font-medium">
                {{ formatCurrency(slotProps.data.basic_salary) }}
              </span>
            </template>
          </Column>
          
          <Column field="overtime_amount" header="Overtime" sortable>
            <template #body="slotProps">
              <span class="text-sm">
                {{ formatCurrency(slotProps.data.overtime_amount || 0) }}
              </span>
            </template>
          </Column>
          
          <Column field="deductions" header="Deductions" sortable>
            <template #body="slotProps">
              <span class="text-sm text-red-600">
                -{{ formatCurrency(slotProps.data.total_deductions || 0) }}
              </span>
            </template>
          </Column>
          
          <Column field="net_pay" header="Net Pay" sortable>
            <template #body="slotProps">
              <span class="text-sm font-bold text-green-600">
                {{ formatCurrency(slotProps.data.net_pay) }}
              </span>
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Badge 
                :value="slotProps.data.status" 
                :severity="getPayrollStatusSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
          
          <Column field="processed_at" header="Processed" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ slotProps.data.processed_at ? formatDate(slotProps.data.processed_at) : 'Pending' }}
              </div>
            </template>
          </Column>
          
          <Column header="Actions" :exportable="false">
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-eye" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'View Payslip'"
                  @click="viewPayslip(slotProps.data)"
                />
                <Button 
                  icon="pi pi-download" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'Download Payslip'"
                  @click="downloadPayslip(slotProps.data)"
                />
                <SplitButton 
                  :model="getPayrollActions(slotProps.data)"
                  class="p-button-text p-button-sm"
                  icon="pi pi-ellipsis-v"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Run Payroll Dialog -->
    <Dialog 
      v-model:visible="showRunPayrollDialog" 
      header="Run Payroll" 
      :modal="true"
      class="w-full max-w-md"
    >
      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-900 mb-2">Payroll Processing</h4>
          <p class="text-sm text-blue-700">
            This will process payroll for all active employees for the selected period.
          </p>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Payroll Period *</label>
          <Dropdown
            v-model="runPayrollForm.period"
            :options="availablePayrollPeriods"
            optionLabel="label"
            optionValue="value"
            placeholder="Select period"
            :class="{ 'p-invalid': runPayrollErrors.period }"
            class="w-full"
          />
          <small v-if="runPayrollErrors.period" class="p-error">{{ runPayrollErrors.period }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Pay Date *</label>
          <Calendar
            v-model="runPayrollForm.pay_date"
            dateFormat="mm/dd/yy"
            :class="{ 'p-invalid': runPayrollErrors.pay_date }"
            class="w-full"
          />
          <small v-if="runPayrollErrors.pay_date" class="p-error">{{ runPayrollErrors.pay_date }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Include Departments</label>
          <MultiSelect
            v-model="runPayrollForm.departments"
            :options="departments"
            optionLabel="name"
            optionValue="id"
            placeholder="All departments"
            class="w-full"
          />
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center">
            <Checkbox
              id="includeOvertime"
              v-model="runPayrollForm.include_overtime"
              binary
            />
            <label for="includeOvertime" class="ml-2 text-sm text-gray-700">Include overtime calculations</label>
          </div>
          
          <div class="flex items-center">
            <Checkbox
              id="sendPayslips"
              v-model="runPayrollForm.send_payslips"
              binary
            />
            <label for="sendPayslips" class="ml-2 text-sm text-gray-700">Send payslips via email</label>
          </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
          <div class="flex items-start space-x-2">
            <i class="pi pi-exclamation-triangle text-yellow-600 mt-0.5"></i>
            <div>
              <p class="text-sm font-medium text-yellow-800">Important Notice</p>
              <p class="text-sm text-yellow-700">
                Once payroll is processed, it cannot be undone. Please review all attendance and salary data before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="Cancel"
            class="p-button-secondary"
            @click="closeRunPayrollDialog"
          />
          <Button
            label="Process Payroll"
            icon="pi pi-play"
            :loading="processingPayroll"
            @click="runPayroll"
            class="p-button-success"
          />
        </div>
      </template>
    </Dialog>
    
    <!-- Payslip Detail Dialog -->
    <Dialog 
      v-model:visible="showPayslipDialog" 
      header="Payslip Details" 
      :modal="true"
      class="w-full max-w-4xl"
    >
      <div v-if="selectedPayroll" class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-4">
            <Avatar 
              :label="getEmployeeInitials(selectedPayroll.employee)" 
              size="large" 
              shape="circle" 
              :class="getAvatarColor(selectedPayroll.employee.email)"
            />
            <div>
              <h3 class="font-semibold text-xl">{{ selectedPayroll.employee.first_name }} {{ selectedPayroll.employee.last_name }}</h3>
              <p class="text-gray-600">{{ selectedPayroll.employee.position }}</p>
              <p class="text-gray-500 text-sm">{{ selectedPayroll.employee.employee_id }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Pay Period</p>
            <p class="font-semibold">{{ formatPayrollPeriod(selectedPayroll.payroll_period) }}</p>
            <Badge 
              :value="selectedPayroll.status" 
              :severity="getPayrollStatusSeverity(selectedPayroll.status)"
              class="mt-2"
            />
          </div>
        </div>
        
        <!-- Payslip Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Earnings -->
          <div>
            <h4 class="font-semibold text-lg mb-4 text-green-700">Earnings</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-green-50 rounded">
                <span class="text-sm">Basic Salary</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.basic_salary) }}</span>
              </div>
              <div v-if="selectedPayroll.overtime_amount" class="flex justify-between items-center p-3 bg-green-50 rounded">
                <span class="text-sm">Overtime ({{ selectedPayroll.overtime_hours }}h)</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.overtime_amount) }}</span>
              </div>
              <div v-if="selectedPayroll.bonus_amount" class="flex justify-between items-center p-3 bg-green-50 rounded">
                <span class="text-sm">Bonus</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.bonus_amount) }}</span>
              </div>
              <div v-if="selectedPayroll.allowances" class="flex justify-between items-center p-3 bg-green-50 rounded">
                <span class="text-sm">Allowances</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.allowances) }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-green-100 rounded border-2 border-green-200">
                <span class="font-medium">Gross Pay</span>
                <span class="font-bold text-lg">{{ formatCurrency(selectedPayroll.gross_pay) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Deductions -->
          <div>
            <h4 class="font-semibold text-lg mb-4 text-red-700">Deductions</h4>
            <div class="space-y-3">
              <div v-if="selectedPayroll.tax_deductions" class="flex justify-between items-center p-3 bg-red-50 rounded">
                <span class="text-sm">Income Tax</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.tax_deductions) }}</span>
              </div>
              <div v-if="selectedPayroll.insurance_deductions" class="flex justify-between items-center p-3 bg-red-50 rounded">
                <span class="text-sm">Insurance</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.insurance_deductions) }}</span>
              </div>
              <div v-if="selectedPayroll.retirement_deductions" class="flex justify-between items-center p-3 bg-red-50 rounded">
                <span class="text-sm">Retirement Fund</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.retirement_deductions) }}</span>
              </div>
              <div v-if="selectedPayroll.other_deductions" class="flex justify-between items-center p-3 bg-red-50 rounded">
                <span class="text-sm">Other Deductions</span>
                <span class="font-semibold">{{ formatCurrency(selectedPayroll.other_deductions) }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-red-100 rounded border-2 border-red-200">
                <span class="font-medium">Total Deductions</span>
                <span class="font-bold text-lg">{{ formatCurrency(selectedPayroll.total_deductions) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Net Pay -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-blue-100">Net Pay</p>
              <p class="text-3xl font-bold">{{ formatCurrency(selectedPayroll.net_pay) }}</p>
            </div>
            <div class="text-right">
              <p class="text-blue-100 text-sm">Pay Date</p>
              <p class="font-semibold">{{ formatDate(selectedPayroll.pay_date) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Additional Info -->
        <div v-if="selectedPayroll.notes" class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Notes</h4>
          <p class="text-sm text-gray-700">{{ selectedPayroll.notes }}</p>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button 
            label="Download PDF" 
            icon="pi pi-download" 
            @click="downloadPayslip(selectedPayroll)"
            class="p-button-success"
          />
          <Button 
            label="Send Email" 
            icon="pi pi-send" 
            @click="emailPayslip(selectedPayroll)"
            class="p-button-outlined"
          />
          <Button label="Close" class="p-button-secondary" @click="showPayslipDialog = false" />
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
const payrollRecords = ref<any[]>([])
const employees = ref<any[]>([])
const employeeSuggestions = ref<any[]>([])
const departments = ref<any[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const selectedPayroll = ref<any>(null)
const currentPayrollPeriod = ref<any>(null)

// Stats
const stats = ref({
  thisMonth: 0,
  employeesPaid: 0,
  pending: 0,
  overtime: 0
})

// Dialogs
const showRunPayrollDialog = ref(false)
const showPayslipDialog = ref(false)

// Forms
const runPayrollForm = ref({
  period: null,
  pay_date: new Date(),
  departments: [],
  include_overtime: true,
  send_payslips: true
})
const runPayrollErrors = ref<Record<string, string>>({})
const processingPayroll = ref(false)

// Filters
const filters = ref({
  payrollPeriod: '',
  department: '',
  status: '',
  employee: null
})

// Pagination
const pagination = ref({
  page: 0,
  rows: 20,
  sortField: 'processed_at',
  sortOrder: -1
})

// Options
const payrollStatusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' }
]

const departmentOptions = ref([
  { label: 'All Departments', value: '' }
])

const payrollPeriodOptions = ref([
  { label: 'All Periods', value: '' }
])

const availablePayrollPeriods = ref<any[]>([])

const moreActions = [
  {
    label: 'Payroll History',
    icon: 'pi pi-history',
    command: () => navigateTo('/tenant/payroll/history')
  },
  {
    label: 'Salary Components',
    icon: 'pi pi-cog',
    command: () => navigateTo('/tenant/payroll/components')
  },
  {
    label: 'Tax Settings',
    icon: 'pi pi-percentage',
    command: () => navigateTo('/tenant/payroll/tax-settings')
  }
]

// Computed
const canRunPayroll = computed(() => {
  return authStore.hasPermission('payroll.run')
})

// Methods
const fetchPayrollRecords = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: (pagination.value.page + 1).toString(),
      page_size: pagination.value.rows.toString()
    })
    
    if (filters.value.payrollPeriod) params.append('payroll_period', filters.value.payrollPeriod)
    if (filters.value.department) params.append('department', filters.value.department)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.employee) params.append('employee', filters.value.employee.id)
    if (pagination.value.sortField) {
      const sortOrder = pagination.value.sortOrder === 1 ? '' : '-'
      params.append('ordering', `${sortOrder}${pagination.value.sortField}`)
    }
    
    const response = await $api(`/api/v1/tenant/payroll/?${params.toString()}`)
    
    payrollRecords.value = response.results
    totalRecords.value = response.count
    
    // Update stats
    stats.value = response.stats || stats.value
    
  } catch (error) {
    console.error('Failed to fetch payroll records:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch payroll records',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const fetchCurrentPayrollPeriod = async () => {
  try {
    const response = await $api('/api/v1/tenant/payroll/current-period/')
    currentPayrollPeriod.value = response
  } catch (error) {
    console.error('Failed to fetch current payroll period:', error)
  }
}

const fetchFilterOptions = async () => {
  try {
    const [employeesResponse, departmentsResponse, periodsResponse] = await Promise.all([
      $api('/api/v1/tenant/employees/?active=true'),
      $api('/api/v1/tenant/departments/'),
      $api('/api/v1/tenant/payroll/periods/')
    ])
    
    employees.value = employeesResponse.results.map((emp: any) => ({
      ...emp,
      name: `${emp.first_name} ${emp.last_name}`
    }))
    
    departments.value = departmentsResponse.results || []
    
    departmentOptions.value = [
      { label: 'All Departments', value: '' },
      ...departments.value.map((dept: any) => ({ label: dept.name, value: dept.id }))
    ]
    
    const periods = periodsResponse.results || []
    payrollPeriodOptions.value = [
      { label: 'All Periods', value: '' },
      ...periods.map((period: any) => ({ 
        label: formatPayrollPeriod(period), 
        value: period.id 
      }))
    ]
    
    availablePayrollPeriods.value = periods.filter((period: any) => 
      period.status === 'open' || period.status === 'draft'
    ).map((period: any) => ({
      label: formatPayrollPeriod(period),
      value: period.id
    }))
    
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
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
  fetchPayrollRecords()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  fetchPayrollRecords()
}

const clearFilters = () => {
  filters.value = {
    payrollPeriod: '',
    department: '',
    status: '',
    employee: null
  }
  pagination.value.page = 0
  fetchPayrollRecords()
}

const viewPayslip = (payroll: any) => {
  selectedPayroll.value = payroll
  showPayslipDialog.value = true
}

const downloadPayslip = async (payroll: any) => {
  try {
    const response = await $api(`/api/v1/tenant/payroll/${payroll.id}/download/`, {
      method: 'GET'
    })
    
    // Handle file download
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payslip-${payroll.employee.employee_id}-${formatPayrollPeriod(payroll.payroll_period)}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Failed to download payslip:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to download payslip',
      life: 3000
    })
  }
}

const emailPayslip = async (payroll: any) => {
  try {
    await $api(`/api/v1/tenant/payroll/${payroll.id}/email/`, {
      method: 'POST'
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payslip sent via email',
      life: 3000
    })
  } catch (error) {
    console.error('Failed to email payslip:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to send payslip email',
      life: 3000
    })
  }
}

const getPayrollActions = (payroll: any) => {
  const actions = []
  
  actions.push({
    label: 'View Employee',
    icon: 'pi pi-user',
    command: () => navigateTo(`/tenant/employees/${payroll.employee.id}`)
  })
  
  if (payroll.status === 'draft') {
    actions.push({
      label: 'Approve',
      icon: 'pi pi-check',
      command: () => updatePayrollStatus(payroll, 'approved')
    })
  }
  
  if (payroll.status === 'approved') {
    actions.push({
      label: 'Mark as Paid',
      icon: 'pi pi-money-bill',
      command: () => updatePayrollStatus(payroll, 'paid')
    })
  }
  
  return actions
}

const updatePayrollStatus = async (payroll: any, status: string) => {
  try {
    await $api(`/api/v1/tenant/payroll/${payroll.id}/`, {
      method: 'PATCH',
      body: { status }
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payroll status updated',
      life: 3000
    })
    
    fetchPayrollRecords()
  } catch (error) {
    console.error('Failed to update payroll status:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update payroll status',
      life: 3000
    })
  }
}

const runPayroll = async () => {
  try {
    processingPayroll.value = true
    runPayrollErrors.value = {}
    
    await $api('/api/v1/tenant/payroll/run/', {
      method: 'POST',
      body: {
        ...runPayrollForm.value,
        pay_date: formatDateForAPI(runPayrollForm.value.pay_date)
      }
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payroll processing started',
      life: 3000
    })
    
    closeRunPayrollDialog()
    fetchPayrollRecords()
    fetchCurrentPayrollPeriod()
  } catch (error: any) {
    if (error.data?.errors) {
      runPayrollErrors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to process payroll',
        life: 3000
      })
    }
  } finally {
    processingPayroll.value = false
  }
}

const closeRunPayrollDialog = () => {
  showRunPayrollDialog.value = false
  runPayrollForm.value = {
    period: null,
    pay_date: new Date(),
    departments: [],
    include_overtime: true,
    send_payslips: true
  }
  runPayrollErrors.value = {}
}

const exportPayroll = () => {
  // TODO: Implement payroll export
  console.log('Export payroll')
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

const getPayrollStatusSeverity = (status: string) => {
  switch (status) {
    case 'paid': return 'success'
    case 'approved': return 'info'
    case 'draft': return 'warning'
    case 'cancelled': return 'danger'
    default: return 'secondary'
  }
}

const formatPayrollPeriod = (period: any) => {
  if (!period) return 'Unknown'
  return `${formatDate(period.start_date)} - ${formatDate(period.end_date)}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatDateForAPI = (date: Date) => {
  return date.toISOString().split('T')[0]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  fetchPayrollRecords()
  fetchCurrentPayrollPeriod()
  fetchFilterOptions()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-multiselect) {
  width: 100%;
}
</style>
