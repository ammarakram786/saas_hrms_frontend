<template>
  <div class="attendance-form">
    <PForm @submit="onSubmit" :loading="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          v-model="form.employee"
          label="Employee *"
          :error="errors.employee"
          required
        >
          <PDropdown 
            v-model="form.employee" 
            :options="employeeOptions" 
            option-label="full_name"
            option-value="id"
            placeholder="Select Employee"
            class="w-full"
            filter
          />
        </FormField>

        <FormField
          v-model="form.date"
          label="Date *"
          :error="errors.date"
          required
        >
          <PCalendar 
            v-model="form.date" 
            placeholder="Select Date"
            date-format="yy-mm-dd"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.check_in"
          label="Check In Time"
          :error="errors.check_in"
        >
          <PCalendar 
            v-model="form.check_in" 
            placeholder="Select Check In Time"
            time-only
            hour-format="12"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.check_out"
          label="Check Out Time"
          :error="errors.check_out"
        >
          <PCalendar 
            v-model="form.check_out" 
            placeholder="Select Check Out Time"
            time-only
            hour-format="12"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.break_start"
          label="Break Start Time"
          :error="errors.break_start"
        >
          <PCalendar 
            v-model="form.break_start" 
            placeholder="Select Break Start Time"
            time-only
            hour-format="12"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.break_end"
          label="Break End Time"
          :error="errors.break_end"
        >
          <PCalendar 
            v-model="form.break_end" 
            placeholder="Select Break End Time"
            time-only
            hour-format="12"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.status"
          label="Status *"
          :error="errors.status"
          required
        >
          <PDropdown 
            v-model="form.status" 
            :options="statusOptions" 
            option-label="label"
            option-value="value"
            placeholder="Select Status"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.shift"
          label="Shift"
          :error="errors.shift"
        >
          <PDropdown 
            v-model="form.shift" 
            :options="shiftOptions" 
            option-label="name"
            option-value="name"
            placeholder="Select Shift"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.leave_type"
          label="Leave Type"
          :error="errors.leave_type"
        >
          <PDropdown 
            v-model="form.leave_type" 
            :options="leaveTypeOptions" 
            option-label="name"
            option-value="name"
            placeholder="Select Leave Type"
            class="w-full"
          />
        </FormField>

        <FormField
          v-model="form.is_manual_entry"
          label="Manual Entry"
          :error="errors.is_manual_entry"
        >
          <PInputSwitch v-model="form.is_manual_entry" />
        </FormField>

        <FormField
          v-model="form.notes"
          label="Notes"
          type="textarea"
          :error="errors.notes"
          class="md:col-span-2"
        />
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <Button 
          type="button"
          label="Cancel" 
          severity="secondary"
          @click="$emit('close')"
        />
        <Button 
          type="submit"
          :label="attendance ? 'Update' : 'Create'"
          :loading="isLoading"
        />
      </div>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useFormValidation } from '~/composables/formValidation'
import type { Attendance, AttendanceForm } from '~/types/hrms'

// Props
interface Props {
  attendance?: Attendance | null
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  close: []
  save: [attendance: Attendance]
}>()

// Composables
const toast = useToast()
const { validateForm, errors, clearErrors } = useFormValidation()

// State
const isLoading = ref(false)
const employees = ref<any[]>([])
const shifts = ref<any[]>([])
const leaveTypes = ref<any[]>([])

const form = ref<AttendanceForm>({
  employee: '',
  date: new Date(),
  check_in: null,
  check_out: null,
  break_start: null,
  break_end: null,
  status: 'present',
  shift: '',
  leave_type: '',
  notes: '',
  is_manual_entry: false
})

// Options
const statusOptions = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Half Day', value: 'half_day' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Holiday', value: 'holiday' },
  { label: 'Weekend', value: 'weekend' }
]

const employeeOptions = computed(() => [
  { id: '', full_name: 'Select Employee' },
  ...employees.value
])

const shiftOptions = computed(() => [
  { name: '', name: 'Select Shift' },
  ...shifts.value
])

const leaveTypeOptions = computed(() => [
  { name: '', name: 'Select Leave Type' },
  ...leaveTypes.value
])

// Methods
const loadEmployees = async () => {
  try {
    const response = await $fetch('/api/v1/employees/employees/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100, status: 'active' }
    })
    employees.value = response.results
  } catch (error) {
    console.error('Error loading employees:', error)
  }
}

const loadShifts = async () => {
  try {
    const response = await $fetch('/api/v1/attendance/shifts/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100 }
    })
    shifts.value = response.results
  } catch (error) {
    console.error('Error loading shifts:', error)
  }
}

const loadLeaveTypes = async () => {
  try {
    const response = await $fetch('/api/v1/attendance/leave-types/', {
      baseURL: useRuntimeConfig().public.apiUrl,
      params: { page_size: 100 }
    })
    leaveTypes.value = response.results
  } catch (error) {
    console.error('Error loading leave types:', error)
  }
}

const initializeForm = () => {
  if (props.attendance) {
    form.value = {
      employee: props.attendance.employee,
      date: new Date(props.attendance.date),
      check_in: props.attendance.check_in ? new Date(props.attendance.check_in) : null,
      check_out: props.attendance.check_out ? new Date(props.attendance.check_out) : null,
      break_start: props.attendance.break_start ? new Date(props.attendance.break_start) : null,
      break_end: props.attendance.break_end ? new Date(props.attendance.break_end) : null,
      status: props.attendance.status,
      shift: props.attendance.shift || '',
      leave_type: props.attendance.leave_type || '',
      notes: props.attendance.notes || '',
      is_manual_entry: props.attendance.is_manual_entry || false
    }
  }
}

const onSubmit = async () => {
  clearErrors()
  
  // Validate form
  const validation = validateForm(form.value, {
    employee: { required: true },
    date: { required: true },
    status: { required: true }
  })

  if (!validation.isValid) {
    errors.value = validation.errors
    return
  }

  isLoading.value = true

  try {
    const attendanceData = {
      ...form.value,
      date: form.value.date.toISOString().split('T')[0],
      check_in: form.value.check_in?.toISOString(),
      check_out: form.value.check_out?.toISOString(),
      break_start: form.value.break_start?.toISOString(),
      break_end: form.value.break_end?.toISOString()
    }

    let response
    if (props.attendance) {
      // Update existing attendance
      response = await $fetch(`/api/v1/attendance/attendance/${props.attendance.id}/`, {
        method: 'PUT',
        baseURL: useRuntimeConfig().public.apiUrl,
        body: attendanceData
      })
    } else {
      // Create new attendance
      response = await $fetch('/api/v1/attendance/attendance/', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiUrl,
        body: attendanceData
      })
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Attendance ${props.attendance ? 'updated' : 'created'} successfully`,
      life: 3000
    })

    emit('save', response)
  } catch (error: any) {
    console.error('Error saving attendance:', error)
    
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to ${props.attendance ? 'update' : 'create'} attendance record`,
        life: 3000
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadEmployees()
  loadShifts()
  loadLeaveTypes()
  initializeForm()
})
</script>

<style scoped>
.attendance-form {
  max-width: 800px;
}
</style>
