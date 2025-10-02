// Re-export from hrms types
export type { User, AuthTokens, LoginCredentials } from './hrms'

export interface UserExtended {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  tenant_id?: number
  profile?: {
    phone?: string
    address?: string
    two_factor_enabled?: boolean
    [key: string]: any
  }
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

export interface Tenant {
  id: number
  name: string
  slug: string
  domain?: string
  status: 'active' | 'suspended' | 'pending'
  is_active: boolean
  max_users: number
  max_employees: number
  subscription_plan?: {
    id: number
    name: string
    price_monthly: number
    price_yearly: number
  }
  subscription_status?: string
  created_at: string
  updated_at: string
}