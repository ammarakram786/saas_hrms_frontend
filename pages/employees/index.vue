<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Employees</h1>
            <p class="text-600 mt-2 mb-0">Manage your organization's employees</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Export" 
              icon="pi pi-download" 
              class="p-button-outlined"
              @click="exportEmployees"
            />
            <PButton 
              v-can="'employee.create'"
              label="Add Employee" 
              icon="pi pi-plus" 
              @click="showCreateDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="col-12">
      <PCard>
        <template #title>Filters</template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="search" class="font-medium">Search</label>
                <PInputText 
                  id="search"
                  v-model="filters.global" 
                  placeholder="Search employees..."
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
                <label for="employmentType" class="font-medium">Employment Type</label>
                <PDropdown 
                  id="employmentType"
                  v-model="filters.employmentType" 
                  :options="employmentTypeOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Types"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Employee Table -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Employee List</span>
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
          <div v-if="loading" class="p-4">
            <SkeletonTable :columns="7" :rows="10" />
          </div>

          <PDataTable
            v-else-if="selectedView === 'table'"
            :value="employees"
            :paginator="true"
            :rows="20"
            :filters="filters"
            filterDisplay="row"
            :loading="false"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['employee_id', 'full_name', 'email', 'department', 'position']"
            responsiveLayout="scroll"
            :scrollable="true"
            scrollHeight="600px"
          >
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-users text-4xl text-400 mb-3"></i>
                <p class="text-600">No employees found</p>
              </div>
            </template>
            
            <PColumn field="employee_id" header="ID" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.employee_id }}</span>
              </template>
            </PColumn>
            
            <PColumn field="full_name" header="Name" sortable style="min-width: 200px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <PAvatar 
                    :label="data.full_name.split(' ').map(n => n[0]).join('')" 
                    shape="circle" 
                    size="normal"
                    class="bg-primary-100 text-primary-700"
                  />
                  <div>
                    <div class="font-medium">{{ data.full_name }}</div>
                    <div class="text-sm text-500">{{ data.position }}</div>
                  </div>
                </div>
              </template>
            </PColumn>
            
            <PColumn field="email" header="Email" sortable style="min-width: 200px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-envelope text-500"></i>
                  <span>{{ data.email }}</span>
                </div>
              </template>
            </PColumn>
            
            <PColumn field="department" header="Department" sortable style="min-width: 150px">
              <template #body="{ data }">
                <PTag :value="data.department" severity="info" />
              </template>
            </PColumn>
            
            <PColumn field="hire_date" header="Hire Date" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>{{ formatDate(data.hire_date) }}</span>
              </template>
            </PColumn>
            
            <PColumn field="status" header="Status" sortable style="min-width: 120px">
              <template #body="{ data }">
                <PTag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'View Details'"
                    @click="viewEmployee(data)" 
                  />
                  <PButton 
                    v-can="'employee.update'"
                    icon="pi pi-pencil" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Edit Employee'"
                    @click="editEmployee(data)" 
                  />
                  <PButton 
                    v-can="'employee.delete'"
                    icon="pi pi-trash" 
                    class="p-button-text p-button-sm p-button-danger"
                    v-tooltip.top="'Delete Employee'"
                    @click="deleteEmployee(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>

          <!-- Card View -->
          <div v-else-if="selectedView === 'card'" class="grid">
            <div
              v-for="employee in employees"
              :key="employee.id"
              class="col-12 md:col-6 lg:col-4"
            >
              <PCard class="employee-card">
                <template #content>
                  <div class="text-center">
                    <PAvatar 
                      :label="employee.full_name.split(' ').map(n => n[0]).join('')" 
                      shape="circle" 
                      size="xlarge"
                      class="bg-primary-100 text-primary-700 mb-3"
                    />
                    <h4 class="text-900 font-medium mb-1">{{ employee.full_name }}</h4>
                    <p class="text-600 text-sm mb-2">{{ employee.position }}</p>
                    <PTag :value="employee.department" severity="info" class="mb-3" />
                    <div class="flex justify-content-center gap-2">
                      <PButton 
                        icon="pi pi-eye" 
                        class="p-button-text p-button-sm"
                        @click="viewEmployee(employee)" 
                      />
                      <PButton 
                        v-can="'employee.update'"
                        icon="pi pi-pencil" 
                        class="p-button-text p-button-sm"
                        @click="editEmployee(employee)" 
                      />
                      <PButton 
                        v-can="'employee.delete'"
                        icon="pi pi-trash" 
                        class="p-button-text p-button-sm p-button-danger"
                        @click="deleteEmployee(employee)" 
                      />
                    </div>
                  </div>
                </template>
              </PCard>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Create/Edit Employee Dialog -->
    <PDialog 
      v-model:visible="showCreateDialog" 
      :header="editingEmployee ? 'Edit Employee' : 'Add New Employee'" 
      :style="{ width: '800px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="employeeId" class="font-medium">Employee ID *</label>
            <PInputText 
              id="employeeId"
              v-model="employeeForm.employee_id" 
              placeholder="EMP001"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="status" class="font-medium">Status *</label>
            <PDropdown 
              id="status"
              v-model="employeeForm.status" 
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
            <label for="firstName" class="font-medium">First Name *</label>
            <PInputText 
              id="firstName"
              v-model="employeeForm.first_name" 
              placeholder="John"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="lastName" class="font-medium">Last Name *</label>
            <PInputText 
              id="lastName"
              v-model="employeeForm.last_name" 
              placeholder="Doe"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="email" class="font-medium">Email *</label>
            <PInputText 
              id="email"
              v-model="employeeForm.email" 
              placeholder="john.doe@company.com"
              type="email"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="phone" class="font-medium">Phone</label>
            <PInputText 
              id="phone"
              v-model="employeeForm.phone" 
              placeholder="+1 234 567 8900"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="department" class="font-medium">Department *</label>
            <PDropdown 
              id="department"
              v-model="employeeForm.department" 
              :options="departmentOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Department"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="position" class="font-medium">Position *</label>
            <PInputText 
              id="position"
              v-model="employeeForm.position" 
              placeholder="Software Engineer"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="employmentType" class="font-medium">Employment Type *</label>
            <PDropdown 
              id="employmentType"
              v-model="employeeForm.employment_type" 
              :options="employmentTypeOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Type"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="hireDate" class="font-medium">Hire Date *</label>
            <PCalendar 
              id="hireDate"
              v-model="employeeForm.hire_date" 
              dateFormat="yy-mm-dd"
              placeholder="Select Date"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="salary" class="font-medium">Base Salary</label>
            <PInputNumber 
              id="salary"
              v-model="employeeForm.base_salary" 
              mode="currency"
              currency="USD"
              locale="en-US"
              placeholder="50000"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="address" class="font-medium">Address</label>
            <PTextarea 
              id="address"
              v-model="employeeForm.address" 
              placeholder="Enter address"
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
          @click="closeDialog" 
        />
        <PButton 
          :label="editingEmployee ? 'Update' : 'Create'" 
          icon="pi pi-check" 
          @click="saveEmployee" 
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
const employees = ref([])
const loading = ref(false)
const showCreateDialog = ref(false)
const editingEmployee = ref(false)
const selectedView = ref('table')

