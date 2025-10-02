<template>
  <form @submit.prevent="handleSubmit" class="p-fluid">
    <div class="formgrid grid">
      <div class="field col-12 md:col-6">
        <FormField label="Employee" :errorMessage="v$.employee.$errors[0]?.$message as string">
          <PDropdown 
            id="employee" 
            v-model="v$.employee.$model" 
            :options="employees" 
            optionLabel="full_name" 
            optionValue="id" 
            placeholder="Select an Employee" 
            :class="{'p-invalid': v$.employee.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Leave Type" :errorMessage="v$.leave_type.$errors[0]?.$message as string">
          <PDropdown 
            id="leave_type" 
            v-model="v$.leave_type.$model" 
            :options="leaveTypes" 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select Leave Type" 
            :class="{'p-invalid': v$.leave_type.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Year" :errorMessage="v$.year.$errors[0]?.$message as string">
          <PInputNumber 
            id="year" 
            v-model="v$.year.$model" 
            :min="2020" 
            :max="2030" 
            :class="{'p-invalid': v$.year.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Total Days" :errorMessage="v$.total_days.$errors[0]?.$message as string">
          <PInputNumber 
            id="total_days" 
            v-model="v$.total_days.$model" 
            :min="0" 
            :max="365" 
            :step="0.5" 
            :class="{'p-invalid': v$.total_days.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Used Days" :errorMessage="v$.used_days.$errors[0]?.$message as string">
          <PInputNumber 
            id="used_days" 
            v-model="v$.used_days.$model" 
            :min="0" 
            :max="365" 
            :step="0.5" 
            :class="{'p-invalid': v$.used_days.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Carry Forward Days">
          <PInputNumber 
            id="carry_forward_days" 
            v-model="balanceData.carry_forward_days" 
            :min="0" 
            :max="365" 
            :step="0.5" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Expiry Date">
          <PCalendar 
            id="expiry_date" 
            v-model="balanceData.expiry_date" 
            dateFormat="yy-mm-dd" 
            placeholder="Select expiry date (optional)" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Notes">
          <PTextarea 
            id="notes" 
            v-model="balanceData.notes" 
            rows="3" 
            placeholder="Additional notes about this leave balance" 
          />
        </FormField>
      </div>
    </div>

    <!-- Calculated Fields Display -->
    <div v-if="balanceData.total_days !== null && balanceData.used_days !== null" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 border-round">
      <h6 class="mb-3">Calculated Fields</h6>
      <div class="grid">
        <div class="col-12 md:col-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ balanceData.total_days }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-500">{{ balanceData.used_days }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Used Days</div>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ calculatedRemainingDays }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Remaining Days</div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all duration-300" 
            :style="{ width: `${usagePercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-content-between text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>{{ balanceData.used_days }} used</span>
          <span>{{ calculatedRemainingDays }} remaining</span>
        </div>
      </div>
    </div>

    <div class="flex justify-content-end mt-4">
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        class="p-button-text" 
        @click="emit('cancel')" 
      />
      <Button 
        label="Save" 
        icon="pi pi-check" 
        type="submit" 
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, maxValue } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { EmployeeService, LeaveTypeService } from '~/services/api'
import type { LeaveBalance, Employee, LeaveType } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const props = defineProps<{
  balance: LeaveBalance | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()

const balanceData = reactive<Partial<LeaveBalance>>({
  employee: '',
  leave_type: '',
  year: new Date().getFullYear(),
  total_days: 0,
  used_days: 0,
  carry_forward_days: 0,
  expiry_date: null,
  notes: ''
})

const employees = ref<Employee[]>([])
const leaveTypes = ref<LeaveType[]>([])
const submitted = ref(false)

const rules = {
  employee: { required },
  leave_type: { required },
  year: { 
    required, 
    minValue: minValue(2020),
    maxValue: maxValue(2030)
  },
  total_days: { 
    required, 
    minValue: minValue(0),
    maxValue: maxValue(365)
  },
  used_days: { 
    required, 
    minValue: minValue(0),
    maxValue: maxValue(365)
  }
}

const v$ = useVuelidate(rules, balanceData)

// Computed properties
const calculatedRemainingDays = computed(() => {
  if (balanceData.total_days === null || balanceData.used_days === null) return 0
  return Math.max(0, balanceData.total_days - balanceData.used_days)
})

const usagePercentage = computed(() => {
  if (balanceData.total_days === null || balanceData.total_days === 0) return 0
  return Math.min(100, (balanceData.used_days || 0) / balanceData.total_days * 100)
})

onMounted(async () => {
  await fetchEmployees()
  await fetchLeaveTypes()
  
  if (props.balance) {
    Object.assign(balanceData, props.balance)
    // Ensure dates are Date objects for Calendar component
    balanceData.expiry_date = props.balance.expiry_date ? new Date(props.balance.expiry_date) : null
  }
})

watch(() => props.balance, (newVal) => {
  if (newVal) {
    Object.assign(balanceData, newVal)
    balanceData.expiry_date = newVal.expiry_date ? new Date(newVal.expiry_date) : null
  } else {
    resetForm()
  }
})

const fetchEmployees = async () => {
  try {
    const response = await EmployeeService.getEmployees()
    employees.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch employees', life: 3000 })
  }
}

const fetchLeaveTypes = async () => {
  try {
    const response = await LeaveTypeService.getLeaveTypes()
    leaveTypes.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch leave types', life: 3000 })
  }
}

const handleSubmit = async () => {
  submitted.value = true
  
  const isFormValid = await v$.value.$validate()
  if (isFormValid) {
    const dataToSubmit = { ...balanceData }
    
    // Calculate remaining days
    dataToSubmit.remaining_days = calculatedRemainingDays.value
    
    // Format dates back to string for API
    dataToSubmit.expiry_date = dataToSubmit.expiry_date instanceof Date 
      ? dataToSubmit.expiry_date.toISOString().split('T')[0] 
      : dataToSubmit.expiry_date

    emit('submit', dataToSubmit)
  } else {
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: 'Please correct the form errors.', 
      life: 3000 
    })
  }
}

const resetForm = () => {
  Object.assign(balanceData, {
    employee: '',
    leave_type: '',
    year: new Date().getFullYear(),
    total_days: 0,
    used_days: 0,
    carry_forward_days: 0,
    expiry_date: null,
    notes: ''
  })
  submitted.value = false
  v$.value.$reset()
}
</script>
