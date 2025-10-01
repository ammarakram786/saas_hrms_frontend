<template>
  <div class="layout-config">
    <PButton 
      type="button" 
      class="p-link layout-config-button"
      @click="onConfigButtonClick"
    >
      <i class="pi pi-cog"></i>
    </PButton>

    <PSidebar 
      v-model:visible="configSidebarVisible" 
      position="right" 
      class="layout-config-sidebar"
    >
      <div class="layout-config-content">
        <h5>Configuration</h5>
        
        <div class="config-section">
          <h6>Menu Mode</h6>
          <PDropdown 
            v-model="layoutConfig.menuMode" 
            :options="menuModeOptions" 
            optionLabel="label" 
            optionValue="value"
            @change="onMenuModeChange"
          />
        </div>

        <div class="config-section">
          <h6>Input Style</h6>
          <PDropdown 
            v-model="layoutConfig.inputStyle" 
            :options="inputStyleOptions" 
            optionLabel="label" 
            optionValue="value"
            @change="onInputStyleChange"
          />
        </div>

        <div class="config-section">
          <h6>Ripple Effect</h6>
          <PInputSwitch v-model="layoutConfig.ripple" @change="onRippleChange" />
        </div>

        <div class="config-section">
          <h6>Color Scheme</h6>
          <PDropdown 
            v-model="layoutConfig.colorScheme" 
            :options="colorSchemeOptions" 
            optionLabel="label" 
            optionValue="value"
            @change="onColorSchemeChange"
          />
        </div>
      </div>
    </PSidebar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLayout } from '~/composables/layout'

const { layoutConfig, changeThemeSettings } = useLayout()

const configSidebarVisible = ref(false)

const menuModeOptions = [
  { label: 'Static', value: 'static' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Slim', value: 'slim' },
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Slim Plus', value: 'slim-plus' }
]

const inputStyleOptions = [
  { label: 'Outlined', value: 'outlined' },
  { label: 'Filled', value: 'filled' }
]

const colorSchemeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const onConfigButtonClick = () => {
  configSidebarVisible.value = true
}

const onMenuModeChange = () => {
  // Handle menu mode change
}

const onInputStyleChange = () => {
  // Handle input style change
}

const onRippleChange = () => {
  // Handle ripple change
}

const onColorSchemeChange = () => {
  changeThemeSettings('sakai', layoutConfig.value.colorScheme)
}
</script>

<style scoped>
.layout-config {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 996;
  transform: translateY(-50%);
}

.layout-config-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border-radius: 50% 0 0 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.layout-config-button:hover {
  background-color: var(--primary-600);
  transform: translateX(-0.25rem);
}

.layout-config-content {
  padding: 1.5rem;
}

.config-section {
  margin-bottom: 2rem;
}

.config-section h6 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 600;
}

:deep(.p-sidebar) {
  width: 20rem;
}

:deep(.p-sidebar .p-sidebar-header) {
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
}

:deep(.p-sidebar .p-sidebar-content) {
  padding: 0;
}
</style>
