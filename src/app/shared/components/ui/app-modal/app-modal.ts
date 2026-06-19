import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, X } from 'lucide-angular'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app-modal.html',
})
export class AppModal implements OnChanges {
  @Input() open = false
  @Input() title = ''
  @Input() size: ModalSize = 'md'
  @Output() closed = new EventEmitter<void>()

  readonly X = X

  sizeClasses: Record<ModalSize, string> = {
    sm:   'max-w-sm',
    md:   'max-w-md',
    lg:   'max-w-lg',
    xl:   'max-w-2xl',
    '2xl': 'max-w-3xl',
  }

  get sizeClass(): string {
    return this.sizeClasses[this.size]
  }

  close() {
    this.closed.emit()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      document.body.style.overflow = this.open ? 'hidden' : ''
    }
  }
}
