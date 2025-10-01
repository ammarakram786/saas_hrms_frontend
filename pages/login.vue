<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <i class="pi pi-users text-6xl text-white mb-3"></i>
            <h1 class="text-3xl font-bold text-white m-0">HRMS</h1>
            <p class="text-white-50 mt-2 mb-0">Human Resource Management System</p>
          </div>
        </div>

        <div class="login-content">
          <div class="login-form">
            <h2 class="text-2xl font-bold text-900 mb-4">Welcome Back</h2>
            <p class="text-600 mb-6">Please sign in to your account</p>

            <form @submit.prevent="handleLogin">
              <div class="field">
                <label for="email" class="font-medium">Email Address</label>
                <PInputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full"
                  placeholder="Enter your email"
                  :class="{ 'p-invalid': errors.email }"
                />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>

              <div class="field">
                <label for="password" class="font-medium">Password</label>
                <PPassword
                  id="password"
                  v-model="form.password"
                  autocomplete="current-password"
                  required
                  class="w-full"
                  placeholder="Enter your password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': errors.password }"
                />
                <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              </div>

              <div class="flex justify-content-between align-items-center mb-4">
                <div class="flex align-items-center">
                  <PCheckbox
                    id="remember-me"
                    v-model="form.remember"
                    class="mr-2"
                  />
                  <label for="remember-me" class="text-sm">
                    Remember me
                  </label>
                </div>

                <NuxtLink to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
                  Forgot password?
                </NuxtLink>
              </div>

              <PButton
                type="submit"
                label="Sign In"
                class="w-full"
                :loading="isLoading"
                size="large"
              />

              <!-- Error message -->
              <div v-if="errors.general" class="p-message p-message-error mt-3">
                <div class="p-message-wrapper">
                  <span class="p-message-icon pi pi-times"></span>
                  <span class="p-message-text">{{ errors.general }}</span>
                </div>
              </div>
            </form>

            <div class="login-divider">
              <div class="divider-line"></div>
              <span class="divider-text">Or continue with</span>
              <div class="divider-line"></div>
            </div>

            <div class="grid">
              <div class="col-6">
                <PButton
                  type="button"
                  icon="pi pi-google"
                  class="w-full p-button-outlined"
                  @click="loginWithGoogle"
                />
              </div>
              <div class="col-6">
                <PButton
                  type="button"
                  icon="pi pi-microsoft"
                  class="w-full p-button-outlined"
                  @click="loginWithMicrosoft"
                />
              </div>
            </div>

            <div class="text-center mt-4">
              <span class="text-600">Don't have an account? </span>
              <NuxtLink to="/register" class="text-primary-600 hover:text-primary-500 font-medium">
                Sign up
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      redirectPath = '/dashboard'
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

const loginWithGoogle = () => {
  // TODO: Implement Google OAuth
  toast.add({
    severity: 'info',
    summary: 'Google Login',
    detail: 'Google OAuth will be implemented',
    life: 3000
  })
}

const loginWithMicrosoft = () => {
  // TODO: Implement Microsoft OAuth
  toast.add({
    severity: 'info',
    summary: 'Microsoft Login',
    detail: 'Microsoft OAuth will be implemented',
    life: 3000
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--surface-card);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.login-logo h1 {
  color: white;
}

.login-logo p {
  color: rgba(255, 255, 255, 0.8);
}

.login-content {
  padding: 2rem;
}

.login-form h2 {
  margin-bottom: 0.5rem;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--surface-border);
}

.divider-text {
  padding: 0 1rem;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    border-radius: 8px;
  }
  
  .login-header {
    padding: 1.5rem;
  }
  
  .login-content {
    padding: 1.5rem;
  }
}
</style>