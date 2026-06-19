import { Component, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { LucideAngularModule, Plus, Search, Pencil, Trash2, RefreshCw, ChevronDown } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { MainLayout } from '../../../shared/components/layout/main-layout/main-layout'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AppBadge } from '../../../shared/components/ui/app-badge/app-badge'
import { AppPagination } from '../../../shared/components/ui/app-pagination/app-pagination'
import { AppConfirmDialog } from '../../../shared/components/ui/app-confirm-dialog/app-confirm-dialog'
import { AppSpinner } from '../../../shared/components/ui/app-spinner/app-spinner'
import { RoleFormModal } from '../role-form-modal/role-form-modal'
import { RoleService } from '../../../core/services/role.service'
import { LookupService } from '../../../core/services/lookup.service'
import { PermissionService } from '../../../core/services/permission.service'
import type { Role, Permission, PageMeta } from '../../../core/models/index'

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 9999]
const ALL_LABEL = 9999

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule,
    MainLayout, Btn, AppBadge, AppPagination,
    AppConfirmDialog, AppSpinner, RoleFormModal,
  ],
  templateUrl: './roles-page.html',
})
export class RolesPage implements OnInit {
  private roleService = inject(RoleService)
  private lookupService = inject(LookupService)
  private permService = inject(PermissionService)
  private toastr = inject(ToastrService)

  readonly Plus = Plus
  readonly Search = Search
  readonly Pencil = Pencil
  readonly Trash2 = Trash2
  readonly RefreshCw = RefreshCw
  readonly ChevronDown = ChevronDown

  readonly PER_PAGE_OPTIONS = PER_PAGE_OPTIONS
  readonly ALL_LABEL = ALL_LABEL

  roles = signal<Role[]>([])
  permissions = signal<Permission[]>([])
  meta = signal<PageMeta>({ page: 1, per_page: 10, total: 0, total_page: 1 })
  search = signal('')
  page = signal(1)
  perPage = signal(10)
  loading = signal(false)
  formOpen = signal(false)
  editRole = signal<Role | null>(null)
  deleteTarget = signal<Role | null>(null)
  deleting = signal(false)

  hasAnyRowAction = computed(() => this.can('role:edit') || this.can('role:delete'))

  can(name: string): boolean { return this.permService.can(name) }

  rowNum(idx: number): number { return (this.page() - 1) * this.perPage() + idx + 1 }

  fetchRoles() {
    this.loading.set(true)
    this.roleService.list({ page: this.page(), per_page: this.perPage(), search: this.search() }).subscribe({
      next: (res) => {
        this.roles.set(res.data ?? [])
        if (res.meta) this.meta.set(res.meta)
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }

  handlePerPage(value: number) { this.perPage.set(value); this.page.set(1); this.fetchRoles() }
  handleSearch(value: string) { this.search.set(value); this.page.set(1); this.fetchRoles() }
  openCreate() { this.editRole.set(null); this.formOpen.set(true) }
  openEdit(r: Role) { this.editRole.set(r); this.formOpen.set(true) }
  onPageChange(p: number) { this.page.set(p); this.fetchRoles() }

  onFormSuccess() { this.formOpen.set(false); this.fetchRoles() }

  handleDelete() {
    if (!this.deleteTarget()) return
    this.deleting.set(true)
    this.roleService.delete(this.deleteTarget()!.id).subscribe({
      next: () => {
        this.toastr.success('Role deleted')
        this.deleteTarget.set(null)
        this.fetchRoles()
      },
      error: () => {},
      complete: () => this.deleting.set(false),
    })
  }

  ngOnInit() {
    this.fetchRoles()
    this.lookupService.permissions().subscribe({
      next: (res) => this.permissions.set(res.data ?? []),
      error: () => {},
    })
  }
}
