import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, AlertTriangle } from 'lucide-angular'
import { AppModal } from '../app-modal/app-modal'
import { Btn } from '../btn/btn'

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppModal, Btn],
  templateUrl: './app-confirm-dialog.html',
})
export class AppConfirmDialog {
  @Input() open = false
  @Input() message = ''
  @Input() title = 'Confirm Action'
  @Input() confirmLabel = 'Delete'
  @Input() loading = false
  @Output() closed = new EventEmitter<void>()
  @Output() confirmed = new EventEmitter<void>()

  readonly AlertTriangle = AlertTriangle
}
