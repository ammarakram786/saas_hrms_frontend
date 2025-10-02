import type {
  LoginCredentials, AuthResponse, Register, User, InvitationCreate, Invitation, RoleCreate, Role,
  DepartmentCreate, Department, EmployeeCreate, Employee, PayrollComponent, PayrollPeriod, PayrollRecord,
  Attendance, Holiday, LeaveBalance, LeaveRequest, LeaveType, Shift, AuditLog, LeaveApproval
} from '~/types/hrms'

// Helper function to get API base URL
const getApiBaseUrl = () => {
  if (process.client) {
    const config = useRuntimeConfig()
    return config.public.apiBase
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'
}

// Helper function to make API calls
const apiCall = async (endpoint: string, options: any = {}) => {
  const baseURL = getApiBaseUrl()
  return await $fetch(endpoint, {
    baseURL,
    ...options
  })
}

export const AuthService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    apiCall('/auth/login/', { method: 'POST', body: credentials }),
  
  register: (data: Register): Promise<AuthResponse> => 
    apiCall('/auth/register/', { method: 'POST', body: data }),
  
  refreshToken: (refreshToken: string): Promise<{ access_token: string, expires_in: number }> => 
    apiCall('/auth/refresh-token/', { method: 'POST', body: { refresh_token: refreshToken } }),
  
  getPermissions: (): Promise<any> => 
    apiCall('/auth/permissions/'),
  
  getCurrentUser: (): Promise<User> => 
    apiCall('/auth/users/me/'),
  
  updateProfile: (id: string, data: Partial<User>): Promise<User> => 
    apiCall(`/auth/users/${id}/`, { method: 'PATCH', body: data }),
  
  assignRoles: (id: string, roleIds: string[]): Promise<User> => 
    apiCall(`/auth/users/${id}/assign_roles/`, { method: 'POST', body: { role_ids: roleIds } }),
  
  logout: (): Promise<void> => 
    apiCall('/auth/logout/', { method: 'POST' }),
}

export const UserService = {
  getUsers: (params?: any): Promise<{ count: number, results: User[] }> => 
    apiCall('/auth/users/', { params }),
  
  getUser: (id: string): Promise<User> => 
    apiCall(`/auth/users/${id}/`),
  
  createUser: (data: Register): Promise<User> => 
    apiCall('/auth/users/', { method: 'POST', body: data }),
  
  updateUser: (id: string, data: Partial<User>): Promise<User> => 
    apiCall(`/auth/users/${id}/`, { method: 'PATCH', body: data }),
  
  deleteUser: (id: string): Promise<void> => 
    apiCall(`/auth/users/${id}/`, { method: 'DELETE' }),
}

export const RoleService = {
  getRoles: (params?: any): Promise<{ count: number, results: Role[] }> => 
    apiCall('/auth/roles/', { params }),
  
  getRole: (id: string): Promise<Role> => 
    apiCall(`/auth/roles/${id}/`),
  
  createRole: (data: RoleCreate): Promise<Role> => 
    apiCall('/auth/roles/', { method: 'POST', body: data }),
  
  updateRole: (id: string, data: Partial<Role>): Promise<Role> => 
    apiCall(`/auth/roles/${id}/`, { method: 'PATCH', body: data }),
  
  deleteRole: (id: string): Promise<void> => 
    apiCall(`/auth/roles/${id}/`, { method: 'DELETE' }),
}

export const InvitationService = {
  getInvitations: (params?: any): Promise<{ count: number, results: Invitation[] }> => 
    apiCall('/auth/invitations/', { params }),
  
  getInvitation: (id: string): Promise<Invitation> => 
    apiCall(`/auth/invitations/${id}/`),
  
  createInvitation: (data: InvitationCreate): Promise<Invitation> => 
    apiCall('/auth/invitations/', { method: 'POST', body: data }),
  
  resendInvitation: (id: string): Promise<Invitation> => 
    apiCall(`/auth/invitations/${id}/resend/`, { method: 'POST' }),
  
  deleteInvitation: (id: string): Promise<void> => 
    apiCall(`/auth/invitations/${id}/`, { method: 'DELETE' }),
  
  acceptInvitation: (token: string): Promise<void> => 
    apiCall('/auth/accept-invitation/', { method: 'POST', body: { token } }),
}

