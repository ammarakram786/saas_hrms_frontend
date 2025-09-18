<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tenant Management</h1>
        <p class="text-gray-600 mt-1">Manage all tenant organizations</p>
      </div>
      <Button 
        label="Create Tenant" 
        icon="pi pi-plus" 
        @click="$router.push('/admin/tenants/create')"
      />
    </div>
    
    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Search</label>
            <InputText 
              v-model="filters.search" 
              placeholder="Search tenants..."
              class="w-full"
              @input="debouncedSearch"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <Dropdown 
              v-model="filters.status" 
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              class="w-full"
              @change="fetchTenants"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Plan</label>
            <Dropdown 
              v-model="filters.plan" 
              :options="planOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Plans"
              class="w-full"
              @change="fetchTenants"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Subscription</label>
            <Dropdown 
              v-model="filters.subscriptionStatus" 
              :options="subscriptionStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Subscriptions"
              class="w-full"
              @change="fetchTenants"
            />
          </div>
        </div>
      </template>
    </Card>
    
    <!-- Tenants Table -->
    <Card>
      <template #content>
        <DataTable 
          :value="tenants" 
          :loading="loading"
          paginator 
          :rows="20"
          :totalRecords="totalRecords"
          :lazy="true"
          @page="onPage"
          @sort="onSort"
          sortMode="single"
          dataKey="id"
          :rowHover="true"
          class="p-datatable-sm"
        >
          <Column field="name" header="Organization" sortable>
            <template #body="slotProps">
              <div class="flex items-center space-x-3">
                <Avatar 
                  :label="slotProps.data.name.charAt(0)" 
                  size="normal" 
                  shape="circle" 
                  class="bg-blue-500"
                />
                <div>
                  <p class="font-medium">{{ slotProps.data.name }}</p>
                  <p class="text-sm text-gray-500">{{ slotProps.data.slug }}</p>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="contact_email" header="Contact" sortable>
            <template #body="slotProps">
              <div>
                <p class="text-sm">{{ slotProps.data.contact_email }}</p>
                <p class="text-xs text-gray-500" v-if="slotProps.data.contact_phone">
                  {{ slotProps.data.contact_phone }}
                </p>
              </div>
            </template>
          </Column>
          
          <Column field="plan" header="Plan" sortable>
            <template #body="slotProps">
              <Badge 
                :value="slotProps.data.plan" 
                :severity="getPlanSeverity(slotProps.data.plan)"
              />
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Badge 
                :value="slotProps.data.status" 
                :severity="getStatusSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
          
          <Column field="subscription_status" header="Subscription" sortable>
            <template #body="slotProps">
              <Badge 
                :value="slotProps.data.subscription_status || 'none'" 
                :severity="getSubscriptionSeverity(slotProps.data.subscription_status)"
              />
            </template>
          </Column>
          
          <Column header="Usage">
            <template #body="slotProps">
              <div class="text-xs">
                <div class="flex justify-between mb-1">
                  <span>Users:</span>
                  <span>{{ slotProps.data.current_user_count }}/{{ slotProps.data.max_users }}</span>
                </div>
                <ProgressBar 
                  :value="getUserUsagePercentage(slotProps.data)" 
                  :showValue="false" 
                  class="h-1 mb-2"
                  :class="getUserUsagePercentage(slotProps.data) > 80 ? 'p-progressbar-danger' : 'p-progressbar-success'"
                />
                <div class="flex justify-between mb-1">
                  <span>Employees:</span>
                  <span>{{ slotProps.data.current_employee_count }}/{{ slotProps.data.max_employees }}</span>
                </div>
                <ProgressBar 
                  :value="getEmployeeUsagePercentage(slotProps.data)" 
                  :showValue="false" 
                  class="h-1"
                  :class="getEmployeeUsagePercentage(slotProps.data) > 80 ? 'p-progressbar-danger' : 'p-progressbar-success'"
                />
              </div>
            </template>
          </Column>
          
          <Column field="created_at" header="Created" sortable>
            <template #body="slotProps">
              <div class="text-sm">
                {{ formatDate(slotProps.data.created_at) }}
              </div>
            </template>
          </Column>
          
          <Column header="Actions" :exportable="false">
            <template #body="slotProps">
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-eye" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'View Details'"
                  @click="viewTenant(slotProps.data)"
                />
                <Button 
                  icon="pi pi-pencil" 
                  class="p-button-text p-button-sm" 
                  v-tooltip="'Edit'"
                  @click="editTenant(slotProps.data)"
                />
                <SplitButton 
                  :model="getTenantActions(slotProps.data)"
                  class="p-button-text p-button-sm"
                  icon="pi pi-ellipsis-v"
                  @click="viewTenant(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Tenant Detail Dialog -->
    <Dialog 
      v-model:visible="showTenantDialog" 
      :header="selectedTenant?.name" 
      :modal="true"
      class="w-full max-w-4xl"
    >
      <div v-if="selectedTenant" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div>
          <h4 class="font-semibold mb-3">Organization Details</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Name:</span>
              <span class="font-medium">{{ selectedTenant.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Slug:</span>
              <span class="font-medium">{{ selectedTenant.slug }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Domain:</span>
              <span class="font-medium">{{ selectedTenant.domain || 'Not set' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Contact Email:</span>
              <span class="font-medium">{{ selectedTenant.contact_email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Contact Phone:</span>
              <span class="font-medium">{{ selectedTenant.contact_phone || 'Not set' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Subscription Info -->
        <div>
          <h4 class="font-semibold mb-3">Subscription Details</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Plan:</span>
              <Badge :value="selectedTenant.plan" :severity="getPlanSeverity(selectedTenant.plan)" />
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <Badge :value="selectedTenant.subscription_status || 'none'" :severity="getSubscriptionSeverity(selectedTenant.subscription_status)" />
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Start Date:</span>
              <span class="font-medium">{{ selectedTenant.subscription_start_date ? formatDate(selectedTenant.subscription_start_date) : 'Not set' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">End Date:</span>
              <span class="font-medium">{{ selectedTenant.subscription_end_date ? formatDate(selectedTenant.subscription_end_date) : 'Not set' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Usage Stats -->
        <div class="md:col-span-2">
          <h4 class="font-semibold mb-3">Usage Statistics</h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="text-blue-600 font-medium">Users</span>
                <span class="text-blue-900 font-bold">{{ selectedTenant.current_user_count }}/{{ selectedTenant.max_users }}</span>
              </div>
              <ProgressBar 
                :value="getUserUsagePercentage(selectedTenant)" 
                class="h-2"
                :class="getUserUsagePercentage(selectedTenant) > 80 ? 'p-progressbar-danger' : 'p-progressbar-success'"
              />
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="text-green-600 font-medium">Employees</span>
                <span class="text-green-900 font-bold">{{ selectedTenant.current_employee_count }}/{{ selectedTenant.max_employees }}</span>
              </div>
              <ProgressBar 
                :value="getEmployeeUsagePercentage(selectedTenant)" 
                class="h-2"
                :class="getEmployeeUsagePercentage(selectedTenant) > 80 ? 'p-progressbar-danger' : 'p-progressbar-success'"
              />
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button label="Edit" icon="pi pi-pencil" @click="editTenant(selectedTenant)" />
          <Button label="Close" class="p-button-secondary" @click="showTenantDialog = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { Tenant } from '~/types/auth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-only'
})

const { $api } = useNuxtApp()

// Reactive data
const tenants = ref<Tenant[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const selectedTenant = ref<Tenant | null>(null)
const showTenantDialog = ref(false)

// Filters
const filters = ref({
  search: '',
  status: '',
  plan: '',
  subscriptionStatus: ''
})

// Pagination
const pagination = ref({
  page: 0,
  rows: 20,
  sortField: 'created_at',
  sortOrder: -1
})

// Options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Pending', value: 'pending' }
]

const planOptions = [
  { label: 'All Plans', value: '' },
  { label: 'Free', value: 'free' },
  { label: 'Basic', value: 'basic' },
  { label: 'Premium', value: 'premium' },
  { label: 'Enterprise', value: 'enterprise' }
]

const subscriptionStatusOptions = [
  { label: 'All Subscriptions', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Past Due', value: 'past_due' },
  { label: 'Trialing', value: 'trialing' }
]

// Methods
const fetchTenants = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: (pagination.value.page + 1).toString(),
      page_size: pagination.value.rows.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.plan) params.append('plan', filters.value.plan)
    if (filters.value.subscriptionStatus) params.append('subscription_status', filters.value.subscriptionStatus)
    if (pagination.value.sortField) {
      const sortOrder = pagination.value.sortOrder === 1 ? '' : '-'
      params.append('ordering', `${sortOrder}${pagination.value.sortField}`)
    }
    
    const response = await $api(`/api/v1/admin/tenants/?${params.toString()}`)
    
    tenants.value = response.results
    totalRecords.value = response.count
    
  } catch (error) {
    console.error('Failed to fetch tenants:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  pagination.value.page = 0
  fetchTenants()
}, 300)

const onPage = (event: any) => {
  pagination.value.page = event.page
  pagination.value.rows = event.rows
  fetchTenants()
}

const onSort = (event: any) => {
  pagination.value.sortField = event.sortField
  pagination.value.sortOrder = event.sortOrder
  fetchTenants()
}

const viewTenant = (tenant: Tenant) => {
  selectedTenant.value = tenant
  showTenantDialog.value = true
}

const editTenant = (tenant: Tenant) => {
  navigateTo(`/admin/tenants/${tenant.id}/edit`)
}

const getTenantActions = (tenant: Tenant) => {
  const actions = []
  
  if (tenant.status === 'active') {
    actions.push({
      label: 'Suspend',
      icon: 'pi pi-ban',
      command: () => updateTenantStatus(tenant, 'suspended')
    })
  } else if (tenant.status === 'suspended') {
    actions.push({
      label: 'Activate',
      icon: 'pi pi-check',
      command: () => updateTenantStatus(tenant, 'active')
    })
  }
  
  actions.push({
    label: 'View Users',
    icon: 'pi pi-users',
    command: () => navigateTo(`/admin/tenants/${tenant.id}/users`)
  })
  
  actions.push({
    label: 'View Subscription',
    icon: 'pi pi-credit-card',
    command: () => navigateTo(`/admin/tenants/${tenant.id}/subscription`)
  })
  
  return actions
}

const updateTenantStatus = async (tenant: Tenant, status: string) => {
  try {
    await $api(`/api/v1/admin/tenants/${tenant.id}/`, {
      method: 'PATCH',
      body: { status }
    })
    
    // Refresh the list
    fetchTenants()
    
    // Update selected tenant if it's the same
    if (selectedTenant.value?.id === tenant.id) {
      selectedTenant.value.status = status
    }
    
  } catch (error) {
    console.error('Failed to update tenant status:', error)
  }
}

// Utility functions
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'suspended': return 'danger'
    case 'pending': return 'warning'
    default: return 'info'
  }
}

const getPlanSeverity = (plan: string) => {
  switch (plan) {
    case 'enterprise': return 'success'
    case 'premium': return 'info'
    case 'basic': return 'warning'
    default: return 'secondary'
  }
}

const getSubscriptionSeverity = (status: string | null) => {
  switch (status) {
    case 'active': return 'success'
    case 'past_due': return 'danger'
    case 'trialing': return 'info'
    case 'cancelled': return 'secondary'
    default: return 'secondary'
  }
}

const getUserUsagePercentage = (tenant: Tenant) => {
  if (tenant.max_users === -1) return 0
  return Math.round((tenant.current_user_count / tenant.max_users) * 100)
}

const getEmployeeUsagePercentage = (tenant: Tenant) => {
  if (tenant.max_employees === -1) return 0
  return Math.round((tenant.current_employee_count / tenant.max_employees) * 100)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchTenants()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-progressbar) {
  height: 0.25rem;
}

:deep(.p-progressbar .p-progressbar-value) {
  transition: width 0.3s ease-in-out;
}
</style>
