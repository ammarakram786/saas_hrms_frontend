<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Role Management</h1>
            <p class="text-600 mt-2 mb-0">Manage user roles and permissions</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Add Role" 
              icon="pi pi-plus" 
              @click="showCreateDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="col-12 md:col-4">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Total Roles</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.totalRoles }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-shield text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-4">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Active Roles</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.activeRoles }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <div class="col-12 md:col-4">
      <PCard class="stat-card">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <span class="block text-500 font-medium mb-3">Users with Roles</span>
              <div class="text-900 font-bold text-4xl m-0">{{ stats.usersWithRoles }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem;">
              <i class="pi pi-users text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </PCard>
    </div>

    <!-- Roles Table -->
    <div class="col-12">
      <PCard>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span>Roles</span>
            <div class="flex align-items-center gap-2">
              <PButton 
                icon="pi pi-refresh" 
                class="p-button-outlined p-button-sm"
                @click="refreshData"
                :loading="loading"
              />
            </div>
          </div>
        </template>
        <template #content>
          <PDataTable 
            :value="roles" 
            :paginator="true" 
            :rows="20"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            responsiveLayout="scroll"
            :scrollable="true"
            scrollHeight="600px"
          >
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-shield text-4xl text-400 mb-3"></i>
                <p class="text-600">No roles found</p>
              </div>
            </template>
            
            <PColumn field="name" header="Role Name" sortable style="min-width: 200px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-shield text-primary-500"></i>
                  <span class="font-medium">{{ data.name }}</span>
                </div>
              </template>
            </PColumn>
            
            <PColumn field="description" header="Description" sortable style="min-width: 300px">
              <template #body="{ data }">
                <span>{{ data.description || '-' }}</span>
              </template>
            </PColumn>
            
            <PColumn field="permissions" header="Permissions" style="min-width: 200px">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                  <PTag 
                    v-for="permission in data.permissions" 
                    :key="permission.id"
                    :value="permission.name" 
                    severity="info" 
                    class="text-xs"
                  />
                </div>
              </template>
            </PColumn>
            
            <PColumn field="user_count" header="Users" sortable style="min-width: 100px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.user_count }}</span>
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
            
            <PColumn field="created_at" header="Created" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span>{{ formatDate(data.created_at) }}</span>
              </template>
            </PColumn>
            
            <PColumn header="Actions" style="min-width: 150px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <PButton 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'View Details'"
                    @click="viewRole(data)" 
                  />
                  <PButton 
                    icon="pi pi-pencil" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Edit Role'"
                    @click="editRole(data)" 
                  />
                  <PButton 
                    icon="pi pi-copy" 
                    class="p-button-text p-button-sm"
                    v-tooltip.top="'Duplicate Role'"
                    @click="duplicateRole(data)" 
                  />
                  <PButton 
                    icon="pi pi-trash" 
                    class="p-button-text p-button-sm p-button-danger"
                    v-tooltip.top="'Delete Role'"
                    @click="deleteRole(data)" 
                  />
                </div>
              </template>
            </PColumn>
          </PDataTable>
        </template>
      </PCard>
    </div>

    <!-- Create/Edit Role Dialog -->
    <PDialog 
      v-model:visible="showCreateDialog" 
      :header="editingRole ? 'Edit Role' : 'Add New Role'" 
      :style="{ width: '700px' }"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="roleName" class="font-medium">Role Name *</label>
            <PInputText 
              id="roleName"
              v-model="roleForm.name" 
              placeholder="e.g., HR Manager"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="roleDescription" class="font-medium">Description</label>
            <PTextarea 
              id="roleDescription"
              v-model="roleForm.description" 
              placeholder="Describe the role and its responsibilities"
              rows="3"
              class="w-full"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label for="permissions" class="font-medium">Permissions</label>
            <PMultiSelect 
              id="permissions"
              v-model="roleForm.permissions" 
              :options="permissionOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Permissions"
              class="w-full"
              :filter="true"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <PCheckbox v-model="roleForm.is_active" inputId="isActive" />
            <label for="isActive" class="ml-2">Active Role</label>
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
          :label="editingRole ? 'Update' : 'Create'" 
          icon="pi pi-check" 
          @click="saveRole" 
        />
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

// Reactive data
const roles = ref([])
const loading = ref(false)
const showCreateDialog = ref(false)
const editingRole = ref(false)

const roleForm = ref({
  name: '',
  description: '',
  permissions: [],
  is_active: true
})

// Stats
const stats = ref({
  totalRoles: 8,
  activeRoles: 7,
  usersWithRoles: 45
})

// Permission options
const permissionOptions = ref([
  { id: 1, name: 'employee.view', category: 'Employee' },
  { id: 2, name: 'employee.create', category: 'Employee' },
  { id: 3, name: 'employee.update', category: 'Employee' },
  { id: 4, name: 'employee.delete', category: 'Employee' },
  { id: 5, name: 'attendance.view', category: 'Attendance' },
  { id: 6, name: 'attendance.create', category: 'Attendance' },
  { id: 7, name: 'attendance.update', category: 'Attendance' },
  { id: 8, name: 'attendance.delete', category: 'Attendance' },
  { id: 9, name: 'leave.view', category: 'Leave' },
  { id: 10, name: 'leave.create', category: 'Leave' },
  { id: 11, name: 'leave.approve', category: 'Leave' },
  { id: 12, name: 'payroll.view', category: 'Payroll' },
  { id: 13, name: 'payroll.create', category: 'Payroll' },
  { id: 14, name: 'payroll.process', category: 'Payroll' },
  { id: 15, name: 'user.view', category: 'User' },
  { id: 16, name: 'user.create', category: 'User' },
  { id: 17, name: 'user.update', category: 'User' },
  { id: 18, name: 'user.delete', category: 'User' },
  { id: 19, name: 'role.view', category: 'Role' },
  { id: 20, name: 'role.create', category: 'Role' },
  { id: 21, name: 'role.update', category: 'Role' },
  { id: 22, name: 'role.delete', category: 'Role' },
  { id: 23, name: 'audit.view', category: 'Audit' },
  { id: 24, name: 'settings.view', category: 'Settings' },
  { id: 25, name: 'settings.update', category: 'Settings' }
])

// Mock data
const mockRoles = ref([
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: [
      { id: 1, name: 'employee.view' },
      { id: 2, name: 'employee.create' },
      { id: 3, name: 'employee.update' },
      { id: 4, name: 'employee.delete' }
    ],
    user_count: 2,
    is_active: true,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'HR Manager',
    description: 'Human resources management with employee and leave permissions',
    permissions: [
      { id: 1, name: 'employee.view' },
      { id: 2, name: 'employee.create' },
      { id: 3, name: 'employee.update' },
      { id: 9, name: 'leave.view' },
      { id: 11, name: 'leave.approve' }
    ],
    user_count: 5,
    is_active: true,
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 3,
    name: 'Manager',
    description: 'Team management with limited permissions',
    permissions: [
      { id: 1, name: 'employee.view' },
      { id: 5, name: 'attendance.view' },
      { id: 9, name: 'leave.view' },
      { id: 11, name: 'leave.approve' }
    ],
    user_count: 12,
    is_active: true,
    created_at: '2023-02-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Employee',
    description: 'Basic employee permissions for self-service',
    permissions: [
      { id: 5, name: 'attendance.view' },
      { id: 6, name: 'attendance.create' },
      { id: 9, name: 'leave.view' },
      { id: 10, name: 'leave.create' }
    ],
    user_count: 26,
    is_active: true,
    created_at: '2023-02-15T00:00:00Z'
  }
])

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewRole = (role: any) => {
  // TODO: Implement view role details
  console.log('View role:', role)
}