export const DepartmentService = {
  getDepartments: (params?: any): Promise<{ count: number, results: Department[] }> => 
    apiCall('/employees/departments/', { params }),
  
  getDepartment: (id: string): Promise<Department> => 
    apiCall(`/employees/departments/${id}/`),
  
  createDepartment: (data: DepartmentCreate): Promise<Department> => 
    apiCall('/employees/departments/', { method: 'POST', body: data }),
  
  updateDepartment: (id: string, data: Partial<Department>): Promise<Department> => 
    apiCall(`/employees/departments/${id}/`, { method: 'PATCH', body: data }),
  
  deleteDepartment: (id: string): Promise<void> => 
    apiCall(`/employees/departments/${id}/`, { method: 'DELETE' }),
  
  getDepartmentEmployees: (id: string): Promise<{ count: number, results: Employee[] }> => 
    apiCall(`/employees/departments/${id}/employees/`),
  
  getDepartmentStatistics: (params?: any): Promise<{ count: number, results: Department[] }> => 
    apiCall('/employees/departments/statistics/', { params }),
}

export const EmployeeService = {
  getEmployees: (params?: any): Promise<{ count: number, results: Employee[] }> => 
    apiCall('/employees/employees/', { params }),
  
  getEmployee: (id: string): Promise<Employee> => 
    apiCall(`/employees/employees/${id}/`),
  
  createEmployee: (data: EmployeeCreate): Promise<Employee> => 
    apiCall('/employees/employees/', { method: 'POST', body: data }),
  
  updateEmployee: (id: string, data: Partial<Employee>): Promise<Employee> => 
    apiCall(`/employees/employees/${id}/`, { method: 'PATCH', body: data }),
  
  deleteEmployee: (id: string): Promise<void> => 
    apiCall(`/employees/employees/${id}/`, { method: 'DELETE' }),
  
  terminateEmployee: (id: string): Promise<Employee> => 
    apiCall(`/employees/employees/${id}/terminate/`, { method: 'POST' }),
  
  reactivateEmployee: (id: string): Promise<Employee> => 
    apiCall(`/employees/employees/${id}/reactivate/`, { method: 'POST' }),
  
  getEmployeeDirectReports: (id: string): Promise<{ count: number, results: Employee[] }> => 
    apiCall(`/employees/employees/${id}/direct_reports/`),
  
  getEmployeeHierarchy: (id: string): Promise<Employee> => 
    apiCall(`/employees/employees/${id}/hierarchy/`),
  
  getEmployeeStatistics: (params?: any): Promise<{ count: number, results: Employee[] }> => 
    apiCall('/employees/employees/statistics/', { params }),
}

export const EmployeeDocumentService = {
  getEmployeeDocuments: (params?: any): Promise<{ count: number, results: any[] }> => 
    apiCall('/employees/employee-documents/', { params }),
  
  getEmployeeDocument: (id: string): Promise<any> => 
    apiCall(`/employees/employee-documents/${id}/`),
  
  createEmployeeDocument: (data: any): Promise<any> => 
    apiCall('/employees/employee-documents/', { method: 'POST', body: data }),
  
  updateEmployeeDocument: (id: string, data: any): Promise<any> => 
    apiCall(`/employees/employee-documents/${id}/`, { method: 'PATCH', body: data }),
  
  deleteEmployeeDocument: (id: string): Promise<void> => 
    apiCall(`/employees/employee-documents/${id}/`, { method: 'DELETE' }),
}

