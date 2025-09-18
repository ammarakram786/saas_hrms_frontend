<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Employees</h1>
        <p class="text-gray-600 mt-1">Manage your organization's employees</p>
      </div>
      
      <PButton 
        v-can="'employee.create'"
        label="Add Employee"
        icon="pi pi-plus"
        @click="showAddDialog = true"
        class="btn-primary"
      />
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label">Search</label>
          <PInputText 
            v-model="filters.search"
            placeholder="Search employees..."
            @input="debouncedSearch"
          />
        </div>
        
        <div>
          <label class="form-label">Department</label>
          <PDropdown 
            v-model="filters.department"
            :options="departments"
            option-label="name"
            option-value="name"
            placeholder="All Departments"
            show-clear
          />
        </div>
        
        <div>
          <label class="form-label">Status</label>
          <PDropdown 
            v-model="filters.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="All Statuses"
            show-clear
          />
        </div>
        
        <div class="flex items-end">
          <PButton 
            label="Reset"
            icon="pi pi-refresh"
            @click="resetFilters"
            class="btn-secondary"
          />
        </div>
      </div>
    </div>

    <!-- Employee table -->
    <div class="card">
      <PDataTable
        :value="employees"
        :loading="loading"
        paginator
        :rows="20"
        :total-records="totalRecords"
        lazy
        @page="onPage"
        @sort="onSort"
        sortMode="single"
        class="w-full"
      >
        <PColumn field="employee_id" header="ID" sortable />
        <PColumn field="full_name" header="Name" sortable>
          <template #body="{ data }">
            <div class="flex items-center">
              <PAvatar 
                :label="getInitials(data)"
                size="normal"
                shape="circle"
                class="mr-3 bg-primary-600 text-white"
              />
              <div>
                <div class="font-medium">{{ data.full_name }}</div>
                <div class="text-sm text-gray-500">{{ data.email }}</div>
              </div>
            </div>
          </template>
        </PColumn>
        
        <PColumn field="department" header="Department" sortable />
        <PColumn field="position" header="Position" sortable />
        
        <PColumn field="status" header="Status" sortable>
          <template #body="{ data }">
            <PChip 
              :label="data.status"
              :class="getStatusClass(data.status)"
            />
          </template>
        </PColumn>
        
        <PColumn field="hire_date" header="Hire Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.hire_date) }}
          </template>
        </PColumn>
        
        <PColumn header="Actions">
          <template #body="{ data }">
            <div class="flex space-x-2">
              <PButton 
                icon="pi pi-eye"
                @click="viewEmployee(data)"
                class="p-button-text p-button-sm"
                v-tooltip="'View'"
              />
              <PButton 
                v-can="'employee.update'"
                icon="pi pi-pencil"
                @click="editEmployee(data)"
                class="p-button-text p-button-sm"
                v-tooltip="'Edit'"
              />
              <PButton 
                v-can="'employee.delete'"
                icon="pi pi-trash"
                @click="deleteEmployee(data)"
                class="p-button-text p-button-sm p-button-danger"
                v-tooltip="'Delete'"
              />
            </div>
          </template>
        </PColumn>
      </PDataTable>
    </div>

    <!-- Add Employee Dialog -->
    <PDialog 
      v-model:visible="showAddDialog"
      modal
      header="Add New Employee"
      :style="{ width: '600px' }"
    >
      <p class="text-gray-600 mb-4">Create a new employee record.</p>
      <!-- Add employee form would go here -->
      <div class="flex justify-end space-x-2 mt-6">
        <PButton 
          label="Cancel"
          @click="showAddDialog = false"
          class="btn-secondary"
        />
        <PButton 
          label="Save"
          @click="saveEmployee"
          class="btn-primary"
        />
      </div>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { debounce } from 'lodash-es'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const loading = ref(false)
const employees = ref([])
const totalRecords = ref(0)
const showAddDialog = ref(false)

// Filters
const filters = reactive({
  search: '',
  department: null,
  status: null,
  page: 0,
  rows: 20,
  sortField: 'full_name',
  sortOrder: 1
})

const departments = ref([
  { name: 'Engineering' },
  { name: 'Marketing' },
  { name: 'Sales' },
  { name: 'HR' }
])

const statusOptions = ref([
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Terminated', value: 'terminated' }
])

// Mock data - replace with real API calls
const mockEmployees = [
  {
    id: '1',
    employee_id: 'EMP001',
    full_name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    hire_date: '2023-01-15'
  },
  {
    id: '2',
    employee_id: 'EMP002',
    full_name: 'Jane Smith',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'active',
    hire_date: '2022-08-20'
  }
]

const fetchEmployees = async () => {
  loading.value = true
  
  try {
    // TODO: Replace with real API call
    // const response = await $api('/api/v1/employees/', { params: filters })
    // employees.value = response.results
    // totalRecords.value = response.count
    
    // Mock data
    employees.value = mockEmployees
    totalRecords.value = mockEmployees.length
  } catch (error) {
    console.error('Error fetching employees:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch employees',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  fetchEmployees()
}, 300)

const onPage = (event: any) => {
  filters.page = event.page
  filters.rows = event.rows
  fetchEmployees()
}

const onSort = (event: any) => {
  filters.sortField = event.sortField
  filters.sortOrder = event.sortOrder
  fetchEmployees()
}

const resetFilters = () => {
  filters.search = ''
  filters.department = null
  filters.status = null
  fetchEmployees()
}

const getInitials = (employee: any) => {
  return `${employee.first_name?.charAt(0)}${employee.last_name?.charAt(0)}`.toUpperCase()
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    terminated: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewEmployee = (employee: any) => {
  navigateTo(`/employees/${employee.id}`)
}

const editEmployee = (employee: any) => {
  navigateTo(`/employees/${employee.id}/edit`)
}

const deleteEmployee = (employee: any) => {
  // TODO: Implement delete functionality
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Delete functionality not implemented yet',
    life: 3000
  })
}

const saveEmployee = () => {
  // TODO: Implement save functionality
  showAddDialog.value = false
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Employee saved successfully',
    life: 3000
  })
}

onMounted(() => {
  fetchEmployees()
})
</script>
