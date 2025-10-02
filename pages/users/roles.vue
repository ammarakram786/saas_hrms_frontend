<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>Roles</h5>
          <Button label="Add Role" icon="pi pi-plus" @click="openNew" />
        </div>

        <DataTable
          :value="roles"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="filters"
          dataKey="id"
          :loading="loading"
          :globalFilterFields="['name', 'description']"
          filterDisplay="row"
          stripedRows
          removableSort
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search Roles" />
              </span>
            </div>
          </template>
          <template #empty>
            No roles found.
          </template>
          <template #loading>
            Loading roles data. Please wait.
          </template>
          <Column field="name" header="Name" sortable>
            <template #body="{ data }">
              <div class="flex align-items-center">
                <i class="pi pi-shield text-2xl text-blue-500 mr-3"></i>
                <div>
                  <div class="font-semibold">{{ data.name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ data.description }}</div>
                </div>
              </div>
            </template>
          </Column>
          <Column field="is_system" header="Type" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.is_system ? 'System' : 'Custom'" 
                :severity="data.is_system ? 'warning' : 'info'" 
              />
            </template>
          </Column>
          <Column field="is_active" header="Status" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.is_active ? 'Active' : 'Inactive'" 
                :severity="data.is_active ? 'success' : 'danger'" 
              />
            </template>
          </Column>
          <Column field="permissions" header="Permissions" sortable>
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <Tag 
                  v-for="permission in data.permissions" 
                  :key="permission.id" 
                  :value="permission.name" 
                  severity="secondary" 
                  size="small"
                />
              </div>
            </template>
          </Column>
          <Column field="user_count" header="Users" sortable>
            <template #body="{ data }">
              <span class="font-semibold">{{ data.user_count || 0 }}</span>
            </template>
          </Column>
          <Column :exportable="false" header="Actions" style="min-width:8rem">
            <template #body="{ data }">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewRole(data)" />
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning" @click="editRole(data)" v-if="!data.is_system" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteRole(data)" v-if="!data.is_system" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="roleDialog" :style="{width: '750px'}" header="Role Details" :modal="true" class="p-fluid">
          <RoleDetails :role="selectedRole" v-if="selectedRole" />
          <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="roleFormDialog" :style="{width: '750px'}" header="Role Form" :modal="true" class="p-fluid">
          <RoleForm :role="selectedRole" @submit="saveRole" @cancel="hideFormDialog" />
        </Dialog>

        <ConfirmDialog></ConfirmDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { RoleService } from '~/services/api'
import type { Role } from '~/types/hrms'
import RoleDetails from '~/components/RoleDetails.vue'
import RoleForm from '~/components/RoleForm.vue'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const confirm = useConfirm()

const roles = ref<Role[]>([])
const roleDialog = ref(false)
const roleFormDialog = ref(false)
const selectedRole = ref<Role | null>(null)
const loading = ref(true)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(() => {
  fetchRoles()
})

const fetchRoles = async () => {
  loading.value = true
  try {
    const response = await RoleService.getRoles()
    roles.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch roles', life: 3000 })
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  selectedRole.value = null
  roleFormDialog.value = true
}

const hideDialog = () => {
  roleDialog.value = false
  selectedRole.value = null
}

const hideFormDialog = () => {
  roleFormDialog.value = false
  selectedRole.value = null
}

const viewRole = (role: Role) => {
  selectedRole.value = { ...role }
  roleDialog.value = true
}

const editRole = (role: Role) => {
  selectedRole.value = { ...role }
  roleFormDialog.value = true
}

const saveRole = async (roleData: Role) => {
  try {
    if (roleData.id) {
      await RoleService.updateRole(roleData.id, roleData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Role Updated', life: 3000 })
    } else {
      await RoleService.createRole(roleData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Role Created', life: 3000 })
    }
    hideFormDialog()
    await fetchRoles()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save role', life: 3000 })
  }
}

const confirmDeleteRole = (role: Role) => {
  confirm.require({
    message: `Are you sure you want to delete the role "${role.name}"?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await RoleService.deleteRole(role.id!)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Role Deleted', life: 3000 })
        await fetchRoles()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete role', life: 3000 })
      }
    }
  })
}
</script>
