<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
          <h5>Leave Balance</h5>
          <div class="flex gap-2">
            <Button 
              label="Refresh" 
              icon="pi pi-refresh" 
              @click="fetchLeaveBalances"
              :loading="loading"
            />
            <Button 
              label="Add Balance" 
              icon="pi pi-plus" 
              @click="openNew"
            />
          </div>
        </div>

        <PDataTable
          :value="leaveBalances"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          v-model:filters="filters"
          dataKey="id"
          :loading="loading"
          :globalFilterFields="['employee_name', 'leave_type_name']"
          filterDisplay="row"
          stripedRows
          removableSort
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <PInputText v-model="filters['global'].value" placeholder="Search Leave Balances" />
              </span>
            </div>
          </template>
          <template #empty>
            No leave balances found.
          </template>
          <template #loading>
            Loading leave balances data. Please wait.
          </template>
          <PColumn field="employee_name" header="Employee" sortable></PColumn>
          <PColumn field="leave_type_name" header="Leave Type" sortable></PColumn>
          <PColumn field="total_days" header="Total Days" sortable>
            <template #body="{ data }">
              <span class="font-semibold">{{ data.total_days }}</span>
            </template>
          </PColumn>
          <PColumn field="used_days" header="Used Days" sortable>
            <template #body="{ data }">
              <span class="text-orange-500">{{ data.used_days }}</span>
            </template>
          </PColumn>
          <PColumn field="remaining_days" header="Remaining Days" sortable>
            <template #body="{ data }">
              <span class="text-green-500 font-semibold">{{ data.remaining_days }}</span>
            </template>
          </PColumn>
          <PColumn field="year" header="Year" sortable></PColumn>
          <PColumn :exportable="false" header="Actions" style="min-width:8rem">
            <template #body="{ data }">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewBalance(data)" />
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-warning" @click="editBalance(data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteBalance(data)" />
            </template>
          </PColumn>
        </PDataTable>

        <PDialog v-model:visible="balanceDialog" :style="{width: '750px'}" header="Leave Balance Details" :modal="true" class="p-fluid">
          <LeaveBalanceDetails :balance="selectedBalance" v-if="selectedBalance" />
          <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          </template>
        </PDialog>

        <PDialog v-model:visible="balanceFormDialog" :style="{width: '750px'}" header="Leave Balance Form" :modal="true" class="p-fluid">
          <LeaveBalanceForm :balance="selectedBalance" @submit="saveBalance" @cancel="hideFormDialog" />
        </PDialog>

        <PConfirmDialog></PConfirmDialog>
      </div>
    </div>

    <!-- Leave Balance Summary Cards -->
    <div class="col-12">
      <div class="card">
        <h5>Leave Balance Summary</h5>
        <div class="grid">
          <div v-for="balance in leaveBalances" :key="balance.id" class="col-12 md:col-6 lg:col-4">
            <div class="border-1 surface-border border-round p-3">
              <div class="flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="mb-1">{{ balance.employee_name }}</h6>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-0">{{ balance.leave_type_name }}</p>
                </div>
                <PTag :value="balance.year" severity="info" />
              </div>
              <div class="grid">
                <div class="col-4 text-center">
                  <div class="text-2xl font-bold text-blue-500">{{ balance.total_days }}</div>
                  <div class="text-xs text-gray-500">Total</div>
                </div>
                <div class="col-4 text-center">
                  <div class="text-2xl font-bold text-orange-500">{{ balance.used_days }}</div>
                  <div class="text-xs text-gray-500">Used</div>
                </div>
                <div class="col-4 text-center">
                  <div class="text-2xl font-bold text-green-500">{{ balance.remaining_days }}</div>
                  <div class="text-xs text-gray-500">Remaining</div>
                </div>
              </div>
              <div class="mt-3">
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: `${(balance.remaining_days / balance.total_days) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { LeaveBalanceService } from '~/services/api'
import type { LeaveBalance } from '~/types/hrms'
import LeaveBalanceDetails from '~/components/LeaveBalanceDetails.vue'
import LeaveBalanceForm from '~/components/LeaveBalanceForm.vue'

definePageMeta({
  middleware: 'auth'
})

const toast = useToast()
const confirm = useConfirm()

const leaveBalances = ref<LeaveBalance[]>([])
const balanceDialog = ref(false)
const balanceFormDialog = ref(false)
const selectedBalance = ref<LeaveBalance | null>(null)
const loading = ref(true)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(() => {
  fetchLeaveBalances()
})

const fetchLeaveBalances = async () => {
  loading.value = true
  try {
    const response = await LeaveBalanceService.getLeaveBalances()
    leaveBalances.value = response.results
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch leave balances', life: 3000 })
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  selectedBalance.value = null
  balanceFormDialog.value = true
}

const hideDialog = () => {
  balanceDialog.value = false
  selectedBalance.value = null
}

const hideFormDialog = () => {
  balanceFormDialog.value = false
  selectedBalance.value = null
}

const viewBalance = (balance: LeaveBalance) => {
  selectedBalance.value = { ...balance }
  balanceDialog.value = true
}

const editBalance = (balance: LeaveBalance) => {
  selectedBalance.value = { ...balance }
  balanceFormDialog.value = true
}

const saveBalance = async (balanceData: LeaveBalance) => {
  try {
    if (balanceData.id) {
      await LeaveBalanceService.updateLeaveBalance(balanceData.id, balanceData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Leave Balance Updated', life: 3000 })
    } else {
      await LeaveBalanceService.createLeaveBalance(balanceData)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Leave Balance Created', life: 3000 })
    }
    hideFormDialog()
    await fetchLeaveBalances()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save leave balance', life: 3000 })
  }
}

const confirmDeleteBalance = (balance: LeaveBalance) => {
  confirm.require({
    message: `Are you sure you want to delete this leave balance for ${balance.employee_name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await LeaveBalanceService.deleteLeaveBalance(balance.id!)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Leave Balance Deleted', life: 3000 })
        await fetchLeaveBalances()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete leave balance', life: 3000 })
      }
    }
  })
}
</script>
