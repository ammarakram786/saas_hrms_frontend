// HRMS Types based on Swagger API definitions

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_active: boolean
  last_login?: string
  profile?: any
  effective_permissions?: string
  created_at: string
  updated_at: string
}

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

export interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  middle_name?: string
  full_name: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: string
  marital_status?: string
  nationality?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  department?: string
  department_name?: string
  department_code?: string
  position: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
  status: 'active' | 'inactive' | 'terminated' | 'on_leave'
  is_active: string
  hire_date: string
  start_date: string
  end_date?: string
  probation_end_date?: string
  base_salary?: string
  currency?: string
  pay_frequency: 'weekly' | 'bi_weekly' | 'monthly' | 'annual'
  manager?: string
  manager_name?: string
  user?: string
  user_email?: string
  emergency_contact?: any
  skills?: any
  certifications?: any
  metadata?: any
  years_of_service?: string
  is_on_probation?: string
  direct_reports_count?: string
  created_at: string
  updated_at: string
}

export interface EmployeeCreate {
  employee_id: string
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: string
  marital_status?: string
  nationality?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  department?: string
  position: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
  hire_date: string
  start_date: string
  probation_end_date?: string
  base_salary?: string
  currency?: string
  pay_frequency: 'weekly' | 'bi_weekly' | 'monthly' | 'annual'
  manager?: string
  emergency_contact?: any
  skills?: any
  certifications?: any
  password: string
  confirm_password: string
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  parent?: string
  parent_name?: string
  head?: string
  head_name?: string
  budget?: string
  cost_center?: string
  is_active: boolean
  employee_count?: string
  created_at: string
  updated_at: string
}

export interface DepartmentCreate {
  name: string
  code: string
  description?: string
  parent?: string
  head?: string
  budget?: string
  cost_center?: string
  is_active?: boolean
}

export interface Attendance {
  id: string
  employee: string
  employee_name?: string
  employee_id?: string
  date: string
  check_in?: string
  check_out?: string
  break_start?: string
  break_end?: string
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday' | 'weekend'
  shift?: string
  hours_worked?: string
  overtime_hours?: string
  leave_type?: string
  notes?: string
  is_manual_entry?: boolean
  is_late?: string
  created_at: string
  updated_at: string
}

export interface LeaveRequest {
  id: string
  employee: string
  employee_name?: string
  leave_type: string
  leave_type_name?: string
  start_date: string
  end_date: string
  days_requested: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  rejection_reason?: string
  documents?: any
  created_at: string
  updated_at: string
}

export interface LeaveType {
  id: string
  name: string
  code: string
  description?: string
  days_allowed_per_year: number
  is_paid: boolean
  requires_approval: boolean
  can_be_carried_forward: boolean
  max_consecutive_days?: number
  applicable_gender: 'all' | 'male' | 'female'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LeaveBalance {
  id: string
  employee: string
  employee_name?: string
  leave_type: string
  leave_type_name?: string
  year: number
  allocated_days: string
  used_days: string
  pending_days: string
  carried_forward: string
  available_days?: string
  total_allocated?: string
  created_at: string
  updated_at: string
}

export interface LeaveApproval {
  action: 'approve' | 'reject'
  reason?: string
}

export interface Holiday {
  id: string
  name: string
  date: string
  is_optional: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface Shift {
  id: string
  name: string
  start_time: string
  end_time: string
  break_duration: number
  is_overnight: boolean
  is_active: boolean
  late_grace_period: number
  early_checkout_grace_period: number
  duration_hours?: string
  created_at: string
  updated_at: string
}

export interface PayrollRecord {
  id: string
  employee: string
  employee_name?: string
  payroll_period: string
  payroll_period_name?: string
  base_salary: string
  overtime_pay: string
  allowances: string
  bonuses: string
  tax: string
  social_security: string
  other_deductions: string
  gross_pay?: string
  total_deductions?: string
  net_pay?: string
  payslip_data?: any
  created_at: string
  updated_at: string
}

export interface PayrollPeriod {
  id: string
  name: string
  period_start: string
  period_end: string
  pay_date: string
  status: 'draft' | 'processing' | 'completed' | 'cancelled'
  processed_by?: string
  processed_by_name?: string
  processed_at?: string
  created_at: string
  updated_at: string
}

export interface PayrollComponent {
  id: string
  name: string
  code: string
  component_type: 'earning' | 'deduction'
  calculation_method: 'fixed' | 'percentage' | 'formula'
  is_taxable: boolean
  is_mandatory: boolean
  is_active: boolean
  fixed_amount?: string
  percentage_value?: string
  formula?: string
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description?: string
  is_system: boolean
  is_active: boolean
  permissions?: Permission[]
  permission_codes?: string
  user_count?: string
  created_at: string
  updated_at: string
}

export interface RoleCreate {
  name: string
  description?: string
  is_active?: boolean
  permissions?: string[]
}

export interface Permission {
  id: string
  code: string
  module: string
  description: string
}

export interface Invitation {
  id: string
  email: string
  role_ids: string[]
  roles?: Role[]
  token?: string
  expires_at?: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  invited_by_name?: string
  is_expired?: string
  is_valid?: string
  created_at: string
  accepted_at?: string
}

export interface InvitationCreate {
  email: string
  role_ids: string[]
}

export interface AuditLog {
  id: string
  actor_user_id?: string
  actor_username?: string
  actor_ip?: string
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout'
  model_name: string
  object_id?: string
  old_values?: any
  new_values?: any
  changed_fields?: any
  description?: string
  metadata?: any
  created_at: string
}

export interface EmployeeDocument {
  id: string
  name: string
  document_type: 'id' | 'contract' | 'resume' | 'certificate' | 'photo' | 'tax_form' | 'bank_details' | 'emergency_contact' | 'other'
  file_path: string
  file_size: number
  mime_type: string
  is_confidential: boolean
  uploaded_by_name?: string
  created_at: string
  updated_at: string
}

// API Response types
export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export interface ApiError {
  message: string
  details?: any
  status?: number
}

// Form types
export interface EmployeeForm {
  employee_id: string
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: string
  marital_status?: string
  nationality?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  department?: string
  position: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
  hire_date: string
  start_date: string
  probation_end_date?: string
  base_salary?: string
  currency?: string
  pay_frequency: 'weekly' | 'bi_weekly' | 'monthly' | 'annual'
  manager?: string
  emergency_contact?: any
  skills?: any
  certifications?: any
  password?: string
  confirm_password?: string
}

export interface AttendanceForm {
  employee: string
  date: string
  check_in?: string
  check_out?: string
  break_start?: string
  break_end?: string
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday' | 'weekend'
  shift?: string
  leave_type?: string
  notes?: string
  is_manual_entry?: boolean
}

export interface LeaveRequestForm {
  employee: string
  leave_type: string
  start_date: string
  end_date: string
  days_requested: string
  reason: string
  documents?: any
}

// Dashboard types
export interface DashboardStats {
  total_employees: number
  active_employees: number
  new_employees_this_month: number
  total_departments: number
  attendance_rate: number
  leave_requests_pending: number
  payroll_processed: number
  recent_activities: any[]
}

export interface AttendanceStats {
  present_today: number
  absent_today: number
  late_today: number
  on_leave_today: number
  attendance_rate: number
  average_hours_worked: number
  overtime_hours: number
}

export interface PayrollStats {
  total_payroll_amount: number
  employees_paid: number
  pending_payments: number
  average_salary: number
  tax_deductions: number
  other_deductions: number
}
