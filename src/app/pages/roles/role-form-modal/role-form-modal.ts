import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, Save, ChevronDown, ChevronRight, LucideIconData } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AppModal } from '../../../shared/components/ui/app-modal/app-modal'
import { AppInput } from '../../../shared/components/ui/app-input/app-input'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { RoleService } from '../../../core/services/role.service'
import type { Role, Permission } from '../../../core/models/index'

@Component({
  selector: 'app-role-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, AppModal, AppInput, Btn],
  templateUrl: './role-form-modal.html',
})
export class RoleFormModal implements OnChanges {
  @Input() open = false
  @Input() role: Role | null = null
  @Input() permissions: Permission[] = []
  @Output() closed = new EventEmitter<void>()
  @Output() success = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private roleService = inject(RoleService)
  private toastr = inject(ToastrService)

  readonly Save = Save
  readonly ChevronDown = ChevronDown
  readonly ChevronRight = ChevronRight

  loading = signal(false)
  selected = signal<Set<string>>(new Set())
  expandedCategories = signal<Set<string>>(new Set())

  get isEdit(): boolean { return !!this.role }

  get selectedCount(): number { return this.selected().size }

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  })

  errors: Record<string, string> = {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open'] && this.open) {
      this.form.patchValue({
        name: this.role?.name ?? '',
        description: this.role?.description ?? '',
      })
      const existingIds = new Set<string>(this.role?.permissions?.map((p) => p.id) ?? [])
      this.selected.set(existingIds)
      this.errors = {}

      // auto-expand categories that have selected children
      const expanded = new Set<string>()
      this.permissions.forEach((cat) => {
        if (cat.type === 'category' && cat.children) {
          const hasSelected = cat.children.some((menu) => {
            if (existingIds.has(menu.id)) return true
            return menu.children?.some((action) => existingIds.has(action.id)) ?? false
          })
          if (hasSelected) expanded.add(cat.id)
        }
      })
      this.expandedCategories.set(expanded)
    }
  }

  toggle(id: string) {
    const next = new Set(this.selected())
    if (next.has(id)) next.delete(id)
    else next.add(id)
    this.selected.set(next)
  }

  isSelected(id: string): boolean {
    return this.selected().has(id)
  }

  toggleCategory(id: string) {
    const next = new Set(this.expandedCategories())
    if (next.has(id)) next.delete(id)
    else next.add(id)
    this.expandedCategories.set(next)
  }

  isCategoryExpanded(id: string): boolean {
    return this.expandedCategories().has(id)
  }

  checkMenu(menuId: string) {
    const next = new Set(this.selected())
    next.add(menuId)
    this.selected.set(next)
  }

  uncheckMenu(menuId: string, actionIds: string[]) {
    const next = new Set(this.selected())
    next.delete(menuId)
    actionIds.forEach((aid) => next.delete(aid))
    this.selected.set(next)
  }

  toggleMenu(menu: Permission) {
    const actionIds = menu.children?.map((c) => c.id) ?? []
    if (this.isSelected(menu.id)) {
      this.uncheckMenu(menu.id, actionIds)
    } else {
      this.checkMenu(menu.id)
    }
  }

  toggleAction(action: Permission, menu: Permission) {
    const next = new Set(this.selected())
    if (next.has(action.id)) {
      next.delete(action.id)
    } else {
      next.add(action.id)
      // auto-check parent menu
      next.add(menu.id)
    }
    this.selected.set(next)
  }

  onSubmit() {
    this.errors = {}
    this.form.markAllAsTouched()
    const { name, description } = this.form.value
    if (!name) { this.errors['name'] = 'Name is required'; return }

    this.loading.set(true)

    const allSelectedIds = new Set<string>(this.selected());
    this.permissions.forEach(cat => {
      if (cat.type === 'category' && cat.children) {
        let catSelected = false;
        cat.children.forEach(menu => {
          let menuSelected = this.selected().has(menu.id);
          if (menu.children) {
            menu.children.forEach(action => {
              if (this.selected().has(action.id)) {
                menuSelected = true;
              }
            });
          }
          if (menuSelected) {
            allSelectedIds.add(menu.id);
            catSelected = true;
          }
        });
        if (catSelected) {
          allSelectedIds.add(cat.id);
        }
      }
    });

    const payload = {
      name: name!,
      description: description ?? '',
      permission_ids: Array.from(allSelectedIds),
    }

    const obs = this.isEdit
      ? this.roleService.update(this.role!.id, payload)
      : this.roleService.create(payload)

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'Role updated' : 'Role created')
        this.success.emit()
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
