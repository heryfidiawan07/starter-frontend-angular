import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  LucideAngularModule, RefreshCw, Layers, Navigation, Zap, LucideIconData,
} from 'lucide-angular'
import { MainLayout } from '../../../shared/components/layout/main-layout/main-layout'
import { Btn } from '../../../shared/components/ui/btn/btn'
import { AppSpinner } from '../../../shared/components/ui/app-spinner/app-spinner'
import { PermissionService } from '../../../core/services/permission.service'
import type { Permission } from '../../../core/models/index'

interface TypeConfig {
  label: string
  icon: LucideIconData
  color: string
}

@Component({
  selector: 'app-permissions-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MainLayout, Btn, AppSpinner],
  templateUrl: './permissions-page.html',
})
export class PermissionsPage implements OnInit {
  private permService = inject(PermissionService)

  readonly RefreshCw = RefreshCw
  readonly Layers = Layers
  readonly Navigation = Navigation
  readonly Zap = Zap

  tree = signal<Permission[]>([])
  loading = signal(false)
  expandedNodes = signal<Set<string>>(new Set())

  typeConfig: Record<string, TypeConfig> = {
    category: { label: 'Category', icon: Layers,     color: 'text-purple-600 bg-purple-50' },
    menu:     { label: 'Menu',     icon: Navigation, color: 'text-blue-600 bg-blue-50' },
    action:   { label: 'Action',   icon: Zap,        color: 'text-green-600 bg-green-50' },
  }

  get typeConfigEntries(): [string, TypeConfig][] {
    return Object.entries(this.typeConfig)
  }

  fetchTree() {
    this.loading.set(true)
    this.permService.tree().subscribe({
      next: (res) => {
        this.tree.set(res.data ?? [])
        // expand all by default
        const ids = new Set<string>()
        this.collectIds(res.data ?? [], ids)
        this.expandedNodes.set(ids)
      },
      error: () => {},
      complete: () => this.loading.set(false),
    })
  }

  collectIds(items: Permission[], ids: Set<string>) {
    items.forEach((p) => {
      ids.add(p.id)
      if (p.children) this.collectIds(p.children, ids)
    })
  }

  isExpanded(id: string): boolean { return this.expandedNodes().has(id) }

  toggleNode(id: string) {
    const next = new Set(this.expandedNodes())
    if (next.has(id)) next.delete(id)
    else next.add(id)
    this.expandedNodes.set(next)
  }

  ngOnInit() { this.fetchTree() }
}
