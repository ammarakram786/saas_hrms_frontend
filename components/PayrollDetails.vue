<template>
  <div v-if="payroll" class="p-fluid">
    <!-- Basic Information -->
    <div class="mb-4">
      <h6 class="mb-3">Basic Information</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Employee:</label>
            <p class="mt-1">{{ payroll.employee_name }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Period:</label>
            <p class="mt-1">{{ payroll.period_name }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Status:</label>
            <p class="mt-1">
              <PTag :value="payroll.status" :severity="getPayrollStatusSeverity(payroll.status)" />
            </p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Pay Date:</label>
            <p class="mt-1">{{ formatDate(payroll.pay_date) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Salary Breakdown -->
    <div class="mb-4">
      <h6 class="mb-3">Salary Breakdown</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Basic Salary:</label>
            <p class="mt-1 text-2xl font-bold text-blue-600">{{ formatCurrency(payroll.basic_salary) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Gross Salary:</label>
            <p class="mt-1 text-2xl font-bold text-green-600">{{ formatCurrency(payroll.gross_salary) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Total Deductions:</label>
            <p class="mt-1 text-2xl font-bold text-red-600">{{ formatCurrency(payroll.deductions) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Net Salary:</label>
            <p class="mt-1 text-3xl font-bold text-purple-600">{{ formatCurrency(payroll.net_salary) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Allowances -->
    <div v-if="payroll.allowances && payroll.allowances.length > 0" class="mb-4">
      <h6 class="mb-3">Allowances</h6>
      <div class="grid">
        <div v-for="(allowance, index) in payroll.allowances" :key="index" class="col-12 md:col-6">
          <div class="border-1 surface-border border-round p-3">
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="font-semibold">{{ allowance.name }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ allowance.description }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-600">{{ formatCurrency(allowance.amount) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ allowance.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deductions -->
    <div v-if="payroll.deduction_details && payroll.deduction_details.length > 0" class="mb-4">
      <h6 class="mb-3">Deductions</h6>
      <div class="grid">
        <div v-for="(deduction, index) in payroll.deduction_details" :key="index" class="col-12 md:col-6">
          <div class="border-1 surface-border border-round p-3">
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="font-semibold">{{ deduction.name }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ deduction.description }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-red-600">{{ formatCurrency(deduction.amount) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ deduction.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tax Information -->
    <div v-if="payroll.tax_details" class="mb-4">
      <h6 class="mb-3">Tax Information</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Income Tax:</label>
            <p class="mt-1 text-xl font-bold text-red-600">{{ formatCurrency(payroll.tax_details.income_tax) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Social Security:</label>
            <p class="mt-1 text-xl font-bold text-red-600">{{ formatCurrency(payroll.tax_details.social_security) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Medicare:</label>
            <p class="mt-1 text-xl font-bold text-red-600">{{ formatCurrency(payroll.tax_details.medicare) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Other Taxes:</label>
            <p class="mt-1 text-xl font-bold text-red-600">{{ formatCurrency(payroll.tax_details.other_taxes) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="mb-4">
      <h6 class="mb-3">Additional Information</h6>
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Hours Worked:</label>
            <p class="mt-1">{{ payroll.hours_worked || 'N/A' }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Overtime Hours:</label>
            <p class="mt-1">{{ payroll.overtime_hours || 'N/A' }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Created:</label>
            <p class="mt-1">{{ formatDateTime(payroll.created_at) }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-semibold">Last Updated:</label>
            <p class="mt-1">{{ formatDateTime(payroll.updated_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="payroll.notes" class="mb-4">
      <h6 class="mb-3">Notes</h6>
      <div class="border-1 surface-border border-round p-3">
        <p class="mb-0">{{ payroll.notes }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-content-end gap-2 mt-4">
      <Button 
        label="Download Payslip" 
        icon="pi pi-download" 
        @click="downloadPayslip"
      />
      <Button 
        label="Print" 
        icon="pi pi-print" 
        severity="secondary"
        @click="printPayslip"
      />
    </div>
  </div>
  <div v-else>
    <p>No payroll record selected.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { PayrollRecord } from '~/types/hrms'

const props = defineProps<{
  payroll: PayrollRecord | null
}>()

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Not set'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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

const getPayrollStatusSeverity = (status: string) => {
  switch (status) {
    case 'paid': return 'success'
    case 'approved': return 'info'
    case 'pending': return 'warning'
    case 'draft': return 'secondary'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}

const downloadPayslip = () => {
  // TODO: Implement payslip download
  console.log('Download payslip for:', props.payroll?.employee_name)
}

const printPayslip = () => {
  // TODO: Implement payslip printing
  console.log('Print payslip for:', props.payroll?.employee_name)
}
</script>
