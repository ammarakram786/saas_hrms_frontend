<template>
  <div class="employee-form">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Add New Employee</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Create a new employee record</p>
        </div>
        <Button 
          icon="pi pi-arrow-left" 
          label="Back to Employees" 
          severity="secondary"
          @click="navigateTo('/employees')"
        />
      </div>
    </div>

    <PForm @submit="onSubmit" :loading="isLoading">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <PCard>
            <template #title>Basic Information</template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  v-model="form.employee_id"
                  label="Employee ID *"
                  :error="errors.employee_id"
                  required
                />
                <FormField
                  v-model="form.email"
                  label="Email *"
                  type="email"
                  :error="errors.email"
                  required
                />
                <FormField
                  v-model="form.first_name"
                  label="First Name *"
                  :error="errors.first_name"
                  required
                />
                <FormField
                  v-model="form.last_name"
                  label="Last Name *"
                  :error="errors.last_name"
                  required
                />
                <FormField
                  v-model="form.middle_name"
                  label="Middle Name"
                  :error="errors.middle_name"
                />
                <FormField
                  v-model="form.phone"
                  label="Phone"
                  :error="errors.phone"
                />
                <FormField
                  v-model="form.date_of_birth"
                  label="Date of Birth"
                  type="date"
                  :error="errors.date_of_birth"
                />
                <FormField
                  v-model="form.gender"
                  label="Gender"
                  :error="errors.gender"
                >
                  <PDropdown 
                    v-model="form.gender" 
                    :options="genderOptions" 
                    placeholder="Select Gender"
                    class="w-full"
                  />
                </FormField>
                <FormField
                  v-model="form.marital_status"
                  label="Marital Status"
                  :error="errors.marital_status"
                >
                  <PDropdown 
                    v-model="form.marital_status" 
                    :options="maritalStatusOptions" 
                    placeholder="Select Marital Status"
                    class="w-full"
                  />
                </FormField>
                <FormField
                  v-model="form.nationality"
                  label="Nationality"
                  :error="errors.nationality"
                />
              </div>
            </template>
          </PCard>

          <!-- Address Information -->
          <PCard>
            <template #title>Address Information</template>
            <template #content>
              <div class="space-y-4">
                <FormField
                  v-model="form.address"
                  label="Address"
                  type="textarea"
                  :error="errors.address"
                />
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    v-model="form.city"
                    label="City"
                    :error="errors.city"
                  />
                  <FormField
                    v-model="form.state"
                    label="State"
                    :error="errors.state"
                  />
                  <FormField
                    v-model="form.postal_code"
                    label="Postal Code"
                    :error="errors.postal_code"
                  />
                </div>
                <FormField
                  v-model="form.country"
                  label="Country"
                  :error="errors.country"
                >
                  <PDropdown 
                    v-model="form.country" 
                    :options="countryOptions" 
                    placeholder="Select Country"
                    class="w-full"
                    filter
                  />
                </FormField>
              </div>
            </template>
          </PCard>

          <!-- Employment Information -->
          <PCard>
            <template #title>Employment Information</template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  v-model="form.department"
                  label="Department"
                  :error="errors.department"
                >
                  <PDropdown 
                    v-model="form.department" 
                    :options="departmentOptions" 
                    option-label="name"
                    option-value="id"
                    placeholder="Select Department"
                    class="w-full"
                  />
                </FormField>
                <FormField
                  v-model="form.position"
                  label="Position *"
                  :error="errors.position"
                  required
                />
                <FormField
                  v-model="form.employment_type"
                  label="Employment Type *"
                  :error="errors.employment_type"
                  required
                >
                  <PDropdown 
                    v-model="form.employment_type" 
                    :options="employmentTypeOptions" 
                    option-label="label"
                    option-value="value"
                    placeholder="Select Employment Type"
                    class="w-full"
                  />
                </FormField>
                <FormField
                  v-model="form.manager"
                  label="Manager"
                  :error="errors.manager"
                >
                  <PDropdown 
                    v-model="form.manager" 
                    :options="managerOptions" 
                    option-label="full_name"
                    option-value="id"
                    placeholder="Select Manager"
                    class="w-full"
                    filter
                  />
                </FormField>
                <FormField
                  v-model="form.hire_date"
                  label="Hire Date *"
                  type="date"
                  :error="errors.hire_date"
                  required
                />
                <FormField
                  v-model="form.start_date"
                  label="Start Date *"
                  type="date"
                  :error="errors.start_date"
                  required
                />
                <FormField
                  v-model="form.probation_end_date"
                  label="Probation End Date"
                  type="date"
                  :error="errors.probation_end_date"
                />
              </div>
            </template>
          </PCard>

          <!-- Salary Information -->
          <PCard>
            <template #title>Salary Information</template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  v-model="form.base_salary"
                  label="Base Salary"
                  type="number"
                  :error="errors.base_salary"
                />
                <FormField
                  v-model="form.currency"
                  label="Currency"
                  :error="errors.currency"
                >
                  <PDropdown 
                    v-model="form.currency" 
                    :options="currencyOptions" 
                    placeholder="Select Currency"
                    class="w-full"
                  />
                </FormField>
                <FormField
                  v-model="form.pay_frequency"
                  label="Pay Frequency *"
                  :error="errors.pay_frequency"
                  required
                >
                  <PDropdown 
                    v-model="form.pay_frequency" 
                    :options="payFrequencyOptions" 
                    option-label="label"
                    option-value="value"
                    placeholder="Select Pay Frequency"
                    class="w-full"
                  />
                </FormField>
              </div>
            </template>
          </PCard>

          <!-- Account Information -->
          <PCard>
            <template #title>Account Information</template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  v-model="form.password"
                  label="Password *"
                  type="password"
                  :error="errors.password"
                  required
                />
                <FormField
                  v-model="form.confirm_password"
                  label="Confirm Password *"
                  type="password"
                  :error="errors.confirm_password"
                  required
                />
              </div>
            </template>
          </PCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Form Actions -->
          <PCard>
            <template #title>Actions</template>
            <template #content>
              <div class="space-y-3">
                <Button 
                  type="submit"
                  label="Create Employee" 
                  icon="pi pi-save"
                  class="w-full"
                  :loading="isLoading"
                />
                <Button 
                  type="button"
                  label="Save as Draft" 
                  icon="pi pi-file"
                  severity="secondary"
                  class="w-full"
                  @click="saveAsDraft"
                />
                <Button 
                  type="button"
                  label="Cancel" 
                  icon="pi pi-times"
                  severity="danger"
                  class="w-full"
                  @click="navigateTo('/employees')"
                />
              </div>
            </template>
          </PCard>

          <!-- Form Progress -->
          <PCard>
            <template #title>Form Progress</template>
            <template #content>
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span>Basic Information</span>
                  <i class="pi pi-check text-green-500" v-if="isBasicInfoComplete"></i>
                  <i class="pi pi-times text-red-500" v-else></i>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Employment Info</span>
                  <i class="pi pi-check text-green-500" v-if="isEmploymentInfoComplete"></i>
                  <i class="pi pi-times text-red-500" v-else></i>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Account Info</span>
                  <i class="pi pi-check text-green-500" v-if="isAccountInfoComplete"></i>
                  <i class="pi pi-times text-red-500" v-else></i>
                </div>
                <PDivider />
                <div class="flex justify-between font-medium">
                  <span>Overall Progress</span>
                  <span>{{ formProgress }}%</span>
                </div>
                <PProgressBar :value="formProgress" />
              </div>
            </template>
          </PCard>
        </div>
      </div>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useFormValidation } from '~/composables/formValidation'
