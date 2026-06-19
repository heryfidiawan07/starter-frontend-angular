import { Component, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  LucideAngularModule, Plus, Search, Pencil, Trash2, Image,
  RefreshCw, ShieldCheck, ShieldOff, ChevronDown,
} from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { MainLayout } from '../../../shared/components/layout/main-layout/main-layout'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AppBadge } from '../../../shared/components/ui/app-badge/app-badge'
import { AppAvatar } from '../../../shared/components/ui/app-avatar/app-avatar'
import { AppPagination } from '../../../shared/components/ui/app-pagination/app-pagination'
import { AppConfirmDialog } from '../../../shared/components/ui/app-confirm-dialog/app-confirm-dialog'
import { AppSpinner } from '../../../shared/components/ui/app-spinner/app-spinner'
import { UserFormModal } from '../user-form-modal/user-form-modal'
import { PhotoUploadModal } from '../photo-upload-modal/photo-upload-modal'
import { UserService } from '../../../core/services/user.service'
import { LookupService } from '../../../core/services/lookup.service'
import { PermissionService } from '../../../core/services/permission.service'
import type { User, Role, PageMeta } from '../../../core/models/index'

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 9999]
const ALL_LABEL = 9999

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule,
    MainLayout, Btn, AppBadge, AppAvatar, AppPagination,
    AppConfirmDialog, AppSpinner, UserFormModal, PhotoUploadModal,
  ],
  templateUrl: './users-page.html',
})
export class UsersPage implements OnInit {
  private userService = inject(UserService)
  private lookupService = inject(LookupService)
  private permService = inject(PermissionService)
  private toastr = inject(ToastrService)

  readonly Plus = Plus
  readonly Search = Search
  readonly Pencil = Pencil
  readonly Trash2 = Trash2
  readonly Image = Image
  readonly RefreshCw = RefreshCw
  readonly ShieldCheck = ShieldCheck
  readonly ShieldOff = ShieldOff
  readonly ChevronDown = ChevronDown

  readonly PER_PAGE_OPTIONS = PER_PAGE_OPTIONS
  readonly ALL_LABEL = ALL_LABEL

  users = signal<User[]>([])
  roles = signal<Role[]>([])
  meta = signal<PageMeta>({ page: 1, per_page: 10, total: 0, total_page: 1 })
  search = signal('')
  page = signal(1)
  perPage = signal(10)
  loading = signal(false)
  formOpen = signal(false)
  photoOpen = signal(false)
  editUser = signal<User | null>(null)
  photoUser = signal<User | null>(null)
  deleteTarget = signal<User | null>(null)
  deleting = signal(false)

  hasAnyRowAction = computed(() => this.can('user:edit') || this.can('user:delete'))

  can(name: string): boolean {
    return this.permService.can(name)
  }

  rowNum(idx: number): number {
    return (this.page() - 1) * this.perPage() + idx + 1
  }

  fetchUsers() {
    this.loading.set(true)
    this.userService.list({
      page: this.page(),
      per_page: this.perPage(),
      search: this.search(),
    }).subscribe({
      next: (res) => {
        this.users.set(res.data ?? [])
        if (res.meta) this.meta.set(res.meta)
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }

  handlePerPage(value: number) {
    this.perPage.set(value)
    this.page.set(1)
    this.fetchUsers()
  }

  handleSearch(value: string) {
    this.search.set(value)
    this.page.set(1)
    this.fetchUsers()
  }

  openCreate() {
    this.editUser.set(null)
    this.formOpen.set(true)
  }

  openEdit(u: User) {
    this.editUser.set(u)
    this.formOpen.set(true)
  }

  openPhoto(u: User) {
    this.photoUser.set(u)
    this.photoOpen.set(true)
  }

  handleDelete() {
    if (!this.deleteTarget()) return
    this.deleting.set(true)
    this.userService.delete(this.deleteTarget()!.id).subscribe({
      next: () => {
        this.toastr.success('User deleted')
        this.deleteTarget.set(null)
        this.fetchUsers()
      },
      error: () => {},
      complete: () => this.deleting.set(false),
    })
  }

  onPageChange(p: number) {
    this.page.set(p)
    this.fetchUsers()
  }

  onFormSuccess() {
    this.formOpen.set(false)
    this.fetchUsers()
  }

  onPhotoSuccess() {
    this.photoOpen.set(false)
    this.fetchUsers()
  }

  ngOnInit() {
    this.fetchUsers()
    this.lookupService.roles().subscribe({
      next: (res) => this.roles.set((res.data ?? []) as Role[]),
      error: () => {},
    })
  }
}
