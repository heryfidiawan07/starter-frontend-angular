import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, Zap } from 'lucide-angular'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  @Input() title = ''
  @Input() subtitle = ''
  readonly Zap = Zap
}