const editRole = (role: any) => {
  editingRole.value = true
  roleForm.value = { 
    ...role, 
    permissions: role.permissions.map(p => p.id) 
  }
  showCreateDialog.value = true
}

const duplicateRole = (role: any) => {
  // TODO: Implement duplicate role
  toast.add({
    severity: 'info',
    summary: 'Duplicate Role',
    detail: 'Role duplication functionality will be implemented',
    life: 3000
  })
}

const deleteRole = (role: any) => {
  // TODO: Implement delete role
  console.log('Delete role:', role)
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingRole.value = false
  resetRoleForm()
}

const resetRoleForm = () => {
  roleForm.value = {
    name: '',
    description: '',
    permissions: [],
    is_active: true
  }
}

const saveRole = () => {
  if (editingRole.value) {
    // Update existing role
    const index = roles.value.findIndex(r => r.id === roleForm.value.id)
    if (index !== -1) {
      roles.value[index] = { 
        ...roleForm.value, 
        permissions: permissionOptions.value.filter(p => roleForm.value.permissions.includes(p.id))
      }
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Role updated successfully',
      life: 3000
    })
  } else {
    // Create new role
    const newRole = {
      ...roleForm.value,
      id: roles.value.length + 1,
      permissions: permissionOptions.value.filter(p => roleForm.value.permissions.includes(p.id)),
      user_count: 0,
      created_at: new Date().toISOString()
    }
    roles.value.unshift(newRole)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Role created successfully',
      life: 3000
    })
  }
  closeDialog()
}

const refreshData = async () => {
  loading.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Data Refreshed',
      detail: 'Role data has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh role data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  roles.value = mockRoles.value
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}
</style>
