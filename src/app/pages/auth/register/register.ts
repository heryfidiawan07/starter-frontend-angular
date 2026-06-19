import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, Router } from '@angular/router'
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, Mail, Lock, Eye, EyeOff, User, AtSign, UserPlus } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AuthLayout } from '../../../shared/components/layout/auth-layout/auth-layout'
import { AppInput } from '../../../shared/components/ui/app-input/app-input'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AuthApiService } from '../../../core/services/auth-api.service'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule, AuthLayout, AppInput, Btn],
  templateUrl: './register.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private authApi = inject(AuthApiService)
  private auth = inject(AuthService)
  private toastr = inject(ToastrService)

  readonly Mail = Mail
  readonly Lock = Lock
  readonly Eye = Eye
  readonly EyeOff = EyeOff
  readonly User = User
  readonly AtSign = AtSign
  readonly UserPlus = UserPlus

  showPw = signal(false)
  loading = signal(false)

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  getError(field: string): string {
    const ctrl = this.form.get(field)
    if (!ctrl?.touched) return ''
    if (ctrl.errors?.['required']) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    if (ctrl.errors?.['email']) return 'Invalid email'
    if (ctrl.errors?.['minlength']) {
      const min = ctrl.errors['minlength'].requiredLength
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${min} characters`
    }
    return ''
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { name, email, username, password } = this.form.value
    this.loading.set(true)

    this.authApi.register({
      name: name!,
      email: email!,
      username: username || undefined,
      password: password!,
    }).subscribe({
      next: (res) => {
        if (res.data?.access_token) {
          const { access_token, refresh_token, user } = res.data
          this.auth.setAuth(user, access_token, refresh_token)
          this.toastr.success('Account created successfully!')
          this.router.navigate(['/dashboard'])
        } else {
          this.toastr.success(res.message)
          this.router.navigate(['/login'])
        }
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
