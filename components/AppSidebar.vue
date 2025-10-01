<template>
  <div class="layout-sidebar">
    <div class="layout-sidebar-header">
      <NuxtLink to="/dashboard" class="layout-sidebar-logo">
        <img src="/images/logo-dark.svg" alt="logo" height="32" />
        <span>HRMS</span>
      </NuxtLink>
    </div>

    <div class="layout-sidebar-content">
      <PMenu :model="menuItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const authStore = useAuthStore()

const menuItems = computed(() => [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/dashboard'
  },
  {
    label: 'Employee Management',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Employees',
        icon: 'pi pi-users',
        to: '/employees',
        visible: authStore.hasPermission('employee.view')
      },
      {
        label: 'Departments',
        icon: 'pi pi-building',
        to: '/departments',
        visible: authStore.hasPermission('department.view')
      },
      {
        label: 'Organization Chart',
        icon: 'pi pi-sitemap',
        to: '/organization',
        visible: authStore.hasPermission('employee.view')
      }
    ],
    visible: authStore.hasPermission('employee.view')
  },
  {
    label: 'Attendance',
    icon: 'pi pi-clock',
    items: [
      {
        label: 'Attendance Records',
        icon: 'pi pi-clock',
        to: '/attendance',
        visible: authStore.hasPermission('attendance.view')
      },
      {
        label: 'Clock In/Out',
        icon: 'pi pi-play',
        to: '/attendance/clock',
        visible: authStore.hasPermission('attendance.clock')
      },
      {
        label: 'Attendance Reports',
        icon: 'pi pi-chart-bar',
        to: '/attendance/reports',
        visible: authStore.hasPermission('attendance.view')
      }
    ],
    visible: authStore.hasPermission('attendance.view')
  },
  {
    label: 'Leave Management',
    icon: 'pi pi-calendar',
    items: [
      {
        label: 'Leave Requests',
        icon: 'pi pi-calendar-plus',
        to: '/leave/requests',
        visible: authStore.hasPermission('leave.view')
      },
      {
        label: 'Leave Balance',
        icon: 'pi pi-calendar-minus',
        to: '/leave/balance',
        visible: authStore.hasPermission('leave.view')
      },
      {
        label: 'Leave Types',
        icon: 'pi pi-cog',
        to: '/leave/types',
        visible: authStore.hasPermission('leave.manage')
      }
    ],
    visible: authStore.hasPermission('leave.view')
  },
  {
    label: 'Payroll',
    icon: 'pi pi-wallet',
    items: [
      {
        label: 'Payroll Records',
        icon: 'pi pi-wallet',
        to: '/payroll',
        visible: authStore.hasPermission('payroll.view')
      },
      {
        label: 'Payroll Periods',
        icon: 'pi pi-calendar',
        to: '/payroll/periods',
        visible: authStore.hasPermission('payroll.manage')
      },
      {
        label: 'Payslips',
        icon: 'pi pi-file-pdf',
        to: '/payroll/payslips',
        visible: authStore.hasPermission('payroll.view')
      }
    ],
    visible: authStore.hasPermission('payroll.view')
  },
  {
    label: 'User Management',
    icon: 'pi pi-user-plus',
    items: [
      {
        label: 'Users',
        icon: 'pi pi-users',
        to: '/users',
        visible: authStore.hasPermission('user.view')
      },
      {
        label: 'Roles',
        icon: 'pi pi-shield',
        to: '/users/roles',
        visible: authStore.hasPermission('role.view')
      },
      {
        label: 'Invitations',
        icon: 'pi pi-envelope',
        to: '/users/invitations',
        visible: authStore.hasPermission('invitation.view')
      }
    ],
    visible: authStore.hasPermission('user.view')
  },
  {
    label: 'Reports & Analytics',
    icon: 'pi pi-chart-line',
    items: [
      {
        label: 'Dashboard Analytics',
        icon: 'pi pi-chart-pie',
        to: '/reports/analytics',
        visible: authStore.hasPermission('report.view')
      },
      {
        label: 'Employee Reports',
        icon: 'pi pi-users',
        to: '/reports/employees',
        visible: authStore.hasPermission('report.view')
      },
      {
        label: 'Attendance Reports',
        icon: 'pi pi-clock',
        to: '/reports/attendance',
        visible: authStore.hasPermission('report.view')
      },
      {
        label: 'Payroll Reports',
        icon: 'pi pi-wallet',
        to: '/reports/payroll',
        visible: authStore.hasPermission('report.view')
      }
    ],
    visible: authStore.hasPermission('report.view')
  },
  {
    label: 'Audit & Logs',
    icon: 'pi pi-history',
    to: '/audit',
    visible: authStore.hasPermission('audit.view')
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'System Settings',
        icon: 'pi pi-cog',
        to: '/settings/system',
        visible: authStore.hasPermission('settings.view')
      },
      {
        label: 'Company Settings',
        icon: 'pi pi-building',
        to: '/settings/company',
        visible: authStore.hasPermission('settings.view')
      },
      {
        label: 'Holiday Calendar',
        icon: 'pi pi-calendar',
        to: '/settings/holidays',
        visible: authStore.hasPermission('settings.view')
      }
    ],
    visible: authStore.hasPermission('settings.view')
  }
].filter(item => item.visible !== false))
</script>

<style scoped>
.layout-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.layout-sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.layout-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.25rem;
}

.layout-sidebar-content {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

:deep(.p-menu) {
  border: none;
  background: transparent;
  width: 100%;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.75rem 1rem;
  border-radius: 0;
  color: var(--text-color);
  transition: all 0.2s;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background-color: var(--surface-hover);
  color: var(--text-color);
}

:deep(.p-menu .p-menuitem-link.router-link-active) {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

:deep(.p-menu .p-submenu-header) {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.p-menu .p-submenu-list) {
  padding: 0;
  background: transparent;
}

:deep(.p-menu .p-submenu-list .p-menuitem-link) {
  padding-left: 2.5rem;
  font-size: 0.875rem;
}

:deep(.p-menu .p-menuitem-icon) {
  margin-right: 0.5rem;
  width: 1rem;
  text-align: center;
}

:deep(.p-menu .p-menuitem-text) {
  flex: 1;
}

:deep(.p-menu .p-submenu-icon) {
  margin-left: auto;
  transition: transform 0.2s;
}

:deep(.p-menu .p-submenu-expanded .p-submenu-icon) {
  transform: rotate(90deg);
}
</style>
