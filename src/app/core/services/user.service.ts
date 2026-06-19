import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import type { ApiResponse, User } from '../models/index'

export interface UserListParams {
  page?: number
  per_page?: number
  search?: string
}

export interface CreateUserPayload {
  name: string
  email: string
  username?: string
  password: string
  role_id?: string | null
  is_active?: boolean
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  username?: string
  password?: string
  role_id?: string | null
  is_active?: boolean
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient)
  private base = `${environment.apiUrl}/api/v1`

  list(params: UserListParams = {}) {
    const p: Record<string, string | number> = {}
    if (params.page !== undefined) p['page'] = params.page
    if (params.per_page !== undefined) p['per_page'] = params.per_page
    if (params.search !== undefined) p['search'] = params.search
    return this.http.get<ApiResponse<User[]>>(`${this.base}/users`, { params: p })
  }

  get(id: string) {
    return this.http.get<ApiResponse<User>>(`${this.base}/users/${id}`)
  }

  create(data: CreateUserPayload) {
    return this.http.post<ApiResponse<User>>(`${this.base}/users`, data)
  }

  update(id: string, data: UpdateUserPayload) {
    return this.http.put<ApiResponse<User>>(`${this.base}/users/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete<ApiResponse>(`${this.base}/users/${id}`)
  }

  uploadPhoto(id: string, file: File) {
    const form = new FormData()
    form.append('photo', file)
    return this.http.post<ApiResponse<User>>(`${this.base}/users/${id}/photo`, form)
  }
}