import type { EmployeeForm, EmployeeCreate } from '~/types/hrms'

// Meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Composables
const toast = useToast()
const { validateForm, errors, clearErrors } = useFormValidation()

// State
const isLoading = ref(false)
const departments = ref<any[]>([])
const managers = ref<any[]>([])

const form = ref<EmployeeForm>({
  employee_id: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  marital_status: '',
  nationality: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  department: '',
  position: '',
  employment_type: 'full_time',
  hire_date: '',
  start_date: '',
  probation_end_date: '',
  base_salary: '',
  currency: 'USD',
  pay_frequency: 'monthly',
  manager: '',
  emergency_contact: {},
  skills: {},
  certifications: {},
  password: '',
  confirm_password: ''
})

// Options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]

const maritalStatusOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' }
]

const employmentTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' },
  { label: 'Temporary', value: 'temporary' }
]

const payFrequencyOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'bi_weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' }
]

const currencyOptions = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'INR - Indian Rupee', value: 'INR' }
]

const countryOptions = [
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'India', value: 'India' },
  { label: 'Japan', value: 'Japan' }
]

const departmentOptions = computed(() => [
  { id: '', name: 'Select Department' },
  ...departments.value
])

const managerOptions = computed(() => [
  { id: '', full_name: 'Select Manager' },
  ...managers.value
])

