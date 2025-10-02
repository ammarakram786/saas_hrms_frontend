<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>Users</h5>
          <div class="flex gap-2">
            <Button 
              label="Invite User" 
              icon="pi pi-user-plus" 
              @click="openInviteDialog"
            />
            <Button 
              label="Add User" 
              icon="pi pi-plus" 
              @click="openNew"
            />
          </div>
        </div>

        <PDataTable
          :value="users"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="filters"
          dataKey="id"
          :loading="loading"
          :globalFilterFields="['first_name', 'last_name', 'email', 'roles']"
          filterDisplay="row"
          stripedRows
          removableSort
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <PInputText v-model="filters['global'].value" placeholder="Search Users" />
              </span>
            </div>
          </template>
          <template #empty>
            No users found.
          </template>
          <template #loading>
            Loading users data. Please wait.
          </template>
          <PColumn field="first_name" header="Name" sortable>
            <template #body="{ data }">
              <div class="flex align-items-center">
                <div class="user-avatar mr-3">
                  <i class="pi pi-user text-2xl text-gray-400"></i>
                </div>
                <div>
                  <div class="font-semibold">{{ data.first_name }} {{ data.last_name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ data.email }}</div>
                </div>
              </div>
            </template>
          </PColumn>
          <PColumn field="roles" header="Roles" sortable>
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <PTag 
                  v-for="role in data.roles" 
                  :key="role.id" 
                  :value="role.name" 
                  severity="info" 
                  size="small"
                />
              </div>
            </template>
          </PColumn>
          <PColumn field="is_active" header="Status" sortable>
            <template #body="{ data }">
              <PTag 
                :value="data.is_active ? 'Active' : 'Inactive'" 
                :severity="data.is_active ? 'success' : 'danger'" 
              />
            </template>
          </PColumn>
          <PColumn field="is_staff" header="Staff" sortable>
            <template #body="{ data }">
              <PTag 
                :value="data.is_staff ? 'Yes' : 'No'" 
                :severity="data.is_staff ? 'warning' : 'secondary'" 
              />
            </template>
          </PColumn>
          <PColumn field="last_login" header="Last Login" sortable>
            <template #body="{ data }">
              {{ formatDateTime(data.last_login) }}
            </template>
          </PColumn>
          <PColumn :exportable="false" header="Actions" style="min-width:10rem">
            <template #body="{ data }">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewUser(data)" />
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning" @click="editUser(data)" />
              <Button icon="pi pi-key" class="p-button-rounded p-button-text p-button-info" @click="resetPassword(data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteUser(data)" />
            </template>
          </PColumn>
        </PDataTable>

        <PDialog v-model:visible="userDialog" :style="{width: '750px'}" header="User Details" :modal="true" class="p-fluid">
          <UserDetails :user="selectedUser" v-if="selectedUser" />
          <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          </template>
        </PDialog>

        <PDialog v-model:visible="userFormDialog" :style="{width: '750px'}" header="User Form" :modal="true" class="p-fluid">
          <UserForm :user="selectedUser" @submit="saveUser" @cancel="hideFormDialog" />
        </PDialog>

        <PDialog v-model:visible="inviteDialog" :style="{width: '500px'}" header="Invite User" :modal="true" class="p-fluid">
          <InviteUserForm @submit="inviteUser" @cancel="hideInviteDialog" />
        </PDialog>

        <PConfirmDialog></PConfirmDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { UserService } from '~/services/api'
import type { User } from '~/types/hrms'
import UserDetails from '~/components/UserDetails.vue'
import UserForm from '~/components/UserForm.vue'
import InviteUserForm from '~/components/InviteUserForm.vue'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const confirm = useConfirm()

const users = ref<User[]>([])
const userDialog = ref(false)
const userFormDialog = ref(false)
const inviteDialog = ref(false)
const selectedUser = ref<User | null>(null)
const loading = ref(true)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await UserService.getUsers()
    users.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users', life: 3000 })
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  selectedUser.value = null
  userFormDialog.value = true
}

const openInviteDialog = () => {
  inviteDialog.value = true
}

const hideDialog = () => {
  userDialog.value = false
  selectedUser.value = null
}

const hideFormDialog = () => {
  userFormDialog.value = false
  selectedUser.value = null
}

const hideInviteDialog = () => {
  inviteDialog.value = false
}

const viewUser = (user: User) => {
  selectedUser.value = { ...user }
  userDialog.value = true
}

const editUser = (user: User) => {
  selectedUser.value = { ...user }
  userFormDialog.value = true
}

const saveUser = async (userData: User) => {
  try {
    if (userData.id) {
      await UserService.updateUser(userData.id, userData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'User Updated', life: 3000 })
    } else {
      await UserService.createUser(userData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'User Created', life: 3000 })
    }
    hideFormDialog()
    await fetchUsers()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save user', life: 3000 })
  }
}

const inviteUser = async (inviteData: any) => {
  try {
    // TODO: Implement user invitation API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User invitation sent successfully',
      life: 3000
    })
    
    hideInviteDialog()
    await fetchUsers()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send invitation', life: 3000 })
  }
}

const resetPassword = (user: User) => {
  confirm.require({
    message: `Are you sure you want to reset the password for ${user.first_name} ${user.last_name}?`,
    header: 'Reset Password',
    icon: 'pi pi-key',
    accept: async () => {
      try {
        // TODO: Implement password reset API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset email sent',
          life: 3000
        })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reset password', life: 3000 })
      }
    }
  })
}

const confirmDeleteUser = (user: User) => {
  confirm.require({
    message: `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await UserService.deleteUser(user.id!)
        toast.add({ severity: 'success', summary: 'Success', detail: 'User Deleted', life: 3000 })
        await fetchUsers()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 })
      }
    }
  })
}

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

<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
