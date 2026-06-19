import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { LucideAngularModule, Users, Shield, Lock, Activity, LucideIconData } from 'lucide-angular'
import { MainLayout } from '../../shared/components/layout/main-layout/main-layout'
import { AuthService } from '../../core/services/auth.service'

interface Stat {
  label: string
  icon: LucideIconData
  color: string
  hint: string
}

interface QuickLink {
  href: string
  label: string
  icon: LucideIconData
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, MainLayout],
  templateUrl: './dashboard.html',
})
export class DashboardPage {
  private auth = inject(AuthService)

  get user() { return this.auth.user() }

  stats: Stat[] = [
    { label: 'Total Users',  icon: Users,    color: 'bg-blue-500',   hint: 'Manage via Users menu' },
    { label: 'Total Roles',  icon: Shield,   color: 'bg-purple-500', hint: 'Manage via Roles menu' },
    { label: 'Permissions',  icon: Lock,     color: 'bg-green-500',  hint: 'View via Permissions menu' },
    { label: 'API Status',   icon: Activity, color: 'bg-orange-500', hint: 'All systems operational' },
  ]

  quickLinks: QuickLink[] = [
    { href: '/users',       label: 'Manage Users',     icon: Users  },
    { href: '/roles',       label: 'Manage Roles',     icon: Shield },
    { href: '/permissions', label: 'View Permissions', icon: Lock   },
  ]
}
