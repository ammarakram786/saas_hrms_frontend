<template>
  <div v-if="leaveRequest" class="p-fluid">
    <div class="field grid">
      <label for="employeeName" class="col-12 mb-2 md:col-3 md:mb-0">Employee:</label>
      <div class="col-12 md:col-9">
        <PInputText id="employeeName" :value="leaveRequest.employee_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="leaveType" class="col-12 mb-2 md:col-3 md:mb-0">Leave Type:</label>
      <div class="col-12 md:col-9">
        <PInputText id="leaveType" :value="leaveRequest.leave_type_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="startDate" class="col-12 mb-2 md:col-3 md:mb-0">Start Date:</label>
      <div class="col-12 md:col-9">
        <PInputText id="startDate" :value="formatDate(leaveRequest.start_date)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="endDate" class="col-12 mb-2 md:col-3 md:mb-0">End Date:</label>
      <div class="col-12 md:col-9">
        <PInputText id="endDate" :value="formatDate(leaveRequest.end_date)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="daysRequested" class="col-12 mb-2 md:col-3 md:mb-0">Days Requested:</label>
      <div class="col-12 md:col-9">
        <PInputText id="daysRequested" :value="leaveRequest.days_requested" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="reason" class="col-12 mb-2 md:col-3 md:mb-0">Reason:</label>
      <div class="col-12 md:col-9">
        <PInputText id="reason" :value="leaveRequest.reason" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="description" class="col-12 mb-2 md:col-3 md:mb-0">Description:</label>
      <div class="col-12 md:col-9">
        <PTextarea id="description" :value="leaveRequest.description" rows="3" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="status" class="col-12 mb-2 md:col-3 md:mb-0">Status:</label>
      <div class="col-12 md:col-9">
        <PTag :value="leaveRequest.status" :severity="getLeaveStatusSeverity(leaveRequest.status)" />
      </div>
    </div>
    <div class="field grid">
      <label for="emergencyContact" class="col-12 mb-2 md:col-3 md:mb-0">Emergency Contact:</label>
      <div class="col-12 md:col-9">
        <PInputText id="emergencyContact" :value="leaveRequest.emergency_contact || 'Not provided'" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="emergencyPhone" class="col-12 mb-2 md:col-3 md:mb-0">Emergency Phone:</label>
      <div class="col-12 md:col-9">
        <PInputText id="emergencyPhone" :value="leaveRequest.emergency_phone || 'Not provided'" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="isHalfDay" class="col-12 mb-2 md:col-3 md:mb-0">Half Day:</label>
      <div class="col-12 md:col-9">
        <PTag :value="leaveRequest.is_half_day ? 'Yes' : 'No'" :severity="leaveRequest.is_half_day ? 'info' : 'secondary'" />
      </div>
    </div>
    <div class="field grid">
      <label for="isEmergency" class="col-12 mb-2 md:col-3 md:mb-0">Emergency Leave:</label>
      <div class="col-12 md:col-9">
        <PTag :value="leaveRequest.is_emergency ? 'Yes' : 'No'" :severity="leaveRequest.is_emergency ? 'warning' : 'secondary'" />
      </div>
    </div>
    <div class="field grid">
      <label for="createdAt" class="col-12 mb-2 md:col-3 md:mb-0">Created:</label>
      <div class="col-12 md:col-9">
        <PInputText id="createdAt" :value="formatDateTime(leaveRequest.created_at)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="updatedAt" class="col-12 mb-2 md:col-3 md:mb-0">Last Updated:</label>
      <div class="col-12 md:col-9">
        <PInputText id="updatedAt" :value="formatDateTime(leaveRequest.updated_at)" readonly />
      </div>
    </div>

    <!-- Approval Information -->
    <div v-if="leaveRequest.approved_by || leaveRequest.rejected_by" class="mt-4">
      <h5>Approval Information</h5>
      <div class="field grid">
        <label for="approvedBy" class="col-12 mb-2 md:col-3 md:mb-0">Approved By:</label>
        <div class="col-12 md:col-9">
          <PInputText id="approvedBy" :value="leaveRequest.approved_by || 'Not approved'" readonly />
        </div>
      </div>
      <div class="field grid">
        <label for="rejectedBy" class="col-12 mb-2 md:col-3 md:mb-0">Rejected By:</label>
        <div class="col-12 md:col-9">
          <PInputText id="rejectedBy" :value="leaveRequest.rejected_by || 'Not rejected'" readonly />
        </div>
      </div>
      <div class="field grid">
        <label for="approvalNotes" class="col-12 mb-2 md:col-3 md:mb-0">Approval Notes:</label>
        <div class="col-12 md:col-9">
          <PTextarea id="approvalNotes" :value="leaveRequest.approval_notes || 'No notes'" rows="2" readonly />
        </div>
      </div>
      <div class="field grid">
        <label for="approvedAt" class="col-12 mb-2 md:col-3 md:mb-0">Approved At:</label>
        <div class="col-12 md:col-9">
          <PInputText id="approvedAt" :value="formatDateTime(leaveRequest.approved_at)" readonly />
        </div>
      </div>
    </div>

    <!-- Documents -->
    <div v-if="leaveRequest.documents && leaveRequest.documents.length > 0" class="mt-4">
      <h5>Attached Documents</h5>
      <div class="grid">
        <div v-for="(doc, index) in leaveRequest.documents" :key="index" class="col-12 md:col-6">
          <div class="border-1 surface-border border-round p-3">
            <div class="flex align-items-center">
              <i class="pi pi-file text-2xl text-primary mr-3"></i>
              <div class="flex-1">
                <div class="font-semibold">{{ doc.name || `Document ${index + 1}` }}</div>
                <div class="text-sm text-gray-500">{{ formatFileSize(doc.size) }}</div>
              </div>
              <Button 
                icon="pi pi-download" 
                size="small" 
                severity="secondary" 
                @click="downloadDocument(doc)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No leave request selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { LeaveRequest } from '~/types/hrms'

const props = defineProps<{
  leaveRequest: LeaveRequest | null
}>()

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Not provided'
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

const formatFileSize = (bytes: number | undefined) => {
  if (!bytes) return 'Unknown size'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const downloadDocument = (document: any) => {
  // TODO: Implement document download
  console.log('Download document:', document)
}

const getLeaveStatusSeverity = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    case 'pending': return 'warning'
    case 'cancelled': return 'secondary'
    default: return 'info'
  }
}
</script>
