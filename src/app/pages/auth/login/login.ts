import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, Router } from '@angular/router'
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AuthLayout } from '../../../shared/components/layout/auth-layout/auth-layout'
import { AppInput } from '../../../shared/components/ui/app-input/app-input'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AuthApiService } from '../../../core/services/auth-api.service'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule, AuthLayout, AppInput, Btn],
  templateUrl: './login.html',
})
export class LoginPage implements OnInit {
  private fb      = inject(FormBuilder)
  private router  = inject(Router)
  private authApi = inject(AuthApiService)
  private auth    = inject(AuthService)
  private toastr  = inject(ToastrService)

  readonly Mail   = Mail
  readonly Lock   = Lock
  readonly Eye    = Eye
  readonly EyeOff = EyeOff
  readonly LogIn  = LogIn

  showPw  = signal(false)
  loading = signal(false)

  private oauthConfig: { google_client_id: string; facebook_app_id: string } | null = null

  form = this.fb.group({
    email:    ['root@example.com', [Validators.required, Validators.email]],
    password: ['password',         [Validators.required]],
  })

  get emailError(): string {
    const ctrl = this.form.get('email')
    if (ctrl?.touched && ctrl.errors?.['required']) return 'Email is required'
    if (ctrl?.touched && ctrl.errors?.['email'])    return 'Invalid email'
    return ''
  }

  get passwordError(): string {
    const ctrl = this.form.get('password')
    if (ctrl?.touched && ctrl.errors?.['required']) return 'Password is required'
    return ''
  }

  private loadScript(src: string, id: string): Promise<void> {
    return new Promise((resolve) => {
      if (document.getElementById(id)) { resolve(); return }
      const s = document.createElement('script')
      s.src = src; s.id = id; s.async = true
      s.onload = () => resolve()
      document.head.appendChild(s)
    })
  }

  ngOnInit() {
    this.authApi.getPublicConfig().subscribe({
      next: (res) => {
        this.oauthConfig = res.data
        if (res.data.google_client_id) this.loadScript('https://accounts.google.com/gsi/client', 'google-gsi')
        if (res.data.facebook_app_id) {
          this.loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-sdk').then(() => {
            ;(window as any).FB?.init({ appId: res.data.facebook_app_id, version: 'v18.0', xfbml: false, cookie: false })
          })
        }
      },
      error: () => {},
    })
  }

  socialLogin(provider: 'google' | 'facebook') {
    if (provider === 'google') {
      const clientId = this.oauthConfig?.google_client_id
      if (!clientId) { this.toastr.error('Google login is not configured on the server'); return }
      const google = (window as any).google
      if (!google) { this.toastr.error('Google SDK not loaded, please refresh'); return }
      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: (res: any) => {
          if (!res.access_token) return
          this.authApi.oauthGoogle(res.access_token).subscribe({
            next: (r) => { if (r.data) this.onSocialSuccess(r.data) },
            error: () => {},
          })
        },
      }).requestAccessToken()
    } else {
      const appId = this.oauthConfig?.facebook_app_id
      if (!appId) { this.toastr.error('Facebook login is not configured on the server'); return }
      const FB = (window as any).FB
      if (!FB) { this.toastr.error('Facebook SDK not loaded, please refresh'); return }
      FB.login((res: any) => {
        if (!res.authResponse?.accessToken) return
        this.authApi.oauthFacebook(res.authResponse.accessToken).subscribe({
          next: (r) => { if (r.data) this.onSocialSuccess(r.data) },
          error: () => {},
        })
      }, { scope: 'email,public_profile' })
    }
  }

  private onSocialSuccess(data: any) {
    this.auth.setAuth(data.user, data.access_token, data.refresh_token)
    this.toastr.success('Welcome!')
    this.router.navigate(['/dashboard'])
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { email, password } = this.form.value
    this.loading.set(true)

    this.authApi.login(email!, password!).subscribe({
      next: (res) => {
        if (res.data) {
          const { access_token, refresh_token, user } = res.data
          this.auth.setAuth(user, access_token, refresh_token)
          this.toastr.success('Welcome back!')
          this.router.navigate(['/dashboard'])
        }
      },
      error:    () => {},
      complete: () => this.loading.set(false),
    })
  }
}
