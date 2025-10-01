<template>
  <div class="layout-topbar">
    <div class="topbar-start">
      <button 
        type="button" 
        class="p-link layout-menu-button layout-topbar-button"
        @click="onMenuToggle"
      >
        <i class="pi pi-bars"></i>
      </button>

      <NuxtLink to="/dashboard" class="layout-topbar-logo">
        <img src="/images/logo-dark.svg" alt="logo" height="32" />
        <span>HRMS</span>
      </NuxtLink>
    </div>

    <div class="topbar-end">
      <div class="topbar-menu">
        <!-- Search -->
        <div class="topbar-search">
          <div class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <PInputText 
              v-model="searchValue" 
              placeholder="Search..." 
              class="w-20rem sm:w-auto"
            />
          </div>
        </div>

        <!-- Notifications -->
        <PButton 
          type="button" 
          class="p-link layout-topbar-button"
          @click="onNotificationClick"
        >
          <i class="pi pi-bell"></i>
          <PBadge v-if="notifications.length > 0" :value="notifications.length" severity="danger" />
        </PButton>

        <!-- User Menu -->
        <div class="topbar-user-menu">
          <PButton 
            type="button" 
            class="p-link layout-topbar-button"
            @click="onUserMenuClick"
          >
            <PAvatar 
              :label="authStore.userInitials" 
              shape="circle" 
              size="normal"
              class="mr-2"
            />
            <span class="ml-2">{{ authStore.userFullName }}</span>
            <i class="pi pi-chevron-down ml-2"></i>
          </PButton>

          <POverlayPanel 
            ref="userMenuOverlay" 
            :showCloseIcon="false"
            class="layout-user-menu"
          >
            <div class="user-menu-header">
              <div class="user-menu-info">
                <div class="user-menu-name">{{ authStore.userFullName }}</div>
                <div class="user-menu-email">{{ authStore.user?.email }}</div>
              </div>
            </div>

            <div class="user-menu-content">
              <NuxtLink to="/profile" class="user-menu-item">
                <i class="pi pi-user"></i>
                <span>Profile</span>
              </NuxtLink>
              
              <NuxtLink to="/settings" class="user-menu-item">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
              </NuxtLink>
              
              <div class="user-menu-divider"></div>
              
              <button @click="logout" class="user-menu-item">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
              </button>
            </div>
          </POverlayPanel>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['menu-toggle'])

const authStore = useAuthStore()
const toast = useToast()

const searchValue = ref('')
const userMenuOverlay = ref()
const notifications = ref([
  { id: 1, message: 'New employee added', time: '2 hours ago' },
  { id: 2, message: 'Leave request pending approval', time: '4 hours ago' },
  { id: 3, message: 'Payroll processed', time: '1 day ago' }
])

const onMenuToggle = () => {
  emit('menu-toggle')
}

const onNotificationClick = () => {
  // Handle notification click
  toast.add({
    severity: 'info',
    summary: 'Notifications',
    detail: 'You have ' + notifications.value.length + ' new notifications',
    life: 3000
  })
}

const onUserMenuClick = (event: Event) => {
  userMenuOverlay.value.toggle(event)
}

const logout = () => {
  userMenuOverlay.value.hide()
  authStore.logout()
}
</script>

<style scoped>
.layout-topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 997;
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  padding: 0 2rem;
}

.topbar-start {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.layout-menu-button {
  display: none;
}

.layout-topbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--text-color);
  border-radius: 50%;
  transition: background-color 0.2s;
}

.layout-topbar-button:hover {
  background-color: var(--surface-hover);
}

.layout-topbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.25rem;
}

.topbar-end {
  margin-left: auto;
}

.topbar-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-search {
  display: none;
}

.user-menu-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.user-menu-info {
  text-align: center;
}

.user-menu-name {
  font-weight: 600;
  color: var(--text-color);
}

.user-menu-email {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.user-menu-content {
  padding: 0.5rem 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.user-menu-item:hover {
  background-color: var(--surface-hover);
}

.user-menu-divider {
  height: 1px;
  background-color: var(--surface-border);
  margin: 0.5rem 0;
}

/* Mobile */
@media screen and (max-width: 991px) {
  .layout-menu-button {
    display: flex;
  }
  
  .topbar-search {
    display: none;
  }
}

/* Desktop */
@media screen and (min-width: 992px) {
  .topbar-search {
    display: block;
  }
}
</style>
