import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'gray'

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-badge.html',
})
export class AppBadge {
  @Input() variant: BadgeVariant = 'gray'

  styles: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-700',
    danger:  'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info:    'bg-blue-100 text-blue-700',
    gray:    'bg-gray-100 text-gray-600',
  }

  get badgeClass(): string {
    return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${this.styles[this.variant]}`
  }
}
