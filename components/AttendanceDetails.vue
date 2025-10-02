<template>
  <div class="attendance-details">
    <div class="space-y-6">
      <!-- Basic Information -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee
            </label>
            <p class="text-gray-900 dark:text-white">{{ attendance.employee_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee ID
            </label>
            <p class="text-gray-900 dark:text-white font-mono">{{ attendance.employee_id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <p class="text-gray-900 dark:text-white">{{ formatDate(attendance.date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Day of Week
            </label>
            <p class="text-gray-900 dark:text-white">{{ getDayOfWeek(attendance.date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <PTag 
              :value="formatStatus(attendance.status)" 
              :severity="getStatusSeverity(attendance.status)"
            />
          </div>
          <div v-if="attendance.shift">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shift
            </label>
            <p class="text-gray-900 dark:text-white">{{ attendance.shift }}</p>
          </div>
        </div>
      </div>

      <!-- Time Information -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="attendance.check_in">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Check In Time
            </label>
            <div class="flex items-center space-x-2">
              <i class="pi pi-sign-in text-green-500"></i>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatTime(attendance.check_in) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                ({{ getTimeAgo(attendance.check_in) }})
              </span>
            </div>
          </div>

          <div v-if="attendance.check_out">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Check Out Time
            </label>
            <div class="flex items-center space-x-2">
              <i class="pi pi-sign-out text-red-500"></i>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatTime(attendance.check_out) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                ({{ getTimeAgo(attendance.check_out) }})
              </span>
            </div>
          </div>

          <div v-if="attendance.break_start">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Break Start Time
            </label>
            <div class="flex items-center space-x-2">
              <i class="pi pi-pause text-orange-500"></i>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatTime(attendance.break_start) }}
              </span>
            </div>
          </div>

          <div v-if="attendance.break_end">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Break End Time
            </label>
            <div class="flex items-center space-x-2">
              <i class="pi pi-play text-orange-500"></i>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatTime(attendance.break_end) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Summary -->
      <div v-if="attendance.hours_worked || attendance.overtime_hours">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-if="attendance.hours_worked">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hours Worked
            </label>
            <p class="text-2xl font-bold text-blue-600">{{ attendance.hours_worked }}h</p>
          </div>
          <div v-if="attendance.overtime_hours">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Overtime Hours
            </label>
            <p class="text-2xl font-bold text-orange-600">{{ attendance.overtime_hours }}h</p>
          </div>
          <div v-if="attendance.is_late">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Late Arrival
            </label>
            <PTag 
              value="Yes" 
              severity="warning"
              class="text-lg"
            />
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div v-if="attendance.leave_type || attendance.notes || attendance.is_manual_entry">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
        <div class="space-y-4">
          <div v-if="attendance.leave_type">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Leave Type
            </label>
            <p class="text-gray-900 dark:text-white">{{ attendance.leave_type }}</p>
          </div>
          
          <div v-if="attendance.notes">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {{ attendance.notes }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Manual Entry
            </label>
            <PTag 
              :value="attendance.is_manual_entry ? 'Yes' : 'No'" 
              :severity="attendance.is_manual_entry ? 'warning' : 'success'"
            />
          </div>
        </div>
      </div>

      <!-- Timestamps -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Record Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Created At
            </label>
            <p class="text-gray-900 dark:text-white">{{ formatDateTime(attendance.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Updated At
            </label>
            <p class="text-gray-900 dark:text-white">{{ formatDateTime(attendance.updated_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          label="Edit" 
          icon="pi pi-pencil"
          @click="$emit('edit', attendance)"
        />
        <Button 
          label="Close" 
          severity="secondary"
          @click="$emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attendance } from '~/types/hrms'

// Props
interface Props {
  attendance: Attendance
}

defineProps<Props>()

// Emits
defineEmits<{
  close: []
  edit: [attendance: Attendance]
}>()

// Utility functions
const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusSeverity = (status: string) => {
  const severities = {
    present: 'success',
    absent: 'danger',
    late: 'warning',
    half_day: 'info',
    on_leave: 'secondary',
    holiday: 'info',
    weekend: 'secondary'
  }
  return severities[status as keyof typeof severities] || 'secondary'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const getDayOfWeek = (dateString: string) => {
  return new Date(dateString).toLocaleDateString([], { weekday: 'long' })
}

const getTimeAgo = (timeString: string) => {
  const now = new Date()
  const time = new Date(timeString)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}
</script>

<style scoped>
.attendance-details {
  max-width: 800px;
}
</style>
