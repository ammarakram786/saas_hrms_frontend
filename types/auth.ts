// Re-export from hrms types
export type { User } from './user'

export interface Register {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  }

export interface UserExtended {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  tenant_id?: number
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface Permission {
  id: number
  code: string
  module: string
  description: string
}

export interface Role {
  id: number
  name: string
  description: string
  is_system: boolean
  is_active: boolean
  tenant_id?: number
}
