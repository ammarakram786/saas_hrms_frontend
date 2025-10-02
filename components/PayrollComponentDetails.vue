<template>
  <div v-if="component" class="p-fluid">
    <div class="field grid">
      <label for="name" class="col-12 mb-2 md:col-3 md:mb-0">Name:</label>
      <div class="col-12 md:col-9">
        <PInputText id="name" :value="component.name" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="type" class="col-12 mb-2 md:col-3 md:mb-0">Type:</label>
      <div class="col-12 md:col-9">
        <PTag :value="component.type" :severity="getComponentTypeSeverity(component.type)" />
      </div>
    </div>
    <div class="field grid">
      <label for="category" class="col-12 mb-2 md:col-3 md:mb-0">Category:</label>
      <div class="col-12 md:col-9">
        <PInputText id="category" :value="component.category" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="description" class="col-12 mb-2 md:col-3 md:mb-0">Description:</label>
      <div class="col-12 md:col-9">
        <PTextarea id="description" :value="component.description" rows="3" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="calculation_method" class="col-12 mb-2 md:col-3 md:mb-0">Calculation Method:</label>
      <div class="col-12 md:col-9">
        <PInputText id="calculation_method" :value="component.calculation_method" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="calculation_value" class="col-12 mb-2 md:col-3 md:mb-0">Calculation Value:</label>
      <div class="col-12 md:col-9">
        <PInputText id="calculation_value" :value="component.calculation_value" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="is_taxable" class="col-12 mb-2 md:col-3 md:mb-0">Taxable:</label>
      <div class="col-12 md:col-9">
        <PTag :value="component.is_taxable ? 'Yes' : 'No'" :severity="component.is_taxable ? 'warning' : 'success'" />
      </div>
    </div>
    <div class="field grid">
      <label for="is_mandatory" class="col-12 mb-2 md:col-3 md:mb-0">Mandatory:</label>
      <div class="col-12 md:col-9">
        <PTag :value="component.is_mandatory ? 'Yes' : 'No'" :severity="component.is_mandatory ? 'danger' : 'secondary'" />
      </div>
    </div>
    <div class="field grid">
      <label for="is_active" class="col-12 mb-2 md:col-3 md:mb-0">Active:</label>
      <div class="col-12 md:col-9">
        <PTag :value="component.is_active ? 'Yes' : 'No'" :severity="component.is_active ? 'success' : 'danger'" />
      </div>
    </div>
    <div class="field grid">
      <label for="sort_order" class="col-12 mb-2 md:col-3 md:mb-0">Sort Order:</label>
      <div class="col-12 md:col-9">
        <PInputText id="sort_order" :value="component.sort_order" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="created_at" class="col-12 mb-2 md:col-3 md:mb-0">Created:</label>
      <div class="col-12 md:col-9">
        <PInputText id="created_at" :value="formatDateTime(component.created_at)" readonly />
      </div>
    </div>
    <div class="field grid">
      <label for="updated_at" class="col-12 mb-2 md:col-3 md:mb-0">Last Updated:</label>
      <div class="col-12 md:col-9">
        <PInputText id="updated_at" :value="formatDateTime(component.updated_at)" readonly />
      </div>
    </div>
  </div>
  <div v-else>
    <p>No component selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { PayrollComponent } from '~/types/hrms'

const props = defineProps<{
  component: PayrollComponent | null
}>()

const formatDateTime = (dateTimeString: string | null | undefined) => {
  if (!dateTimeString) return 'Not available'
  const date = new Date(dateTimeString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getComponentTypeSeverity = (type: string) => {
  switch (type) {
    case 'allowance': return 'success'
    case 'deduction': return 'danger'
    case 'tax': return 'warning'
    case 'bonus': return 'info'
    default: return 'secondary'
  }
}
</script>
