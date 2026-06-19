import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import {
  LucideAngularModule,
  Zap, LogIn, UserPlus, ShieldCheck, RefreshCw, Globe,
  Database, ArrowRight, Lock, Users, Shield,
  LucideIconData,
} from 'lucide-angular'
import { Btn } from '../../shared/components/ui/btn/btn'

interface Feature {
  icon: LucideIconData
  title: string
  description: string
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Btn],
  templateUrl: './welcome.html',
})
export class WelcomePage {
  readonly Zap = Zap
  readonly LogIn = LogIn
  readonly UserPlus = UserPlus
  readonly ArrowRight = ArrowRight
  readonly Lock = Lock

  backends = ['Golang', 'Node.js', 'Java', '.NET', 'Python', 'Rust']

  features: Feature[] = [
    { icon: ShieldCheck, title: 'JWT Authentication',  description: 'Access & refresh tokens stored in database, fully revocable.' },
    { icon: Globe,       title: 'OAuth 2.0',           description: 'Login with Google or Facebook via raw HTTP — no heavy SDKs.' },
    { icon: Users,       title: 'User Management',     description: 'Full CRUD with photo upload, role assignment, and soft delete.' },
    { icon: Shield,      title: 'Role & Permission',   description: 'Hierarchical permissions (category → menu → action) per role.' },
    { icon: RefreshCw,   title: 'Token Revocation',    description: 'Refresh tokens tracked in DB — logout from any device anytime.' },
    { icon: Database,    title: 'Multi-Database',      description: 'MySQL, PostgreSQL, SQLite, and SQL Server — switch via .env.' },
  ]

  currentYear = new Date().getFullYear()
}
