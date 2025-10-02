<template>
  <div class="form-field">
    <label 
      v-if="label" 
      :for="fieldId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <slot>
        <PInputText 
          :id="fieldId"
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)"
          :class="[
            'w-full',
            error ? 'p-invalid' : '',
            inputClass
          ]"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :type="type"
          :rows="rows"
        />
      </slot>
      
      <div v-if="error" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <i class="pi pi-exclamation-circle text-red-500"></i>
      </div>
    </div>
    
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
    
    <div v-if="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  modelValue?: any
  label?: string
  error?: string
  hint?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  type?: string
  rows?: number
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  rows: 3
})

// Emits
defineEmits<{
  'update:modelValue': [value: any]
}>()

// Computed
const fieldId = computed(() => {
  return `field-${Math.random().toString(36).substr(2, 9)}`
})
</script>

<style scoped>
.form-field {
  @apply space-y-1;
}

/* Error state styling */
:deep(.p-invalid) {
  border-color: theme('colors.red.500');
}

:deep(.p-invalid:focus) {
  border-color: theme('colors.red.500');
  box-shadow: 0 0 0 1px theme('colors.red.500');
}

/* Disabled state */
:deep(.p-disabled) {
  background-color: theme('colors.gray.100');
  color: theme('colors.gray.500');
}

/* Readonly state */
:deep(.p-readonly) {
  background-color: theme('colors.gray.50');
}
</style>
