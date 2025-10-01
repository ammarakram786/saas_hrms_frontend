<template>
  <div class="form-field">
    <label v-if="label" :for="name" class="block text-900 font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <!-- Input Field -->
      <InputText
        v-if="type === 'text'"
        :id="name"
        v-model="fieldValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="onBlur"
        @input="onInput"
      />

      <InputText
        v-else-if="type === 'email'"
        :id="name"
        v-model="fieldValue"
        type="email"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="onBlur"
        @input="onInput"
      />

      <Password
        v-else-if="type === 'password'"
        :id="name"
        v-model="fieldValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :toggleMask="true"
        :feedback="showPasswordStrength"
        @blur="onBlur"
        @input="onInput"
      />

      <InputNumber
        v-else-if="type === 'number'"
        :id="name"
        v-model="fieldValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :min="min"
        :max="max"
        @blur="onBlur"
        @input="onInput"
      />

      <Textarea
        v-else-if="type === 'textarea'"
        :id="name"
        v-model="fieldValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :autoResize="autoResize"
        @blur="onBlur"
        @input="onInput"
      />

      <!-- Dropdown -->
      <Dropdown
        v-else-if="type === 'dropdown'"
        :id="name"
        v-model="fieldValue"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @change="onChange"
        @blur="onBlur"
      />

      <!-- Date Picker -->
      <Calendar
        v-else-if="type === 'date'"
        :id="name"
        v-model="fieldValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        :dateFormat="dateFormat"
        :showIcon="true"
        @date-select="onDateSelect"
        @blur="onBlur"
      />

      <!-- Error Message -->
      <small v-if="error" class="p-error block mt-1">
        {{ error }}
      </small>

      <!-- Help Text -->
      <small v-if="helpText && !error" class="text-500 block mt-1">
        {{ helpText }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  name: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'dropdown' | 'date'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  modelValue?: any
  options?: any[]
  optionLabel?: string
  optionValue?: string
  min?: number
  max?: number
  rows?: number
  autoResize?: boolean
  dateFormat?: string
  showPasswordStrength?: boolean
  helpText?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  optionLabel: 'label',
  optionValue: 'value',
  dateFormat: 'yy-mm-dd',
  showPasswordStrength: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'blur': [event: Event]
  'input': [event: Event]
}>()

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputClasses = computed(() => ({
  'w-full': true,
  'p-invalid': !!props.error
}))

const onBlur = (event: Event) => {
  emit('blur', event)
}

const onInput = (event: Event) => {
  emit('input', event)
}

const onChange = (event: Event) => {
  emit('input', event)
}

const onDateSelect = (value: Date) => {
  fieldValue.value = value
  emit('input', { target: { value } })
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1.5rem;
}

.p-invalid {
  border-color: var(--red-500) !important;
}
</style>
