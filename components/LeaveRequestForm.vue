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
        <FormField label="Start Date" :errorMessage="v$.start_date.$errors[0]?.$message as string">
          <PCalendar 
            id="start_date" 
            v-model="v$.start_date.$model" 
            dateFormat="yy-mm-dd" 
            :class="{'p-invalid': v$.start_date.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="End Date" :errorMessage="v$.end_date.$errors[0]?.$message as string">
          <PCalendar 
            id="end_date" 
            v-model="v$.end_date.$model" 
            dateFormat="yy-mm-dd" 
            :class="{'p-invalid': v$.end_date.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Days Requested" :errorMessage="v$.days_requested.$errors[0]?.$message as string">
          <PInputNumber 
            id="days_requested" 
            v-model="v$.days_requested.$model" 
            :min="0.5" 
            :max="365" 
            :step="0.5" 
            :class="{'p-invalid': v$.days_requested.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Reason" :errorMessage="v$.reason.$errors[0]?.$message as string">
          <PDropdown 
            id="reason" 
            v-model="leaveRequestData.reason" 
            :options="leaveReasons" 
            placeholder="Select Reason" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Description" :errorMessage="v$.description.$errors[0]?.$message as string">
          <PTextarea 
            id="description" 
            v-model="v$.description.$model" 
            rows="3" 
            placeholder="Provide additional details about your leave request" 
            :class="{'p-invalid': v$.description.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Emergency Contact">
          <PInputText 
            id="emergency_contact" 
            v-model="leaveRequestData.emergency_contact" 
            placeholder="Emergency contact information" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Emergency Phone">
          <PInputText 
            id="emergency_phone" 
            v-model="leaveRequestData.emergency_phone" 
            placeholder="Emergency contact phone number" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Documents">
          <PFileUpload 
            mode="basic" 
            name="documents[]" 
            :multiple="true" 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            :maxFileSize="5000000" 
            chooseLabel="Upload Documents" 
            @uploader="onFileUpload"
          />
          <small class="text-gray-500">Upload supporting documents (PDF, DOC, DOCX, JPG, PNG) - Max 5MB per file</small>
        </FormField>
      </div>
      <div class="field-checkbox col-12">
        <PCheckbox 
          id="is_half_day" 
          v-model="leaveRequestData.is_half_day" 
          :binary="true" 
        />
        <label for="is_half_day">Half Day Leave</label>
      </div>
      <div class="field-checkbox col-12">
        <PCheckbox 
          id="is_emergency" 
          v-model="leaveRequestData.is_emergency" 
          :binary="true" 
        />
        <label for="is_emergency">Emergency Leave</label>
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
import type { LeaveRequest, Employee, LeaveType } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const props = defineProps<{
  leaveRequest: LeaveRequest | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()

const leaveRequestData = reactive<Partial<LeaveRequest>>({
  employee: '',
  leave_type: '',
  start_date: '',
  end_date: '',
  days_requested: 1,
  reason: '',
  description: '',
  emergency_contact: '',
  emergency_phone: '',
  is_half_day: false,
  is_emergency: false,
  documents: []
})

const employees = ref<Employee[]>([])
const leaveTypes = ref<LeaveType[]>([])
const leaveReasons = ref([
  'Personal',
  'Medical',
  'Family Emergency',
  'Vacation',
  'Sick Leave',
  'Maternity/Paternity',
  'Bereavement',
  'Other'
])
const submitted = ref(false)

const rules = {
  employee: { required },
  leave_type: { required },
  start_date: { required },
  end_date: { required },
  days_requested: { 
    required, 
    minValue: minValue(0.5),
    maxValue: maxValue(365)
  },
  description: { required }
}

const v$ = useVuelidate(rules, leaveRequestData)

// Computed for date validation
const isEndDateValid = computed(() => {
  if (!leaveRequestData.start_date || !leaveRequestData.end_date) return true
  return new Date(leaveRequestData.end_date) >= new Date(leaveRequestData.start_date)
})

onMounted(async () => {
  await fetchEmployees()
  await fetchLeaveTypes()
  
  if (props.leaveRequest) {
    Object.assign(leaveRequestData, props.leaveRequest)
    // Ensure dates are Date objects for Calendar component
    leaveRequestData.start_date = props.leaveRequest.start_date ? new Date(props.leaveRequest.start_date) : ''
    leaveRequestData.end_date = props.leaveRequest.end_date ? new Date(props.leaveRequest.end_date) : ''
  }
})

watch(() => props.leaveRequest, (newVal) => {
  if (newVal) {
    Object.assign(leaveRequestData, newVal)
    leaveRequestData.start_date = newVal.start_date ? new Date(newVal.start_date) : ''
    leaveRequestData.end_date = newVal.end_date ? new Date(newVal.end_date) : ''
  } else {
    resetForm()
  }
})

// Watch for date changes to calculate days
watch([() => leaveRequestData.start_date, () => leaveRequestData.end_date], ([startDate, endDate]) => {
  if (startDate && endDate && isEndDateValid.value) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    leaveRequestData.days_requested = diffDays
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

const onFileUpload = (event: any) => {
  // Handle file upload
  const files = event.files
  if (files && files.length > 0) {
    leaveRequestData.documents = files
  }
}

const handleSubmit = async () => {
  submitted.value = true
  
  // Custom validation for end date
  if (!isEndDateValid.value) {
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: 'End date must be after start date', 
      life: 3000 
    })
    return
  }
  
  const isFormValid = await v$.value.$validate()
  if (isFormValid) {
    const dataToSubmit = { ...leaveRequestData }
    
    // Format dates back to string for API
    dataToSubmit.start_date = dataToSubmit.start_date instanceof Date 
      ? dataToSubmit.start_date.toISOString().split('T')[0] 
      : dataToSubmit.start_date
    dataToSubmit.end_date = dataToSubmit.end_date instanceof Date 
      ? dataToSubmit.end_date.toISOString().split('T')[0] 
      : dataToSubmit.end_date

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
  Object.assign(leaveRequestData, {
    employee: '',
    leave_type: '',
    start_date: '',
    end_date: '',
    days_requested: 1,
    reason: '',
    description: '',
    emergency_contact: '',
    emergency_phone: '',
    is_half_day: false,
    is_emergency: false,
    documents: []
  })
  submitted.value = false
  v$.value.$reset()
}
</script>