// Computed
const isBasicInfoComplete = computed(() => {
  return form.value.employee_id && 
         form.value.first_name && 
         form.value.last_name && 
         form.value.email
})

const isEmploymentInfoComplete = computed(() => {
  return form.value.position && 
         form.value.employment_type && 
         form.value.hire_date && 
         form.value.start_date &&
         form.value.pay_frequency
})

const isAccountInfoComplete = computed(() => {
  return form.value.password && 
         form.value.confirm_password &&
         form.value.password === form.value.confirm_password
})

const formProgress = computed(() => {
  let progress = 0
  if (isBasicInfoComplete.value) progress += 33
  if (isEmploymentInfoComplete.value) progress += 33
  if (isAccountInfoComplete.value) progress += 34
  return progress
})

// Methods
const loadDepartments = async () => {
  try {
    const response = await $fetch('/api/v1/employees/departments/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100 }
    })
    departments.value = response.results
  } catch (error) {
    console.error('Error loading departments:', error)
  }
}

const loadManagers = async () => {
  try {
    const response = await $fetch('/api/v1/employees/employees/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100, status: 'active' }
    })
    managers.value = response.results
  } catch (error) {
    console.error('Error loading managers:', error)
  }
}

const onSubmit = async () => {
  clearErrors()
  
  // Validate form
  const validation = validateForm(form.value, {
    employee_id: { required: true },
    first_name: { required: true },
    last_name: { required: true },
    email: { required: true, email: true },
    position: { required: true },
    employment_type: { required: true },
    hire_date: { required: true },
    start_date: { required: true },
    pay_frequency: { required: true },
    password: { required: true, minLength: 8 },
    confirm_password: { required: true, match: form.value.password }
  })

  if (!validation.isValid) {
    errors.value = validation.errors
    return
  }

  isLoading.value = true

  try {
    const employeeData: EmployeeCreate = {
      ...form.value,
      password: form.value.password!,
      confirm_password: form.value.confirm_password!
    }

    await $fetch('/api/v1/employees/employees/', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.apiUrl,
      body: employeeData
    })

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee created successfully',
      life: 3000
    })

    navigateTo('/employees')
  } catch (error: any) {
    console.error('Error creating employee:', error)
    
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create employee',
        life: 3000
      })
    }
  } finally {
    isLoading.value = false
  }
}

const saveAsDraft = () => {
  // TODO: Implement save as draft functionality
  toast.add({
    severity: 'info',
    summary: 'Draft',
    detail: 'Save as draft functionality coming soon',
    life: 3000
  })
}

// Lifecycle
onMounted(() => {
  loadDepartments()
  loadManagers()
})
</script>

<style scoped>
.employee-form {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1.5rem;
}
</style>
