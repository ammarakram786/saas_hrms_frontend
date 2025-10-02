<template>
  <div v-if="role" class="p-fluid">
    <div class="field grid">
      <label for="name" class="col-12 mb-2 md:col-3 md:mb-0">Name:</label>
      <div class="col-12 md:col-9">
        <PInputText id="name" :value="role.name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="description" class="col-12 mb-2 md:col-3 md:mb-0">Description:</label>
      <div class="col-12 md:col-9">
        <PTextarea id="description" :value="role.description" rows="3" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="isSystem" class="col-12 mb-2 md:col-3 md:mb-0">Type:</label>
      <div class="col-12 md:col-9">
        <PTag :value="role.is_system ? 'System' : 'Custom'" :severity="role.is_system ? 'warning' : 'info'" />
      </div>
    </div>
    <div class="field grid">
      <label for="isActive" class="col-12 mb-2 md:col-3 md:mb-0">Status:</label>
      <div class="col-12 md:col-9">
        <PTag :value="role.is_active ? 'Active' : 'Inactive'" :severity="role.is_active ? 'success' : 'danger'" />
      </div>
    </div>
    <div class="field grid">
      <label for="permissions" class="col-12 mb-2 md:col-3 md:mb-0">Permissions:</label>
      <div class="col-12 md:col-9">
        <div v-if="role.permissions && role.permissions.length > 0" class="flex flex-wrap gap-1">
          <PTag 
            v-for="permission in role.permissions" 
            :key="permission.id" 
            :value="permission.name" 
            severity="secondary" 
          />
        </div>
        <div v-else class="text-gray-500">No permissions assigned</div>
      </div>
    </div>
    <div class="field grid">
      <label for="userCount" class="col-12 mb-2 md:col-3 md:mb-0">Users:</label>
      <div class="col-12 md:col-9">
        <PInputText id="userCount" :value="role.user_count || 0" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="createdAt" class="col-12 mb-2 md:col-3 md:mb-0">Created:</label>
      <div class="col-12 md:col-9">
        <PInputText id="createdAt" :value="formatDateTime(role.created_at)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="updatedAt" class="col-12 mb-2 md:col-3 md:mb-0">Last Updated:</label>
      <div class="col-12 md:col-9">
        <PInputText id="updatedAt" :value="formatDateTime(role.updated_at)" readonly />
      </div>
    </div>
  </div>
  <div v-else>
    <p>No role selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Role } from '~/types/hrms'

const props = defineProps<{
  role: Role | null
}>()

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
