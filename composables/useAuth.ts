import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia as any)
  
  return {
    // User information
    user: computed(() => authStore.user),
    userFullName: computed(() => authStore.userFullName),
    userInitials: computed(() => authStore.userInitials),
    
    // Authentication status
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isSuperUser: computed(() => authStore.isSuperUser),
    isLoading: computed(() => authStore.isLoading),
    
    // Permissions and roles
    permissions: computed(() => authStore.permissions),
    roles: computed(() => authStore.roles),
    hasPermission: (permission: string) => authStore.hasPermission(permission),
    hasPermissions: (permissions: string[]) => authStore.hasPermissions(permissions),
    hasRole: (roleName: string) => authStore.hasRole(roleName),
    
    
    // Actions
    login: (credentials: any) => authStore.login(credentials),
    logout: () => authStore.logout(),
    register: (userData: any) => authStore.register(userData),
    refreshToken: () => authStore.refreshToken(),
    updateProfile: (profileData: any) => authStore.updateProfile(profileData),
    
    // Store access for advanced usage
    store: authStore
  }
}

// Convenience composables for specific use cases
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Redirect to login if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      navigateTo('/auth/login')
    }
  }
  
  // Redirect to dashboard if authenticated
  const requireGuest = () => {
    if (isAuthenticated.value) {
      navigateTo('/')
    }
  }
  
  return {
    requireAuth,
    requireGuest,
    isAuthenticated,
    isLoading
  }
}

// Composable for conditional rendering based on auth
export const useAuthConditional = () => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth()
  
  const showIfAuthenticated = computed(() => isAuthenticated.value)
  const showIfGuest = computed(() => !isAuthenticated.value)
  
  const showIfHasPermission = (permission: string) => computed(() => 
    isAuthenticated.value && hasPermission(permission)
  )
  
  const showIfHasRole = (role: string) => computed(() => 
    isAuthenticated.value && hasRole(role)
  )
  
  return {
    showIfAuthenticated,
    showIfGuest,
    showIfHasPermission,
    showIfHasRole
  }
}
