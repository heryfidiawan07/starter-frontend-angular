import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, Save, Camera } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { MainLayout } from '../../../shared/components/layout/main-layout/main-layout'
import { AppInput } from '../../../shared/components/ui/app-input/app-input'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AppAvatar } from '../../../shared/components/ui/app-avatar/app-avatar'
import { AppBadge } from '../../../shared/components/ui/app-badge/app-badge'
import { PhotoUploadModal } from '../../users/photo-upload-modal/photo-upload-modal'
import { AuthApiService } from '../../../core/services/auth-api.service'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, MainLayout, AppInput, Btn, AppAvatar, AppBadge, PhotoUploadModal],
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private fb = inject(FormBuilder)
  private authApi = inject(AuthApiService)
  private auth = inject(AuthService)
  private toastr = inject(ToastrService)

  readonly Save = Save
  readonly Camera = Camera

  photoOpen = signal(false)
  loading = signal(false)

  get user() { return this.auth.user() }

  form = this.fb.group({
    name: [this.auth.user()?.name ?? '', [Validators.required]],
    username: [this.auth.user()?.username ?? ''],
  })

  errors: Record<string, string> = {}

  get nameError(): string { return this.errors['name'] ?? '' }

  onSubmit() {
    this.errors = {}
    this.form.markAllAsTouched()
    const { name, username } = this.form.value
    if (!name) { this.errors['name'] = 'Name is required'; return }

    this.loading.set(true)
    this.authApi.updateProfile({ name: name!, username: username || undefined }).subscribe({
      next: (res) => {
        if (res.data) this.auth.setUser(res.data)
        this.toastr.success('Profile updated')
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }

  handlePhotoSuccess() {
    this.photoOpen.set(false)
    this.authApi.me().subscribe({
      next: (res) => { if (res.data) this.auth.setUser(res.data) },
      error: () => {},
    })
  }
}
