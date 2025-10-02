<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>System Settings</h5>
          <Button 
            label="Save Changes" 
            icon="pi pi-save" 
            @click="saveSettings"
            :loading="isSaving"
          />
        </div>

        <PTabView>
          <!-- General Settings -->
          <PTabPanel header="General">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField label="Company Name">
                  <PInputText 
                    v-model="settings.general.company_name" 
                    placeholder="Enter company name" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Company Email">
                  <PInputText 
                    v-model="settings.general.company_email" 
                    type="email" 
                    placeholder="Enter company email" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Company Phone">
                  <PInputText 
                    v-model="settings.general.company_phone" 
                    placeholder="Enter company phone" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Company Address">
                  <PTextarea 
                    v-model="settings.general.company_address" 
                    rows="3" 
                    placeholder="Enter company address" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Timezone">
                  <PDropdown 
                    v-model="settings.general.timezone" 
                    :options="timezoneOptions" 
                    placeholder="Select timezone" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Date Format">
                  <PDropdown 
                    v-model="settings.general.date_format" 
                    :options="dateFormatOptions" 
                    placeholder="Select date format" 
                  />
                </FormField>
              </div>
            </div>
          </PTabPanel>

          <!-- Attendance Settings -->
          <PTabPanel header="Attendance">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField label="Default Work Hours">
                  <PInputNumber 
                    v-model="settings.attendance.default_work_hours" 
                    :min="1" 
                    :max="24" 
                    suffix=" hours" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Overtime Threshold">
                  <PInputNumber 
                    v-model="settings.attendance.overtime_threshold" 
                    :min="1" 
                    :max="24" 
                    suffix=" hours" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Late Arrival Threshold">
                  <PInputNumber 
                    v-model="settings.attendance.late_arrival_threshold" 
                    :min="1" 
                    :max="120" 
                    suffix=" minutes" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Auto Clock Out">
                  <PDropdown 
                    v-model="settings.attendance.auto_clock_out" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Require Clock In/Out">
                  <PDropdown 
                    v-model="settings.attendance.require_clock_in_out" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Allow Remote Work">
                  <PDropdown 
                    v-model="settings.attendance.allow_remote_work" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
            </div>
          </PTabPanel>

          <!-- Leave Settings -->
          <PTabPanel header="Leave">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField label="Default Annual Leave Days">
                  <PInputNumber 
                    v-model="settings.leave.default_annual_leave_days" 
                    :min="0" 
                    :max="365" 
                    suffix=" days" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Default Sick Leave Days">
                  <PInputNumber 
                    v-model="settings.leave.default_sick_leave_days" 
                    :min="0" 
                    :max="365" 
                    suffix=" days" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Leave Approval Required">
                  <PDropdown 
                    v-model="settings.leave.leave_approval_required" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Allow Negative Balance">
                  <PDropdown 
                    v-model="settings.leave.allow_negative_balance" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Leave Carry Forward">
                  <PDropdown 
                    v-model="settings.leave.leave_carry_forward" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Max Carry Forward Days">
                  <PInputNumber 
                    v-model="settings.leave.max_carry_forward_days" 
                    :min="0" 
                    :max="365" 
                    suffix=" days" 
                  />
                </FormField>
              </div>
            </div>
          </PTabPanel>

          <!-- Payroll Settings -->
          <PTabPanel header="Payroll">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField label="Default Currency">
                  <PDropdown 
                    v-model="settings.payroll.default_currency" 
                    :options="currencyOptions" 
                    placeholder="Select currency" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Payroll Period">
                  <PDropdown 
                    v-model="settings.payroll.payroll_period" 
                    :options="payrollPeriodOptions" 
                    placeholder="Select period" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Tax Calculation Method">
                  <PDropdown 
                    v-model="settings.payroll.tax_calculation_method" 
                    :options="taxCalculationOptions" 
                    placeholder="Select method" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Auto Generate Payroll">
                  <PDropdown 
                    v-model="settings.payroll.auto_generate_payroll" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Overtime Rate Multiplier">
                  <PInputNumber 
                    v-model="settings.payroll.overtime_rate_multiplier" 
                    :min="1" 
                    :max="5" 
                    :step="0.1" 
                    suffix="x" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Holiday Rate Multiplier">
                  <PInputNumber 
                    v-model="settings.payroll.holiday_rate_multiplier" 
                    :min="1" 
                    :max="5" 
                    :step="0.1" 
                    suffix="x" 
                  />
                </FormField>
              </div>
            </div>
          </PTabPanel>

          <!-- Security Settings -->
          <PTabPanel header="Security">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField label="Password Minimum Length">
                  <PInputNumber 
                    v-model="settings.security.password_min_length" 
                    :min="6" 
                    :max="32" 
                    suffix=" characters" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Password Require Special Characters">
                  <PDropdown 
                    v-model="settings.security.password_require_special_chars" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Session Timeout">
                  <PInputNumber 
                    v-model="settings.security.session_timeout" 
                    :min="5" 
                    :max="480" 
                    suffix=" minutes" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Two-Factor Authentication Required">
                  <PDropdown 
                    v-model="settings.security.two_factor_required" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Login Attempts Limit">
                  <PInputNumber 
                    v-model="settings.security.login_attempts_limit" 
                    :min="3" 
                    :max="10" 
                    suffix=" attempts" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Account Lockout Duration">
                  <PInputNumber 
                    v-model="settings.security.account_lockout_duration" 
                    :min="5" 
                    :max="60" 
                    suffix=" minutes" 
                  />
                </FormField>
              </div>
            </div>
          </PTabPanel>

          <!-- Notification Settings -->
          <PTabPanel header="Notifications">
            <div class="grid">
              <div class="col-12 md:col-6">
                <FormField label="Email Notifications">
                  <PDropdown 
                    v-model="settings.notifications.email_enabled" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="SMS Notifications">
                  <PDropdown 
                    v-model="settings.notifications.sms_enabled" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Push Notifications">
                  <PDropdown 
                    v-model="settings.notifications.push_enabled" 
                    :options="booleanOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                  />
                </FormField>
              </div>
              <div class="col-12 md:col-6">
                <FormField label="Notification Frequency">
                  <PDropdown 
                    v-model="settings.notifications.frequency" 
                    :options="notificationFrequencyOptions" 
                    placeholder="Select frequency" 
                  />
                </FormField>
              </div>
            </div>
          </PTabPanel>
        </PTabView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

