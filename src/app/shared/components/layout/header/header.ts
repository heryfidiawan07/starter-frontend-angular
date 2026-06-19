import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { LucideAngularModule, User, LogOut, Settings, ChevronDown, Menu } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '../../../../core/services/auth.service'
import { AuthApiService } from '../../../../core/services/auth-api.service'
import { AppAvatar } from '../../ui/app-avatar/app-avatar'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppAvatar],
  templateUrl: './header.html',
})
export class Header {
  @Input() title = ''
  @Output() menuClick = new EventEmitter<void>()

  private auth = inject(AuthService)
  private authApi = inject(AuthApiService)
  private router = inject(Router)
  private toastr = inject(ToastrService)

  readonly User = User
  readonly LogOut = LogOut
  readonly Settings = Settings
  readonly ChevronDown = ChevronDown
  readonly Menu = Menu

  dropdownOpen = signal(false)

  get user() {
    return this.auth.user()
  }

  toggleDropdown() {
    this.dropdownOpen.update((v) => !v)
  }

  closeDropdown() {
    this.dropdownOpen.set(false)
  }

  navigate(path: string) {
    this.dropdownOpen.set(false)
    this.router.navigate([path])
  }

  handleLogout() {
    this.authApi.logout().subscribe({
      complete: () => {},
      error: () => {},
    })
    this.auth.logout()
    this.router.navigate(['/login'])
    this.toastr.success('Logged out successfully')
    this.dropdownOpen.set(false)
  }
}
