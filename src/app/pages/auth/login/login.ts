import { Component, inject, signal } from '@angular/core'
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
export class LoginPage {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private authApi = inject(AuthApiService)
  private auth = inject(AuthService)
  private toastr = inject(ToastrService)

  readonly Mail = Mail
  readonly Lock = Lock
  readonly Eye = Eye
  readonly EyeOff = EyeOff
  readonly LogIn = LogIn

  showPw = signal(false)
  loading = signal(false)

  form = this.fb.group({
    email: ['root@example.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]],
  })

  get emailError(): string {
    const ctrl = this.form.get('email')
    if (ctrl?.touched && ctrl.errors?.['required']) return 'Email is required'
    if (ctrl?.touched && ctrl.errors?.['email']) return 'Invalid email'
    return ''
  }

  get passwordError(): string {
    const ctrl = this.form.get('password')
    if (ctrl?.touched && ctrl.errors?.['required']) return 'Password is required'
    return ''
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
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
