<template>
  <div v-if="user" class="p-fluid">
    <div class="field grid">
      <label for="fullName" class="col-12 mb-2 md:col-3 md:mb-0">Full Name:</label>
      <div class="col-12 md:col-9">
        <PInputText id="fullName" :value="user.first_name + ' ' + user.last_name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="email" class="col-12 mb-2 md:col-3 md:mb-0">Email:</label>
      <div class="col-12 md:col-9">
        <PInputText id="email" :value="user.email" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="isActive" class="col-12 mb-2 md:col-3 md:mb-0">Status:</label>
      <div class="col-12 md:col-9">
        <PTag :value="user.is_active ? 'Active' : 'Inactive'" :severity="user.is_active ? 'success' : 'danger'" />
      </div>
    </div>
    <div class="field grid">
      <label for="isStaff" class="col-12 mb-2 md:col-3 md:mb-0">Staff:</label>
      <div class="col-12 md:col-9">
        <PTag :value="user.is_staff ? 'Yes' : 'No'" :severity="user.is_staff ? 'warning' : 'secondary'" />
      </div>
    </div>
    <div class="field grid">
      <label for="isSuperuser" class="col-12 mb-2 md:col-3 md:mb-0">Super User:</label>
      <div class="col-12 md:col-9">
        <PTag :value="user.is_superuser ? 'Yes' : 'No'" :severity="user.is_superuser ? 'danger' : 'secondary'" />
      </div>
    </div>
    <div class="field grid">
      <label for="roles" class="col-12 mb-2 md:col-3 md:mb-0">Roles:</label>
      <div class="col-12 md:col-9">
        <div class="flex flex-wrap gap-1">
          <PTag 
            v-for="role in user.roles" 
            :key="role.id" 
            :value="role.name" 
            severity="info" 
          />
        </div>
      </div>
    </div>
    <div class="field grid">
      <label for="lastLogin" class="col-12 mb-2 md:col-3 md:mb-0">Last Login:</label>
      <div class="col-12 md:col-9">
        <PInputText id="lastLogin" :value="formatDateTime(user.last_login)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="dateJoined" class="col-12 mb-2 md:col-3 md:mb-0">Date Joined:</label>
      <div class="col-12 md:col-9">
        <PInputText id="dateJoined" :value="formatDateTime(user.date_joined)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="profile" class="col-12 mb-2 md:col-3 md:mb-0">Profile:</label>
      <div class="col-12 md:col-9">
        <div v-if="user.profile" class="border-1 surface-border border-round p-3">
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="field">
                <label class="font-semibold">Phone:</label>
                <p class="mt-1">{{ user.profile.phone || 'Not provided' }}</p>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="field">
                <label class="font-semibold">Address:</label>
                <p class="mt-1">{{ user.profile.address || 'Not provided' }}</p>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="field">
                <label class="font-semibold">Two-Factor Auth:</label>
                <p class="mt-1">
                  <PTag 
                    :value="user.profile.two_factor_enabled ? 'Enabled' : 'Disabled'" 
                    :severity="user.profile.two_factor_enabled ? 'success' : 'warning'" 
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500">No profile information available</div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No user selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { User } from '~/types/hrms'

const props = defineProps<{
  user: User | null
}>()

const formatDateTime = (dateTimeString: string | null | undefined) => {
  if (!dateTimeString) return 'Never'
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
