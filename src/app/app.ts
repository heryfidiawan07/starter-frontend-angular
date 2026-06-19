import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AuthService } from './core/services/auth.service'
import { AuthApiService } from './core/services/auth-api.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private auth = inject(AuthService)
  private authApi = inject(AuthApiService)

  ngOnInit() {
    this.auth.initFromStorage()
    if (this.auth.isAuthenticated()) {
      this.authApi.me().subscribe({
        next: (res) => { if (res.data) this.auth.setUser(res.data) },
        error: () => {},
      })
    }
  }
}
