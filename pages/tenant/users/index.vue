<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600 mt-1">Manage users in your organization</p>
      </div>
      <div class="flex space-x-2">
        <Button 
          label="Invite User" 
          icon="pi pi-user-plus" 
          @click="showInviteDialog = true"
        />
        <Button 
          label="Bulk Import" 
          icon="pi pi-upload" 
          class="p-button-outlined"
          @click="showImportDialog = true"
        />
      </div>
    </div>
    
    <!-- Usage Warning -->
    <Message 
      v-if="showUsageWarning" 
      severity="warn" 
      class="mb-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <strong>User Limit Warning:</strong> You're using {{ userUsagePercentage }}% of your user limit ({{ totalUsers }}/{{ maxUsers }}).
        </div>
        <Button 
          label="Upgrade Plan" 
          class="p-button-sm p-button-warning" 
          @click="$router.push('/tenant/settings/subscription')"
        />
      </div>
    </Message>
    
    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Search</label>
            <InputText 
              v-model="filters.search" 
              placeholder="Search users..."
              class="w-full"
              @input="debouncedSearch"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <Dropdown 
              v-model="filters.status" 
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              class="w-full"
              @change="fetchUsers"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Role</label>
            <Dropdown 
              v-model="filters.role" 
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Roles"
              class="w-full"
              @change="fetchUsers"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Department</label>
            <Dropdown 
              v-model="filters.department" 
              :options="departmentOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Departments"
              class="w-full"
              @change="fetchUsers"
            />
          </div>
          <div class="flex items-end">
            <Button 
              label="Clear Filters" 
              class="p-button-outlined w-full"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>
    </Card>
    
    <!-- Users Table -->
    <Card>
      <template #content>
        <DataTable 
          :value="users" 
          :loading="loading"
          paginator 
          :rows="20"
          :totalRecords="totalRecords"
          :lazy="true"
          @page="onPage"
          @sort="onSort"
          sortMode="single"
          dataKey="id"
          :rowHover="true"
          class="p-datatable-sm"
          :selection="selectedUsers"
          @update:selection="selectedUsers = $event"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <Button 
                  v-if="selectedUsers.length > 0"
                  :label="`Actions (${selectedUsers.length})`"
                  icon="pi pi-cog"
                  class="p-button-sm"
                  @click="showBulkActions = true"
                />
              </div>
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-refresh" 
                  class="p-button-text p-button-sm" 
                  @click="fetchUsers"
                  v-tooltip="'Refresh'"
                />
                <Button 
                  icon="pi pi-download" 
                  class="p-button-text p-button-sm" 
                  @click="exportUsers"
                  v-tooltip="'Export'"
                />
              </div>
            </div>
          </template>
          
          <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
          
          <Column field="email" header="User" sortable>
            <template #body="slotProps">
              <div class="flex items-center space-x-3">
                <Avatar 
                  :label="getUserInitials(slotProps.data)" 
                  size="normal" 
                  shape="circle" 
                  :class="getAvatarColor(slotProps.data.email)"
                />
                <div>
                  <p class="font-medium">{{ slotProps.data.first_name }} {{ slotProps.data.last_name }}</p>
                  <p class="text-sm text-gray-500">{{ slotProps.data.email }}</p>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="roles" header="Roles">
            <template #body="slotProps">
              <div class="flex flex-wrap gap-1">
                <Badge 
                  v-for="role in slotProps.data.roles" 
                  :key="role.id"
                  :value="role.name" 
                  :severity="getRoleSeverity(role.name)"
                  class="text-xs"
                />
              </div>
            </template>
          </Column>
          
          <Column field="department" header="Department" sortable>
            <template #body="slotProps">
              <span class="text-sm">{{ slotProps.data.department?.name || 'Not assigned' }}</span>
            </template>
          </Column>
          
          <Column field="is_active" header="Status" sortable>
            <template #body="slotProps">
              <Badge 
                :value="slotProps.data.is_active ? 'Active' : 'Inactive'" 
                :severity="slotProps.data.is_active ? 'success' : 'danger'"
              />
            </template>
          </Column>
          
          <Column field="last_login" header="Last Login" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ slotProps.data.last_login ? formatDate(slotProps.data.last_login) : 'Never' }}
              </div>
            </template>
          </Column>
          
          <Column field="created_at" header="Joined" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ formatDate(slotProps.data.created_at) }}
              </div>
            </template>
          </Column>
          
          <Column header="Actions" :exportable="false">
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-eye" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'View Profile'"
                  @click="viewUser(slotProps.data)"
                />
                <Button 
                  icon="pi pi-pencil" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'Edit'"
                  @click="editUser(slotProps.data)"
                />
                <SplitButton 
                  :model="getUserActions(slotProps.data)"
                  class="p-button-text p-button-sm"
                  icon="pi pi-ellipsis-v"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Invite User Dialog -->
    <Dialog 
      v-model:visible="showInviteDialog" 
      header="Invite New User" 
      :modal="true"
      class="w-full max-w-md"
    >
      <form @submit.prevent="inviteUser" class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Email Address *</label>
          <InputText
            v-model="inviteForm.email"
            type="email"
            placeholder="user@company.com"
            :class="{ 'p-invalid': inviteErrors.email }"
            required
          />
          <small v-if="inviteErrors.email" class="p-error">{{ inviteErrors.email }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">First Name *</label>
          <InputText
            v-model="inviteForm.first_name"
            placeholder="John"
            :class="{ 'p-invalid': inviteErrors.first_name }"
            required
          />
          <small v-if="inviteErrors.first_name" class="p-error">{{ inviteErrors.first_name }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Last Name *</label>
          <InputText
            v-model="inviteForm.last_name"
            placeholder="Doe"
            :class="{ 'p-invalid': inviteErrors.last_name }"
            required
          />
          <small v-if="inviteErrors.last_name" class="p-error">{{ inviteErrors.last_name }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Role *</label>
          <MultiSelect
            v-model="inviteForm.roles"
            :options="availableRoles"
            optionLabel="name"
            optionValue="id"
            placeholder="Select roles"
            :class="{ 'p-invalid': inviteErrors.roles }"
            class="w-full"
          />
          <small v-if="inviteErrors.roles" class="p-error">{{ inviteErrors.roles }}</small>
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Department</label>
          <Dropdown
            v-model="inviteForm.department"
            :options="departments"
            optionLabel="name"
            optionValue="id"
            placeholder="Select department"
            class="w-full"
          />
        </div>
        
        <div class="flex items-center">
          <Checkbox
            id="sendWelcome"
            v-model="inviteForm.send_welcome_email"
            binary
          />
          <label for="sendWelcome" class="ml-2 text-sm text-gray-700">Send welcome email</label>
        </div>
      </form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="Cancel"
            class="p-button-secondary"
            @click="closeInviteDialog"
          />
          <Button
            label="Send Invitation"
            :loading="inviting"
            @click="inviteUser"
          />
        </div>
      </template>
    </Dialog>
    
    <!-- User Profile Dialog -->
    <Dialog 
      v-model:visible="showProfileDialog" 
      :header="selectedUser?.first_name + ' ' + selectedUser?.last_name" 
      :modal="true"
      class="w-full max-w-2xl"
    >
      <div v-if="selectedUser" class="space-y-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3">Personal Information</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Email:</span>
                <span class="font-medium">{{ selectedUser.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phone:</span>
                <span class="font-medium">{{ selectedUser.profile?.phone || 'Not set' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Department:</span>
                <span class="font-medium">{{ selectedUser.department?.name || 'Not assigned' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <Badge :value="selectedUser.is_active ? 'Active' : 'Inactive'" :severity="selectedUser.is_active ? 'success' : 'danger'" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold mb-3">Account Details</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Joined:</span>
                <span class="font-medium">{{ formatDate(selectedUser.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Login:</span>
                <span class="font-medium">{{ selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Never' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Two Factor:</span>
                <Badge :value="selectedUser.profile?.two_factor_enabled ? 'Enabled' : 'Disabled'" :severity="selectedUser.profile?.two_factor_enabled ? 'success' : 'warning'" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Roles and Permissions -->
        <div>
          <h4 class="font-semibold mb-3">Roles & Permissions</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-2">Assigned Roles</h5>
              <div class="flex flex-wrap gap-2">
                <Badge 
                  v-for="role in selectedUser.roles" 
                  :key="role.id"
                  :value="role.name" 
                  :severity="getRoleSeverity(role.name)"
                />
              </div>
            </div>
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-2">Effective Permissions</h5>
              <div class="max-h-32 overflow-y-auto">
                <div class="flex flex-wrap gap-1">
                  <Badge 
                    v-for="permission in selectedUser.effective_permissions" 
                    :key="permission"
                    :value="permission" 
                    severity="info"
                    class="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button label="Edit User" icon="pi pi-pencil" @click="editUser(selectedUser)" />
          <Button label="Close" class="p-button-secondary" @click="showProfileDialog = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'tenant',
  middleware: 'tenant-admin'
})

const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()

// Reactive data
const users = ref<any[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const selectedUsers = ref<any[]>([])
const selectedUser = ref<any>(null)
const totalUsers = ref(0)
const maxUsers = ref(0)

// Dialogs
const showInviteDialog = ref(false)
const showProfileDialog = ref(false)
const showImportDialog = ref(false)
const showBulkActions = ref(false)

// Forms
const inviteForm = ref({
  email: '',
  first_name: '',
  last_name: '',
  roles: [],
  department: null,
  send_welcome_email: true
})
const inviteErrors = ref<Record<string, string>>({})
const inviting = ref(false)

// Filters
const filters = ref({
  search: '',
  status: '',
  role: '',
  department: ''
})

// Pagination
const pagination = ref({
  page: 0,
  rows: 20,
  sortField: 'created_at',
  sortOrder: -1
})

// Options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
]

const roleOptions = ref([
  { label: 'All Roles', value: '' }
])

const departmentOptions = ref([
  { label: 'All Departments', value: '' }
])

const availableRoles = ref<any[]>([])
const departments = ref<any[]>([])

// Computed
const userUsagePercentage = computed(() => {
  if (maxUsers.value === -1) return 0
  return Math.round((totalUsers.value / maxUsers.value) * 100)
})

const showUsageWarning = computed(() => {
  return userUsagePercentage.value > 80
})

// Methods
const fetchUsers = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: (pagination.value.page + 1).toString(),
      page_size: pagination.value.rows.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status) params.append('is_active', filters.value.status)
    if (filters.value.role) params.append('role', filters.value.role)
    if (filters.value.department) params.append('department', filters.value.department)
    if (pagination.value.sortField) {
      const sortOrder = pagination.value.sortOrder === 1 ? '' : '-'
      params.append('ordering', `${sortOrder}${pagination.value.sortField}`)
    }
    
    const response = await $api(`/api/v1/tenant/users/?${params.toString()}`)
    
    users.value = response.results
    totalRecords.value = response.count
    totalUsers.value = response.count
    
    // Get tenant limits
    if (authStore.tenant) {
      maxUsers.value = authStore.tenant.max_users
    }
    
  } catch (error) {
    console.error('Failed to fetch users:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch users',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const fetchRolesAndDepartments = async () => {
  try {
    const [rolesResponse, departmentsResponse] = await Promise.all([
      $api('/api/v1/tenant/roles/'),
      $api('/api/v1/tenant/departments/')
    ])
    
    availableRoles.value = rolesResponse.results || []
    departments.value = departmentsResponse.results || []
    
    // Update filter options
    roleOptions.value = [
      { label: 'All Roles', value: '' },
      ...availableRoles.value.map(role => ({ label: role.name, value: role.id }))
    ]
    
    departmentOptions.value = [
      { label: 'All Departments', value: '' },
      ...departments.value.map(dept => ({ label: dept.name, value: dept.id }))
    ]
    
  } catch (error) {
    console.error('Failed to fetch roles and departments:', error)
  }
}

const debouncedSearch = debounce(() => {
  pagination.value.page = 0
  fetchUsers()
}, 300)

const onPage = (event: any) => {
  pagination.value.page = event.page
  pagination.value.rows = event.rows
  fetchUsers()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  fetchUsers()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    role: '',
    department: ''
  }
  pagination.value.page = 0
  fetchUsers()
}

const viewUser = (user: any) => {
  selectedUser.value = user
  showProfileDialog.value = true
}

const editUser = (user: any) => {
  navigateTo(`/tenant/users/${user.id}/edit`)
}

const getUserActions = (user: any) => {
  const actions = []
  
  if (user.is_active) {
    actions.push({
      label: 'Deactivate',
      icon: 'pi pi-ban',
      command: () => updateUserStatus(user, false)
    })
  } else {
    actions.push({
      label: 'Activate',
      icon: 'pi pi-check',
      command: () => updateUserStatus(user, true)
    })
  }
  
  actions.push({
    label: 'Reset Password',
    icon: 'pi pi-key',
    command: () => resetUserPassword(user)
  })
  
  actions.push({
    label: 'View Activity',
    icon: 'pi pi-history',
    command: () => navigateTo(`/tenant/users/${user.id}/activity`)
  })
  
  if (!user.is_active) {
    actions.push({
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => deleteUser(user)
    })
  }
  
  return actions
}

const updateUserStatus = async (user: any, status: boolean) => {
  try {
    await $api(`/api/v1/tenant/users/${user.id}/`, {
      method: 'PATCH',
      body: { is_active: status }
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `User ${status ? 'activated' : 'deactivated'} successfully`,
      life: 3000
    })
    
    fetchUsers()
  } catch (error) {
    console.error('Failed to update user status:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update user status',
      life: 3000
    })
  }
}

const resetUserPassword = async (user: any) => {
  try {
    await $api(`/api/v1/tenant/users/${user.id}/reset-password/`, {
      method: 'POST'
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password reset email sent',
      life: 3000
    })
  } catch (error) {
    console.error('Failed to reset password:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to reset password',
      life: 3000
    })
  }
}

const deleteUser = async (user: any) => {
  // TODO: Implement delete confirmation dialog
  console.log('Delete user:', user.id)
}

const inviteUser = async () => {
  try {
    inviting.value = true
    inviteErrors.value = {}
    
    await $api('/api/v1/tenant/users/invite/', {
      method: 'POST',
      body: inviteForm.value
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User invitation sent successfully',
      life: 3000
    })
    
    closeInviteDialog()
    fetchUsers()
  } catch (error: any) {
    if (error.data?.errors) {
      inviteErrors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send invitation',
        life: 3000
      })
    }
  } finally {
    inviting.value = false
  }
}

const closeInviteDialog = () => {
  showInviteDialog.value = false
  inviteForm.value = {
    email: '',
    first_name: '',
    last_name: '',
    roles: [],
    department: null,
    send_welcome_email: true
  }
  inviteErrors.value = {}
}

const exportUsers = () => {
  // TODO: Implement user export
  console.log('Export users')
}

// Utility functions
const getUserInitials = (user: any) => {
  return (user.first_name?.charAt(0) || '') + (user.last_name?.charAt(0) || '')
}

const getAvatarColor = (email: string) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500']
  const index = email.length % colors.length
  return colors[index]
}

const getRoleSeverity = (roleName: string) => {
  switch (roleName.toLowerCase()) {
    case 'tenant_admin': return 'danger'
    case 'hr_manager': return 'warning'
    case 'manager': return 'info'
    default: return 'secondary'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchUsers()
  fetchRolesAndDepartments()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-multiselect) {
  width: 100%;
}
</style>
