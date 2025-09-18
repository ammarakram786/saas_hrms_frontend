<template>
  <div class="card">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Sign in to your account</h2>
      <p class="mt-2 text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/register" class="text-primary-600 hover:text-primary-500">
          Register here
        </NuxtLink>
      </p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="form-group">
        <label for="email" class="form-label">Email address</label>
        <PInputText
          id="email"
          v-model="form.email"
          type="email"
          :class="['form-input', { 'border-red-300': errors.email }]"
          placeholder="Enter your email"
          :disabled="isLoading"
        />
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <PPassword
          id="password"
          v-model="form.password"
          :class="['form-input', { 'border-red-300': errors.password }]"
          placeholder="Enter your password"
          :disabled="isLoading"
          :feedback="false"
          toggle-mask
        />
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <PCheckbox
            id="remember"
            v-model="form.remember"
            binary
            :disabled="isLoading"
          />
          <label for="remember" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <NuxtLink to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
          Forgot password?
        </NuxtLink>
      </div>

      <PButton
        type="submit"
        :loading="isLoading"
        :disabled="isLoading"
        class="w-full btn-primary"
        label="Sign in"
      />

      <!-- Error message -->
      <div v-if="errors.general" class="text-red-600 text-sm text-center">
        {{ errors.general }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })

    toast.add({
      severity: 'success',
      summary: 'Welcome back!',
      detail: 'Successfully logged in',
      life: 3000
    })

    // Determine redirect based on user type
    let redirectPath = '/dashboard'
    
    if (authStore.isSuperUser) {
      redirectPath = '/admin/dashboard'
    } else if (authStore.hasRole('tenant_admin') || authStore.user?.is_staff) {
      redirectPath = '/tenant/dashboard'
    } else {
      redirectPath = '/employee/dashboard'
    }
    
    await navigateTo(redirectPath)
  } catch (error: any) {
    errors.general = error.message
    
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error.message,
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>
