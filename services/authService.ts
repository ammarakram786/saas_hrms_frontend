import type { User, LoginCredentials } from '~/types/auth'

export interface LoginResponse {
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

export class AuthService {
  private getApi() {
    // Get API client from Nuxt app when needed
    return useNuxtApp().$api
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await this.getApi().call('/api/v1/auth/login/', {
      method: 'POST',
      data: credentials
    })
  }

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    return await this.getApi().call('/api/v1/auth/refresh/', {
      method: 'POST',
      data: {
        refresh_token: refreshToken
      }
    })
  }

  logout(): void {
    // Clear cookies
    useCookie('auth_token').value = null
    useCookie('refresh_token').value = null
  }
}

// Export singleton instance
export const authService = new AuthService()
