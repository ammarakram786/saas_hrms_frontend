<template>
  <div class="layout-topbar">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Left side -->
      <div class="flex items-center space-x-4">
        <!-- Menu toggle button -->
        <Button 
          icon="pi pi-bars" 
          text
          @click="$emit('menu-toggle')"
          class="p-2"
        />

        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm">
          <NuxtLink 
            to="/dashboard" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="pi pi-home mr-1"></i>
            Dashboard
          </NuxtLink>
          <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
          <span class="text-gray-900 dark:text-white font-medium">{{ currentPageTitle }}</span>
        </nav>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="hidden md:block">
          <div class="p-input-icon-left">
            <i class="pi pi-search" />
            <PInputText 
              v-model="searchQuery" 
              placeholder="Search..."
              class="w-64"
              @keyup.enter="onSearch"
            />
          </div>
        </div>

        <!-- Notifications -->
        <PDropdown 
          :model="notificationItems" 
          :popup="true"
          placement="bottom-end"
          class="notification-dropdown"
        >
          <template #trigger>
            <Button 
              icon="pi pi-bell" 
              text
              class="relative"
            >
              <PBadge 
                v-if="unreadNotifications > 0" 
                :value="unreadNotifications" 
                severity="danger"
                class="absolute -top-1 -right-1"
              />
            </Button>
          </template>
        </PDropdown>

        <!-- Messages -->
        <PDropdown 
          :model="messageItems" 
          :popup="true"
          placement="bottom-end"
          class="message-dropdown"
        >
          <template #trigger>
            <Button 
              icon="pi pi-envelope" 
              text
              class="relative"
            >
              <PBadge 
                v-if="unreadMessages > 0" 
                :value="unreadMessages" 
                severity="danger"
                class="absolute -top-1 -right-1"
              />
            </Button>
          </template>
        </PDropdown>

        <!-- Theme toggle -->
        <Button 
          :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" 
          text
          @click="toggleTheme"
          v-tooltip.top="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        />

        <!-- User menu -->
        <PDropdown 
          :model="userMenuItems" 
          :popup="true"
          placement="bottom-end"
          class="user-dropdown"
        >
          <template #trigger>
            <div class="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
              <PAvatar 
                :label="authStore.userInitials" 
                size="normal"
                class="bg-blue-100 text-blue-600"
              />
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ authStore.userFullName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ authStore.user?.email }}
                </p>
              </div>
              <i class="pi pi-chevron-down text-gray-400 text-xs"></i>
            </div>
          </template>
        </PDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Props
interface Props {
  visible?: boolean
}

defineProps<Props>()

// Emits
defineEmits<{
  'menu-toggle': []
}>()

// Stores
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const isDarkMode = ref(false)
const unreadNotifications = ref(3)
const unreadMessages = ref(1)

// Computed
const currentPageTitle = computed(() => {
  const route = useRoute()
  const path = route.path
  
  // Map routes to page titles
  const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/employees': 'Employees',
    '/employees/create': 'Add Employee',
    '/employees/departments': 'Departments',
    '/attendance': 'Attendance',
    '/attendance/clock': 'Clock In/Out',
    '/attendance/shifts': 'Shifts',
    '/leave': 'Leave Requests',
    '/leave/request': 'Request Leave',
    '/leave/types': 'Leave Types',
    '/leave/balances': 'Leave Balances',
    '/leave/holidays': 'Holidays',
    '/payroll': 'Payroll',
    '/payroll/periods': 'Payroll Periods',
    '/payroll/components': 'Payroll Components',
    '/users': 'Users',
    '/users/roles': 'Roles',
    '/users/invitations': 'Invitations',
    '/reports/attendance': 'Attendance Reports',
    '/reports/leave': 'Leave Reports',
    '/reports/payroll': 'Payroll Reports',
    '/audit': 'Audit Logs',
    '/settings': 'Settings',
    '/profile': 'Profile'
  }
  
  return titleMap[path] || 'Page'
})

// Menu items
const notificationItems = computed(() => [
  {
    label: 'Notifications',
    items: [
      {
        label: 'New leave request from John Doe',
        icon: 'pi pi-calendar-times',
        command: () => navigateTo('/leave')
      },
      {
        label: 'Attendance report is ready',
        icon: 'pi pi-chart-bar',
        command: () => navigateTo('/reports/attendance')
      },
      {
        label: 'System maintenance scheduled',
        icon: 'pi pi-cog',
        command: () => navigateTo('/settings')
      }
    ]
  },
  {
    separator: true
  },
  {
    label: 'View All Notifications',
    icon: 'pi pi-eye',
    command: () => navigateTo('/notifications')
  }
])

const messageItems = computed(() => [
  {
    label: 'Messages',
    items: [
      {
        label: 'Sarah Wilson',
        icon: 'pi pi-user',
        command: () => console.log('Open message')
      },
      {
        label: 'Mike Johnson',
        icon: 'pi pi-user',
        command: () => console.log('Open message')
      }
    ]
  },
  {
    separator: true
  },
  {
    label: 'View All Messages',
    icon: 'pi pi-envelope',
    command: () => navigateTo('/messages')
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
    label: 'Help & Support',
    icon: 'pi pi-question-circle',
    command: () => console.log('Help')
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

// Methods
const onSearch = () => {
  if (searchQuery.value.trim()) {
    // TODO: Implement global search
    console.log('Searching for:', searchQuery.value)
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // TODO: Implement theme toggle
  console.log('Toggle theme:', isDarkMode.value ? 'dark' : 'light')
}

// Lifecycle
onMounted(() => {
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>

<style scoped>
.layout-topbar {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.notification-dropdown,
.message-dropdown,
.user-dropdown {
  min-width: 300px;
}

/* Custom dropdown styles */
:deep(.p-dropdown-panel) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--surface-border);
}

:deep(.p-menuitem-content) {
  padding: 0.75rem 1rem;
}

:deep(.p-menuitem-content:hover) {
  background-color: var(--surface-100);
}

.dark :deep(.p-menuitem-content:hover) {
  background-color: var(--surface-800);
}

/* Search input */
:deep(.p-inputtext) {
  border-radius: 0.5rem;
  border: 1px solid var(--surface-300);
}

:deep(.p-inputtext:focus) {
  border-color: var(--blue-500);
  box-shadow: 0 0 0 1px var(--blue-500);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .layout-topbar {
    padding: 0.5rem 1rem;
  }
  
  .hidden.md\\:block {
    display: none;
  }
}
</style>
