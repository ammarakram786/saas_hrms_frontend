export default defineNuxtRouteMiddleware((to, from) => {
  
  
  const authStore = useAuthStore()
  
  // Define authentication routes
  const authRoutes = ['/auth/login']
  const isAuthRoute = authRoutes.includes(to.path)
  const isProtectedRoute = !isAuthRoute
  
  // Check authentication status
  const isAuthenticated = authStore.isAuthenticated
  
  
  // Redirect to login if trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return navigateTo('/auth/login')
  }
  
  // Redirect to home if trying to access auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    console.log('Authenticated, redirecting to home')
    return navigateTo('/')
  }
  
  console.log('Auth middleware done')
})
