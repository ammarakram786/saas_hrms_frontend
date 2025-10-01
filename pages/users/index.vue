<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">User Management</h1>
            <p class="text-600 mt-2 mb-0">Manage system users, roles, and permissions</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Send Invitation" 
              icon="pi pi-envelope" 
              class="p-button-outlined"
              @click="showInviteDialog = true"
            />
            <PButton 
              label="Add User" 
              icon="pi pi-plus" 
              @click="showCreateDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Total Users</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.totalUsers }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-users text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Active Users</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.activeUsers }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Pending Invitations</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.pendingInvitations }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-clock text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-3">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Admin Users</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.adminUsers }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-shield text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Filters -->
    <div class="col-12">
      <PCard>
        <template #title>Filters</template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="search" class="font-medium">Search</label>
                <PInputText 
                  id="search"
                  v-model="filters.global" 
                  placeholder="Search users..."
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="role" class="font-medium">Role</label>
                <PDropdown 
                  id="role"
                  v-model="filters.role" 
                  :options="roleOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Roles"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="status" class="font-medium">Status</label>
                <PDropdown 
                  id="status"
                  v-model="filters.status" 
                  :options="statusOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="All Statuses"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="lastLogin" class="font-medium">Last Login</label>
                <PDropdown 
                  id="lastLogin"
                  v-model="filters.lastLogin" 
                  :options="lastLoginOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="Any Time"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Users Table -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Users</span>
            <div class="flex align-items-center gap-2">
              <PButton 
                icon="pi pi-refresh" 
                class="p-button-outlined p-button-sm"
                @click="refreshData"
                :loading="loading"
              />
              <PDropdown 
                v-model="selectedView" 
                :options="viewOptions" 
                optionLabel="label" 
                optionValue="value"
                class="w-8rem"
              />
            </div>
          </div>
        </template>
        <template #content>
          <PDataTable 
            v-if="selectedView === 'table'"
            :value="users" 
            :paginator="true" 
            :rows="20"
            :filters="filters"
            filterDisplay="row"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            :globalFilterFields="['username', 'email', 'first_name', 'last_name']"
            responsiveLayout="scroll"
            :scrollable="true"
            scrollHeight="600px"
          >
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-users text-4xl text-400 mb-3"></i>
                <p class="text-600">No users found</p>
              </div>
            </template>
            
            <PColumn field="username" header="Username" sortable style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <PAvatar 
                    :label="data.first_name?.charAt(0) + data.last_name?.charAt(0)" 
                    shape="circle" 
                    size="normal"
                    class="bg-primary-100 text-primary-700"
                  />
                  <div>
                    <div class="font-medium">{{ data.username }}</div>
                    <div class="text-sm text-500">{{ data.email }}</div>
                  </div>
                </div>
              </template>
            </PColumn>
            
            <PColumn field="first_name" header="Full Name" sortable style="min-width: 200px">
              <template #body="{ data }">
                <span>{{ data.first_name }} {{ data.last_name }}</span>
              </template>
            </PColumn>
            
            <PColumn field="roles" header="Roles" sortable style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                  <PTag 
                    v-for="role in data.roles" 
                    :key="role.id"
                    :value="role.name" 
                    severity="info" 
                    class="text-xs"
                  />
                </div>
              </template>
            </PColumn>
            
            <PColumn field="is_active" header="Status" sortable style="min-width: 120px">
              <template #body="{ data }">
                <PTag 
                  :value="data.is_active ? 'Active' : 'Inactive'" 
                  :severity="data.is_active ? 'success' : 'danger'" 
                />
              </template>
            </PColumn>
            
            <PColumn field="last_login" header="Last Login" sortable style="min-width: 150px">
              <template #body="{ data }">
                <span v-if="data.last_login">{{ formatDate(data.last_login) }}</span>
                <span v-else class="text-500">Never</span>
              </template>
            </PColumn>
            
            <PColumn field="date_joined" header="Joined" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>{{ formatDate(data.date_joined) }}</span>
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'View Details'"
                    @click="viewUser(data)" 
                  />
                  <PButton 
                    icon="pi pi-pencil" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Edit User'"
                    @click="editUser(data)" 
                  />
                  <PButton 
                    icon="pi pi-key" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Reset Password'"
                    @click="resetPassword(data)" 
                  />
                  <PButton 
                    icon="pi pi-trash" 
                    class="p-button-text p-button-sm p-button-danger"
                    v-tooltip.top="'Delete User'"
                    @click="deleteUser(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>

          <!-- Card View -->
          <div v-else class="grid">
            <div 
              v-for="user in users" 
              :key="user.id" 
              class="col-12 md:col-6 lg:col-4"
            >
              <PCard class="user-card">
                <template #content>
                  <div class="text-center">
                    <PAvatar 
                      :label="user.first_name?.charAt(0) + user.last_name?.charAt(0)" 
                      shape="circle" 
                      size="xlarge"
                      class="bg-primary-100 text-primary-700 mb-3"
                    />
                    <h4 class="text-900 font-medium mb-1">{{ user.first_name }} {{ user.last_name }}</h4>
                    <p class="text-600 text-sm mb-2">{{ user.email }}</p>
                    <div class="flex justify-content-center gap-1 mb-3">
                      <PTag 
                        v-for="role in user.roles" 
                        :key="role.id"
                        :value="role.name" 
                        severity="info" 
                        class="text-xs"
                      />
                    </div>
                    <PTag 
                      :value="user.is_active ? 'Active' : 'Inactive'" 
                      :severity="user.is_active ? 'success' : 'danger'" 
                      class="mb-3"
                    />
                    <div class="flex justify-content-center gap-2">
                      <PButton 
                        icon="pi pi-eye" 
                        class="p-button-text p-button-sm"
                        @click="viewUser(user)" 
                      />
                      <PButton 
                        icon="pi pi-pencil" 
                        class="p-button-text p-button-sm"
                        @click="editUser(user)" 
                      />
                      <PButton 
                        icon="pi pi-key" 
                        class="p-button-text p-button-sm"
                        @click="resetPassword(user)" 
                      />
                      <PButton 
                        icon="pi pi-trash" 
                        class="p-button-text p-button-sm p-button-danger"
                        @click="deleteUser(user)" 
                      />
                    </div>
                  </div>
                </template>
              </PCard>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Create/Edit User Dialog -->
    <PDialog 
      v-model:visible="showCreateDialog" 
      :header="editingUser ? 'Edit User' : 'Add New User'" 
      :style="{ width: '600px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="username" class="font-medium">Username *</label>
            <PInputText 
              id="username"
              v-model="userForm.username" 
              placeholder="johndoe"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="email" class="font-medium">Email *</label>
            <PInputText 
              id="email"
              v-model="userForm.email" 
              type="email"
              placeholder="john@example.com"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="firstName" class="font-medium">First Name *</label>
            <PInputText 
              id="firstName"
              v-model="userForm.first_name" 
              placeholder="John"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="lastName" class="font-medium">Last Name *</label>
            <PInputText 
              id="lastName"
              v-model="userForm.last_name" 
              placeholder="Doe"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="password" class="font-medium">Password</label>
            <PPassword 
              id="password"
              v-model="userForm.password" 
              placeholder="Enter password"
              class="w-full"
              :feedback="false"
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="isActive" class="font-medium">Status</label>
            <PDropdown 
              id="isActive"
              v-model="userForm.is_active" 
              :options="statusOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Status"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="roles" class="font-medium">Roles</label>
            <PMultiSelect 
              id="roles"
              v-model="userForm.roles" 
              :options="roleOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Roles"
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <PButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="closeDialog" 
        />
        <PButton 
          :label="editingUser ? 'Update' : 'Create'" 
          icon="pi pi-check" 
          @click="saveUser" 
        />
      </template>
    </PDialog>

    <!-- Send Invitation Dialog -->
    <PDialog 
      v-model:visible="showInviteDialog" 
      header="Send Invitation" 
      :style="{ width: '500px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="inviteEmail" class="font-medium">Email Address *</label>
            <PInputText 
              id="inviteEmail"
              v-model="inviteForm.email" 
              type="email"
              placeholder="user@example.com"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="inviteRole" class="font-medium">Role *</label>
            <PDropdown 
              id="inviteRole"
              v-model="inviteForm.role" 
              :options="roleOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Role"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="inviteMessage" class="font-medium">Message</label>
            <PTextarea 
              id="inviteMessage"
              v-model="inviteForm.message" 
              placeholder="Optional message for the invitation"
              rows="3"
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <PButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="closeInviteDialog" 
        />
        <PButton 
          label="Send Invitation" 
          icon="pi pi-envelope" 
          @click="sendInvitation" 
        />
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

