export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side for immediate redirects
  if (import.meta.client) {
    // Direct localStorage check for immediate response
    const tokens = localStorage.getItem('auth_tokens')
    const isAuthenticated = !!tokens
    
    // Define routes
    const authRoutes = ['/auth/login', '/auth/access', '/auth/register']
    const isAuthRoute = authRoutes.includes(to.path)
    const isProtectedRoute = !isAuthRoute
    
    // Instant redirect logic
    if (isProtectedRoute && !isAuthenticated) {
      return navigateTo('/auth/login')
    }
    
    if (isAuthRoute && isAuthenticated) {
      return navigateTo('/')
    }
  }
})
