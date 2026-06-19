import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms'
import { LucideAngularModule, Lock, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AuthLayout } from '../../../shared/components/layout/auth-layout/auth-layout'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AuthApiService } from '../../../core/services/auth-api.service'

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('new_password')?.value
  const confirm = control.get('confirm_password')?.value
  return pw === confirm ? null : { passwordMismatch: true }
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule, AuthLayout, Btn],
  templateUrl: './reset-password.html',
})
export class ResetPasswordPage implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private authApi = inject(AuthApiService)
  private toastr = inject(ToastrService)

  readonly Lock = Lock
  readonly Eye = Eye
  readonly EyeOff = EyeOff
  readonly KeyRound = KeyRound
  readonly ArrowLeft = ArrowLeft

  showPw = signal(false)
  loading = signal(false)
  token = ''

  form = this.fb.group({
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]],
  }, { validators: passwordMatchValidator })

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? ''
  }

  getError(field: string): string {
    const ctrl = this.form.get(field)
    if (!ctrl?.touched) return ''
    if (ctrl.errors?.['required']) return 'This field is required'
    if (ctrl.errors?.['minlength']) return 'Password must be at least 8 characters'
    if (field === 'confirm_password' && this.form.errors?.['passwordMismatch'] && ctrl.touched) return 'Passwords do not match'
    return ''
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return
    if (!this.token) { this.toastr.error('Invalid reset token'); return }

    this.loading.set(true)
    this.authApi.resetPassword(this.token, this.form.value.new_password!).subscribe({
      next: () => {
        this.toastr.success('Password reset successfully')
        this.router.navigate(['/login'])
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