const isSaving = ref(false)

const settings = reactive({
  general: {
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY'
  },
  attendance: {
    default_work_hours: 8,
    overtime_threshold: 8,
    late_arrival_threshold: 15,
    auto_clock_out: false,
    require_clock_in_out: true,
    allow_remote_work: true
  },
  leave: {
    default_annual_leave_days: 20,
    default_sick_leave_days: 10,
    leave_approval_required: true,
    allow_negative_balance: false,
    leave_carry_forward: true,
    max_carry_forward_days: 5
  },
  payroll: {
    default_currency: 'USD',
    payroll_period: 'monthly',
    tax_calculation_method: 'standard',
    auto_generate_payroll: false,
    overtime_rate_multiplier: 1.5,
    holiday_rate_multiplier: 2.0
  },
  security: {
    password_min_length: 8,
    password_require_special_chars: true,
    session_timeout: 30,
    two_factor_required: false,
    login_attempts_limit: 5,
    account_lockout_duration: 15
  },
  notifications: {
    email_enabled: true,
    sms_enabled: false,
    push_enabled: true,
    frequency: 'immediate'
  }
})

const timezoneOptions = ref([
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Asia/Kolkata', 'Australia/Sydney'
])

const dateFormatOptions = ref([
  'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'
])

const booleanOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false }
])

const currencyOptions = ref([
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'
])

const payrollPeriodOptions = ref([
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' }
])

const taxCalculationOptions = ref([
  { label: 'Standard', value: 'standard' },
  { label: 'Progressive', value: 'progressive' },
  { label: 'Flat Rate', value: 'flat_rate' }
])

const notificationFrequencyOptions = ref([
  { label: 'Immediate', value: 'immediate' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
])

onMounted(() => {
  loadSettings()
})

const loadSettings = async () => {
  try {
    // TODO: Implement settings API call
    // For now, using default values
    console.log('Loading settings...')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load settings', life: 3000 })
  }
}

const saveSettings = async () => {
  isSaving.value = true
  
  try {
    // TODO: Implement settings save API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Settings saved successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save settings', life: 3000 })
  } finally {
    isSaving.value = false
  }
}
</script>