// Reactive data
const users = ref([])
const loading = ref(false)
const showCreateDialog = ref(false)
const showInviteDialog = ref(false)
const editingUser = ref(false)
const selectedView = ref('table')

const filters = ref({
  global: '',
  role: null,
  status: null,
  lastLogin: null
})

const userForm = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  is_active: true,
  roles: []
})

const inviteForm = ref({
  email: '',
  role: null,
  message: ''
})

// Stats
const stats = ref({
  totalUsers: 45,
  activeUsers: 42,
  pendingInvitations: 3,
  adminUsers: 5
})

// Options
const roleOptions = ref([
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'HR', value: 'hr' },
  { label: 'Employee', value: 'employee' }
])

const statusOptions = ref([
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
])

const lastLoginOptions = ref([
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Never', value: 'never' }
])

const viewOptions = ref([
  { label: 'Table View', value: 'table' },
  { label: 'Card View', value: 'card' }
])

// Mock data
const mockUsers = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    first_name: 'John',
    last_name: 'Admin',
    is_active: true,
    roles: [{ id: 1, name: 'Super Admin' }],
    last_login: '2024-01-15T10:30:00Z',
    date_joined: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'jane.smith',
    email: 'jane.smith@company.com',
    first_name: 'Jane',
    last_name: 'Smith',
    is_active: true,
    roles: [{ id: 2, name: 'Manager' }],
    last_login: '2024-01-14T15:45:00Z',
    date_joined: '2023-02-15T00:00:00Z'
  },
  {
    id: 3,
    username: 'mike.johnson',
    email: 'mike.johnson@company.com',
    first_name: 'Mike',
    last_name: 'Johnson',
    is_active: false,
    roles: [{ id: 3, name: 'Employee' }],
    last_login: null,
    date_joined: '2023-03-10T00:00:00Z'
  }
])

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewUser = (user: any) => {
  // TODO: Implement view user details
  console.log('View user:', user)
}

