<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Employee Directory</h1>
        <p class="text-gray-600 mt-1">Manage employee information and lifecycle</p>
      </div>
      <div class="flex space-x-2">
        <Button 
          label="Add Employee" 
          icon="pi pi-user-plus" 
          @click="$router.push('/tenant/employees/create')"
        />
        <SplitButton 
          label="More Actions" 
          :model="moreActions"
          class="p-button-outlined"
        />
      </div>
    </div>
    
    <!-- Usage Warning -->
    <Message 
      v-if="showUsageWarning" 
      severity="warn" 
      class="mb-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <strong>Employee Limit Warning:</strong> You're using {{ employeeUsagePercentage }}% of your employee limit ({{ totalEmployees }}/{{ maxEmployees }}).
        </div>
        <Button 
          label="Upgrade Plan" 
          class="p-button-sm p-button-warning" 
          @click="$router.push('/tenant/settings/subscription')"
        />
      </div>
    </Message>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card class="bg-blue-50 border-blue-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Total Employees</p>
              <p class="text-2xl font-bold text-blue-900">{{ stats.total }}</p>
            </div>
            <i class="pi pi-users text-blue-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-green-50 border-green-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">Active</p>
              <p class="text-2xl font-bold text-green-900">{{ stats.active }}</p>
            </div>
            <i class="pi pi-check-circle text-green-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-orange-50 border-orange-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">On Leave</p>
              <p class="text-2xl font-bold text-orange-900">{{ stats.onLeave }}</p>
            </div>
            <i class="pi pi-calendar text-orange-500 text-2xl"></i>
          </div>
        </template>
      </Card>
      
      <Card class="bg-purple-50 border-purple-200">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">New Hires (MTD)</p>
              <p class="text-2xl font-bold text-purple-900">{{ stats.newHires }}</p>
            </div>
            <i class="pi pi-user-plus text-purple-500 text-2xl"></i>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Search</label>
            <InputText 
              v-model="filters.search" 
              placeholder="Search employees..."
              class="w-full"
              @input="debouncedSearch"
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
              @change="fetchEmployees"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Position</label>
            <Dropdown 
              v-model="filters.position" 
              :options="positionOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Positions"
              class="w-full"
              @change="fetchEmployees"
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
              @change="fetchEmployees"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Employment Type</label>
            <Dropdown 
              v-model="filters.employmentType" 
              :options="employmentTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Types"
              class="w-full"
              @change="fetchEmployees"
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
    
    <!-- Employee Cards/Table Toggle -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">View:</span>
        <SelectButton 
          v-model="viewMode" 
          :options="viewOptions" 
          optionLabel="label"
          optionValue="value"
        />
      </div>
      <div class="flex items-center space-x-2">
        <Button 
          icon="pi pi-refresh" 
          class="p-button-text p-button-sm" 
          @click="fetchEmployees"
          v-tooltip="'Refresh'"
        />
        <Button 
          icon="pi pi-download" 
          class="p-button-text p-button-sm" 
          @click="exportEmployees"
          v-tooltip="'Export'"
        />
      </div>
    </div>
    
    <!-- Employee Cards View -->
    <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="employee in employees" 
        :key="employee.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewEmployee(employee)"
      >
        <template #content>
          <div class="text-center">
            <Avatar 
              :label="getEmployeeInitials(employee)" 
              size="xlarge" 
              shape="circle" 
              :class="getAvatarColor(employee.email)"
              class="mb-4"
            />
            <h3 class="font-semibold text-lg text-gray-900">{{ employee.first_name }} {{ employee.last_name }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ employee.position || 'No position assigned' }}</p>
            <p class="text-gray-500 text-xs mb-3">{{ employee.department?.name || 'No department' }}</p>
            
            <div class="flex justify-center space-x-2 mb-3">
              <Badge 
                :value="getEmploymentStatus(employee)" 
                :severity="getStatusSeverity(employee)"
              />
              <Badge 
                :value="employee.employment_type" 
                severity="info"
                v-if="employee.employment_type"
              />
            </div>
            
            <div class="flex justify-center space-x-1">
              <Button 
                icon="pi pi-eye" 
                class="p-button-text p-button-sm" 
                v-tooltip="'View Profile'"
                @click.stop="viewEmployee(employee)"
              />
              <Button 
                icon="pi pi-pencil" 
                class="p-button-text p-button-sm" 
                v-tooltip="'Edit'"
                @click.stop="editEmployee(employee)"
              />
              <Button 
                icon="pi pi-calendar" 
                class="p-button-text p-button-sm" 
                v-tooltip="'View Attendance'"
                @click.stop="viewAttendance(employee)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Employee Table View -->
    <Card v-else>
      <template #content>
        <DataTable 
          :value="employees" 
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
          <Column field="employee_id" header="ID" sortable>
            <template #body="slotProps">
              <span class="font-mono text-sm">{{ slotProps.data.employee_id }}</span>
            </template>
          </Column>
          
          <Column field="name" header="Employee" sortable>
            <template #body="slotProps">
              <div class="flex items-center space-x-3">
                <Avatar 
                  :label="getEmployeeInitials(slotProps.data)" 
                  size="normal" 
                  shape="circle" 
                  :class="getAvatarColor(slotProps.data.email)"
                />
                <div>
                  <p class="font-medium">{{ slotProps.data.first_name }} {{ slotProps.data.last_name }}</p>
                  <p class="text-sm text-gray-500">{{ slotProps.data.email }}</p>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="position" header="Position" sortable>
            <template #body="slotProps">
              <div>
                <p class="text-sm font-medium">{{ slotProps.data.position || 'Not assigned' }}</p>
                <p class="text-xs text-gray-500">{{ slotProps.data.department?.name || 'No department' }}</p>
              </div>
            </template>
          </Column>
          
          <Column field="employment_type" header="Type" sortable>
            <template #body="slotProps">
              <Badge 
                :value="slotProps.data.employment_type || 'Not set'" 
                severity="info"
              />
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Badge 
                :value="getEmploymentStatus(slotProps.data)" 
                :severity="getStatusSeverity(slotProps.data)"
              />
            </template>
          </Column>
          
          <Column field="hire_date" header="Hire Date" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ slotProps.data.hire_date ? formatDate(slotProps.data.hire_date) : 'Not set' }}
              </div>
            </template>
          </Column>
          
          <Column field="salary" header="Salary" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ slotProps.data.salary ? formatCurrency(slotProps.data.salary) : 'Not set' }}
              </div>
            </template>
          </Column>
          
          <Column header="Actions" :exportable="false">
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-eye" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'View Profile'"
                  @click="viewEmployee(slotProps.data)"
                />
                <Button 
                  icon="pi pi-pencil" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'Edit'"
                  @click="editEmployee(slotProps.data)"
                />
                <SplitButton 
                  :model="getEmployeeActions(slotProps.data)"
                  class="p-button-text p-button-sm"
                  icon="pi pi-ellipsis-v"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Employee Profile Dialog -->
    <Dialog 
      v-model:visible="showProfileDialog" 
      :header="selectedEmployee?.first_name + ' ' + selectedEmployee?.last_name" 
      :modal="true"
      class="w-full max-w-4xl"
    >
      <div v-if="selectedEmployee" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Info -->
        <div class="lg:col-span-1">
          <div class="text-center mb-6">
            <Avatar 
              :label="getEmployeeInitials(selectedEmployee)" 
              size="xlarge" 
              shape="circle" 
              :class="getAvatarColor(selectedEmployee.email)"
              class="mb-4"
            />
            <h3 class="font-semibold text-xl">{{ selectedEmployee.first_name }} {{ selectedEmployee.last_name }}</h3>
            <p class="text-gray-600">{{ selectedEmployee.position || 'No position assigned' }}</p>
            <p class="text-gray-500 text-sm">{{ selectedEmployee.department?.name || 'No department' }}</p>
            
            <div class="flex justify-center space-x-2 mt-3">
              <Badge 
                :value="getEmploymentStatus(selectedEmployee)" 
                :severity="getStatusSeverity(selectedEmployee)"
              />
              <Badge 
                :value="selectedEmployee.employment_type" 
                severity="info"
                v-if="selectedEmployee.employment_type"
              />
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-sm text-gray-700 mb-2">Contact Information</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <i class="pi pi-envelope text-gray-400"></i>
                  <span>{{ selectedEmployee.email }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="pi pi-phone text-gray-400"></i>
                  <span>{{ selectedEmployee.phone || 'Not provided' }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="pi pi-map-marker text-gray-400"></i>
                  <span>{{ selectedEmployee.address || 'Not provided' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Details -->
        <div class="lg:col-span-2 space-y-6">
          <div>
            <h4 class="font-semibold mb-3">Employment Details</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Employee ID:</span>
                <p class="font-medium font-mono">{{ selectedEmployee.employee_id }}</p>
              </div>
              <div>
                <span class="text-gray-600">Hire Date:</span>
                <p class="font-medium">{{ selectedEmployee.hire_date ? formatDate(selectedEmployee.hire_date) : 'Not set' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Employment Type:</span>
                <p class="font-medium">{{ selectedEmployee.employment_type || 'Not set' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Manager:</span>
                <p class="font-medium">{{ selectedEmployee.manager?.name || 'Not assigned' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Salary:</span>
                <p class="font-medium">{{ selectedEmployee.salary ? formatCurrency(selectedEmployee.salary) : 'Not set' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Work Location:</span>
                <p class="font-medium">{{ selectedEmployee.work_location || 'Not set' }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="selectedEmployee.skills && selectedEmployee.skills.length">
            <h4 class="font-semibold mb-3">Skills</h4>
            <div class="flex flex-wrap gap-2">
              <Badge 
                v-for="skill in selectedEmployee.skills" 
                :key="skill"
                :value="skill" 
                severity="info"
                class="text-xs"
              />
            </div>
          </div>
          
          <div v-if="selectedEmployee.certifications && selectedEmployee.certifications.length">
            <h4 class="font-semibold mb-3">Certifications</h4>
            <div class="space-y-2">
              <div 
                v-for="cert in selectedEmployee.certifications" 
                :key="cert.name"
                class="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <p class="font-medium text-sm">{{ cert.name }}</p>
                  <p class="text-xs text-gray-500">{{ cert.issuer }}</p>
                </div>
                <div class="text-xs text-gray-500">
                  {{ cert.expiry_date ? formatDate(cert.expiry_date) : 'No expiry' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button label="Edit Employee" icon="pi pi-pencil" @click="editEmployee(selectedEmployee)" />
          <Button label="View Attendance" icon="pi pi-calendar" class="p-button-outlined" @click="viewAttendance(selectedEmployee)" />
          <Button label="Close" class="p-button-secondary" @click="showProfileDialog = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
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
const employees = ref<any[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const selectedEmployee = ref<any>(null)
const totalEmployees = ref(0)
const maxEmployees = ref(0)
const viewMode = ref('cards')

// Stats
const stats = ref({
  total: 0,
  active: 0,
  onLeave: 0,
  newHires: 0
})

// Dialogs
const showProfileDialog = ref(false)

// Filters
const filters = ref({
  search: '',
  department: '',
  position: '',
  status: '',
  employmentType: ''
})

// Pagination
const pagination = ref({
  page: 0,
  rows: 20,
  sortField: 'hire_date',
  sortOrder: -1
})

// Options
const viewOptions = [
  { label: 'Cards', value: 'cards' },
  { label: 'Table', value: 'table' }
]

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Terminated', value: 'terminated' }
]

const employmentTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Full-time', value: 'full_time' },
  { label: 'Part-time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' }
]

const departmentOptions = ref([
  { label: 'All Departments', value: '' }
])

const positionOptions = ref([
  { label: 'All Positions', value: '' }
])

const moreActions = [
  {
    label: 'Import Employees',
    icon: 'pi pi-upload',
    command: () => console.log('Import employees')
  },
  {
    label: 'Bulk Actions',
    icon: 'pi pi-cog',
    command: () => console.log('Bulk actions')
  },
  {
    label: 'Generate Report',
    icon: 'pi pi-file-pdf',
    command: () => console.log('Generate report')
  }
]

// Computed
const employeeUsagePercentage = computed(() => {
  if (maxEmployees.value === -1) return 0
  return Math.round((totalEmployees.value / maxEmployees.value) * 100)
})

const showUsageWarning = computed(() => {
  return employeeUsagePercentage.value > 80
})

// Methods
const fetchEmployees = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: (pagination.value.page + 1).toString(),
      page_size: pagination.value.rows.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.department) params.append('department', filters.value.department)
    if (filters.value.position) params.append('position', filters.value.position)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.employmentType) params.append('employment_type', filters.value.employmentType)
    if (pagination.value.sortField) {
      const sortOrder = pagination.value.sortOrder === 1 ? '' : '-'
      params.append('ordering', `${sortOrder}${pagination.value.sortField}`)
    }
    
    const response = await $api(`/api/v1/tenant/employees/?${params.toString()}`)
    
    employees.value = response.results
    totalRecords.value = response.count
    totalEmployees.value = response.count
    
    // Update stats
    stats.value = response.stats || stats.value
    
    // Get tenant limits
    if (authStore.tenant) {
      maxEmployees.value = authStore.tenant.max_employees
    }
    
  } catch (error) {
    console.error('Failed to fetch employees:', error)
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

const fetchFilterOptions = async () => {
  try {
    const [departmentsResponse, positionsResponse] = await Promise.all([
      $api('/api/v1/tenant/departments/'),
      $api('/api/v1/tenant/positions/')
    ])
    
    departmentOptions.value = [
      { label: 'All Departments', value: '' },
      ...(departmentsResponse.results || []).map((dept: any) => ({ label: dept.name, value: dept.id }))
    ]
    
    positionOptions.value = [
      { label: 'All Positions', value: '' },
      ...(positionsResponse.results || []).map((pos: any) => ({ label: pos.title, value: pos.title }))
    ]
    
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
  }
}

const debouncedSearch = debounce(() => {
  pagination.value.page = 0
  fetchEmployees()
}, 300)

const onPage = (event: any) => {
  pagination.value.page = event.page
  pagination.value.rows = event.rows
  fetchEmployees()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  fetchEmployees()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    department: '',
    position: '',
    status: '',
    employmentType: ''
  }
  pagination.value.page = 0
  fetchEmployees()
}

const viewEmployee = (employee: any) => {
  selectedEmployee.value = employee
  showProfileDialog.value = true
}

const editEmployee = (employee: any) => {
  navigateTo(`/tenant/employees/${employee.id}/edit`)
}

const viewAttendance = (employee: any) => {
  navigateTo(`/tenant/attendance/employee/${employee.id}`)
}

const getEmployeeActions = (employee: any) => {
  const actions = []
  
  actions.push({
    label: 'View Profile',
    icon: 'pi pi-user',
    command: () => viewEmployee(employee)
  })
  
  actions.push({
    label: 'View Attendance',
    icon: 'pi pi-calendar',
    command: () => viewAttendance(employee)
  })
  
  actions.push({
    label: 'View Payroll',
    icon: 'pi pi-wallet',
    command: () => navigateTo(`/tenant/payroll/employee/${employee.id}`)
  })
  
  if (employee.status === 'active') {
    actions.push({
      label: 'Request Leave',
      icon: 'pi pi-calendar-times',
      command: () => console.log('Request leave for', employee.id)
    })
  }
  
  return actions
}

const exportEmployees = () => {
  // TODO: Implement employee export
  console.log('Export employees')
}

// Utility functions
const getEmployeeInitials = (employee: any) => {
  return (employee.first_name?.charAt(0) || '') + (employee.last_name?.charAt(0) || '')
}

const getAvatarColor = (email: string) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500']
  const index = email.length % colors.length
  return colors[index]
}

const getEmploymentStatus = (employee: any) => {
  if (employee.end_date) return 'Terminated'
  if (employee.status === 'on_leave') return 'On Leave'
  return 'Active'
}

const getStatusSeverity = (employee: any) => {
  if (employee.end_date) return 'danger'
  if (employee.status === 'on_leave') return 'warning'
  return 'success'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  fetchEmployees()
  fetchFilterOptions()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-card:hover) {
  transform: translateY(-2px);
}
</style>
