<template>
  <div class="reset-password-page">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
            <i class="pi pi-lock text-white text-2xl"></i>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <!-- Reset Form -->
        <PCard class="mt-8">
          <template #content>
            <PForm @submit="onSubmit" :loading="isLoading">
              <div class="space-y-6">
                <FormField
                  v-model="form.password"
                  label="New Password"
                  type="password"
                  :error="errors.password"
                  required
                  placeholder="Enter your new password"
                />

                <FormField
                  v-model="form.confirm_password"
                  label="Confirm New Password"
                  type="password"
                  :error="errors.confirm_password"
                  required
                  placeholder="Confirm your new password"
                />

                <!-- Password Requirements -->
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Password Requirements:
                  </h4>
                  <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.length }">
                      <i class="pi pi-check" v-if="passwordChecks.length"></i>
                      <i class="pi pi-times" v-else></i>
                      At least 8 characters
                    </li>
                    <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.uppercase }">
                      <i class="pi pi-check" v-if="passwordChecks.uppercase"></i>
                      <i class="pi pi-times" v-else></i>
                      One uppercase letter
                    </li>
                    <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.lowercase }">
                      <i class="pi pi-check" v-if="passwordChecks.lowercase"></i>
                      <i class="pi pi-times" v-else></i>
                      One lowercase letter
                    </li>
                    <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.number }">
                      <i class="pi pi-check" v-if="passwordChecks.number"></i>
                      <i class="pi pi-times" v-else></i>
                      One number
                    </li>
                    <li :class="{ 'text-green-600 dark:text-green-400': passwordChecks.special }">
                      <i class="pi pi-check" v-if="passwordChecks.special"></i>
                      <i class="pi pi-times" v-else></i>
                      One special character
                    </li>
                  </ul>
                </div>

                <Button 
                  type="submit"
                  label="Reset Password" 
                  class="w-full"
                  :loading="isLoading"
                  :disabled="!isPasswordValid"
                  size="large"
                />

                <div class="text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?
                    <NuxtLink 
                      to="/auth/login" 
                      class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Sign in here
                    </NuxtLink>
                  </p>
                </div>
              </div>
            </PForm>
          </template>
        </PCard>

        <!-- Success Message -->
        <PCard v-if="passwordReset" class="mt-6">
          <template #content>
            <div class="text-center">
              <div class="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <i class="pi pi-check text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Password Reset Successful
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Button 
                label="Sign In" 
                class="w-full"
                @click="goToLogin"
              />
            </div>
          </template>
        </PCard>

        <!-- Footer -->
        <div class="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; {{ currentYear }} HRMS. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFormValidation } from '~/composables/formValidation'

// Meta
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Composables
const { validateForm, errors, clearErrors } = useFormValidation()

// State
const isLoading = ref(false)
const passwordReset = ref(false)

const form = ref({
  password: '',
  confirm_password: ''
})

// Computed
const currentYear = computed(() => new Date().getFullYear())

const passwordChecks = computed(() => {
  const password = form.value.password
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const isPasswordValid = computed(() => {
  return Object.values(passwordChecks.value).every(check => check) && 
         form.value.password === form.value.confirm_password
})

// Watch password changes to clear confirm password error
watch(() => form.value.password, () => {
  if (errors.value.confirm_password) {
    clearErrors()
  }
})

// Methods
const onSubmit = async () => {
  clearErrors()
  
  // Validate form
  const validation = validateForm(form.value, {
    password: { 
      required: true, 
      minLength: 8,
      custom: (value: string) => {
        if (!passwordChecks.value.length) return 'Password must be at least 8 characters'
        if (!passwordChecks.value.uppercase) return 'Password must contain at least one uppercase letter'
        if (!passwordChecks.value.lowercase) return 'Password must contain at least one lowercase letter'
        if (!passwordChecks.value.number) return 'Password must contain at least one number'
        if (!passwordChecks.value.special) return 'Password must contain at least one special character'
        return true
      }
    },
    confirm_password: { 
      required: true,
      custom: (value: string) => value === form.value.password || 'Passwords do not match'
    }
  })

  if (!validation.isValid) {
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual password reset API call
    // await AuthService.resetPassword(token, form.value.password)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    passwordReset.value = true
  } catch (error: any) {
    console.error('Reset password error:', error)
    
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      errors.value.general = error.message || 'Failed to reset password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  navigateTo('/auth/login')
}
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* Dark mode background */
.dark .reset-password-page {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
}

/* Card styling */
:deep(.p-card) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* Form styling */
:deep(.p-inputtext) {
  border-radius: 0.5rem;
}

:deep(.p-button) {
  border-radius: 0.5rem;
  font-weight: 600;
}

/* Success card */
:deep(.p-card:nth-of-type(2)) {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* Password requirements */
:deep(.bg-gray-50) {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dark :deep(.bg-gray-800) {
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .reset-password-page {
    padding: 1rem;
  }
}
</style>