const filters = ref({
  global: '',
  department: null,
  status: null,
  employmentType: null
})

const employeeForm = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  department: null,
  position: '',
  employment_type: null,
  hire_date: null,
  base_salary: null,
  address: '',
  status: 'active'
})

// Options
const departmentOptions = ref([
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Operations', value: 'Operations' }
])

const statusOptions = ref([
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Terminated', value: 'terminated' }
])

const employmentTypeOptions = ref([
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' },
  { label: 'Temporary', value: 'temporary' }
])

const viewOptions = ref([
  { label: 'Table View', value: 'table' },
  { label: 'Card View', value: 'card' }
])

// Mock data
const mockEmployees = ref([
  {
    id: 1,
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 234 567 8900',
    department: 'Engineering',
    position: 'Software Engineer',
    employment_type: 'full_time',
    hire_date: '2023-01-15',
    base_salary: 75000,
    address: '123 Main St, City, State 12345',
    status: 'active'
  },
  {
    id: 2,
    employee_id: 'EMP002',
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1 234 567 8901',
    department: 'Marketing',
    position: 'Marketing Manager',
    employment_type: 'full_time',
    hire_date: '2023-02-20',
    base_salary: 65000,
    address: '456 Oak Ave, City, State 12345',
    status: 'active'
  },
  {
    id: 3,
    employee_id: 'EMP003',
    first_name: 'Mike',
    last_name: 'Johnson',
    full_name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 234 567 8902',
    department: 'Sales',
    position: 'Sales Representative',
    employment_type: 'full_time',
    hire_date: '2023-03-10',
    base_salary: 55000,
    address: '789 Pine St, City, State 12345',
    status: 'on_leave'
  }
])

// Methods
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'warning'
    case 'on_leave': return 'info'
    case 'terminated': return 'danger'
    default: return 'info'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewEmployee = (employee: any) => {
  navigateTo(`/employees/${employee.id}`)
}

const editEmployee = (employee: any) => {
  editingEmployee.value = true
  employeeForm.value = { ...employee }
  showCreateDialog.value = true
}

const deleteEmployee = (employee: any) => {
  // Show confirmation dialog
  // TODO: Implement confirmation dialog
  console.log('Delete employee:', employee)
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingEmployee.value = false
  resetForm()
}

const resetForm = () => {
  employeeForm.value = {
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: null,
    position: '',
    employment_type: null,
    hire_date: null,
    base_salary: null,
    address: '',
    status: 'active'
  }
}

const saveEmployee = () => {
  if (editingEmployee.value) {
    // Update existing employee
    const index = employees.value.findIndex(emp => emp.id === employeeForm.value.id)
    if (index !== -1) {
      employees.value[index] = { ...employeeForm.value }
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee updated successfully',
      life: 3000
    })
  } else {
    // Create new employee
    const newEmployee = {
      ...employeeForm.value,
      id: employees.value.length + 1,
      full_name: `${employeeForm.value.first_name} ${employeeForm.value.last_name}`
    }
    employees.value.unshift(newEmployee)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee created successfully',
      life: 3000
    })
  }
  closeDialog()
}

const refreshData = async () => {
  loading.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'Employee data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh employee data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const exportEmployees = () => {
  // TODO: Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality will be implemented',
    life: 3000
  })
}

onMounted(() => {
  employees.value = mockEmployees.value
})
</script>

<style scoped>
.employee-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>