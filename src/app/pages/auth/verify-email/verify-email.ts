import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, ActivatedRoute } from '@angular/router'
import { LucideAngularModule, CheckCircle, XCircle, LogIn } from 'lucide-angular'
import { AuthLayout } from '../../../shared/components/layout/auth-layout/auth-layout'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AppSpinner } from '../../../shared/components/ui/app-spinner/app-spinner'
import { AuthApiService } from '../../../core/services/auth-api.service'

type VerifyStatus = 'loading' | 'success' | 'error'

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, AuthLayout, Btn, AppSpinner],
  templateUrl: './verify-email.html',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute)
  private authApi = inject(AuthApiService)

  readonly CheckCircle = CheckCircle
  readonly XCircle = XCircle
  readonly LogIn = LogIn

  status = signal<VerifyStatus>('loading')

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token')
    if (!token) {
      this.status.set('error')
      return
    }

    this.authApi.verifyEmail(token).subscribe({
      next: () => this.status.set('success'),
      error: () => this.status.set('error'),
    })
  }
}
