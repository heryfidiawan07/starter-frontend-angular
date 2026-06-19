import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, Save, User as UserIcon, Mail, AtSign, Lock, Shield, ToggleLeft } from 'lucide-angular'
import { ToastrService } from 'ngx-toastr'
import { AppModal } from '../../../shared/components/ui/app-modal/app-modal'
import { AppInput } from '../../../shared/components/ui/app-input/app-input'
import { AppSelect } from '../../../shared/components/ui/app-select/app-select'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { UserService } from '../../../core/services/user.service'
import type { User, Role } from '../../../core/models/index'

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, AppModal, AppInput, AppSelect, Btn],
  templateUrl: './user-form-modal.html',
})
export class UserFormModal implements OnChanges {
  @Input() open = false
  @Input() user: User | null = null
  @Input() roles: Role[] = []
  @Output() closed = new EventEmitter<void>()
  @Output() success = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private userService = inject(UserService)
  private toastr = inject(ToastrService)

  readonly Save = Save
  readonly UserIcon = UserIcon
  readonly Mail = Mail
  readonly AtSign = AtSign
  readonly Lock = Lock
  readonly Shield = Shield
  readonly ToggleLeft = ToggleLeft

  loading = signal(false)

  get isEdit(): boolean { return !!this.user }

  get roleOptions() {
    return [
      { value: '', label: 'No role assigned' },
      ...this.roles.map((r) => ({ value: r.id, label: r.name })),
    ]
  }

  statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ]

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    password: [''],
    role_id: [''],
    is_active: ['true'],
  })

  errors: Record<string, string> = {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open'] && this.open) {
      this.form.patchValue({
        name: this.user?.name ?? '',
        email: this.user?.email ?? '',
        username: this.user?.username ?? '',
        password: '',
        role_id: this.user?.role_id ?? '',
        is_active: this.user ? (this.user.is_active ? 'true' : 'false') : 'true',
      })
      this.errors = {}

      if (this.isEdit) {
        this.form.get('password')?.clearValidators()
      } else {
        this.form.get('password')?.setValidators([Validators.required])
      }
      this.form.get('password')?.updateValueAndValidity()
    }
  }

  getError(field: string): string {
    return this.errors[field] ?? ''
  }

  onSubmit() {
    this.errors = {}
    this.form.markAllAsTouched()

    const { name, email, username, password, role_id, is_active } = this.form.value

    if (!name) { this.errors['name'] = 'Name is required'; return }
    if (!email) { this.errors['email'] = 'Email is required'; return }
    if (!this.isEdit && !password) { this.toastr.error('Password is required'); return }

    this.loading.set(true)

    const payload = {
      name: name!,
      email: email!,
      username: username || undefined,
      role_id: role_id || null,
      is_active: is_active === 'true',
      ...(password ? { password } : {}),
    }

    const obs = this.isEdit
      ? this.userService.update(this.user!.id, payload)
      : this.userService.create({ ...payload, password: password! })

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'User updated' : 'User created')
        this.success.emit()
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }
}
