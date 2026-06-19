import { Component, Input, Output, EventEmitter, inject, signal, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, Upload, ImagePlus } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AppModal } from '../../../shared/components/ui/app-modal/app-modal'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AppAvatar } from '../../../shared/components/ui/app-avatar/app-avatar'
import { UserService } from '../../../core/services/user.service'
import { AuthApiService } from '../../../core/services/auth-api.service'
import { AuthService } from '../../../core/services/auth.service'
import type { User } from '../../../core/models/index'

@Component({
  selector: 'app-photo-upload-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppModal, Btn, AppAvatar],
  templateUrl: './photo-upload-modal.html',
})
export class PhotoUploadModal {
  @Input() open = false
  @Input() user: User | null = null
  @Input() isProfile = false
  @Output() closed = new EventEmitter<void>()
  @Output() success = new EventEmitter<void>()

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>

  private userService = inject(UserService)
  private authApi = inject(AuthApiService)
  private auth = inject(AuthService)
  private toastr = inject(ToastrService)

  readonly Upload = Upload
  readonly ImagePlus = ImagePlus

  preview = signal<string | null>(null)
  file = signal<File | null>(null)
  uploading = signal(false)

  handleFile(f: File) {
    this.file.set(f)
    this.preview.set(URL.createObjectURL(f))
  }

  onFileChange(event: Event) {
    const f = (event.target as HTMLInputElement).files?.[0]
    if (f) this.handleFile(f)
  }

  onDrop(event: DragEvent) {
    event.preventDefault()
    const f = event.dataTransfer?.files[0]
    if (f) this.handleFile(f)
  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
  }

  clickInput() {
    this.fileInputRef?.nativeElement.click()
  }

  handleUpload() {
    if (!this.file() || !this.user) return
    this.uploading.set(true)

    const obs = this.isProfile
      ? this.authApi.uploadPhoto(this.file()!)
      : this.userService.uploadPhoto(this.user.id, this.file()!)

    obs.subscribe({
      next: () => {
        this.toastr.success('Photo updated')
        this.preview.set(null)
        this.file.set(null)
        this.success.emit()
      },
      error: () => {},
      complete: () => this.uploading.set(false),
    })
  }

  handleClose() {
    this.preview.set(null)
    this.file.set(null)
    this.closed.emit()
  }
}
