import { defineStore } from 'pinia'
import jwtDecode from 'jwt-decode'
import type { User, AuthTokens, LoginCredentials } from '~/types/auth'
import { authService } from '~/services/authService'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  permissions: string[]
  roles: any[]
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    permissions: [],
    roles: [],
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.tokens?.access_token,
    isSuperUser: (state) => state.user?.is_superuser || false,
    
    hasPermission: (state) => (permission: string) => {
      if (state.user?.is_superuser) return true
      return state.permissions.includes(permission)
    },
    
    hasPermissions: (state) => (permissions: string[]) => {
      if (state.user?.is_superuser) return true
      return permissions.every(permission => state.permissions.includes(permission))
    },
    
    hasRole: (state) => (roleName: string) => {
      return state.roles.some(role => role.name === roleName)
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

        // Decode token to get additional info
        if (this.tokens.access_token) {
          const decoded: any = jwtDecode(this.tokens.access_token)
          this.permissions = decoded.permissions || []
        }

        // Store in localStorage
        this.persistAuth()

        // Get user permissions
        await this.fetchUserPermissions()

        return response
      } catch (error: any) {
        // Error is already handled by the API client error handler
        // Just re-throw to maintain error chain
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: any) {
      this.isLoading = true

      try {
        const toast = useToast()
        const response = await authService.register(userData)

        // Auto-login after registration
        this.tokens = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          token_type: response.token_type,
          expires_in: response.expires_in
        }

        this.user = response.user
        this.persistAuth()

        // Get user permissions
        await this.fetchUserPermissions()

        // Show success message
        toast.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: `Welcome to HRMS, ${this.userFullName}!`,
          life: 4000
        })

        return response
      } catch (error: any) {
        // Error is already handled by the API client error handler
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async refreshToken() {
      if (!this.tokens?.refresh_token) {
        // No refresh token available, logout user
        this.logout()
        return
      }

      try {
        const response = await authService.refreshToken(this.tokens.refresh_token)

        this.tokens = {
          ...this.tokens,
          access_token: response.access_token,
          expires_in: response.expires_in
        }

        this.persistAuth()

        return response
      } catch (error) {
        // If refresh fails, logout user
        this.logout()
        throw error
      }
    },

    async fetchUserPermissions() {
      if (!this.isAuthenticated) return

      try {
        const response = await authService.getUserPermissions()
        
        this.permissions = response.permissions || []
        this.roles = response.roles || []
        
        // Permissions and roles are now set
      } catch (error) {
        console.error('Failed to fetch user permissions:', error)
      }
    },


    async updateProfile(profileData: Partial<User>) {
      if (!this.user) return

      try {
        const response = await authService.updateProfile(profileData)
        
        this.user = { ...this.user, ...response }
        this.persistAuth()
        
        return response
      } catch (error: any) {
        throw new Error(error.message || 'Profile update failed')
      }
    },

    logout() {
      this.user = null
      this.tokens = null
      this.permissions = []
      this.roles = []
      
      // Use service to clear localStorage
      authService.logout()
      
      // Redirect to login
      navigateTo('/login')
    },

    persistAuth() {
      if (this.tokens && this.user) {
        authService.storeAuth(this.tokens, this.user)
      }
    },

    initializeAuth() {
      if (import.meta.client) {
        try {
          const tokens = authService.getStoredTokens()
          const user = authService.getStoredUser()
          
          if (tokens) {
            this.tokens = tokens
          }
          
          if (user) {
            this.user = user
          }
          
          // Fetch fresh permissions on app load
          if (this.isAuthenticated) {
            this.fetchUserPermissions()
          }
        } catch (error) {
          console.error('Error initializing auth from localStorage:', error)
          this.logout()
        }
      }
    }
  }
})
