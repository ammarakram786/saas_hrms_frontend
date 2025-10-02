<template>
  <div class="employees-page">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your organization's employees</p>
        </div>
        <div class="flex gap-3">
          <Button 
            icon="pi pi-upload" 
            label="Import" 
            severity="secondary"
            @click="showImportDialog = true"
          />
          <Button 
            icon="pi pi-plus" 
            label="Add Employee" 
            @click="navigateTo('/employees/create')"
          />
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <PCard class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <PDropdown 
            v-model="filters.department" 
            :options="departmentOptions" 
            option-label="name"
            option-value="id"
            placeholder="All Departments"
            @change="loadEmployees"
          />
          <PDropdown 
            v-model="filters.status" 
            :options="statusOptions" 
            option-label="label"
            option-value="value"
            placeholder="All Status"
            @change="loadEmployees"
          />
        </div>
      </template>
    </PCard>

    <!-- Employees Table -->
    <PCard>
      <template #title>
        <div class="flex justify-between items-center">
          <span>Employees ({{ totalRecords }})</span>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-refresh" 
              @click="loadEmployees"
              :loading="isLoading"
              text
              size="small"
            />
            <Button 
              icon="pi pi-download" 
              @click="exportEmployees"
              text
              size="small"
            />
          </div>
        </div>
      </template>
      <template #content>
        <PDataTable 
          :value="employees" 
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
          current-page-report-template="Showing {first} to {last} of {totalRecords} employees"
        >
          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-users text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400">No employees found</p>
            </div>
          </template>

          <PColumn field="employee_id" header="Employee ID" :sortable="true">
            <template #body="{ data }">
              <span class="font-mono text-sm">{{ data.employee_id }}</span>
            </template>
          </PColumn>

          <PColumn field="full_name" header="Name" :sortable="true">
            <template #body="{ data }">
              <div class="flex items-center space-x-3">
                <PAvatar 
                  :label="data.first_name?.charAt(0) + data.last_name?.charAt(0)" 
                  size="small"
                  :class="getStatusColor(data.status)"
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ data.full_name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ data.email }}
                  </div>
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="position" header="Position" :sortable="true">
            <template #body="{ data }">
              <div>
                <div class="font-medium">{{ data.position }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ data.department_name || 'No Department' }}
                </div>
              </div>
            </template>
          </PColumn>

          <PColumn field="employment_type" header="Type" :sortable="true">
            <template #body="{ data }">
              <PTag 
                :value="formatEmploymentType(data.employment_type)" 
                :severity="getEmploymentTypeSeverity(data.employment_type)"
              />
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

          <PColumn field="hire_date" header="Hire Date" :sortable="true">
            <template #body="{ data }">
              {{ formatDate(data.hire_date) }}
            </template>
          </PColumn>

          <PColumn field="base_salary" header="Salary" :sortable="true">
            <template #body="{ data }">
              <div v-if="data.base_salary">
                {{ formatCurrency(data.base_salary, data.currency) }}
              </div>
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
                  @click="viewEmployee(data)"
                  v-tooltip.top="'View Details'"
                />
                <Button 
                  icon="pi pi-pencil" 
                  size="small"
                  text
                  @click="editEmployee(data)"
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

    <!-- Employee Details Dialog -->
    <PDialog 
      v-model:visible="showEmployeeDialog" 
      :header="selectedEmployee?.full_name || 'Employee Details'"
      :modal="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <EmployeeDetails 
        v-if="selectedEmployee" 
        :employee="selectedEmployee"
        @close="showEmployeeDialog = false"
        @edit="editEmployee"
      />
    </PDialog>

    <!-- Import Dialog -->
    <PDialog 
      v-model:visible="showImportDialog" 
      header="Import Employees"
      :modal="true"
      :style="{ width: '30rem' }"
    >
      <div class="space-y-4">
        <PFileUpload 
          mode="basic" 
          name="file"
          accept=".csv,.xlsx"
          :max-file-size="1000000"
          :auto="true"
          choose-label="Choose File"
          @upload="onFileUpload"
        />
        <div class="text-sm text-gray-500">
          <p>Supported formats: CSV, Excel (.xlsx)</p>
          <p>Maximum file size: 1MB</p>
        </div>
      </div>
    </PDialog>

    <!-- Delete Confirmation -->
    <PConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { Employee, PaginatedResponse } from '~/types/hrms'

// Meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Composables
const confirm = useConfirm()
const toast = useToast()

// State
const employees = ref<Employee[]>([])
const departments = ref<any[]>([])
const isLoading = ref(false)
const totalRecords = ref(0)
const showEmployeeDialog = ref(false)
const showImportDialog = ref(false)
const selectedEmployee = ref<Employee | null>(null)

const filters = ref({
  search: '',
  department: null,
  status: null
})

const pagination = ref({
  first: 0,
  rows: 25,
  sortField: 'created_at',
  sortOrder: -1
})

// Options
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Terminated', value: 'terminated' },
  { label: 'On Leave', value: 'on_leave' }
]

const departmentOptions = computed(() => [
  { id: null, name: 'All Departments' },
  ...departments.value
])

// Methods
const loadEmployees = async () => {
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
    if (filters.value.department) {
      params.department = filters.value.department
    }
    if (filters.value.status) {
      params.status = filters.value.status
    }

    const response = await $fetch<PaginatedResponse<Employee>>('/api/v1/employees/employees/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params
    })

    employees.value = response.results
    totalRecords.value = response.count
  } catch (error) {
    console.error('Error loading employees:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load employees',
      life: 3000
    })
  } finally {
    isLoading.value = false
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
  loadEmployees()
}, 500)

const onPageChange = (event: any) => {
  pagination.value.first = event.first
  pagination.value.rows = event.rows
  loadEmployees()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  loadEmployees()
}

const viewEmployee = (employee: Employee) => {
  selectedEmployee.value = employee
  showEmployeeDialog.value = true
}

const editEmployee = (employee: Employee) => {
  navigateTo(`/employees/${employee.id}/edit`)
}

const confirmDelete = (employee: Employee) => {
  confirm.require({
    message: `Are you sure you want to delete ${employee.full_name}?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteEmployee(employee.id)
  })
}

const deleteEmployee = async (id: string) => {
  try {
    await $fetch(`/api/v1/employees/employees/${id}/`, {
      method: 'DELETE',
      baseURL: useRuntimeConfig().public.apiUrl
    })

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee deleted successfully',
      life: 3000
    })

    loadEmployees()
  } catch (error) {
    console.error('Error deleting employee:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete employee',
      life: 3000
    })
  }
}

const exportEmployees = () => {
  // TODO: Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality coming soon',
    life: 3000
  })
}

const onFileUpload = (event: any) => {
  // TODO: Implement file upload
  toast.add({
    severity: 'info',
    summary: 'Upload',
    detail: 'File upload functionality coming soon',
    life: 3000
  })
}

// Utility functions
const formatEmploymentType = (type: string) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getEmploymentTypeSeverity = (type: string) => {
  const severities = {
    full_time: 'success',
    part_time: 'info',
    contract: 'warning',
    intern: 'secondary',
    temporary: 'danger'
  }
  return severities[type as keyof typeof severities] || 'secondary'
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusSeverity = (status: string) => {
  const severities = {
    active: 'success',
    inactive: 'secondary',
    terminated: 'danger',
    on_leave: 'warning'
  }
  return severities[status as keyof typeof severities] || 'secondary'
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-600',
    inactive: 'bg-gray-100 text-gray-600',
    terminated: 'bg-red-100 text-red-600',
    on_leave: 'bg-yellow-100 text-yellow-600'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: string, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(parseFloat(amount))
}

// Lifecycle
onMounted(() => {
  loadEmployees()
  loadDepartments()
})
</script>

<style scoped>
.employees-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1.5rem;
}
</style>
