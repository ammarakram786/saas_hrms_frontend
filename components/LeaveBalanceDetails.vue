<template>
  <div v-if="balance" class="p-fluid">
    <div class="field grid">
      <label for="employeeName" class="col-12 mb-2 md:col-3 md:mb-0">Employee:</label>
      <div class="col-12 md:col-9">
        <PInputText id="employeeName" :value="balance.employee_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="leaveType" class="col-12 mb-2 md:col-3 md:mb-0">Leave Type:</label>
      <div class="col-12 md:col-9">
        <PInputText id="leaveType" :value="balance.leave_type_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="year" class="col-12 mb-2 md:col-3 md:mb-0">Year:</label>
      <div class="col-12 md:col-9">
        <PInputText id="year" :value="balance.year" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="totalDays" class="col-12 mb-2 md:col-3 md:mb-0">Total Days:</label>
      <div class="col-12 md:col-9">
        <PInputText id="totalDays" :value="balance.total_days" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="usedDays" class="col-12 mb-2 md:col-3 md:mb-0">Used Days:</label>
      <div class="col-12 md:col-9">
        <PInputText id="usedDays" :value="balance.used_days" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="remainingDays" class="col-12 mb-2 md:col-3 md:mb-0">Remaining Days:</label>
      <div class="col-12 md:col-9">
        <PInputText id="remainingDays" :value="balance.remaining_days" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="carryForward" class="col-12 mb-2 md:col-3 md:mb-0">Carry Forward:</label>
      <div class="col-12 md:col-9">
        <PInputText id="carryForward" :value="balance.carry_forward_days || 0" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="expiryDate" class="col-12 mb-2 md:col-3 md:mb-0">Expiry Date:</label>
      <div class="col-12 md:col-9">
        <PInputText id="expiryDate" :value="formatDate(balance.expiry_date)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="notes" class="col-12 mb-2 md:col-3 md:mb-0">Notes:</label>
      <div class="col-12 md:col-9">
        <PTextarea id="notes" :value="balance.notes || 'No notes'" rows="3" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="createdAt" class="col-12 mb-2 md:col-3 md:mb-0">Created:</label>
      <div class="col-12 md:col-9">
        <PInputText id="createdAt" :value="formatDateTime(balance.created_at)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="updatedAt" class="col-12 mb-2 md:col-3 md:mb-0">Last Updated:</label>
      <div class="col-12 md:col-9">
        <PInputText id="updatedAt" :value="formatDateTime(balance.updated_at)" readonly />
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="field grid mt-4">
      <label class="col-12 mb-2 md:col-3 md:mb-0">Usage Progress:</label>
      <div class="col-12 md:col-9">
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="bg-blue-500 h-3 rounded-full transition-all duration-300" 
            :style="{ width: `${(balance.used_days / balance.total_days) * 100}%` }"
          ></div>
        </div>
        <div class="flex justify-content-between text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>{{ balance.used_days }} used</span>
          <span>{{ balance.remaining_days }} remaining</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No leave balance selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { LeaveBalance } from '~/types/hrms'

const props = defineProps<{
  balance: LeaveBalance | null
}>()

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Not set'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateTimeString: string | null | undefined) => {
  if (!dateTimeString) return 'Not available'
  const date = new Date(dateTimeString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
