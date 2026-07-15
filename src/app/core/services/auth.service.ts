import { Injectable, signal, computed } from '@angular/core'
import type { User } from '../models/index'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null)
  userActions = signal<string[]>([])
  private _accessToken = signal<string | null>(null)
  private _refreshToken = signal<string | null>(null)

  readonly user = this._user.asReadonly()
  readonly isAuthenticated = computed(() => !!this._accessToken())

  setAuth(user: User, at: string, rt: string) {
    localStorage.setItem('access_token', at)
    localStorage.setItem('refresh_token', rt)
    localStorage.setItem('user', JSON.stringify(user))
    this._user.set(user)
    this._accessToken.set(at)
    this._refreshToken.set(rt)
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this._user.set(user)
  }

  logout() {
    localStorage.clear()
    this._user.set(null)
    this._accessToken.set(null)
    this._refreshToken.set(null)
  }

  initFromStorage() {
    const token = localStorage.getItem('access_token')
    const raw = localStorage.getItem('user')
    if (token && raw) {
      try {
        this._user.set(JSON.parse(raw))
        this._accessToken.set(token)
        this._refreshToken.set(localStorage.getItem('refresh_token'))
      } catch {
        localStorage.clear()
      }
    }
  }

  getAccessToken(): string | null {
    return this._accessToken()
  }

  getRefreshToken(): string | null {
    return this._refreshToken()
  }
}
