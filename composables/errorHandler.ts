interface ApiError {
  error: {
    message: string
    code?: string
    status_code?: number
    field_errors?: Record<string, string>
  }
}

export const useErrorHandler = () => {
  const toast = useToast()

  const handleValidationError = (error: ApiError) => {
    const message = error.error.message || 'Validation failed'
    const fieldErrors = error.error.field_errors || {}

    // Show general validation error
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: message,
      life: 5000
    })

    // Show field-specific errors if available
    Object.entries(fieldErrors).forEach(([field, fieldMessage]) => {
      toast.add({
        severity: 'warn',
        summary: `${field.charAt(0).toUpperCase() + field.slice(1)} Error`,
        detail: fieldMessage,
        life: 4000
      })
    })

    return { message, fieldErrors }
  }

  const handleUnauthorized = () => {
    const authStore = useAuthStore()

    toast.add({
      severity: 'error',
      summary: 'Authentication Required',
      detail: 'Please log in to continue',
      life: 5000
    })

    // Logout user and redirect to login
    authStore.logout()
  }

  const handleForbidden = (error: ApiError) => {
    const message = error.error.message || 'Access denied'

    toast.add({
      severity: 'error',
      summary: 'Access Denied',
      detail: message,
      life: 5000
    })
  }

  const handleNotFound = (error: ApiError) => {
    const message = error.error.message || 'Resource not found'

    toast.add({
      severity: 'warn',
      summary: 'Not Found',
      detail: message,
      life: 4000
    })
  }

  const handleLocked = (error: ApiError) => {
    const message = error.error.message || 'Account temporarily locked'

    toast.add({
      severity: 'warn',
      summary: 'Account Locked',
      detail: message,
      life: 6000
    })
  }

  const handleRateLimit = (error: ApiError) => {
    const message = error.error.message || 'Too many requests'

    toast.add({
      severity: 'warn',
      summary: 'Rate Limited',
      detail: message,
      life: 5000
    })
  }

  const handleServerError = (error: ApiError) => {
    const message = error.error.message || 'Server error occurred'

    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: message,
      life: 5000
    })
  }

  const handleGenericError = (error: ApiError) => {
    const message = error.error.message || 'An unexpected error occurred'

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    })
  }

  const handleNetworkError = (error: Error) => {
    toast.add({
      severity: 'error',
      summary: 'Network Error',
      detail: 'Please check your internet connection and try again',
      life: 5000
    })

    console.error('Network error:', error)
  }

  return {
    handleValidationError,
    handleUnauthorized,
    handleForbidden,
    handleNotFound,
    handleLocked,
    handleRateLimit,
    handleServerError,
    handleGenericError,
    handleNetworkError
  }
}
