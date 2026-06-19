import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { LucideAngularModule, RefreshCw, Home } from 'lucide-angular'
import { Btn } from '../../../shared/components/ui/btn/btn'

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Btn],
  templateUrl: './server-error.html',
})
export class ServerErrorPage {
  private router = inject(Router)

  readonly RefreshCw = RefreshCw
  readonly Home = Home

  retry() { window.location.reload() }
  goHome() { this.router.navigate(['/']) }
}
