<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>My Profile</h5>
          <Button 
            label="Edit Profile" 
            icon="pi pi-pencil" 
            @click="editProfile"
            :disabled="isEditing"
          />
        </div>

        <div v-if="!isEditing" class="profile-view">
          <div class="grid">
            <div class="col-12 md:col-4">
              <div class="text-center">
                <div class="profile-avatar">
                  <i class="pi pi-user text-6xl text-gray-400"></i>
                </div>
                <h3 class="mt-3 mb-1">{{ user?.first_name }} {{ user?.last_name }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
                <PTag 
                  :value="user?.is_active ? 'Active' : 'Inactive'" 
                  :severity="user?.is_active ? 'success' : 'danger'"
                  class="mt-2"
                />
              </div>
            </div>
            <div class="col-12 md:col-8">
              <div class="profile-details">
                <h4 class="mb-3">Personal Information</h4>
                <div class="grid">
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">First Name</label>
                      <p class="mt-1">{{ user?.first_name || 'Not provided' }}</p>
                    </div>
                  </div>
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Last Name</label>
                      <p class="mt-1">{{ user?.last_name || 'Not provided' }}</p>
                    </div>
                  </div>
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Email</label>
                      <p class="mt-1">{{ user?.email || 'Not provided' }}</p>
                    </div>
                  </div>
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Phone</label>
                      <p class="mt-1">{{ user?.profile?.phone || 'Not provided' }}</p>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="field">
                      <label class="font-semibold">Address</label>
                      <p class="mt-1">{{ user?.profile?.address || 'Not provided' }}</p>
                    </div>
                  </div>
                </div>

                <h4 class="mb-3 mt-4">Account Information</h4>
                <div class="grid">
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">User ID</label>
                      <p class="mt-1 font-mono text-sm">{{ user?.id }}</p>
                    </div>
                  </div>
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Account Type</label>
                      <p class="mt-1">
                        <PTag 
                          :value="user?.is_superuser ? 'Super User' : user?.is_staff ? 'Staff' : 'User'" 
                          :severity="user?.is_superuser ? 'danger' : user?.is_staff ? 'warning' : 'info'"
                        />
                      </p>
                    </div>
                  </div>
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Member Since</label>
                      <p class="mt-1">{{ formatDate(user?.created_at) }}</p>
                    </div>
                  </div>
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Last Updated</label>
                      <p class="mt-1">{{ formatDate(user?.updated_at) }}</p>
                    </div>
                  </div>
                </div>

                <h4 class="mb-3 mt-4">Security</h4>
                <div class="grid">
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label class="font-semibold">Two-Factor Authentication</label>
                      <div class="flex align-items-center mt-1">
                        <PTag 
                          :value="user?.profile?.two_factor_enabled ? 'Enabled' : 'Disabled'" 
                          :severity="user?.profile?.two_factor_enabled ? 'success' : 'warning'"
                        />
                        <Button 
                          :label="user?.profile?.two_factor_enabled ? 'Disable' : 'Enable'"
                          size="small"
                          severity="secondary"
                          class="ml-2"
                          @click="toggleTwoFactor"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="profile-edit">
          <PForm @submit="onSubmit" :loading="isLoading">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField
                  v-model="form.first_name"
                  label="First Name"
                  :error="errors.first_name"
                  required
                />
              </div>
              <div class="col-12 md:col-6">
                <FormField
                  v-model="form.last_name"
                  label="Last Name"
                  :error="errors.last_name"
                  required
                />
              </div>
              <div class="col-12 md:col-6">
                <FormField
                  v-model="form.email"
                  label="Email"
                  type="email"
                  :error="errors.email"
                  required
                />
              </div>
              <div class="col-12 md:col-6">
                <FormField
                  v-model="form.phone"
                  label="Phone"
                  :error="errors.phone"
                />
              </div>
              <div class="col-12">
                <FormField
                  v-model="form.address"
                  label="Address"
                  :error="errors.address"
                />
              </div>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
              <Button 
                label="Cancel" 
                icon="pi pi-times" 
                severity="secondary"
                @click="cancelEdit"
              />
              <Button 
                label="Save Changes" 
                icon="pi pi-check" 
                type="submit"
                :loading="isLoading"
              />
            </div>
          </PForm>
        </div>
      </div>
    </div>

    <!-- Change Password Card -->
    <div class="col-12">
      <div class="card">
        <h5>Change Password</h5>
        <PForm @submit="onPasswordSubmit" :loading="isChangingPassword">
          <div class="grid">
            <div class="col-12 md:col-4">
              <FormField
                v-model="passwordForm.current_password"
                label="Current Password"
                type="password"
                :error="passwordErrors.current_password"
                required
              />
            </div>
            <div class="col-12 md:col-4">
              <FormField
                v-model="passwordForm.new_password"
                label="New Password"
                type="password"
                :error="passwordErrors.new_password"
                required
              />
            </div>
            <div class="col-12 md:col-4">
              <FormField
                v-model="passwordForm.confirm_password"
                label="Confirm New Password"
                type="password"
                :error="passwordErrors.confirm_password"
                required
              />
            </div>
          </div>

          <div class="flex justify-content-end mt-4">
            <Button 
              label="Change Password" 
              icon="pi pi-key" 
              type="submit"
              :loading="isChangingPassword"
            />
          </div>
        </PForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useFormValidation } from '~/composables/formValidation'
