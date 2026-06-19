import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import type { ApiResponse, Role } from '../models/index'

export interface RoleListParams {
  page?: number
  per_page?: number
  search?: string
}

export interface CreateRolePayload {
  name: string
  description?: string
  permission_ids?: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permission_ids?: string[]
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient)
  private base = `${environment.apiUrl}/api/v1`

  list(params: RoleListParams = {}) {
    const p: Record<string, string | number> = {}
    if (params.page !== undefined) p['page'] = params.page
    if (params.per_page !== undefined) p['per_page'] = params.per_page
    if (params.search !== undefined) p['search'] = params.search
    return this.http.get<ApiResponse<Role[]>>(`${this.base}/roles`, { params: p })
  }

  get(id: string) {
    return this.http.get<ApiResponse<Role>>(`${this.base}/roles/${id}`)
  }

  create(data: CreateRolePayload) {
    return this.http.post<ApiResponse<Role>>(`${this.base}/roles`, data)
  }

  update(id: string, data: UpdateRolePayload) {
    return this.http.put<ApiResponse<Role>>(`${this.base}/roles/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete<ApiResponse>(`${this.base}/roles/${id}`)
  }
}
