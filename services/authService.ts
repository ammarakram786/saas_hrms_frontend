import type { User, AuthTokens, LoginCredentials } from '~/types/auth'

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface RegisterResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface RefreshResponse {
  access_token: string
  expires_in: number  
}

export interface PermissionsResponse {
  permissions: string[]
  roles: any[]
  is_superuser: boolean
}

export class AuthService {
  private getApi() {
    // Get API client from Nuxt app when needed
    return useNuxtApp().$api
  }

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await this.getApi().call('/api/v1/auth/login/', {
      method: 'POST',
      data: credentials
    })
  }

  /**
   * Register new user
   */
  async register(userData: any): Promise<RegisterResponse> {
    return await this.getApi().call('/api/v1/auth/register/', {
      method: 'POST',
      data: userData
    })
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    return await this.getApi().call('/api/v1/auth/refresh/', {
      method: 'POST',
      data: {
        refresh_token: refreshToken
      }
    })
  }

  /**
   * Get user permissions and roles
   */
  async getUserPermissions(): Promise<PermissionsResponse> {
    return await this.getApi().call('/api/v1/auth/permissions/me/')
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    return await this.getApi().call('/api/v1/auth/profile/update/', {
      method: 'PATCH',
      data: profileData
    })
  }

  /**
   * Logout user (client-side only)
   */
  logout(): void {
    // Clear localStorage
    if (import.meta.client) {
      localStorage.removeItem('auth_tokens')
      localStorage.removeItem('auth_user')
    }
  }

  /**
   * Get tokens from localStorage
   */
  getStoredTokens(): AuthTokens | null {
    if (import.meta.client) {
      try {
        const tokens = localStorage.getItem('auth_tokens')
        return tokens ? JSON.parse(tokens) : null
      } catch (error) {
        console.error('Error parsing stored tokens:', error)
        return null
      }
    }
    return null
  }

  /**
   * Get user from localStorage
   */
  getStoredUser(): User | null {
    if (import.meta.client) {
      try {
        const user = localStorage.getItem('auth_user')
        return user ? JSON.parse(user) : null
      } catch (error) {
        console.error('Error parsing stored user:', error)
        return null
      }
    }
    return null
  }

  /**
   * Store auth data in localStorage
   */
  storeAuth(tokens: AuthTokens, user: User): void {
    if (import.meta.client) {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      localStorage.setItem('auth_user', JSON.stringify(user))
    }
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens()
    return !!tokens?.access_token
  }
}

// Export singleton instance
export const authService = new AuthService()
