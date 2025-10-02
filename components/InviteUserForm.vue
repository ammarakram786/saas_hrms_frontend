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
      <div class="field col-12">
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
      <div class="field col-12">
        <FormField label="Roles">
          <PMultiSelect 
            id="roles" 
            v-model="inviteData.roles" 
            :options="availableRoles" 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select roles" 
            display="chip" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Message">
          <PTextarea 
            id="message" 
            v-model="inviteData.message" 
            rows="3" 
            placeholder="Personal message for the invitation (optional)" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Expiry Days">
          <PInputNumber 
            id="expiry_days" 
            v-model="inviteData.expiry_days" 
            :min="1" 
            :max="30" 
            placeholder="Number of days until invitation expires" 
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
        label="Send Invitation" 
        icon="pi pi-send" 
        type="submit" 
        :loading="isLoading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { RoleService } from '~/services/api'
import type { Role } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()

const inviteData = reactive({
  first_name: '',
  last_name: '',
  email: '',
  roles: [] as string[],
  message: '',
  expiry_days: 7
})

const availableRoles = ref<Role[]>([])
const submitted = ref(false)
const isLoading = ref(false)

const rules = {
  first_name: { required },
  last_name: { required },
  email: { required, email }
}

const v$ = useVuelidate(rules, inviteData)

onMounted(async () => {
  await fetchRoles()
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
    isLoading.value = true
    
    try {
      // Convert role IDs back to role objects
      const roles = inviteData.roles.map(roleId => 
        availableRoles.value.find(role => role.id === roleId)
      ).filter(Boolean)
      
      const dataToSubmit = {
        ...inviteData,
        roles
      }

      emit('submit', dataToSubmit)
    } catch (error) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to send invitation', 
        life: 3000 
      })
    } finally {
      isLoading.value = false
    }
  } else {
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: 'Please correct the form errors.', 
      life: 3000 
    })
  }
}
</script>
