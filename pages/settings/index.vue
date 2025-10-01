<template>
  <div class="grid">
    <!-- Page Header -->
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="text-3xl font-bold text-900 m-0">Settings</h1>
            <p class="text-600 mt-2 mb-0">Configure system settings and preferences</p>
          </div>
          <div class="flex align-items-center gap-3">
            <PButton 
              label="Reset to Default" 
              icon="pi pi-refresh" 
              class="p-button-outlined"
              @click="resetToDefault"
            />
            <PButton 
              label="Save Changes" 
              icon="pi pi-check" 
              @click="saveSettings"
              :loading="saving"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="col-12">
      <PTabView v-model:activeIndex="activeTab">
        <!-- General Settings -->
        <PTabPanel header="General">
          <div class="grid">
            <div class="col-12 md:col-6">
              <PCard>
                <template #title>Company Information</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <label for="companyName" class="font-medium">Company Name *</label>
                      <PInputText 
                        id="companyName"
                        v-model="settings.general.companyName" 
                        placeholder="Enter company name"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="companyEmail" class="font-medium">Company Email *</label>
                      <PInputText 
                        id="companyEmail"
                        v-model="settings.general.companyEmail" 
                        type="email"
                        placeholder="company@example.com"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="companyPhone" class="font-medium">Company Phone</label>
                      <PInputText 
                        id="companyPhone"
                        v-model="settings.general.companyPhone" 
                        placeholder="+1 (555) 123-4567"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="companyAddress" class="font-medium">Company Address</label>
                      <PTextarea 
                        id="companyAddress"
                        v-model="settings.general.companyAddress" 
                        placeholder="Enter company address"
                        rows="3"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="timezone" class="font-medium">Timezone *</label>
                      <PDropdown 
                        id="timezone"
                        v-model="settings.general.timezone" 
                        :options="timezoneOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="Select timezone"
                        class="w-full"
                      />
                    </div>
                  </div>
                </template>
              </PCard>
            </div>

            <div class="col-12 md:col-6">
              <PCard>
                <template #title>System Preferences</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <label for="dateFormat" class="font-medium">Date Format *</label>
                      <PDropdown 
                        id="dateFormat"
                        v-model="settings.general.dateFormat" 
                        :options="dateFormatOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="Select date format"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="timeFormat" class="font-medium">Time Format *</label>
                      <PDropdown 
                        id="timeFormat"
                        v-model="settings.general.timeFormat" 
                        :options="timeFormatOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="Select time format"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="currency" class="font-medium">Currency *</label>
                      <PDropdown 
                        id="currency"
                        v-model="settings.general.currency" 
                        :options="currencyOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="Select currency"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="language" class="font-medium">Language *</label>
                      <PDropdown 
                        id="language"
                        v-model="settings.general.language" 
                        :options="languageOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="Select language"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.general.autoLogout" inputId="autoLogout" />
                      <label for="autoLogout" class="ml-2">Enable Auto Logout</label>
                    </div>
                    <div class="col-12 field">
                      <label for="sessionTimeout" class="font-medium">Session Timeout (minutes)</label>
                      <PInputNumber 
                        id="sessionTimeout"
                        v-model="settings.general.sessionTimeout" 
                        :min="5" 
                        :max="480"
                        class="w-full"
                      />
                    </div>
                  </div>
                </template>
              </PCard>
            </div>
          </div>
        </PTabPanel>

        <!-- Security Settings -->
        <PTabPanel header="Security">
          <div class="grid">
            <div class="col-12 md:col-6">
              <PCard>
                <template #title>Password Policy</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <label for="minPasswordLength" class="font-medium">Minimum Password Length</label>
                      <PInputNumber 
                        id="minPasswordLength"
                        v-model="settings.security.minPasswordLength" 
                        :min="6" 
                        :max="32"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.requireUppercase" inputId="requireUppercase" />
                      <label for="requireUppercase" class="ml-2">Require Uppercase Letters</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.requireLowercase" inputId="requireLowercase" />
                      <label for="requireLowercase" class="ml-2">Require Lowercase Letters</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.requireNumbers" inputId="requireNumbers" />
                      <label for="requireNumbers" class="ml-2">Require Numbers</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.requireSpecialChars" inputId="requireSpecialChars" />
                      <label for="requireSpecialChars" class="ml-2">Require Special Characters</label>
                    </div>
                    <div class="col-12 field">
                      <label for="passwordExpiry" class="font-medium">Password Expiry (days)</label>
                      <PInputNumber 
                        id="passwordExpiry"
                        v-model="settings.security.passwordExpiry" 
                        :min="0" 
                        :max="365"
                        class="w-full"
                      />
                    </div>
                  </div>
                </template>
              </PCard>
            </div>

            <div class="col-12 md:col-6">
              <PCard>
                <template #title>Login Security</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <label for="maxLoginAttempts" class="font-medium">Max Login Attempts</label>
                      <PInputNumber 
                        id="maxLoginAttempts"
                        v-model="settings.security.maxLoginAttempts" 
                        :min="3" 
                        :max="10"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="lockoutDuration" class="font-medium">Lockout Duration (minutes)</label>
                      <PInputNumber 
                        id="lockoutDuration"
                        v-model="settings.security.lockoutDuration" 
                        :min="5" 
                        :max="60"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.enable2FA" inputId="enable2FA" />
                      <label for="enable2FA" class="ml-2">Enable Two-Factor Authentication</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.require2FA" inputId="require2FA" />
                      <label for="require2FA" class="ml-2">Require 2FA for All Users</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.security.enableSSO" inputId="enableSSO" />
                      <label for="enableSSO" class="ml-2">Enable Single Sign-On (SSO)</label>
                    </div>
                    <div class="col-12 field">
                      <label for="sessionTimeout" class="font-medium">Session Timeout (minutes)</label>
                      <PInputNumber 
                        id="sessionTimeout"
                        v-model="settings.security.sessionTimeout" 
                        :min="15" 
                        :max="480"
                        class="w-full"
                      />
                    </div>
                  </div>
                </template>
              </PCard>
            </div>
          </div>
        </PTabPanel>

        <!-- Notification Settings -->
        <PTabPanel header="Notifications">
          <div class="grid">
            <div class="col-12 md:col-6">
              <PCard>
                <template #title>Email Notifications</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.emailEnabled" inputId="emailEnabled" />
                      <label for="emailEnabled" class="ml-2">Enable Email Notifications</label>
                    </div>
                    <div class="col-12 field">
                      <label for="smtpHost" class="font-medium">SMTP Host</label>
                      <PInputText 
                        id="smtpHost"
                        v-model="settings.notifications.smtpHost" 
                        placeholder="smtp.gmail.com"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="smtpPort" class="font-medium">SMTP Port</label>
                      <PInputNumber 
                        id="smtpPort"
                        v-model="settings.notifications.smtpPort" 
                        :min="1" 
                        :max="65535"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="smtpUsername" class="font-medium">SMTP Username</label>
                      <PInputText 
                        id="smtpUsername"
                        v-model="settings.notifications.smtpUsername" 
                        placeholder="your-email@gmail.com"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="smtpPassword" class="font-medium">SMTP Password</label>
                      <PPassword 
                        id="smtpPassword"
                        v-model="settings.notifications.smtpPassword" 
                        placeholder="Enter SMTP password"
                        class="w-full"
                        :feedback="false"
                      />
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.smtpSSL" inputId="smtpSSL" />
                      <label for="smtpSSL" class="ml-2">Use SSL/TLS</label>
                    </div>
                  </div>
                </template>
              </PCard>
            </div>

            <div class="col-12 md:col-6">
              <PCard>
                <template #title>Notification Types</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.leaveRequest" inputId="leaveRequest" />
                      <label for="leaveRequest" class="ml-2">Leave Request Notifications</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.attendanceAlert" inputId="attendanceAlert" />
                      <label for="attendanceAlert" class="ml-2">Attendance Alert Notifications</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.payrollReminder" inputId="payrollReminder" />
                      <label for="payrollReminder" class="ml-2">Payroll Reminder Notifications</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.systemUpdates" inputId="systemUpdates" />
                      <label for="systemUpdates" class="ml-2">System Update Notifications</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.securityAlerts" inputId="securityAlerts" />
                      <label for="securityAlerts" class="ml-2">Security Alert Notifications</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.notifications.userActivity" inputId="userActivity" />
                      <label for="userActivity" class="ml-2">User Activity Notifications</label>
                    </div>
                  </div>
                </template>
              </PCard>
            </div>
          </div>
        </PTabPanel>

        <!-- Integration Settings -->
        <PTabPanel header="Integrations">
          <div class="grid">
            <div class="col-12 md:col-6">
              <PCard>
                <template #title>API Settings</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.apiEnabled" inputId="apiEnabled" />
                      <label for="apiEnabled" class="ml-2">Enable API Access</label>
                    </div>
                    <div class="col-12 field">
                      <label for="apiKey" class="font-medium">API Key</label>
                      <PInputText 
                        id="apiKey"
                        v-model="settings.integrations.apiKey" 
                        readonly
                        class="w-full"
                      />
                      <PButton 
                        label="Generate New Key" 
                        icon="pi pi-refresh" 
                        class="p-button-outlined p-button-sm mt-2"
                        @click="generateApiKey"
                      />
                    </div>
                    <div class="col-12 field">
                      <label for="rateLimit" class="font-medium">Rate Limit (requests per minute)</label>
                      <PInputNumber 
                        id="rateLimit"
                        v-model="settings.integrations.rateLimit" 
                        :min="10" 
                        :max="1000"
                        class="w-full"
                      />
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.corsEnabled" inputId="corsEnabled" />
                      <label for="corsEnabled" class="ml-2">Enable CORS</label>
                    </div>
                  </div>
                </template>
              </PCard>
            </div>

            <div class="col-12 md:col-6">
              <PCard>
                <template #title>Third-Party Integrations</template>
                <template #content>
                  <div class="grid formgrid">
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.googleWorkspace" inputId="googleWorkspace" />
                      <label for="googleWorkspace" class="ml-2">Google Workspace Integration</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.microsoft365" inputId="microsoft365" />
                      <label for="microsoft365" class="ml-2">Microsoft 365 Integration</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.slack" inputId="slack" />
                      <label for="slack" class="ml-2">Slack Integration</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.zoom" inputId="zoom" />
                      <label for="zoom" class="ml-2">Zoom Integration</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.quickbooks" inputId="quickbooks" />
                      <label for="quickbooks" class="ml-2">QuickBooks Integration</label>
                    </div>
                    <div class="col-12 field">
                      <PCheckbox v-model="settings.integrations.bambooHR" inputId="bambooHR" />
                      <label for="bambooHR" class="ml-2">BambooHR Integration</label>
                    </div>
                  </div>
                </template>
              </PCard>
            </div>
          </div>
        </PTabPanel>
      </PTabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()

