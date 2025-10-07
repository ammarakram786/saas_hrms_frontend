import { defineStore } from 'pinia'
import type { User, AuthTokens, LoginCredentials } from '~/types/auth'
import { authService } from '~/services/authService'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: () => {
      const token = useCookie('auth_token')
      return !!token.value
    },
    
    userInitials: (state) => {
      if (!state.user) return ''
      const firstInitial = state.user.first_name?.charAt(0) || ''
      const lastInitial = state.user.last_name?.charAt(0) || ''
      return (firstInitial + lastInitial).toUpperCase()
    },
    
    userFullName: (state) => {
      if (!state.user) return ''
      return `${state.user.first_name} ${state.user.last_name}`.trim()
    }
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true

      try {
        const response = await authService.login(credentials)

        this.tokens = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          token_type: response.token_type,
          expires_in: response.expires_in
        }

        this.user = response.user

        // Store auth token in cookie for SSR
        useCookie('auth_token').value = response.access_token
        useCookie('refresh_token').value = response.refresh_token

        // Small delay to ensure cookies are properly set
        await new Promise(resolve => setTimeout(resolve, 100))

        return response
      } catch (error: any) {
        // Error is already handled by the API client error handler
        // Just re-throw to maintain error chain
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async refresh() {
      const refreshToken = this.tokens?.refresh_token || useCookie('refresh_token').value
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      this.isLoading = true

      try {
        const response = await authService.refreshToken(refreshToken)

        this.tokens = {
          access_token: response.access_token,
          refresh_token: this.tokens?.refresh_token || refreshToken,
          token_type: this.tokens?.token_type || 'Bearer',
          expires_in: response.expires_in
        }

        // Update stored token in cookie
        useCookie('auth_token').value = response.access_token

        return response
      } catch (error: any) {
        // If refresh fails, logout user
        this.logout()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.tokens = null
      
      // Clear cookies
      useCookie('auth_token').value = null
      useCookie('refresh_token').value = null
      
      // Redirect to login
      navigateTo('/login')
    },

    initializeAuth() {
      try {
        const authToken = useCookie('auth_token').value
        const refreshToken = useCookie('refresh_token').value
        
        if (authToken && refreshToken) {
          this.tokens = {
            access_token: authToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            expires_in: 3600 // Default, will be updated on next API call
          }
        }
      } catch (error) {
        console.error('Error initializing auth from cookies:', error)
        this.logout()
      }
    }
  }
})
