import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, Loader2 } from 'lucide-angular'

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app-spinner.html',
})
export class AppSpinner {
  @Input() wrapClass = ''
  readonly Loader2 = Loader2
}
