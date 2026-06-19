import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, Mail, Send, ArrowLeft } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AuthLayout } from '../../../shared/components/layout/auth-layout/auth-layout'
import { AppInput } from '../../../shared/components/ui/app-input/app-input'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AuthApiService } from '../../../core/services/auth-api.service'

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule, AuthLayout, AppInput, Btn],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder)
  private authApi = inject(AuthApiService)
  private toastr = inject(ToastrService)

  readonly Mail = Mail
  readonly Send = Send
  readonly ArrowLeft = ArrowLeft

  loading = signal(false)
  submitted = signal(false)

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  })

  get emailError(): string {
    const ctrl = this.form.get('email')
    if (!ctrl?.touched) return ''
    if (ctrl.errors?.['required']) return 'Email is required'
    if (ctrl.errors?.['email']) return 'Invalid email'
    return ''
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    this.loading.set(true)
    this.authApi.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.toastr.success('Check your email for a reset link')
        this.submitted.set(true)
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
