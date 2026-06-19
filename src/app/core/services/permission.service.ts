import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { AuthService } from './auth.service'
import type { ApiResponse, Permission } from '../models/index'

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private http = inject(HttpClient)
  private auth = inject(AuthService)
  private base = `${environment.apiUrl}/api/v1`

  list() {
    return this.http.get<ApiResponse<Permission[]>>(`${this.base}/permissions`)
  }

  tree() {
    return this.http.get<ApiResponse<Permission[]>>(`${this.base}/permissions/tree`)
  }

  byRole(roleId: string) {
    return this.http.get<ApiResponse<Permission[]>>(`${this.base}/permissions/by-role/${roleId}`)
  }

  can(name: string): boolean {
    const user = this.auth.user()
    if (!user) return false
    if (user.is_root) return true
    return user.role?.permissions?.some((p) => p.name === name) ?? false
  }
}
