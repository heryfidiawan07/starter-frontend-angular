import { Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, Router } from '@angular/router'
import {
  LucideAngularModule,
  LayoutDashboard, Users, Shield, Lock,
  Zap, UserCog, X, ChevronDown, ChevronRight,
  LucideIconData,
  Circle
} from 'lucide-angular'
import * as Icons from 'lucide-angular'
import { AuthService } from '../../../../core/services/auth.service'

interface LeafItem {
  type: 'leaf'
  label: string
  route: string
  name: string
  icon: LucideIconData
}

interface DropdownItem {
  type: 'dropdown'
  label: string
  icon: LucideIconData
  children: LeafItem[]
  open?: boolean
}

interface CategoryGroup {
  category: string
  items: (LeafItem | DropdownItem)[]
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Input() open = false
  @Output() closed = new EventEmitter<void>()

  auth = inject(AuthService)
  private router = inject(Router)

  readonly Zap = Zap
  readonly X = X
  readonly ChevronDown = ChevronDown
  readonly ChevronRight = ChevronRight
  readonly Circle = Circle

  menuConfig: CategoryGroup[] = [
    {
      category: 'Main',
      items: [
        { type: 'leaf', label: 'Dashboard', route: '/dashboard', name: 'dashboard:index', icon: LayoutDashboard },
      ],
    },
    {
      category: 'Settings',
      items: [
        {
          type: 'dropdown',
          label: 'Administrator',
          icon: UserCog,
          open: this.isAnyAdminRouteActive(),
          children: [
            { type: 'leaf', label: 'User',       route: '/users',       name: 'user:index',       icon: Users  },
            { type: 'leaf', label: 'Role',       route: '/roles',       name: 'role:index',       icon: Shield },
            { type: 'leaf', label: 'Permission', route: '/permissions', name: 'permission:index', icon: Lock   },
          ],
        },
      ],
    },
  ]

  isAnyAdminRouteActive(): boolean {
    const url = this.router.url
    return url.startsWith('/users') || url.startsWith('/roles') || url.startsWith('/permissions')
  }

  get isRoot(): boolean {
    return this.auth.user()?.is_root ?? false
  }

  get userRoleMenus(): any[] {
    return this.auth.user()?.role?.permissions || []
  }

  resolveIcon(iconString: string | null): LucideIconData {
    if (!iconString) return Circle
    const iconName = iconString.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    return (Icons as any)[iconName] || Circle
  }

  getVisibleLeafItems(group: CategoryGroup): LeafItem[] {
    return group.items
      .filter((item) => item.type === 'leaf') as LeafItem[]
  }

  getVisibleDropdowns(group: CategoryGroup): DropdownItem[] {
    return group.items
      .filter((item) => item.type === 'dropdown') as DropdownItem[]
  }

  hasVisibleItems(group: CategoryGroup): boolean {
    return this.getVisibleLeafItems(group).length > 0 || this.getVisibleDropdowns(group).length > 0
  }

  getAllVisibleItems(group: CategoryGroup): (LeafItem | DropdownItem)[] {
    return group.items
  }

  getVisibleChildren(item: DropdownItem): LeafItem[] {
    return item.children
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route
  }

  isDropdownChildActive(item: DropdownItem): boolean {
    return item.children.some((c) => this.router.url.startsWith(c.route))
  }

  toggleDropdown(item: DropdownItem) {
    item.open = !item.open
  }

  get sidebarClass(): string {
    const base = 'w-60 shrink-0 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:relative lg:translate-x-0 lg:z-auto lg:inset-y-auto lg:left-auto lg:min-h-screen'
    return this.open ? `${base} translate-x-0` : `${base} -translate-x-full`
  }
}
