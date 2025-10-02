<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>Payroll Components</h5>
          <Button label="Add Component" icon="pi pi-plus" @click="openNew" />
        </div>

        <PDataTable
          :value="payrollComponents"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="filters"
          dataKey="id"
          :loading="loading"
          :globalFilterFields="['name', 'type', 'category']"
          filterDisplay="row"
          stripedRows
          removableSort
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <PInputText v-model="filters['global'].value" placeholder="Search Components" />
              </span>
            </div>
          </template>
          <template #empty>
            No payroll components found.
          </template>
          <template #loading>
            Loading payroll components data. Please wait.
          </template>
          <PColumn field="name" header="Name" sortable></PColumn>
          <PColumn field="type" header="Type" sortable>
            <template #body="{ data }">
              <PTag :value="data.type" :severity="getComponentTypeSeverity(data.type)" />
            </template>
          </PColumn>
          <PColumn field="category" header="Category" sortable></PColumn>
          <PColumn field="is_taxable" header="Taxable" sortable>
            <template #body="{ data }">
              <PTag :value="data.is_taxable ? 'Yes' : 'No'" :severity="data.is_taxable ? 'warning' : 'success'" />
            </template>
          </PColumn>
          <PColumn field="is_mandatory" header="Mandatory" sortable>
            <template #body="{ data }">
              <PTag :value="data.is_mandatory ? 'Yes' : 'No'" :severity="data.is_mandatory ? 'danger' : 'secondary'" />
            </template>
          </PColumn>
          <PColumn field="is_active" header="Active" sortable>
            <template #body="{ data }">
              <PTag :value="data.is_active ? 'Yes' : 'No'" :severity="data.is_active ? 'success' : 'danger'" />
            </template>
          </PColumn>
          <PColumn :exportable="false" header="Actions" style="min-width:8rem">
            <template #body="{ data }">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewComponent(data)" />
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning" @click="editComponent(data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteComponent(data)" />
            </template>
          </PColumn>
        </PDataTable>

        <PDialog v-model:visible="componentDialog" :style="{width: '750px'}" header="Component Details" :modal="true" class="p-fluid">
          <PayrollComponentDetails :component="selectedComponent" v-if="selectedComponent" />
          <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          </template>
        </PDialog>

        <PDialog v-model:visible="componentFormDialog" :style="{width: '750px'}" header="Component Form" :modal="true" class="p-fluid">
          <PayrollComponentForm :component="selectedComponent" @submit="saveComponent" @cancel="hideFormDialog" />
        </PDialog>

        <PConfirmDialog></PConfirmDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { PayrollComponentService } from '~/services/api'
import type { PayrollComponent } from '~/types/hrms'
import PayrollComponentDetails from '~/components/PayrollComponentDetails.vue'
import PayrollComponentForm from '~/components/PayrollComponentForm.vue'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const confirm = useConfirm()

const payrollComponents = ref<PayrollComponent[]>([])
const componentDialog = ref(false)
const componentFormDialog = ref(false)
const selectedComponent = ref<PayrollComponent | null>(null)
const loading = ref(true)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(() => {
  fetchPayrollComponents()
})

const fetchPayrollComponents = async () => {
  loading.value = true
  try {
    const response = await PayrollComponentService.getPayrollComponents()
    payrollComponents.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch payroll components', life: 3000 })
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  selectedComponent.value = null
  componentFormDialog.value = true
}

const hideDialog = () => {
  componentDialog.value = false
  selectedComponent.value = null
}

const hideFormDialog = () => {
  componentFormDialog.value = false
  selectedComponent.value = null
}

const viewComponent = (component: PayrollComponent) => {
  selectedComponent.value = { ...component }
  componentDialog.value = true
}

const editComponent = (component: PayrollComponent) => {
  selectedComponent.value = { ...component }
  componentFormDialog.value = true
}

const saveComponent = async (componentData: PayrollComponent) => {
  try {
    if (componentData.id) {
      await PayrollComponentService.updatePayrollComponent(componentData.id, componentData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Component Updated', life: 3000 })
    } else {
      await PayrollComponentService.createPayrollComponent(componentData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Component Created', life: 3000 })
    }
    hideFormDialog()
    await fetchPayrollComponents()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save component', life: 3000 })
  }
}

const confirmDeleteComponent = (component: PayrollComponent) => {
  confirm.require({
    message: `Are you sure you want to delete ${component.name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await PayrollComponentService.deletePayrollComponent(component.id!)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Component Deleted', life: 3000 })
        await fetchPayrollComponents()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete component', life: 3000 })
      }
    }
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
