<template>
  <div class="layout-wrapper" :class="containerClass">
    <!-- App Topbar -->
    <AppTopbar @menu-toggle="onMenuToggle" />
    
    <!-- App Sidebar -->
    <div class="layout-sidebar" :class="sidebarClass">
      <AppSidebar :visible="staticMenuMobileActive" />
    </div>
    
    <!-- App Main -->
    <div class="layout-main-container">
      <div class="layout-main">
        <slot />
      </div>
      
      <!-- App Footer -->
      <AppFooter />
    </div>
    
    <!-- App Config -->
    <AppConfig />
    
    <!-- Overlay -->
    <div 
      class="layout-mask" 
      :class="maskClass" 
      @click="onMaskClick"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLayout } from '~/composables/layout'

const { layoutConfig, layoutState, isSidebarActive, isSidebarVisible, isMobile, isDesktop } = useLayout()

const staticMenuMobileActive = ref(false)

const containerClass = computed(() => {
  return {
    'layout-static': layoutConfig.value.menuMode === 'static',
    'layout-overlay': layoutConfig.value.menuMode === 'overlay',
    'layout-slim': layoutConfig.value.menuMode === 'slim',
    'layout-horizontal': layoutConfig.value.menuMode === 'horizontal',
    'layout-slim-plus': layoutConfig.value.menuMode === 'slim-plus',
    'layout-static-inactive': layoutConfig.value.menuMode === 'static' && !layoutState.value.staticMenuDesktopInactive,
    'layout-overlay-active': layoutState.value.overlayMenuActive,
    'layout-mobile-active': layoutState.value.staticMenuMobileActive,
    'p-input-filled': layoutConfig.value.inputStyle === 'filled',
    'p-ripple-disabled': !layoutConfig.value.ripple,
    'layout-theme-light': layoutConfig.value.colorScheme === 'light',
    'layout-theme-dark': layoutConfig.value.colorScheme === 'dark'
  }
})

const sidebarClass = computed(() => {
  return {
    'layout-sidebar-dark': layoutConfig.value.menuTheme === 'dark',
    'layout-sidebar-light': layoutConfig.value.menuTheme === 'light'
  }
})

const maskClass = computed(() => {
  return {
    'layout-mask-sidebar': layoutConfig.value.menuMode === 'overlay',
    'layout-mask-mobile': layoutConfig.value.menuMode === 'static'
  }
})

const onMenuToggle = () => {
  if (isMobile.value) {
    staticMenuMobileActive.value = !staticMenuMobileActive.value
  }
}

const onMaskClick = () => {
  if (isMobile.value) {
    staticMenuMobileActive.value = false
  }
}

onMounted(() => {
  if (isMobile.value) {
    staticMenuMobileActive.value = false
  }
})
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
}

.layout-sidebar {
  position: fixed;
  width: 300px;
  height: 100vh;
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 0;
  transition: transform 0.2s, left 0.2s;
  background-color: var(--surface-card);
  border-right: 1px solid var(--surface-border);
}

.layout-main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  padding-left: 300px;
  transition: margin-left 0.2s;
}

.layout-main {
  flex: 1 1 auto;
  padding: 2rem;
}

.layout-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: var(--maskbg);
}

/* Mobile */
@media screen and (max-width: 991px) {
  .layout-main-container {
    margin-left: 0;
    padding-left: 0;
  }

  .layout-sidebar {
    transform: translateX(-100%);
    left: 0;
  }

  .layout-mask-mobile {
    display: block;
  }

  .layout-mobile-active .layout-sidebar {
    transform: translateX(0);
  }
}

/* Desktop */
@media screen and (min-width: 992px) {
  .layout-sidebar {
    transform: translateX(0);
  }

  .layout-mask-sidebar {
    display: none;
  }
}
</style>
