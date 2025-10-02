<template>
  <div class="layout-sidebar">
    <!-- Logo -->
    <div class="layout-logo">
      <div class="flex items-center space-x-3 p-4">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <i class="pi pi-users text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">HRMS</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">Human Resources</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="layout-menu">
      <PMenu :model="menuItems" class="layout-menu-container">
        <template #item="{ item, props }">
          <NuxtLink 
            v-if="item.route" 
            :to="item.route" 
            v-slot="{ isActive }"
          >
            <a 
              :href="item.route" 
              v-bind="props.action" 
              :class="[
                'flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              ]"
            >
              <i :class="[item.icon, 'text-lg']"></i>
              <span>{{ item.label }}</span>
              <PBadge 
                v-if="item.badge" 
                :value="item.badge" 
                severity="danger"
                class="ml-auto"
              />
            </a>
          </NuxtLink>
          <a 
            v-else 
            v-bind="props.action" 
            :class="[
              'flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span>{{ item.label }}</span>
            <i 
              :class="[
                'pi pi-chevron-down ml-auto transition-transform',
                item.expanded ? 'rotate-180' : ''
              ]"
            ></i>
          </a>
        </template>
      </PMenu>
    </div>

    <!-- User Profile -->
    <div class="layout-user-profile">
      <div class="flex items-center space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <PAvatar 
          :label="authStore.userInitials" 
          size="large"
          class="bg-blue-100 text-blue-600"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ authStore.userFullName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ authStore.user?.email }}
          </p>
        </div>
        <PDropdown 
          :model="userMenuItems" 
          :popup="true"
          placement="top-end"
        >
          <template #trigger>
            <Button 
              icon="pi pi-ellipsis-v" 
              text
              size="small"
              class="p-1"
            />
          </template>
        </PDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Props
interface Props {
  visible?: boolean
}

defineProps<Props>()

// Stores
const authStore = useAuthStore()

// Menu items
const menuItems = computed(() => [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    route: '/dashboard'
  },
  {
    label: 'Employees',
    icon: 'pi pi-users',
    items: [
      {
        label: 'All Employees',
        icon: 'pi pi-list',
        route: '/employees'
      },
      {
        label: 'Add Employee',
        icon: 'pi pi-user-plus',
        route: '/employees/create'
      },
      {
        label: 'Departments',
        icon: 'pi pi-building',
        route: '/employees/departments'
      }
    ]
  },
  {
    label: 'Attendance',
    icon: 'pi pi-clock',
    items: [
      {
        label: 'Attendance Records',
        icon: 'pi pi-calendar',
        route: '/attendance'
      },
      {
        label: 'Clock In/Out',
        icon: 'pi pi-play',
        route: '/attendance/clock'
      },
      {
        label: 'Shifts',
        icon: 'pi pi-calendar-times',
        route: '/attendance/shifts'
      }
    ]
  },
  {
    label: 'Leave Management',
    icon: 'pi pi-calendar-times',
    items: [
      {
        label: 'Leave Requests',
        icon: 'pi pi-list',
        route: '/leave',
        badge: authStore.hasPermission('leave.view_leave_request') ? '3' : undefined
      },
      {
        label: 'Request Leave',
        icon: 'pi pi-plus',
        route: '/leave/request'
      },
      {
        label: 'Leave Types',
        icon: 'pi pi-cog',
        route: '/leave/types'
      },
      {
        label: 'Leave Balances',
        icon: 'pi pi-wallet',
        route: '/leave/balances'
      },
      {
        label: 'Holidays',
        icon: 'pi pi-star',
        route: '/leave/holidays'
      }
    ]
  },
  {
    label: 'Payroll',
    icon: 'pi pi-dollar',
    items: [
      {
        label: 'Payroll Records',
        icon: 'pi pi-list',
        route: '/payroll'
      },
      {
        label: 'Payroll Periods',
        icon: 'pi pi-calendar',
        route: '/payroll/periods'
      },
      {
        label: 'Payroll Components',
        icon: 'pi pi-cog',
        route: '/payroll/components'
      }
    ]
  },
  {
    label: 'User Management',
    icon: 'pi pi-user-cog',
    items: [
      {
        label: 'Users',
        icon: 'pi pi-users',
        route: '/users'
      },
      {
        label: 'Roles',
        icon: 'pi pi-shield',
        route: '/users/roles'
      },
      {
        label: 'Invitations',
        icon: 'pi pi-envelope',
        route: '/users/invitations'
      }
    ]
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-bar',
    items: [
      {
        label: 'Attendance Reports',
        icon: 'pi pi-clock',
        route: '/reports/attendance'
      },
      {
        label: 'Leave Reports',
        icon: 'pi pi-calendar-times',
        route: '/reports/leave'
      },
      {
        label: 'Payroll Reports',
        icon: 'pi pi-dollar',
        route: '/reports/payroll'
      }
    ]
  },
  {
    label: 'Audit Logs',
    icon: 'pi pi-history',
    route: '/audit'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    route: '/settings'
  }
])

const userMenuItems = computed(() => [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => navigateTo('/profile')
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => navigateTo('/settings')
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => authStore.logout()
  }
])
</script>

<style scoped>
.layout-sidebar {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--surface-card) 0%, var(--surface-50) 100%);
  border-right: 1px solid var(--surface-border);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.layout-logo {
  border-bottom: 1px solid var(--surface-border);
}

.layout-menu {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.layout-menu-container {
  border: none;
  background: transparent;
}

.layout-user-profile {
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

/* Custom scrollbar */
.layout-menu::-webkit-scrollbar {
  width: 4px;
}

.layout-menu::-webkit-scrollbar-track {
  background: transparent;
}

.layout-menu::-webkit-scrollbar-thumb {
  background: var(--surface-300);
  border-radius: 2px;
}

.layout-menu::-webkit-scrollbar-thumb:hover {
  background: var(--surface-400);
}

/* Menu item hover effects */
.layout-menu-container :deep(.p-menuitem-link) {
  border-radius: 0.5rem;
  margin: 0 0.5rem;
}

.layout-menu-container :deep(.p-menuitem-link:hover) {
  background-color: var(--surface-100);
}

.layout-menu-container :deep(.p-menuitem-link.p-menuitem-link-active) {
  background-color: var(--blue-100);
  color: var(--blue-700);
}

/* Dark mode adjustments */
.dark .layout-menu-container :deep(.p-menuitem-link:hover) {
  background-color: var(--surface-800);
}

.dark .layout-menu-container :deep(.p-menuitem-link.p-menuitem-link-active) {
  background-color: var(--blue-900);
  color: var(--blue-300);
}
</style>
