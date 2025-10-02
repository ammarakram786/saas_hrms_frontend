<template>
  <form @submit.prevent="handleSubmit" class="p-fluid">
    <div class="formgrid grid">
      <div class="field col-12 md:col-6">
        <FormField label="Name" :errorMessage="v$.name.$errors[0]?.$message as string">
          <PInputText 
            id="name" 
            v-model="v$.name.$model" 
            placeholder="Component name" 
            :class="{'p-invalid': v$.name.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Type" :errorMessage="v$.type.$errors[0]?.$message as string">
          <PDropdown 
            id="type" 
            v-model="v$.type.$model" 
            :options="typeOptions" 
            placeholder="Select type" 
            :class="{'p-invalid': v$.type.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Category" :errorMessage="v$.category.$errors[0]?.$message as string">
          <PInputText 
            id="category" 
            v-model="v$.category.$model" 
            placeholder="Component category" 
            :class="{'p-invalid': v$.category.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Sort Order">
          <PInputNumber 
            id="sort_order" 
            v-model="componentData.sort_order" 
            :min="0" 
            :max="999" 
          />
        </FormField>
      </div>
      <div class="field col-12">
        <FormField label="Description">
          <PTextarea 
            id="description" 
            v-model="componentData.description" 
            rows="3" 
            placeholder="Component description" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Calculation Method" :errorMessage="v$.calculation_method.$errors[0]?.$message as string">
          <PDropdown 
            id="calculation_method" 
            v-model="v$.calculation_method.$model" 
            :options="calculationMethods" 
            placeholder="Select calculation method" 
            :class="{'p-invalid': v$.calculation_method.$invalid && submitted}" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-6">
        <FormField label="Calculation Value">
          <PInputNumber 
            id="calculation_value" 
            v-model="componentData.calculation_value" 
            :min="0" 
            :max="1000000" 
            :step="0.01" 
          />
        </FormField>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field-checkbox">
          <PCheckbox 
            id="is_taxable" 
            v-model="componentData.is_taxable" 
            :binary="true" 
          />
          <label for="is_taxable">Taxable</label>
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field-checkbox">
          <PCheckbox 
            id="is_mandatory" 
            v-model="componentData.is_mandatory" 
            :binary="true" 
          />
          <label for="is_mandatory">Mandatory</label>
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field-checkbox">
          <PCheckbox 
            id="is_active" 
            v-model="componentData.is_active" 
            :binary="true" 
          />
          <label for="is_active">Active</label>
        </div>
      </div>
    </div>

    <!-- Calculation Preview -->
    <div v-if="componentData.calculation_method && componentData.calculation_value !== null" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 border-round">
      <h6 class="mb-3">Calculation Preview</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ componentData.calculation_method }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Method</div>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ componentData.calculation_value }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Value</div>
          </div>
        </div>
      </div>
      <div class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Example:</strong> If basic salary is $5000 and this component uses "percentage" method with value 10%, the calculated amount would be $500.</p>
      </div>
    </div>

    <div class="flex justify-content-end mt-4">
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        class="p-button-text" 
        @click="emit('cancel')" 
      />
      <Button 
        label="Save" 
        icon="pi pi-check" 
        type="submit" 
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { PayrollComponent } from '~/types/hrms'
import FormField from '~/components/FormField.vue'

const props = defineProps<{
  component: PayrollComponent | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const componentData = reactive<Partial<PayrollComponent>>({
  name: '',
  type: '',
  category: '',
  description: '',
  calculation_method: '',
  calculation_value: 0,
  is_taxable: false,
  is_mandatory: false,
  is_active: true,
  sort_order: 0
})

const submitted = ref(false)

const typeOptions = ref([
  { label: 'Allowance', value: 'allowance' },
  { label: 'Deduction', value: 'deduction' },
  { label: 'Tax', value: 'tax' },
  { label: 'Bonus', value: 'bonus' }
])

const calculationMethods = ref([
  { label: 'Fixed Amount', value: 'fixed' },
  { label: 'Percentage of Basic Salary', value: 'percentage' },
  { label: 'Percentage of Gross Salary', value: 'gross_percentage' },
  { label: 'Hourly Rate', value: 'hourly' },
  { label: 'Daily Rate', value: 'daily' },
  { label: 'Custom Formula', value: 'formula' }
])

const rules = {
  name: { required },
  type: { required },
  category: { required },
  calculation_method: { required }
}

const v$ = useVuelidate(rules, componentData)

onMounted(() => {
  if (props.component) {
    Object.assign(componentData, props.component)
  }
})

watch(() => props.component, (newVal) => {
  if (newVal) {
    Object.assign(componentData, newVal)
  } else {
    resetForm()
  }
})

const handleSubmit = async () => {
  submitted.value = true
  
  const isFormValid = await v$.value.$validate()
  if (isFormValid) {
    emit('submit', componentData)
  }
}

const resetForm = () => {
  Object.assign(componentData, {
    name: '',
    type: '',
    category: '',
    description: '',
    calculation_method: '',
    calculation_value: 0,
    is_taxable: false,
    is_mandatory: false,
    is_active: true,
    sort_order: 0
  })
  submitted.value = false
  v$.value.$reset()
}
</script>
