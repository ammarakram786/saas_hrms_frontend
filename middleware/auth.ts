export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side for immediate redirects
  if (import.meta.client) {
    // Direct localStorage check for immediate response
    const tokens = localStorage.getItem('auth_tokens')
    const isAuthenticated = !!tokens
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return navigateTo('/auth/login')
    }
  }
})
