import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { LucideAngularModule, Home, ArrowLeft } from 'lucide-angular'
import { Btn } from '../../../shared/components/ui/btn/btn'

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Btn],
  templateUrl: './not-found.html',
})
export class NotFoundPage {
  readonly Home = Home
  readonly ArrowLeft = ArrowLeft
}
