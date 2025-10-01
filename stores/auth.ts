import { defineStore } from 'pinia'
import jwtDecode from 'jwt-decode'
import type { User, AuthTokens, LoginCredentials } from '~/types/auth'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  permissions: string[]
  roles: any[]
  tenant: any | null
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    permissions: [],
    roles: [],
    tenant: null,
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
        const { $api } = useNuxtApp()
        const toast = useToast()

        const response = await $api('/api/v1/auth/login/', {
          method: 'POST',
          body: credentials
        })

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

        // Get user permissions and tenant info
        await this.fetchUserPermissions()

        // Show success message
        toast.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome back, ${this.userFullName}!`,
          life: 3000
        })

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
        const { $api } = useNuxtApp()
        const toast = useToast()

        const response = await $api('/api/v1/auth/register/', {
          method: 'POST',
          body: userData
        })

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
        const errorHandler = useErrorHandler()
        errorHandler.handleUnauthorized()
        return
      }

      try {
        const { $api } = useNuxtApp()

        const response = await $api('/api/v1/auth/refresh/', {
          method: 'POST',
          body: {
            refresh_token: this.tokens.refresh_token
          }
        })

        this.tokens = {
          ...this.tokens,
          access_token: response.access_token,
          expires_in: response.expires_in
        }

        this.persistAuth()

        return response
      } catch (error) {
        // If refresh fails, logout user
        const errorHandler = useErrorHandler()
        errorHandler.handleUnauthorized()
        throw error
      }
    },

    async fetchUserPermissions() {
      if (!this.isAuthenticated) return

      try {
        const { $api } = useNuxtApp()
        
        const response = await $api('/api/v1/auth/permissions/me/')
        
        this.permissions = response.permissions || []
        this.roles = response.roles || []
        
        // Fetch tenant info if user is not superuser
        if (!response.is_superuser) {
          await this.fetchTenant()
        }
      } catch (error) {
        console.error('Failed to fetch user permissions:', error)
      }
    },

    async fetchTenant() {
      if (!this.isAuthenticated || this.isSuperUser) return

      try {
        const { $api } = useNuxtApp()
        const response = await $api('/api/v1/tenants/current/')
        this.tenant = response
      } catch (error) {
        console.error('Failed to fetch tenant info:', error)
      }
    },

    async updateProfile(profileData: Partial<User>) {
      if (!this.user) return

      try {
        const { $api } = useNuxtApp()
        
        const response = await $api('/api/v1/auth/profile/update/', {
          method: 'PATCH',
          body: profileData
        })
        
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
      this.tenant = null
      
      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('auth_user')
      }
      
      // Redirect to login
      navigateTo('/login')
    },

    persistAuth() {
      if (process.client) {
        if (this.tokens) {
          localStorage.setItem('auth_tokens', JSON.stringify(this.tokens))
        }
        if (this.user) {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
        }
      }
    },

    initializeAuth() {
      if (process.client) {
        try {
          const tokens = localStorage.getItem('auth_tokens')
          const user = localStorage.getItem('auth_user')
          
          if (tokens) {
            this.tokens = JSON.parse(tokens)
          }
          
          if (user) {
            this.user = JSON.parse(user)
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