const editUser = (user: any) => {
  editingUser.value = true
  userForm.value = { ...user }
  showCreateDialog.value = true
}

const resetPassword = (user: any) => {
  // TODO: Implement reset password
  toast.add({
    severity: 'info',
    summary: 'Reset Password',
    detail: 'Password reset functionality will be implemented',
    life: 3000
  })
}

const deleteUser = (user: any) => {
  // TODO: Implement delete user
  console.log('Delete user:', user)
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingUser.value = false
  resetUserForm()
}

const resetUserForm = () => {
  userForm.value = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_active: true,
    roles: []
  }
}

const saveUser = () => {
  if (editingUser.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === userForm.value.id)
    if (index !== -1) {
      users.value[index] = { ...userForm.value }
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User updated successfully',
      life: 3000
    })
  } else {
    // Create new user
    const newUser = {
      ...userForm.value,
      id: users.value.length + 1,
      roles: roleOptions.value.filter(role => userForm.value.roles.includes(role.value)),
      last_login: null,
      date_joined: new Date().toISOString()
    }
    users.value.unshift(newUser)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User created successfully',
      life: 3000
    })
  }
  closeDialog()
}

const closeInviteDialog = () => {
  showInviteDialog.value = false
  resetInviteForm()
}

const resetInviteForm = () => {
  inviteForm.value = {
    email: '',
    role: null,
    message: ''
  }
}

const sendInvitation = () => {
  // TODO: Implement send invitation
  toast.add({
    severity: 'success',
    summary: 'Invitation Sent',
    detail: 'User invitation has been sent successfully',
    life: 3000
  })
  closeInviteDialog()
}

const refreshData = async () => {
  loading.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'User data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh user data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  users.value = mockUsers.value
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.user-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
