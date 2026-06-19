import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, Loader2, LucideIconData } from 'lucide-angular'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './btn.html',
  host: {
    style: 'display: inline-flex; align-items: stretch;',
  },
})
export class Btn {
  @Input() variant: Variant = 'primary'
  @Input() size: Size = 'md'
  @Input() loading = false
  @Input() disabled = false
  @Input() icon: LucideIconData | null = null
  @Input() type: 'button' | 'submit' | 'reset' = 'button'

  readonly Loader2 = Loader2

  variantClasses: Record<Variant, string> = {
    primary:   'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    outline:   'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  }

  sizeClasses: Record<Size, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-base gap-2',
  }

  iconSizes: Record<Size, number> = { sm: 14, md: 15, lg: 17 }

  get btnClass(): string {
    return [
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-60',
      this.variantClasses[this.variant],
      this.sizeClasses[this.size],
    ].join(' ')
  }

  get iconSize(): number {
    return this.iconSizes[this.size]
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading
  }
}
