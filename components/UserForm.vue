<template>
  <form @submit.prevent="handleSubmit" class="p-fluid">
    <div class="formgrid grid">
      <div class="field col-12 md:col-6">
        <FormField label="First Name" :errorMessage="v$.first_name.$errors[0]?.$message as string">
          <PInputText 
            id="first_name" 
            v-model="v$.first_name.$model" 
            placeholder="Enter first name" 
            :class="{'p-invalid': v$.first_name.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Last Name" :errorMessage="v$.last_name.$errors[0]?.$message as string">
          <PInputText 
            id="last_name" 
            v-model="v$.last_name.$model" 
            placeholder="Enter last name" 
            :class="{'p-invalid': v$.last_name.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Email" :errorMessage="v$.email.$errors[0]?.$message as string">
          <PInputText 
            id="email" 
            v-model="v$.email.$model" 
            type="email" 
            placeholder="Enter email address" 
            :class="{'p-invalid': v$.email.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Phone">
          <PInputText 
            id="phone" 
            v-model="userData.profile.phone" 
            placeholder="Enter phone number" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Address">
          <PTextarea 
            id="address" 
            v-model="userData.profile.address" 
            rows="2" 
            placeholder="Enter address" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Roles">
          <PMultiSelect 
            id="roles" 
            v-model="userData.roles" 
            :options="availableRoles" 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select roles" 
            display="chip" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Status">
          <PDropdown 
            id="is_active" 
            v-model="userData.is_active" 
            :options="statusOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Select status" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field-checkbox">
          <PCheckbox 
            id="is_staff" 
            v-model="userData.is_staff" 
            :binary="true" 
          />
          <label for="is_staff">Staff Member</label>
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field-checkbox">
          <PCheckbox 
            id="is_superuser" 
            v-model="userData.is_superuser" 
            :binary="true" 
          />
          <label for="is_superuser">Super User</label>
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field-checkbox">
          <PCheckbox 
            id="two_factor_enabled" 
            v-model="userData.profile.two_factor_enabled" 
            :binary="true" 
          />
          <label for="two_factor_enabled">Two-Factor Auth</label>
        </div>
      </div>
      <div v-if="!user" class="field col-12 md:col-6">
        <FormField label="Password" :errorMessage="v$.password.$errors[0]?.$message as string">
          <PPassword 
            id="password" 
            v-model="v$.password.$model" 
            placeholder="Enter password" 
            toggleMask 
            :class="{'p-invalid': v$.password.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div v-if="!user" class="field col-12 md:col-6">
        <FormField label="Confirm Password" :errorMessage="v$.confirm_password.$errors[0]?.$message as string">
          <PPassword 
            id="confirm_password" 
            v-model="v$.confirm_password.$model" 
            placeholder="Confirm password" 
            toggleMask 
            :class="{'p-invalid': v$.confirm_password.$invalid && submitted}" 
          />
        </FormField>
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { RoleService } from '~/services/api'
import type { User, Role } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()

const userData = reactive<Partial<User> & { 
  profile: { 
    phone?: string; 
    address?: string; 
    two_factor_enabled?: boolean 
  };
  password?: string;
  confirm_password?: string;
}>({
  first_name: '',
  last_name: '',
  email: '',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  roles: [],
  profile: {
    phone: '',
    address: '',
    two_factor_enabled: false
  },
  password: '',
  confirm_password: ''
})

const availableRoles = ref<Role[]>([])
const submitted = ref(false)

const statusOptions = ref([
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
])

const rules = {
  first_name: { required },
  last_name: { required },
  email: { required, email },
  password: {
    required: (value: string) => {
      if (!props.user) return required.$validator(value)
      return true
    },
    minLength: minLength(8)
  },
  confirm_password: {
    required: (value: string) => {
      if (!props.user) return required.$validator(value)
      return true
    },
    sameAsPassword: sameAs(computed(() => userData.password))
  }
}

const v$ = useVuelidate(rules, userData)

onMounted(async () => {
  await fetchRoles()
  
  if (props.user) {
    Object.assign(userData, props.user)
    userData.profile = props.user.profile || {
      phone: '',
      address: '',
      two_factor_enabled: false
    }
    userData.roles = props.user.roles?.map(role => role.id) || []
  }
})

watch(() => props.user, (newVal) => {
  if (newVal) {
    Object.assign(userData, newVal)
    userData.profile = newVal.profile || {
      phone: '',
      address: '',
      two_factor_enabled: false
    }
    userData.roles = newVal.roles?.map(role => role.id) || []
  } else {
    resetForm()
  }
})

const fetchRoles = async () => {
  try {
    const response = await RoleService.getRoles()
    availableRoles.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch roles', life: 3000 })
  }
}

const handleSubmit = async () => {
  submitted.value = true
  
  const isFormValid = await v$.value.$validate()
  if (isFormValid) {
    const dataToSubmit = { ...userData }
    
    // Remove password fields for updates
    if (props.user) {
      delete dataToSubmit.password
      delete dataToSubmit.confirm_password
    }
    
    // Convert role IDs back to role objects
    if (dataToSubmit.roles) {
      dataToSubmit.roles = dataToSubmit.roles.map(roleId => 
        availableRoles.value.find(role => role.id === roleId)
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
  Object.assign(userData, {
    first_name: '',
    last_name: '',
    email: '',
    is_active: true,
    is_staff: false,
    is_superuser: false,
    roles: [],
    profile: {
      phone: '',
      address: '',
      two_factor_enabled: false
    },
    password: '',
    confirm_password: ''
  })
  submitted.value = false
  v$.value.$reset()
}
</script>
