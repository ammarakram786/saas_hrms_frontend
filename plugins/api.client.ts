import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Create axios instance inside the plugin
  const apiClient: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Request interceptor to add auth token
  apiClient.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      
      if (authStore.tokens?.access_token) {
        config.headers.Authorization = `Bearer ${authStore.tokens.access_token}`
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for token refresh and error handling
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config
      
      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        
        const authStore = useAuthStore()
        
        try {
          // Try to refresh token
          await authStore.refreshToken()
          
          // Retry original request with new token
          if (authStore.tokens?.access_token) {
            originalRequest.headers.Authorization = `Bearer ${authStore.tokens.access_token}`
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          authStore.logout()
          return Promise.reject(refreshError)
        }
      }
      
      // Handle other errors
      if (error.response?.status >= 500) {
        const toast = useToast()
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Something went wrong on our end. Please try again later.',
          life: 5000
        })
      }
      
      return Promise.reject(error)
    }
  )

  // API service functions
  const apiService = {
    // Generic API call method
    async call<T = any>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
      try {
        const response = await apiClient(url, options)
        return response.data
      } catch (error: any) {
        // Handle specific error cases
        if (error.response?.status === 403) {
          const toast = useToast()
          toast.add({
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You do not have permission to perform this action.',
            life: 4000
          })
        } else if (error.response?.status === 404) {
          const toast = useToast()
          toast.add({
            severity: 'warn',
            summary: 'Not Found',
            detail: 'The requested resource was not found.',
            life: 3000
          })
        } else if (error.response?.status === 422) {
          // Validation errors - handled by form components
          throw error
        }
        
        throw error
      }
    }
  }

  return {
    provide: {
      api: apiService
    }
  }
})