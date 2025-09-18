export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Check if user is superuser
  if (!authStore.isSuperUser) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Superuser privileges required.'
    })
  }
})