export const AttendanceService = {
  getAttendances: (params?: any): Promise<{ count: number, results: Attendance[] }> => 
    apiCall('/attendance/attendance/', { params }),
  
  getAttendance: (id: string): Promise<Attendance> => 
    apiCall(`/attendance/attendance/${id}/`),
  
  createAttendance: (data: Attendance): Promise<Attendance> => 
    apiCall('/attendance/attendance/', { method: 'POST', body: data }),
  
  updateAttendance: (id: string, data: Partial<Attendance>): Promise<Attendance> => 
    apiCall(`/attendance/attendance/${id}/`, { method: 'PATCH', body: data }),
  
  deleteAttendance: (id: string): Promise<void> => 
    apiCall(`/attendance/attendance/${id}/`, { method: 'DELETE' }),
  
  clockIn: (): Promise<void> => 
    apiCall('/attendance/clock-in/', { method: 'POST' }),
  
  clockOut: (): Promise<void> => 
    apiCall('/attendance/clock-out/', { method: 'POST' }),
  
  getAttendanceStatistics: (params?: any): Promise<{ count: number, results: Attendance[] }> => 
    apiCall('/attendance/attendance/statistics/', { params }),
}

export const HolidayService = {
  getHolidays: (params?: any): Promise<{ count: number, results: Holiday[] }> => 
    apiCall('/attendance/holidays/', { params }),
  
  getHoliday: (id: string): Promise<Holiday> => 
    apiCall(`/attendance/holidays/${id}/`),
  
  createHoliday: (data: Holiday): Promise<Holiday> => 
    apiCall('/attendance/holidays/', { method: 'POST', body: data }),
  
  updateHoliday: (id: string, data: Partial<Holiday>): Promise<Holiday> => 
    apiCall(`/attendance/holidays/${id}/`, { method: 'PATCH', body: data }),
  
  deleteHoliday: (id: string): Promise<void> => 
    apiCall(`/attendance/holidays/${id}/`, { method: 'DELETE' }),
}

export const LeaveTypeService = {
  getLeaveTypes: (params?: any): Promise<{ count: number, results: LeaveType[] }> => 
    apiCall('/attendance/leave-types/', { params }),
  
  getLeaveType: (id: string): Promise<LeaveType> => 
    apiCall(`/attendance/leave-types/${id}/`),
  
  createLeaveType: (data: LeaveType): Promise<LeaveType> => 
    apiCall('/attendance/leave-types/', { method: 'POST', body: data }),
  
  updateLeaveType: (id: string, data: Partial<LeaveType>): Promise<LeaveType> => 
    apiCall(`/attendance/leave-types/${id}/`, { method: 'PATCH', body: data }),
  
  deleteLeaveType: (id: string): Promise<void> => 
    apiCall(`/attendance/leave-types/${id}/`, { method: 'DELETE' }),
}

export const LeaveRequestService = {
  getLeaveRequests: (params?: any): Promise<{ count: number, results: LeaveRequest[] }> => 
    apiCall('/attendance/leave-requests/', { params }),
  
  getLeaveRequest: (id: string): Promise<LeaveRequest> => 
    apiCall(`/attendance/leave-requests/${id}/`),
  
  createLeaveRequest: (data: LeaveRequest): Promise<LeaveRequest> => 
    apiCall('/attendance/leave-requests/', { method: 'POST', body: data }),
  
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>): Promise<LeaveRequest> => 
    apiCall(`/attendance/leave-requests/${id}/`, { method: 'PATCH', body: data }),
  
  deleteLeaveRequest: (id: string): Promise<void> => 
    apiCall(`/attendance/leave-requests/${id}/`, { method: 'DELETE' }),
  
  approveLeaveRequest: (id: string, data: LeaveApproval): Promise<LeaveRequest> => 
    apiCall(`/attendance/leave-requests/${id}/approve/`, { method: 'POST', body: data }),
  
  rejectLeaveRequest: (id: string, data: LeaveApproval): Promise<LeaveRequest> => 
    apiCall(`/attendance/leave-requests/${id}/reject/`, { method: 'POST', body: data }),
}

export const LeaveBalanceService = {
  getLeaveBalances: (params?: any): Promise<{ count: number, results: LeaveBalance[] }> => 
    apiCall('/attendance/leave-balances/', { params }),
  
  getLeaveBalance: (id: string): Promise<LeaveBalance> => 
    apiCall(`/attendance/leave-balances/${id}/`),
  
  createLeaveBalance: (data: LeaveBalance): Promise<LeaveBalance> => 
    apiCall('/attendance/leave-balances/', { method: 'POST', body: data }),
  
  updateLeaveBalance: (id: string, data: Partial<LeaveBalance>): Promise<LeaveBalance> => 
    apiCall(`/attendance/leave-balances/${id}/`, { method: 'PATCH', body: data }),
  
  deleteLeaveBalance: (id: string): Promise<void> => 
    apiCall(`/attendance/leave-balances/${id}/`, { method: 'DELETE' }),
}

