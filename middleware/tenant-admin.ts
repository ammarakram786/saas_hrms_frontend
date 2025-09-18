export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Superusers should use admin interface
  if (authStore.isSuperUser) {
    return navigateTo('/admin/dashboard')
  }
  
  // Check if user has tenant admin role or is staff
  if (!authStore.hasRole('tenant_admin') && !authStore.user?.is_staff) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Tenant administrator privileges required.'
    })
  }
  
  // Check if tenant context exists
  if (!authStore.tenant) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tenant context required. Please contact your administrator.'
    })
  }
})
