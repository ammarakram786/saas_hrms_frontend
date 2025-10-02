<template>
  <footer class="layout-footer">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © {{ currentYear }} HRMS. All rights reserved.
        </p>
        <div class="flex items-center space-x-4 text-sm">
          <a 
            href="#" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <i class="pi pi-circle-fill text-green-500 text-xs"></i>
          <span>System Status: Online</span>
        </div>
        
        <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <i class="pi pi-clock"></i>
          <span>{{ currentTime }}</span>
        </div>
        
        <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <i class="pi pi-info-circle"></i>
          <span>v{{ appVersion }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// State
const currentTime = ref('')
const currentYear = ref(new Date().getFullYear())
const appVersion = ref('1.0.0')

let timeInterval: NodeJS.Timeout | null = null

// Methods
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.layout-footer {
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .layout-footer {
    flex-direction: column;
    align-items: flex-start;
    space-y: 1rem;
  }
  
  .layout-footer > div {
    width: 100%;
    justify-content: space-between;
  }
  
  .layout-footer .flex.items-center.space-x-4 {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