export const ShiftService = {
  getShifts: (params?: any): Promise<{ count: number, results: Shift[] }> => 
    apiCall('/attendance/shifts/', { params }),
  
  getShift: (id: string): Promise<Shift> => 
    apiCall(`/attendance/shifts/${id}/`),
  
  createShift: (data: Shift): Promise<Shift> => 
    apiCall('/attendance/shifts/', { method: 'POST', body: data }),
  
  updateShift: (id: string, data: Partial<Shift>): Promise<Shift> => 
    apiCall(`/attendance/shifts/${id}/`, { method: 'PATCH', body: data }),
  
  deleteShift: (id: string): Promise<void> => 
    apiCall(`/attendance/shifts/${id}/`, { method: 'DELETE' }),
}

export const PayrollComponentService = {
  getPayrollComponents: (params?: any): Promise<{ count: number, results: PayrollComponent[] }> => 
    apiCall('/payroll/components/', { params }),
  
  getPayrollComponent: (id: string): Promise<PayrollComponent> => 
    apiCall(`/payroll/components/${id}/`),
  
  createPayrollComponent: (data: PayrollComponent): Promise<PayrollComponent> => 
    apiCall('/payroll/components/', { method: 'POST', body: data }),
  
  updatePayrollComponent: (id: string, data: Partial<PayrollComponent>): Promise<PayrollComponent> => 
    apiCall(`/payroll/components/${id}/`, { method: 'PATCH', body: data }),
  
  deletePayrollComponent: (id: string): Promise<void> => 
    apiCall(`/payroll/components/${id}/`, { method: 'DELETE' }),
}

export const PayrollPeriodService = {
  getPayrollPeriods: (params?: any): Promise<{ count: number, results: PayrollPeriod[] }> => 
    apiCall('/payroll/periods/', { params }),
  
  getPayrollPeriod: (id: string): Promise<PayrollPeriod> => 
    apiCall(`/payroll/periods/${id}/`),
  
  createPayrollPeriod: (data: PayrollPeriod): Promise<PayrollPeriod> => 
    apiCall('/payroll/periods/', { method: 'POST', body: data }),
  
  updatePayrollPeriod: (id: string, data: Partial<PayrollPeriod>): Promise<PayrollPeriod> => 
    apiCall(`/payroll/periods/${id}/`, { method: 'PATCH', body: data }),
  
  deletePayrollPeriod: (id: string): Promise<void> => 
    apiCall(`/payroll/periods/${id}/`, { method: 'DELETE' }),
}

export const PayrollRecordService = {
  getPayrollRecords: (params?: any): Promise<{ count: number, results: PayrollRecord[] }> => 
    apiCall('/payroll/records/', { params }),
  
  getPayrollRecord: (id: string): Promise<PayrollRecord> => 
    apiCall(`/payroll/records/${id}/`),
  
  createPayrollRecord: (data: PayrollRecord): Promise<PayrollRecord> => 
    apiCall('/payroll/records/', { method: 'POST', body: data }),
  
  updatePayrollRecord: (id: string, data: Partial<PayrollRecord>): Promise<PayrollRecord> => 
    apiCall(`/payroll/records/${id}/`, { method: 'PATCH', body: data }),
  
  deletePayrollRecord: (id: string): Promise<void> => 
    apiCall(`/payroll/records/${id}/`, { method: 'DELETE' }),
}

export const AuditLogService = {
  getAuditLogs: (params?: any): Promise<{ count: number, results: AuditLog[] }> => 
    apiCall('/audit/logs/', { params }),
  
  getAuditLog: (id: string): Promise<AuditLog> => 
    apiCall(`/audit/logs/${id}/`),
}

export const CoreService = {
  getPermissions: (): Promise<any> => 
    apiCall('/core/permissions/'),
  
  healthCheck: (): Promise<any> => 
    apiCall('/core/health/'),
}
