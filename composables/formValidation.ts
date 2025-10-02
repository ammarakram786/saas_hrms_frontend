import { ref, reactive } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  email?: boolean
  pattern?: RegExp
  match?: any
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)

  const validateField = (value: any, rules: ValidationRule): string | null => {
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'This field is required'
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null
    }

    // Min length validation
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters long`
    }

    // Max length validation
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters long`
    }

    // Min value validation
    if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      return `Must be at least ${rules.min}`
    }

    // Max value validation
    if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      return `Must be no more than ${rules.max}`
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Please enter a valid format'
    }

    // Match validation
    if (rules.match !== undefined && value !== rules.match) {
      return 'Values do not match'
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        return customError
      }
    }

    return null
  }

  const validateForm = (data: Record<string, any>, rules: ValidationRules): ValidationResult => {
    const formErrors: Record<string, string> = {}

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field]
      const error = validateField(value, fieldRules)
      
      if (error) {
        formErrors[field] = error
      }
    }

    errors.value = formErrors

    return {
      isValid: Object.keys(formErrors).length === 0,
      errors: formErrors
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const setError = (field: string, message: string) => {
    errors.value[field] = message
  }

  const clearError = (field: string) => {
    delete errors.value[field]
  }

  const hasError = (field: string): boolean => {
    return field in errors.value
  }

  const getError = (field: string): string | undefined => {
    return errors.value[field]
  }

  // Common validation rules
  const commonRules = {
    required: { required: true },
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
    phone: { pattern: /^[\+]?[1-9][\d]{0,15}$/ },
    url: { pattern: /^https?:\/\/.+/ },
    positiveNumber: { min: 0 },
    percentage: { min: 0, max: 100 }
  }

  return {
    errors,
    isSubmitting,
    validateField,
    validateForm,
    clearErrors,
    setError,
    clearError,
    hasError,
    getError,
    commonRules
  }
}

// Validation helpers
export const validators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required'
    }
    return null
  },

  email: (value: string) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return null
  },

  minLength: (value: string, min: number) => {
    if (!value) return null
    if (value.length < min) {
      return `Must be at least ${min} characters long`
    }
    return null
  },

  maxLength: (value: string, max: number) => {
    if (!value) return null
    if (value.length > max) {
      return `Must be no more than ${max} characters long`
    }
    return null
  },

  min: (value: number, min: number) => {
    if (value === null || value === undefined) return null
    if (value < min) {
      return `Must be at least ${min}`
    }
    return null
  },

  max: (value: number, max: number) => {
    if (value === null || value === undefined) return null
    if (value > max) {
      return `Must be no more than ${max}`
    }
    return null
  },

  pattern: (value: string, pattern: RegExp, message?: string) => {
    if (!value) return null
    if (!pattern.test(value)) {
      return message || 'Please enter a valid format'
    }
    return null
  },

  match: (value: any, matchValue: any) => {
    if (value !== matchValue) {
      return 'Values do not match'
    }
    return null
  }
}