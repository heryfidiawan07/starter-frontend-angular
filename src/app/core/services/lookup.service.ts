import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import type { ApiResponse, Role, Permission } from '../models/index'

@Injectable({ providedIn: 'root' })
export class LookupService {
  private http = inject(HttpClient)
  private base = `${environment.apiUrl}/api/v1`

  roles() {
    return this.http.get<ApiResponse<Pick<Role, 'id' | 'name'>[]>>(`${this.base}/lookup/roles`)
  }

  permissions() {
    return this.http.get<ApiResponse<Permission[]>>(`${this.base}/lookup/permissions`)
  }
}
