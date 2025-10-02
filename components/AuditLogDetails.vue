<template>
  <div v-if="log" class="p-fluid">
    <div class="field grid">
      <label for="timestamp" class="col-12 mb-2 md:col-3 md:mb-0">Timestamp:</label>
      <div class="col-12 md:col-9">
        <PInputText id="timestamp" :value="formatDateTime(log.timestamp)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="user" class="col-12 mb-2 md:col-3 md:mb-0">User:</label>
      <div class="col-12 md:col-9">
        <PInputText id="user" :value="log.user_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="action" class="col-12 mb-2 md:col-3 md:mb-0">Action:</label>
      <div class="col-12 md:col-9">
        <PTag :value="log.action" :severity="getActionSeverity(log.action)" />
      </div>
    </div>
    <div class="field grid">
      <label for="resourceType" class="col-12 mb-2 md:col-3 md:mb-0">Resource Type:</label>
      <div class="col-12 md:col-9">
        <PInputText id="resourceType" :value="log.resource_type" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="resourceName" class="col-12 mb-2 md:col-3 md:mb-0">Resource Name:</label>
      <div class="col-12 md:col-9">
        <PInputText id="resourceName" :value="log.resource_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="resourceId" class="col-12 mb-2 md:col-3 md:mb-0">Resource ID:</label>
      <div class="col-12 md:col-9">
        <PInputText id="resourceId" :value="log.resource_id" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="ipAddress" class="col-12 mb-2 md:col-3 md:mb-0">IP Address:</label>
      <div class="col-12 md:col-9">
        <PInputText id="ipAddress" :value="log.ip_address" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="userAgent" class="col-12 mb-2 md:col-3 md:mb-0">User Agent:</label>
      <div class="col-12 md:col-9">
        <PTextarea id="userAgent" :value="log.user_agent" rows="2" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="sessionId" class="col-12 mb-2 md:col-3 md:mb-0">Session ID:</label>
      <div class="col-12 md:col-9">
        <PInputText id="sessionId" :value="log.session_id || 'N/A'" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="requestId" class="col-12 mb-2 md:col-3 md:mb-0">Request ID:</label>
      <div class="col-12 md:col-9">
        <PInputText id="requestId" :value="log.request_id || 'N/A'" readonly />
      </div>
    </div>

    <!-- Changes Section -->
    <div v-if="log.changes && Object.keys(log.changes).length > 0" class="mt-4">
      <h6 class="mb-3">Changes Made</h6>
      <div class="border-1 surface-border border-round p-3">
        <div v-for="(change, field) in log.changes" :key="field" class="mb-3">
          <div class="font-semibold mb-2">{{ formatFieldName(field) }}</div>
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="p-2 bg-red-50 dark:bg-red-900 border-round">
                <div class="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">Before:</div>
                <div class="text-sm">{{ formatValue(change.old) }}</div>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="p-2 bg-green-50 dark:bg-green-900 border-round">
                <div class="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">After:</div>
                <div class="text-sm">{{ formatValue(change.new) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Data -->
    <div v-if="log.additional_data && Object.keys(log.additional_data).length > 0" class="mt-4">
      <h6 class="mb-3">Additional Data</h6>
      <div class="border-1 surface-border border-round p-3">
        <pre class="text-sm text-gray-600 dark:text-gray-400 overflow-auto">{{ JSON.stringify(log.additional_data, null, 2) }}</pre>
      </div>
    </div>

    <!-- Metadata -->
    <div class="mt-4">
      <h6 class="mb-3">Metadata</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Created:</label>
            <p class="mt-1">{{ formatDateTime(log.created_at) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Log ID:</label>
            <p class="mt-1 font-mono text-sm">{{ log.id }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No audit log selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { AuditLog } from '~/types/hrms'

const props = defineProps<{
  log: AuditLog | null
}>()

const formatDateTime = (dateTimeString: string | null | undefined) => {
  if (!dateTimeString) return 'N/A'
  const date = new Date(dateTimeString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getActionSeverity = (action: string) => {
  switch (action) {
    case 'create': return 'success'
    case 'update': return 'info'
    case 'delete': return 'danger'
    case 'login': return 'success'
    case 'logout': return 'warning'
    default: return 'secondary'
  }
}

const formatFieldName = (field: string) => {
  return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatValue = (value: any) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}
</script>
