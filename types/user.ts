export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_active: boolean
  is_superuser?: boolean
  last_login?: string
  profile?: any
  effective_permissions?: string
  created_at: string
  updated_at: string
}
