<template>
  <form @submit.prevent="handleSubmit" class="p-fluid">
    <div class="formgrid grid">
      <div class="field col-12 md:col-6">
        <FormField label="Name" :errorMessage="v$.name.$errors[0]?.$message as string">
          <PInputText 
            id="name" 
            v-model="v$.name.$model" 
            placeholder="Enter role name" 
            :class="{'p-invalid': v$.name.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Status">
          <PDropdown 
            id="is_active" 
            v-model="roleData.is_active" 
            :options="statusOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Select status" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Description">
          <PTextarea 
            id="description" 
            v-model="roleData.description" 
            rows="3" 
            placeholder="Enter role description" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Permissions">
          <PMultiSelect 
            id="permissions" 
            v-model="roleData.permissions" 
            :options="availablePermissions" 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select permissions" 
            display="chip" 
            :filter="true"
            filterPlaceholder="Search permissions"
          />
        </FormField>
      </div>
    </div>

    <!-- Permission Categories -->
    <div v-if="roleData.permissions && roleData.permissions.length > 0" class="mt-4">
      <h6 class="mb-3">Selected Permissions by Category</h6>
      <div class="grid">
        <div v-for="category in permissionCategories" :key="category" class="col-12 md:col-6">
          <div class="border-1 surface-border border-round p-3">
            <h6 class="mb-2">{{ category }}</h6>
            <div class="flex flex-wrap gap-1">
              <PTag 
                v-for="permission in getPermissionsByCategory(category)" 
                :key="permission.id" 
                :value="permission.name" 
                severity="info" 
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-content-end mt-4">
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        class="p-button-text" 
        @click="emit('cancel')" 
      />
      <Button 
        label="Save" 
        icon="pi pi-check" 
        type="submit" 
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import type { Role, Permission } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const props = defineProps<{
  role: Role | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()

const roleData = reactive<Partial<Role>>({
  name: '',
  description: '',
  is_active: true,
  is_system: false,
  permissions: []
})

const availablePermissions = ref<Permission[]>([])
const submitted = ref(false)

const statusOptions = ref([
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
])

const rules = {
  name: { required }
}

const v$ = useVuelidate(rules, roleData)

// Computed properties
const permissionCategories = computed(() => {
  const categories = new Set<string>()
  availablePermissions.value.forEach(permission => {
    if (permission.module) {
      categories.add(permission.module)
    }
  })
  return Array.from(categories).sort()
})

const getPermissionsByCategory = (category: string) => {
  return availablePermissions.value.filter(permission => 
    permission.module === category && 
    roleData.permissions?.includes(permission.id)
  )
}

onMounted(async () => {
  await fetchPermissions()
  
  if (props.role) {
    Object.assign(roleData, props.role)
    roleData.permissions = props.role.permissions?.map(permission => permission.id) || []
  }
})

watch(() => props.role, (newVal) => {
  if (newVal) {
    Object.assign(roleData, newVal)
    roleData.permissions = newVal.permissions?.map(permission => permission.id) || []
  } else {
    resetForm()
  }
})

const fetchPermissions = async () => {
  try {
    // TODO: Implement permissions API call
    // For now, using mock data
    availablePermissions.value = [
      { id: '1', name: 'View Employees', code: 'view_employees', module: 'Employees', description: 'View employee information' },
      { id: '2', name: 'Create Employees', code: 'create_employees', module: 'Employees', description: 'Create new employees' },
      { id: '3', name: 'Edit Employees', code: 'edit_employees', module: 'Employees', description: 'Edit employee information' },
      { id: '4', name: 'Delete Employees', code: 'delete_employees', module: 'Employees', description: 'Delete employees' },
      { id: '5', name: 'View Attendance', code: 'view_attendance', module: 'Attendance', description: 'View attendance records' },
      { id: '6', name: 'Create Attendance', code: 'create_attendance', module: 'Attendance', description: 'Create attendance records' },
      { id: '7', name: 'Edit Attendance', code: 'edit_attendance', module: 'Attendance', description: 'Edit attendance records' },
      { id: '8', name: 'View Leave Requests', code: 'view_leave_requests', module: 'Leave', description: 'View leave requests' },
      { id: '9', name: 'Approve Leave Requests', code: 'approve_leave_requests', module: 'Leave', description: 'Approve or reject leave requests' },
      { id: '10', name: 'View Payroll', code: 'view_payroll', module: 'Payroll', description: 'View payroll information' },
      { id: '11', name: 'Create Payroll', code: 'create_payroll', module: 'Payroll', description: 'Create payroll records' },
      { id: '12', name: 'View Users', code: 'view_users', module: 'Users', description: 'View user accounts' },
      { id: '13', name: 'Create Users', code: 'create_users', module: 'Users', description: 'Create user accounts' },
      { id: '14', name: 'Edit Users', code: 'edit_users', module: 'Users', description: 'Edit user accounts' },
      { id: '15', name: 'Manage Roles', code: 'manage_roles', module: 'Users', description: 'Manage user roles and permissions' }
    ]
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch permissions', life: 3000 })
  }
}

const handleSubmit = async () => {
  submitted.value = true
  
  const isFormValid = await v$.value.$validate()
  if (isFormValid) {
    const dataToSubmit = { ...roleData }
    
    // Convert permission IDs back to permission objects
    if (dataToSubmit.permissions) {
      dataToSubmit.permissions = dataToSubmit.permissions.map(permissionId => 
        availablePermissions.value.find(permission => permission.id === permissionId)
      ).filter(Boolean)
    }

    emit('submit', dataToSubmit)
  } else {
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: 'Please correct the form errors.', 
      life: 3000 
    })
  }
}

const resetForm = () => {
  Object.assign(roleData, {
    name: '',
    description: '',
    is_active: true,
    is_system: false,
    permissions: []
  })
  submitted.value = false
  v$.value.$reset()
}
</script>
