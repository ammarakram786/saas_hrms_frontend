<template>
  <div class="forgot-password-page">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-orange-600 rounded-full flex items-center justify-center">
            <i class="pi pi-key text-white text-2xl"></i>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <!-- Reset Form -->
        <PCard class="mt-8">
          <template #content>
            <PForm @submit="onSubmit" :loading="isLoading">
              <div class="space-y-6">
                <FormField
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  :error="errors.email"
                  required
                  placeholder="Enter your email address"
                />

                <Button 
                  type="submit"
                  label="Send Reset Link" 
                  class="w-full"
                  :loading="isLoading"
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
        <PCard v-if="emailSent" class="mt-6">
          <template #content>
            <div class="text-center">
              <div class="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <i class="pi pi-check text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Check your email
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We've sent a password reset link to <strong>{{ form.email }}</strong>
              </p>
              <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p>• Check your spam folder if you don't see the email</p>
                <p>• The link will expire in 1 hour</p>
                <p>• Contact support if you need help</p>
              </div>
              <Button 
                label="Resend Email" 
                size="small"
                severity="secondary"
                class="mt-4"
                @click="resendEmail"
                :loading="isResending"
              />
            </div>
          </template>
        </PCard>

        <!-- Help -->
        <PCard class="mt-6">
          <template #content>
            <div class="text-center">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Need help?
              </h3>
              <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <p>Contact your system administrator</p>
                <p>Email: support@hrms.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
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
import { ref, computed } from 'vue'
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
const isResending = ref(false)
const emailSent = ref(false)

const form = ref({
  email: ''
})

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Methods
const onSubmit = async () => {
  clearErrors()
  
  // Validate form
  const validation = validateForm(form.value, {
    email: { required: true, email: true }
  })

  if (!validation.isValid) {
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual password reset API call
    // await AuthService.forgotPassword(form.value.email)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    emailSent.value = true
  } catch (error: any) {
    console.error('Forgot password error:', error)
    
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      errors.value.general = error.message || 'Failed to send reset email. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const resendEmail = async () => {
  isResending.value = true
  
  try {
    // TODO: Implement resend email API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const toast = useToast()
    toast.add({
      severity: 'success',
      summary: 'Email Sent',
      detail: 'Password reset email has been resent',
      life: 3000
    })
  } catch (error) {
    const toast = useToast()
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to resend email',
      life: 3000
    })
  } finally {
    isResending.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Dark mode background */
.dark .forgot-password-page {
  background: linear-gradient(135deg, #2d1b69 0%, #11998e 100%);
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

/* Help card */
:deep(.p-card:last-of-type) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .forgot-password-page {
    padding: 1rem;
  }
}
</style>
