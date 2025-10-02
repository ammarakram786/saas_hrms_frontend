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
        <FormField label="Payroll Period" :errorMessage="v$.period.$errors[0]?.$message as string">
          <PDropdown 
            id="period" 
            v-model="v$.period.$model" 
            :options="payrollPeriods" 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select Payroll Period" 
            :class="{'p-invalid': v$.period.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Basic Salary" :errorMessage="v$.basic_salary.$errors[0]?.$message as string">
          <PInputNumber 
            id="basic_salary" 
            v-model="v$.basic_salary.$model" 
            mode="currency" 
            currency="USD" 
            :min="0" 
            :class="{'p-invalid': v$.basic_salary.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Status" :errorMessage="v$.status.$errors[0]?.$message as string">
          <PDropdown 
            id="status" 
            v-model="v$.status.$model" 
            :options="statusOptions" 
            placeholder="Select Status" 
            :class="{'p-invalid': v$.status.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Pay Date">
          <PCalendar 
            id="pay_date" 
            v-model="payrollData.pay_date" 
            dateFormat="yy-mm-dd" 
            placeholder="Select pay date" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Hours Worked">
          <PInputNumber 
            id="hours_worked" 
            v-model="payrollData.hours_worked" 
            :min="0" 
            :max="168" 
            :step="0.5" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Overtime Hours">
          <PInputNumber 
            id="overtime_hours" 
            v-model="payrollData.overtime_hours" 
            :min="0" 
            :max="168" 
            :step="0.5" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Gross Salary">
          <PInputNumber 
            id="gross_salary" 
            v-model="payrollData.gross_salary" 
            mode="currency" 
            currency="USD" 
            :min="0" 
            readonly
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Total Deductions">
          <PInputNumber 
            id="deductions" 
            v-model="payrollData.deductions" 
            mode="currency" 
            currency="USD" 
            :min="0" 
            readonly
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Net Salary">
          <PInputNumber 
            id="net_salary" 
            v-model="payrollData.net_salary" 
            mode="currency" 
            currency="USD" 
            :min="0" 
            readonly
          />
        </FormField>
      </div>
    </div>

    <!-- Allowances Section -->
    <div class="mt-4">
      <h6 class="mb-3">Allowances</h6>
      <div v-for="(allowance, index) in payrollData.allowances" :key="index" class="grid mb-3">
        <div class="col-12 md:col-4">
          <FormField label="Name">
            <PInputText 
              v-model="allowance.name" 
              placeholder="Allowance name" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-3">
          <FormField label="Amount">
            <PInputNumber 
              v-model="allowance.amount" 
              mode="currency" 
              currency="USD" 
              :min="0" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-3">
          <FormField label="Type">
            <PDropdown 
              v-model="allowance.type" 
              :options="allowanceTypes" 
              placeholder="Select type" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-2">
          <div class="flex align-items-end h-full">
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              size="small"
              @click="removeAllowance(index)"
            />
          </div>
        </div>
      </div>
      <Button 
        label="Add Allowance" 
        icon="pi pi-plus" 
        size="small"
        severity="secondary"
        @click="addAllowance"
      />
    </div>

    <!-- Deductions Section -->
    <div class="mt-4">
      <h6 class="mb-3">Deductions</h6>
      <div v-for="(deduction, index) in payrollData.deduction_details" :key="index" class="grid mb-3">
        <div class="col-12 md:col-4">
          <FormField label="Name">
            <PInputText 
              v-model="deduction.name" 
              placeholder="Deduction name" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-3">
          <FormField label="Amount">
            <PInputNumber 
              v-model="deduction.amount" 
              mode="currency" 
              currency="USD" 
              :min="0" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-3">
          <FormField label="Type">
            <PDropdown 
              v-model="deduction.type" 
              :options="deductionTypes" 
              placeholder="Select type" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-2">
          <div class="flex align-items-end h-full">
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              size="small"
              @click="removeDeduction(index)"
            />
          </div>
        </div>
      </div>
      <Button 
        label="Add Deduction" 
        icon="pi pi-plus" 
        size="small"
        severity="secondary"
        @click="addDeduction"
      />
    </div>

    <!-- Tax Information -->
    <div class="mt-4">
      <h6 class="mb-3">Tax Information</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <FormField label="Income Tax">
            <PInputNumber 
              v-model="payrollData.tax_details.income_tax" 
              mode="currency" 
              currency="USD" 
              :min="0" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-6">
          <FormField label="Social Security">
            <PInputNumber 
              v-model="payrollData.tax_details.social_security" 
              mode="currency" 
              currency="USD" 
              :min="0" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-6">
          <FormField label="Medicare">
            <PInputNumber 
              v-model="payrollData.tax_details.medicare" 
              mode="currency" 
              currency="USD" 
              :min="0" 
            />
          </FormField>
        </div>
        <div class="col-12 md:col-6">
          <FormField label="Other Taxes">
            <PInputNumber 
              v-model="payrollData.tax_details.other_taxes" 
              mode="currency" 
              currency="USD" 
              :min="0" 
            />
          </FormField>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="field col-12 mt-4">
      <FormField label="Notes">
        <PTextarea 
          id="notes" 
          v-model="payrollData.notes" 
          rows="3" 
          placeholder="Additional notes about this payroll record" 
        />
      </FormField>
    </div>

    <!-- Summary -->
    <div v-if="payrollData.basic_salary !== null" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 border-round">
      <h6 class="mb-3">Payroll Summary</h6>
      <div class="grid">
        <div class="col-12 md:col-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ formatCurrency(payrollData.basic_salary) }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Basic Salary</div>
          </div>
        </div>
        <div class="col-12 md:col-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ formatCurrency(calculatedGrossSalary) }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Gross Salary</div>
          </div>
        </div>
        <div class="col-12 md:col-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-500">{{ formatCurrency(calculatedDeductions) }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Deductions</div>
          </div>
        </div>
        <div class="col-12 md:col-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-500">{{ formatCurrency(calculatedNetSalary) }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Net Salary</div>
          </div>
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
import { required, minValue } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { PayrollPeriodService, EmployeeService } from '~/services/api'
import type { PayrollRecord, PayrollPeriod, Employee } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const props = defineProps<{
  payroll: PayrollRecord | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()

const payrollData = reactive<Partial<PayrollRecord>>({
  employee: '',
  period: '',
  basic_salary: 0,
  gross_salary: 0,
  deductions: 0,
  net_salary: 0,
  status: 'draft',
  pay_date: null,
  hours_worked: null,
  overtime_hours: null,
  allowances: [],
  deduction_details: [],
  tax_details: {
    income_tax: 0,
    social_security: 0,
    medicare: 0,
    other_taxes: 0
  },
  notes: ''
})

const employees = ref<Employee[]>([])
const payrollPeriods = ref<PayrollPeriod[]>([])
const submitted = ref(false)

const statusOptions = ref([
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' }
])

const allowanceTypes = ref([
  { label: 'Housing', value: 'housing' },
  { label: 'Transport', value: 'transport' },
  { label: 'Medical', value: 'medical' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Other', value: 'other' }
])

const deductionTypes = ref([
  { label: 'Tax', value: 'tax' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Loan', value: 'loan' },
  { label: 'Advance', value: 'advance' },
  { label: 'Other', value: 'other' }
])

const rules = {
  employee: { required },
  period: { required },
  basic_salary: { required, minValue: minValue(0) },
  status: { required }
}

const v$ = useVuelidate(rules, payrollData)

// Computed properties
const calculatedGrossSalary = computed(() => {
  const basic = payrollData.basic_salary || 0
  const allowances = payrollData.allowances?.reduce((sum, allowance) => sum + (allowance.amount || 0), 0) || 0
  return basic + allowances
})

const calculatedDeductions = computed(() => {
  const deductions = payrollData.deduction_details?.reduce((sum, deduction) => sum + (deduction.amount || 0), 0) || 0
  const taxes = payrollData.tax_details ? 
    (payrollData.tax_details.income_tax || 0) + 
    (payrollData.tax_details.social_security || 0) + 
    (payrollData.tax_details.medicare || 0) + 
    (payrollData.tax_details.other_taxes || 0) : 0
  return deductions + taxes
})

const calculatedNetSalary = computed(() => {
  return calculatedGrossSalary.value - calculatedDeductions.value
})

// Watch for changes to update calculated fields
watch([calculatedGrossSalary, calculatedDeductions], () => {
  payrollData.gross_salary = calculatedGrossSalary.value
  payrollData.deductions = calculatedDeductions.value
  payrollData.net_salary = calculatedNetSalary.value
})

onMounted(async () => {
  await fetchEmployees()
  await fetchPayrollPeriods()
  
  if (props.payroll) {
    Object.assign(payrollData, props.payroll)
    // Ensure dates are Date objects for Calendar component
    payrollData.pay_date = props.payroll.pay_date ? new Date(props.payroll.pay_date) : null
  } else {
    // Initialize with default values
    payrollData.allowances = []
    payrollData.deduction_details = []
    payrollData.tax_details = {
      income_tax: 0,
      social_security: 0,
      medicare: 0,
      other_taxes: 0
    }
  }
})

watch(() => props.payroll, (newVal) => {
  if (newVal) {
    Object.assign(payrollData, newVal)
    payrollData.pay_date = newVal.pay_date ? new Date(newVal.pay_date) : null
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

const fetchPayrollPeriods = async () => {
  try {
    const response = await PayrollPeriodService.getPayrollPeriods()
    payrollPeriods.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch payroll periods', life: 3000 })
  }
}

const addAllowance = () => {
  if (!payrollData.allowances) payrollData.allowances = []
  payrollData.allowances.push({
    name: '',
    amount: 0,
    type: 'other',
    description: ''
  })
}

const removeAllowance = (index: number) => {
  if (payrollData.allowances) {
    payrollData.allowances.splice(index, 1)
  }
}

const addDeduction = () => {
  if (!payrollData.deduction_details) payrollData.deduction_details = []
  payrollData.deduction_details.push({
    name: '',
    amount: 0,
    type: 'other',
    description: ''
  })
}

const removeDeduction = (index: number) => {
  if (payrollData.deduction_details) {
    payrollData.deduction_details.splice(index, 1)
  }
}

const handleSubmit = async () => {
  submitted.value = true
  
  const isFormValid = await v$.value.$validate()
  if (isFormValid) {
    const dataToSubmit = { ...payrollData }
    
    // Update calculated fields
    dataToSubmit.gross_salary = calculatedGrossSalary.value
    dataToSubmit.deductions = calculatedDeductions.value
    dataToSubmit.net_salary = calculatedNetSalary.value
    
    // Format dates back to string for API
    dataToSubmit.pay_date = dataToSubmit.pay_date instanceof Date 
      ? dataToSubmit.pay_date.toISOString().split('T')[0] 
      : dataToSubmit.pay_date

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
  Object.assign(payrollData, {
    employee: '',
    period: '',
    basic_salary: 0,
    gross_salary: 0,
    deductions: 0,
    net_salary: 0,
    status: 'draft',
    pay_date: null,
    hours_worked: null,
    overtime_hours: null,
    allowances: [],
    deduction_details: [],
    tax_details: {
      income_tax: 0,
      social_security: 0,
      medicare: 0,
      other_taxes: 0
    },
    notes: ''
  })
  submitted.value = false
  v$.value.$reset()
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>