// Reactive data
const activeTab = ref(0)
const saving = ref(false)

const settings = ref({
  general: {
    companyName: 'HRMS Company',
    companyEmail: 'admin@hrmscompany.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Business Street\nNew York, NY 10001',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'en',
    autoLogout: true,
    sessionTimeout: 30
  },
  security: {
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enable2FA: true,
    require2FA: false,
    enableSSO: false,
    sessionTimeout: 30
  },
  notifications: {
    emailEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@hrmscompany.com',
    smtpPassword: '',
    smtpSSL: true,
    leaveRequest: true,
    attendanceAlert: true,
    payrollReminder: true,
    systemUpdates: true,
    securityAlerts: true,
    userActivity: false
  },
  integrations: {
    apiEnabled: true,
    apiKey: 'hrms_api_key_123456789',
    rateLimit: 100,
    corsEnabled: true,
    googleWorkspace: false,
    microsoft365: false,
    slack: false,
    zoom: false,
    quickbooks: false,
    bambooHR: false
  }
})

// Options
const timezoneOptions = ref([
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Chicago', value: 'America/Chicago' },
  { label: 'America/Denver', value: 'America/Denver' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Paris', value: 'Europe/Paris' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  { label: 'Asia/Shanghai', value: 'Asia/Shanghai' }
])

const dateFormatOptions = ref([
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' }
])

const timeFormatOptions = ref([
  { label: '12 Hour (AM/PM)', value: '12' },
  { label: '24 Hour', value: '24' }
])

const currencyOptions = ref([
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Japanese Yen (JPY)', value: 'JPY' },
  { label: 'Canadian Dollar (CAD)', value: 'CAD' }
])

const languageOptions = ref([
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Chinese', value: 'zh' }
])

// Methods
const saveSettings = async () => {
  saving.value = true
  try {
    // TODO: Implement real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: 'Your settings have been saved successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save settings',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const resetToDefault = () => {
  // TODO: Implement reset to default functionality
  toast.add({
    severity: 'info',
    summary: 'Reset to Default',
    detail: 'Reset to default functionality will be implemented',
    life: 3000
  })
}

const generateApiKey = () => {
  // TODO: Implement generate API key functionality
  const newKey = 'hrms_api_key_' + Math.random().toString(36).substr(2, 9)
  settings.value.integrations.apiKey = newKey
  toast.add({
    severity: 'success',
    summary: 'API Key Generated',
    detail: 'New API key has been generated',
    life: 3000
  })
}

onMounted(() => {
  // TODO: Load settings from API
})
</script>

<style scoped>
.formgrid .field {
  margin-bottom: 1rem;
}
</style>