import { useToast } from 'primevue/usetoast'

// Meta
definePageMeta({
  middleware: 'auth'
})

// Stores
const authStore = useAuthStore()
const toast = useToast()

// Composables
const { validateForm, errors, clearErrors } = useFormValidation()
const { validateForm: validatePasswordForm, errors: passwordErrors, clearErrors: clearPasswordErrors } = useFormValidation()

// State
const isEditing = ref(false)
const isLoading = ref(false)
const isChangingPassword = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Computed
const user = computed(() => authStore.user)

// Methods
const editProfile = () => {
  if (user.value) {
    form.first_name = user.value.first_name || ''
    form.last_name = user.value.last_name || ''
    form.email = user.value.email || ''
    form.phone = user.value.profile?.phone || ''
    form.address = user.value.profile?.address || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  clearErrors()
}

const onSubmit = async () => {
  clearErrors()
  
  const validation = validateForm(form, {
    first_name: { required: true, minLength: 2 },
    last_name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    phone: { 
      custom: (value: string) => {
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        return true
      }
    }
  })

  if (!validation.isValid) {
    return
  }

  isLoading.value = true

  try {
    await authStore.updateProfile(user.value!.id, {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      profile: {
        phone: form.phone,
        address: form.address
      }
    })

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully',
      life: 3000
    })

    isEditing.value = false
  } catch (error: any) {
    console.error('Profile update error:', error)
    
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update profile',
        life: 3000
      })
    }
  } finally {
    isLoading.value = false
  }
}

const onPasswordSubmit = async () => {
  clearPasswordErrors()
  
  const validation = validatePasswordForm(passwordForm, {
    current_password: { required: true },
    new_password: { required: true, minLength: 8 },
    confirm_password: { 
      required: true,
      custom: (value: string) => value === passwordForm.new_password || 'Passwords do not match'
    }
  })

  if (!validation.isValid) {
    return
  }

  isChangingPassword.value = true

  try {
    // TODO: Implement change password API call
    // await AuthService.changePassword(passwordForm)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password changed successfully',
      life: 3000
    })

    // Reset form
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.confirm_password = ''
  } catch (error: any) {
    console.error('Password change error:', error)
    
    if (error.data?.errors) {
      passwordErrors.value = error.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to change password',
        life: 3000
      })
    }
  } finally {
    isChangingPassword.value = false
  }
}

const toggleTwoFactor = () => {
  // TODO: Implement two-factor authentication toggle
  toast.add({
    severity: 'info',
    summary: 'Two-Factor Authentication',
    detail: 'Two-factor authentication toggle coming soon',
    life: 3000
  })
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not available'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Initialize form with user data
onMounted(() => {
  if (user.value) {
    form.first_name = user.value.first_name || ''
    form.last_name = user.value.last_name || ''
    form.email = user.value.email || ''
    form.phone = user.value.profile?.phone || ''
    form.address = user.value.profile?.address || ''
  }
})
</script>

<style scoped>
.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
}

.profile-details {
  padding: 1rem 0;
}

.profile-details h4 {
  color: var(--primary-color);
  border-bottom: 2px solid var(--surface-border);
  padding-bottom: 0.5rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.field p {
  margin: 0;
  color: var(--text-color-secondary);
  word-break: break-word;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
  
  .profile-avatar i {
    font-size: 2rem !important;
  }
}
</style>
