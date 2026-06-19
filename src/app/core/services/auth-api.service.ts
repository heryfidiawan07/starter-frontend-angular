import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import type { ApiResponse, AuthTokens, User } from '../models/index'

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient)
  private base = `${environment.apiUrl}/api/v1`

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthTokens>>(`${this.base}/auth/login`, { email, password })
  }

  register(data: { name: string; email: string; username?: string; password: string }) {
    return this.http.post<ApiResponse<AuthTokens>>(`${this.base}/auth/register`, data)
  }

  logout() {
    return this.http.post<ApiResponse>(`${this.base}/auth/logout`, {})
  }

  refresh(refresh_token: string) {
    return this.http.post<ApiResponse<AuthTokens>>(`${this.base}/auth/refresh`, { refresh_token })
  }

  forgotPassword(email: string) {
    return this.http.post<ApiResponse>(`${this.base}/auth/forgot-password`, { email })
  }

  resetPassword(token: string, new_password: string) {
    return this.http.post<ApiResponse>(`${this.base}/auth/reset-password`, { token, new_password })
  }

  verifyEmail(token: string) {
    return this.http.get<ApiResponse>(`${this.base}/auth/verify-email?token=${token}`)
  }

  changePassword(current_password: string, new_password: string) {
    return this.http.post<ApiResponse>(`${this.base}/auth/change-password`, { current_password, new_password })
  }

  me() {
    return this.http.get<ApiResponse<User>>(`${this.base}/auth/me`)
  }

  updateProfile(data: { name?: string; username?: string }) {
    return this.http.put<ApiResponse<User>>(`${this.base}/profile`, data)
  }

  uploadPhoto(file: File) {
    const form = new FormData()
    form.append('photo', file)
    return this.http.post<ApiResponse<User>>(`${this.base}/profile/photo`, form)
  }
}
