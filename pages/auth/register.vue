<template>
  <div class="register-page">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="pi pi-user-plus text-white text-2xl"></i>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our HRMS platform and get started today.
          </p>
        </div>

        <!-- Registration Form -->
        <PCard class="mt-8">
          <template #content>
            <PForm @submit="onSubmit" :loading="isLoading">
              <div class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                  <FormField
                    v-model="form.first_name"
                    label="First Name"
                    :error="errors.first_name"
                    required
                    placeholder="John"
                  />

                  <FormField
                    v-model="form.last_name"
                    label="Last Name"
                    :error="errors.last_name"
                    required
                    placeholder="Doe"
                  />
                </div>

                <FormField
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  :error="errors.email"
                  required
                  placeholder="john.doe@company.com"
                />

                <FormField
                  v-model="form.password"
                  label="Password"
                  type="password"
                  :error="errors.password"
                  required
                  placeholder="Create a strong password"
                />

                <FormField
                  v-model="form.confirm_password"
                  label="Confirm Password"
                  type="password"
                  :error="errors.confirm_password"
                  required
                  placeholder="Confirm your password"
                />

                <div class="flex items-center">
                  <PCheckbox 
                    v-model="form.terms_accepted" 
                    :binary="true"
                    input-id="terms"
                    :class="{'p-invalid': errors.terms_accepted}"
                  />
                  <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-white">
                    I agree to the 
                    <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
                    and 
                    <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
                  </label>
                </div>

                <Button 
                  type="submit"
                  label="Create Account" 
                  class="w-full"
                  :loading="isLoading"
                  size="large"
                />

                <div class="text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?
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

        <!-- Features -->
        <PCard class="mt-6">
          <template #content>
            <div class="text-center">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                What you'll get:
              </h3>
              <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center justify-center space-x-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span>Employee management tools</span>
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span>Attendance tracking</span>
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span>Leave management</span>
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <span>Payroll processing</span>
                </div>
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
import { useAuthStore } from '~/stores/auth'
import { useFormValidation } from '~/composables/formValidation'
import type { Register } from '~/types/hrms'

// Meta
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Stores
const authStore = useAuthStore()

// Composables
const { validateForm, errors, clearErrors } = useFormValidation()

// State
const isLoading = ref(false)

const form = ref<Register & { confirm_password: string; terms_accepted: boolean }>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  terms_accepted: false
})

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Methods
const onSubmit = async () => {
  clearErrors()
  
  // Validate form
  const validation = validateForm(form.value, {
    first_name: { required: true, minLength: 2 },
    last_name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
    confirm_password: { 
      required: true, 
      sameAs: form.value.password,
      custom: (value: string) => value === form.value.password || 'Passwords do not match'
    },
    terms_accepted: { 
      required: true,
      custom: (value: boolean) => value || 'You must accept the terms and conditions'
    }
  })

  if (!validation.isValid) {
    return
  }

  isLoading.value = true

  try {
    await authStore.register({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password
    })

    // Redirect to dashboard
    await navigateTo('/dashboard')
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      errors.value.general = error.message || 'Registration failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Redirect if already authenticated
if (authStore.isAuthenticated) {
  navigateTo('/dashboard')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Dark mode background */
.dark .register-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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

/* Features card */
:deep(.p-card:last-of-type) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .register-page {
    padding: 1rem;
  }
}
</style>
