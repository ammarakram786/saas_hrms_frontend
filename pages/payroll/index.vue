<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>Payroll Records</h5>
          <div class="flex gap-2">
            <Button 
              label="Generate Payroll" 
              icon="pi pi-calculator" 
              @click="generatePayroll"
              :loading="isGenerating"
            />
            <Button 
              label="Add Record" 
              icon="pi pi-plus" 
              @click="openNew"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="grid mb-4">
          <div class="col-12 md:col-3">
            <FormField label="Employee">
              <PDropdown 
                v-model="filters.employee" 
                :options="employees" 
                optionLabel="full_name" 
                optionValue="id" 
                placeholder="All Employees" 
                showClear
              />
            </FormField>
          </div>
          <div class="col-12 md:col-3">
            <FormField label="Period">
              <PDropdown 
                v-model="filters.period" 
                :options="payrollPeriods" 
                optionLabel="name" 
                optionValue="id" 
                placeholder="All Periods" 
                showClear
              />
            </FormField>
          </div>
          <div class="col-12 md:col-3">
            <FormField label="Status">
              <PDropdown 
                v-model="filters.status" 
                :options="statusOptions" 
                placeholder="All Statuses" 
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
          :value="payrollRecords"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="dataTableFilters"
          dataKey="id"
          :loading="loading"
          :globalFilterFields="['employee_name', 'period_name', 'status']"
          filterDisplay="row"
          stripedRows
          removableSort
        >
          <template #header>
            <div class="flex justify-content-between align-items-center">
              <div class="flex gap-2">
                <Button 
                  label="Export" 
                  icon="pi pi-download" 
                  severity="secondary"
                  @click="exportPayroll"
                />
                <Button 
                  label="Print" 
                  icon="pi pi-print" 
                  severity="secondary"
                  @click="printPayroll"
                />
              </div>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <PInputText v-model="dataTableFilters['global'].value" placeholder="Search Payroll" />
              </span>
            </div>
          </template>
          <template #empty>
            No payroll records found.
          </template>
          <template #loading>
            Loading payroll data. Please wait.
          </template>
          <PColumn field="employee_name" header="Employee" sortable></PColumn>
          <PColumn field="period_name" header="Period" sortable></PColumn>
          <PColumn field="basic_salary" header="Basic Salary" sortable>
            <template #body="{ data }">
              <span class="font-semibold">{{ formatCurrency(data.basic_salary) }}</span>
            </template>
          </PColumn>
          <PColumn field="gross_salary" header="Gross Salary" sortable>
            <template #body="{ data }">
              <span class="font-semibold text-green-600">{{ formatCurrency(data.gross_salary) }}</span>
            </template>
          </PColumn>
          <PColumn field="deductions" header="Deductions" sortable>
            <template #body="{ data }">
              <span class="text-red-500">{{ formatCurrency(data.deductions) }}</span>
            </template>
          </PColumn>
          <PColumn field="net_salary" header="Net Salary" sortable>
            <template #body="{ data }">
              <span class="font-bold text-blue-600">{{ formatCurrency(data.net_salary) }}</span>
            </template>
          </PColumn>
          <PColumn field="status" header="Status" sortable>
            <template #body="{ data }">
              <PTag :value="data.status" :severity="getPayrollStatusSeverity(data.status)" />
            </template>
          </PColumn>
          <PColumn :exportable="false" header="Actions" style="min-width:10rem">
            <template #body="{ data }">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewPayroll(data)" />
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning" @click="editPayroll(data)" />
              <Button icon="pi pi-download" class="p-button-rounded p-button-text p-button-info" @click="downloadPayslip(data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeletePayroll(data)" />
            </template>
          </PColumn>
        </PDataTable>

        <PDialog v-model:visible="payrollDialog" :style="{width: '900px'}" header="Payroll Details" :modal="true" class="p-fluid">
          <PayrollDetails :payroll="selectedPayroll" v-if="selectedPayroll" />
          <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          </template>
        </PDialog>

        <PDialog v-model:visible="payrollFormDialog" :style="{width: '900px'}" header="Payroll Form" :modal="true" class="p-fluid">
          <PayrollForm :payroll="selectedPayroll" @submit="savePayroll" @cancel="hideFormDialog" />
        </PDialog>

        <PConfirmDialog></PConfirmDialog>
      </div>
    </div>

    <!-- Payroll Summary Cards -->
    <div class="col-12">
      <div class="card">
        <h5>Payroll Summary</h5>
        <div class="grid">
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-blue-500">{{ summary.totalEmployees }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Employees</div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-green-500">{{ formatCurrency(summary.totalGrossSalary) }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Gross Salary</div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-red-500">{{ formatCurrency(summary.totalDeductions) }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Deductions</div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="text-center p-3 border-1 surface-border border-round">
              <div class="text-3xl font-bold text-purple-500">{{ formatCurrency(summary.totalNetSalary) }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Net Salary</div>
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
import { useConfirm } from 'primevue/useconfirm'
import { PayrollRecordService, PayrollPeriodService, EmployeeService } from '~/services/api'
import type { PayrollRecord, PayrollPeriod, Employee } from '~/types/hrms'
import PayrollDetails from '~/components/PayrollDetails.vue'
import PayrollForm from '~/components/PayrollForm.vue'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const confirm = useConfirm()

const payrollRecords = ref<PayrollRecord[]>([])
const employees = ref<Employee[]>([])
const payrollPeriods = ref<PayrollPeriod[]>([])
const payrollDialog = ref(false)
const payrollFormDialog = ref(false)
const selectedPayroll = ref<PayrollRecord | null>(null)
const loading = ref(true)
const isGenerating = ref(false)

const filters = reactive({
  employee: null,
  period: null,
  status: null,
  dateRange: null
})

const dataTableFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const statusOptions = ref([
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' }
])

const summary = computed(() => {
  const records = payrollRecords.value
  return {
    totalEmployees: records.length,
    totalGrossSalary: records.reduce((sum, record) => sum + (record.gross_salary || 0), 0),
    totalDeductions: records.reduce((sum, record) => sum + (record.deductions || 0), 0),
    totalNetSalary: records.reduce((sum, record) => sum + (record.net_salary || 0), 0)
  }
})

onMounted(() => {
  fetchPayrollRecords()
  fetchEmployees()
  fetchPayrollPeriods()
})

const fetchPayrollRecords = async () => {
  loading.value = true
  try {
    const response = await PayrollRecordService.getPayrollRecords()
    payrollRecords.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch payroll records', life: 3000 })
  } finally {
    loading.value = false
  }
}

const fetchEmployees = async () => {
  try {
    const response = await EmployeeService.getEmployees()
    employees.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch employees', life: 3000 })
  }
}

const fetchPayrollPeriods = async () => {
  try {
    const response = await PayrollPeriodService.getPayrollPeriods()
    payrollPeriods.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch payroll periods', life: 3000 })
  }
}

const openNew = () => {
  selectedPayroll.value = null
  payrollFormDialog.value = true
}

const hideDialog = () => {
  payrollDialog.value = false
  selectedPayroll.value = null
}

const hideFormDialog = () => {
  payrollFormDialog.value = false
  selectedPayroll.value = null
}

const viewPayroll = (payroll: PayrollRecord) => {
  selectedPayroll.value = { ...payroll }
  payrollDialog.value = true
}

const editPayroll = (payroll: PayrollRecord) => {
  selectedPayroll.value = { ...payroll }
  payrollFormDialog.value = true
}

const savePayroll = async (payrollData: PayrollRecord) => {
  try {
    if (payrollData.id) {
      await PayrollRecordService.updatePayrollRecord(payrollData.id, payrollData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll Record Updated', life: 3000 })
    } else {
      await PayrollRecordService.createPayrollRecord(payrollData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll Record Created', life: 3000 })
    }
    hideFormDialog()
    await fetchPayrollRecords()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save payroll record', life: 3000 })
  }
}

const confirmDeletePayroll = (payroll: PayrollRecord) => {
  confirm.require({
    message: `Are you sure you want to delete this payroll record for ${payroll.employee_name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await PayrollRecordService.deletePayrollRecord(payroll.id!)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll Record Deleted', life: 3000 })
        await fetchPayrollRecords()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete payroll record', life: 3000 })
      }
    }
  })
}

const generatePayroll = async () => {
  isGenerating.value = true
  try {
    // TODO: Implement payroll generation API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payroll generated successfully',
      life: 3000
    })
    
    await fetchPayrollRecords()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate payroll', life: 3000 })
  } finally {
    isGenerating.value = false
  }
}

const exportPayroll = () => {
  // TODO: Implement payroll export
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Payroll export functionality coming soon',
    life: 3000
  })
}

const printPayroll = () => {
  // TODO: Implement payroll printing
  toast.add({
    severity: 'info',
    summary: 'Print',
    detail: 'Payroll printing functionality coming soon',
    life: 3000
  })
}

const downloadPayslip = (payroll: PayrollRecord) => {
  // TODO: Implement payslip download
  toast.add({
    severity: 'info',
    summary: 'Download',
    detail: `Payslip for ${payroll.employee_name} downloaded`,
    life: 3000
  })
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getPayrollStatusSeverity = (status: string) => {
  switch (status) {
    case 'paid': return 'success'
    case 'approved': return 'info'
    case 'pending': return 'warning'
    case 'draft': return 'secondary'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}
</script>
