import { ref, computed } from 'vue'

interface ValidationRule {
  validate: (value: any) => boolean | string
  message: string
}

interface FieldValidation {
  value: any
  rules: ValidationRule[]
  errors: string[]
  touched: boolean
  valid: boolean
}

export const useFormValidation = () => {
  const fields = ref<Record<string, FieldValidation>>({})

  const addField = (name: string, initialValue: any = '', rules: ValidationRule[] = []) => {
    fields.value[name] = {
      value: initialValue,
      rules,
      errors: [],
      touched: false,
      valid: true
    }
  }

  const updateField = (name: string, value: any) => {
    if (fields.value[name]) {
      fields.value[name].value = value
      validateField(name)
    }
  }

  const touchField = (name: string) => {
    if (fields.value[name]) {
      fields.value[name].touched = true
    }
  }

  const validateField = (name: string) => {
    const field = fields.value[name]
    if (!field) return

    field.errors = []

    for (const rule of field.rules) {
      const result = rule.validate(field.value)
      if (result !== true) {
        field.errors.push(typeof result === 'string' ? result : rule.message)
      }
    }

    field.valid = field.errors.length === 0
  }

  const validateAllFields = () => {
    Object.keys(fields.value).forEach(name => {
      validateField(name)
      touchField(name)
    })
  }

  const isFormValid = computed(() => {
    return Object.values(fields.value).every(field => field.valid)
  })

  const getFieldError = (name: string) => {
    const field = fields.value[name]
    return field?.touched ? field?.errors[0] : ''
  }

  const resetForm = () => {
    Object.keys(fields.value).forEach(name => {
      fields.value[name].value = ''
      fields.value[name].errors = []
      fields.value[name].touched = false
      fields.value[name].valid = true
    })
  }

  // Common validation rules
  const validationRules = {
    required: (message = 'This field is required'): ValidationRule => ({
      validate: (value: any) => {
        if (value === null || value === undefined || value === '') return message
        if (Array.isArray(value) && value.length === 0) return message
        return true
      },
      message
    }),

    email: (message = 'Please enter a valid email address'): ValidationRule => ({
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) || message
      },
      message
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      validate: (value: string) => {
        return (value && value.length >= min) || (message || `Must be at least ${min} characters`)
      },
      message: message || `Must be at least ${min} characters`
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      validate: (value: string) => {
        return (value && value.length <= max) || (message || `Must be no more than ${max} characters`)
      },
      message: message || `Must be no more than ${max} characters`
    }),

    pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
      validate: (value: string) => {
        return regex.test(value) || message
      },
      message
    }),

    phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
      validate: (value: string) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) || message
      },
      message
    }),

    numeric: (message = 'Must be a number'): ValidationRule => ({
      validate: (value: any) => {
        return !isNaN(Number(value)) || message
      },
      message
    }),

    date: (message = 'Please enter a valid date'): ValidationRule => ({
      validate: (value: string) => {
        const date = new Date(value)
        return !isNaN(date.getTime()) || message
      },
      message
    }),

    password: (message = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'): ValidationRule => ({
      validate: (value: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
        return passwordRegex.test(value) || message
      },
      message
    })
  }

  return {
    fields: readonly(fields),
    addField,
    updateField,
    touchField,
    validateField,
    validateAllFields,
    isFormValid,
    getFieldError,
    resetForm,
    validationRules
  }
}
