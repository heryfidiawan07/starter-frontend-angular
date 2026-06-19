import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, switchMap, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { environment } from '../../../environments/environment'
import type { ApiResponse, AuthTokens } from '../models/index'

const REFRESH_URL = `${environment.apiUrl}/api/v1/auth/refresh`

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const http = inject(HttpClient)

  // Don't add auth header or retry for the refresh endpoint
  const isRefreshRequest = req.url === REFRESH_URL

  const token = auth.getAccessToken()
  const authReq = token && !isRefreshRequest
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isRefreshRequest) {
        const refresh = auth.getRefreshToken()
        if (refresh) {
          return http
            .post<ApiResponse<AuthTokens>>(REFRESH_URL, { refresh_token: refresh })
            .pipe(
              switchMap((res) => {
                if (res.data) {
                  auth.setAuth(auth.user()!, res.data.access_token, res.data.refresh_token)
                  return next(
                    req.clone({
                      headers: req.headers.set('Authorization', `Bearer ${res.data.access_token}`),
                    })
                  )
                }
                auth.logout()
                router.navigate(['/login'])
                return throwError(() => err)
              }),
              catchError(() => {
                auth.logout()
                router.navigate(['/login'])
                return throwError(() => err)
              })
            )
        }
        auth.logout()
        router.navigate(['/login'])
      }
      return throwError(() => err)
    })
  )
}
