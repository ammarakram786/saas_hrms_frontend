<template>
  <div class="employee-details">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Employee Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information -->
        <PCard>
          <template #title>
            <div class="flex items-center justify-between">
              <span>Basic Information</span>
              <Button 
                icon="pi pi-pencil" 
                label="Edit" 
                size="small"
                @click="$emit('edit', employee)"
              />
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employee ID
                </label>
                <p class="text-gray-900 dark:text-white font-mono">{{ employee.employee_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.phone || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <p class="text-gray-900 dark:text-white">{{ formatDate(employee.date_of_birth) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.gender || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Marital Status
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.marital_status || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nationality
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.nationality || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.country || '-' }}</p>
              </div>
            </div>
          </template>
        </PCard>

        <!-- Address Information -->
        <PCard v-if="employee.address">
          <template #title>Address Information</template>
          <template #content>
            <div class="space-y-2">
              <p class="text-gray-900 dark:text-white">{{ employee.address }}</p>
              <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span v-if="employee.city">{{ employee.city }}</span>
                <span v-if="employee.state">{{ employee.state }}</span>
                <span v-if="employee.postal_code">{{ employee.postal_code }}</span>
              </div>
            </div>
          </template>
        </PCard>

        <!-- Employment Information -->
        <PCard>
          <template #title>Employment Information</template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.position }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <p class="text-gray-900 dark:text-white">{{ employee.department_name || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employment Type
                </label>
                <PTag 
                  :value="formatEmploymentType(employee.employment_type)" 
                  :severity="getEmploymentTypeSeverity(employee.employment_type)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <PTag 
                  :value="formatStatus(employee.status)" 
                  :severity="getStatusSeverity(employee.status)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hire Date
                </label>
                <p class="text-gray-900 dark:text-white">{{ formatDate(employee.hire_date) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <p class="text-gray-900 dark:text-white">{{ formatDate(employee.start_date) }}</p>
              </div>
              <div v-if="employee.end_date">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <p class="text-gray-900 dark:text-white">{{ formatDate(employee.end_date) }}</p>
              </div>
              <div v-if="employee.probation_end_date">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Probation End Date
                </label>
                <p class="text-gray-900 dark:text-white">{{ formatDate(employee.probation_end_date) }}</p>
              </div>
            </div>
          </template>
        </PCard>

        <!-- Salary Information -->
        <PCard v-if="employee.base_salary">
          <template #title>Salary Information</template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Base Salary
                </label>
                <p class="text-gray-900 dark:text-white text-lg font-semibold">
                  {{ formatCurrency(employee.base_salary, employee.currency) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pay Frequency
                </label>
                <p class="text-gray-900 dark:text-white">{{ formatPayFrequency(employee.pay_frequency) }}</p>
              </div>
            </div>
          </template>
        </PCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Employee Photo/Avatar -->
        <PCard>
          <template #content>
            <div class="text-center">
              <PAvatar 
                :label="employee.first_name?.charAt(0) + employee.last_name?.charAt(0)" 
                size="xlarge"
                :class="getStatusColor(employee.status)"
                class="mb-4"
              />
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ employee.full_name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">{{ employee.position }}</p>
              <PTag 
                :value="formatStatus(employee.status)" 
                :severity="getStatusSeverity(employee.status)"
                class="mt-2"
              />
            </div>
          </template>
        </PCard>

        <!-- Quick Actions -->
        <PCard>
          <template #title>Quick Actions</template>
          <template #content>
            <div class="space-y-2">
              <Button 
                icon="pi pi-pencil" 
                label="Edit Employee" 
                class="w-full justify-start"
                @click="$emit('edit', employee)"
              />
              <Button 
                icon="pi pi-clock" 
                label="View Attendance" 
                class="w-full justify-start"
                severity="secondary"
                @click="viewAttendance"
              />
              <Button 
                icon="pi pi-calendar" 
                label="View Leave History" 
                class="w-full justify-start"
                severity="secondary"
                @click="viewLeaveHistory"
              />
              <Button 
                icon="pi pi-dollar" 
                label="View Payroll" 
                class="w-full justify-start"
                severity="secondary"
                @click="viewPayroll"
              />
              <Button 
                icon="pi pi-file-pdf" 
                label="Generate Report" 
                class="w-full justify-start"
                severity="secondary"
                @click="generateReport"
              />
            </div>
          </template>
        </PCard>

        <!-- Manager Information -->
        <PCard v-if="employee.manager_name">
          <template #title>Manager</template>
          <template #content>
            <div class="flex items-center space-x-3">
              <PAvatar 
                :label="employee.manager_name?.charAt(0)" 
                size="small"
                class="bg-blue-100 text-blue-600"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ employee.manager_name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Manager</p>
              </div>
            </div>
          </template>
        </PCard>

        <!-- Statistics -->
        <PCard>
          <template #title>Statistics</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Years of Service</span>
                <span class="font-medium">{{ employee.years_of_service || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Direct Reports</span>
                <span class="font-medium">{{ employee.direct_reports_count || '0' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">On Probation</span>
                <PTag 
                  :value="employee.is_on_probation === 'true' ? 'Yes' : 'No'" 
                  :severity="employee.is_on_probation === 'true' ? 'warning' : 'success'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </PCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from '~/types/hrms'

// Props
interface Props {
  employee: Employee
}

defineProps<Props>()

// Emits
defineEmits<{
  close: []
  edit: [employee: Employee]
}>()

// Methods
const viewAttendance = () => {
  // TODO: Navigate to attendance page with employee filter
  console.log('View attendance for employee:', props.employee.id)
}

const viewLeaveHistory = () => {
  // TODO: Navigate to leave history page with employee filter
  console.log('View leave history for employee:', props.employee.id)
}

const viewPayroll = () => {
  // TODO: Navigate to payroll page with employee filter
  console.log('View payroll for employee:', props.employee.id)
}

const generateReport = () => {
  // TODO: Generate employee report
  console.log('Generate report for employee:', props.employee.id)
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

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: string, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(parseFloat(amount))
}

const formatPayFrequency = (frequency: string) => {
  const frequencies = {
    weekly: 'Weekly',
    bi_weekly: 'Bi-weekly',
    monthly: 'Monthly',
    annual: 'Annual'
  }
  return frequencies[frequency as keyof typeof frequencies] || frequency
}
</script>

<style scoped>
.employee-details {
  max-width: 1200px;
}
</style>
