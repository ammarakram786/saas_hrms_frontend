export default defineNuxtPlugin((nuxtApp) => {
  // v-can directive for permission-based UI controls
  nuxtApp.vueApp.directive('can', {
    mounted(el: HTMLElement, binding) {
      const authStore = useAuthStore()
      
      if (!checkPermission(binding.value, authStore)) {
        el.style.display = 'none'
        el.setAttribute('disabled', 'true')
      }
    },
    
    updated(el: HTMLElement, binding) {
      const authStore = useAuthStore()
      
      if (!checkPermission(binding.value, authStore)) {
        el.style.display = 'none'
        el.setAttribute('disabled', 'true')
      } else {
        el.style.display = ''
        el.removeAttribute('disabled')
      }
    }
  })
  
  // v-role directive for role-based UI controls
  nuxtApp.vueApp.directive('role', {
    mounted(el: HTMLElement, binding) {
      const authStore = useAuthStore()
      
      if (!checkRole(binding.value, authStore)) {
        el.style.display = 'none'
      }
    },
    
    updated(el: HTMLElement, binding) {
      const authStore = useAuthStore()
      
      if (!checkRole(binding.value, authStore)) {
        el.style.display = 'none'
      } else {
        el.style.display = ''
      }
    }
  })
})

function checkPermission(permission: string | string[], authStore: any): boolean {
  if (!authStore.isAuthenticated) return false
  
  if (typeof permission === 'string') {
    return authStore.hasPermission(permission)
  }
  
  if (Array.isArray(permission)) {
    return authStore.hasPermissions(permission)
  }
  
  return false
}

function checkRole(role: string | string[], authStore: any): boolean {
  if (!authStore.isAuthenticated) return false
  
  if (typeof role === 'string') {
    return authStore.hasRole(role)
  }
  
  if (Array.isArray(role)) {
    return role.some(r => authStore.hasRole(r))
  }
  
  return false
}
