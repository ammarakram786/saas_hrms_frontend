import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/auth'

export interface ApiError {
  message: string
  status?: number
  details?: any
  errors?: Record<string, string[]>
}

export function useErrorHandler() {
  const toast = useToast()
  const authStore = useAuthStore()

  const handleError = (error: any): ApiError => {
    console.error('API Error:', error)

    // Extract error information
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500,
      details: error.response?.data
    }

    // Handle different error types
    if (error.response?.data?.message) {
      apiError.message = error.response.data.message
    } else if (error.response?.data?.detail) {
      apiError.message = error.response.data.detail
    } else if (error.response?.data?.error) {
      apiError.message = error.response.data.error
    } else if (error.message) {
      apiError.message = error.message
    }

    // Extract validation errors
    if (error.response?.data?.errors) {
      apiError.errors = error.response.data.errors
    }

    // Handle specific status codes
    switch (apiError.status) {
      case 400:
        handleBadRequest(apiError)
        break
      case 401:
        handleUnauthorized()
        break
      case 403:
        handleForbidden(apiError)
        break
      case 404:
        handleNotFound(apiError)
        break
      case 422:
        handleValidationError(apiError)
        break
      case 429:
        handleRateLimit(apiError)
        break
      case 500:
        handleServerError(apiError)
        break
      case 502:
      case 503:
      case 504:
        handleServiceUnavailable(apiError)
        break
      default:
        handleGenericError(apiError)
    }

    return apiError
  }

  const handleBadRequest = (error: ApiError) => {
    toast.add({
      severity: 'warn',
      summary: 'Bad Request',
      detail: error.message,
      life: 4000
    })
  }

  const handleUnauthorized = () => {
    toast.add({
      severity: 'warn',
      summary: 'Session Expired',
      detail: 'Please log in again to continue',
      life: 4000
    })
    
    // Redirect to login after a short delay
    setTimeout(() => {
      authStore.logout()
    }, 2000)
  }

  const handleForbidden = (error: ApiError) => {
    toast.add({
      severity: 'warn',
      summary: 'Access Denied',
      detail: 'You do not have permission to perform this action',
      life: 4000
    })
  }

  const handleNotFound = (error: ApiError) => {
    toast.add({
      severity: 'warn',
      summary: 'Not Found',
      detail: 'The requested resource was not found',
      life: 3000
    })
  }

  const handleValidationError = (error: ApiError) => {
    // Validation errors are typically handled by form components
    // This is just a fallback
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: error.message,
      life: 4000
    })
  }

  const handleRateLimit = (error: ApiError) => {
    toast.add({
      severity: 'warn',
      summary: 'Rate Limit Exceeded',
      detail: 'Please wait a moment before trying again',
      life: 5000
    })
  }

  const handleServerError = (error: ApiError) => {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Something went wrong on our end. Please try again later.',
      life: 5000
    })
  }

  const handleServiceUnavailable = (error: ApiError) => {
    toast.add({
      severity: 'error',
      summary: 'Service Unavailable',
      detail: 'The service is temporarily unavailable. Please try again later.',
      life: 5000
    })
  }

  const handleGenericError = (error: ApiError) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 4000
    })
  }

  const handleNetworkError = () => {
    toast.add({
      severity: 'error',
      summary: 'Network Error',
      detail: 'Please check your internet connection and try again',
      life: 5000
    })
  }

  const handleTimeoutError = () => {
    toast.add({
      severity: 'warn',
      summary: 'Request Timeout',
      detail: 'The request took too long to complete. Please try again.',
      life: 4000
    })
  }

  // Utility functions
  const isNetworkError = (error: any): boolean => {
    return !error.response && error.request
  }

  const isTimeoutError = (error: any): boolean => {
    return error.code === 'ECONNABORTED' || error.message?.includes('timeout')
  }

  const isValidationError = (error: any): boolean => {
    return error.response?.status === 422
  }

  const isAuthError = (error: any): boolean => {
    return error.response?.status === 401 || error.response?.status === 403
  }

  const isServerError = (error: any): boolean => {
    return error.response?.status >= 500
  }

  const isClientError = (error: any): boolean => {
    return error.response?.status >= 400 && error.response?.status < 500
  }

  // Main error handler that determines the type and calls appropriate handler
  const handleApiError = (error: any): ApiError => {
    if (isNetworkError(error)) {
      handleNetworkError()
      return {
        message: 'Network error occurred',
        status: 0
      }
    }

    if (isTimeoutError(error)) {
      handleTimeoutError()
      return {
        message: 'Request timeout',
        status: 408
      }
    }

    return handleError(error)
  }

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    handleTimeoutError,
    isNetworkError,
    isTimeoutError,
    isValidationError,
    isAuthError,
    isServerError,
    isClientError
  }
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandler() {
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Only handle API-related errors
      if (event.reason?.response || event.reason?.request) {
        const errorHandler = useErrorHandler()
        errorHandler.handleApiError(event.reason)
      }
    })
  }
}