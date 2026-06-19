import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms'
import { LucideAngularModule, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { MainLayout } from '../../../shared/components/layout/main-layout/main-layout'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AuthApiService } from '../../../core/services/auth-api.service'

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('new_password')?.value
  const confirm = control.get('confirm_password')?.value
  return pw === confirm ? null : { passwordMismatch: true }
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, MainLayout, Btn],
  templateUrl: './change-password.html',
})
export class ChangePasswordPage {
  private fb = inject(FormBuilder)
  private authApi = inject(AuthApiService)
  private toastr = inject(ToastrService)

  readonly Lock = Lock
  readonly Eye = Eye
  readonly EyeOff = EyeOff
  readonly ShieldCheck = ShieldCheck

  showCurrent = signal(false)
  showNew = signal(false)
  loading = signal(false)

  form = this.fb.group({
    current_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]],
  }, { validators: passwordMatchValidator })

  getError(field: string): string {
    const ctrl = this.form.get(field)
    if (!ctrl?.touched) return ''
    if (ctrl.errors?.['required']) return 'This field is required'
    if (ctrl.errors?.['minlength']) return 'Password must be at least 8 characters'
    if (field === 'confirm_password' && this.form.errors?.['passwordMismatch'] && ctrl.touched) {
      return 'Passwords do not match'
    }
    return ''
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { current_password, new_password } = this.form.value
    this.loading.set(true)

    this.authApi.changePassword(current_password!, new_password!).subscribe({
      next: () => {
        this.toastr.success('Password changed successfully')
        this.form.reset()
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
