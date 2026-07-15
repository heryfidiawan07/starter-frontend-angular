export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  meta?: PageMeta
  errors?: Record<string, string[]>
}

export interface PageMeta {
  page: number
  per_page: number
  total: number
  total_page: number
}

export interface Permission {
  id: string
  parent_id: string | null
  name: string
  label: string
  type: 'category' | 'menu' | 'action'
  route: string | null
  order: number
  children?: Permission[]
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description: string | null
  permissions?: PermissionNode[];
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  username: string | null
  photo: string | null
  is_root: boolean
  is_active: boolean
  email_verified: boolean
  role_id: string | null
  role?: Role | null
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface PaginatedData<T> {
  items: T[]
  meta: PageMeta
}

;
export interface PermissionAction {
  id: string;
  name: string;
  label: string;
}
;
export interface PermissionNode {
  id: string;
  label: string;
  name: string;
  type: 'category' | 'menu';
  icon: string | null;
  route: string | null;
  actions: PermissionAction[];
  children?: PermissionNode[];
}
