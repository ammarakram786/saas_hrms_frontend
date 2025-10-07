export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated using the computed getter
  if (!authStore.isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return navigateTo('/auth/login')
  }
})
