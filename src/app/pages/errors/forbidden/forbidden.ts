import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { LucideAngularModule, ArrowLeft, LayoutDashboard } from 'lucide-angular'
import { Btn } from '../../../shared/components/ui/btn/btn'

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Btn],
  templateUrl: './forbidden.html',
})
export class ForbiddenPage {
  private router = inject(Router)

  readonly ArrowLeft = ArrowLeft
  readonly LayoutDashboard = LayoutDashboard

  goBack() { window.history.back() }
  goDashboard() { this.router.navigate(['/dashboard']) }
}
