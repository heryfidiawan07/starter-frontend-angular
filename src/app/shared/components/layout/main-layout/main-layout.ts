import { Component, Input, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Sidebar } from '../sidebar/sidebar'
import { Header } from '../header/header'

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, Sidebar, Header],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  @Input() title = ''
  sidebarOpen = signal(false)

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v)
  }

  closeSidebar() {
    this.sidebarOpen.set(false)
  }
}
