import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

type AvatarSize = 'sm' | 'md' | 'lg'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-avatar.html',
})
export class AppAvatar {
  @Input() src: string | null = null
  @Input() name = ''
  @Input() size: AvatarSize = 'md'

  sizeClasses: Record<AvatarSize, string> = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-16 h-16 text-xl',
  }

  get sizeClass(): string {
    return this.sizeClasses[this.size]
  }

  get initials(): string {
    if (!this.name) return '?'
    return this.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }
}
