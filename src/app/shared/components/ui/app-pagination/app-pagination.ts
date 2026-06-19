import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular'
import type { PageMeta } from '../../../../core/models/index'

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app-pagination.html',
})
export class AppPagination {
  @Input() meta!: PageMeta
  @Output() pageChange = new EventEmitter<number>()

  readonly ChevronLeft = ChevronLeft
  readonly ChevronRight = ChevronRight

  get from(): number {
    return (this.meta.page - 1) * this.meta.per_page + 1
  }

  get to(): number {
    return Math.min(this.meta.page * this.meta.per_page, this.meta.total)
  }

  get pages(): (number | '...')[] {
    const { page, total_page } = this.meta
    const nums = Array.from({ length: total_page }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === total_page || Math.abs(p - page) <= 1)

    const result: (number | '...')[] = []
    nums.forEach((p, idx) => {
      if (idx > 0 && p - nums[idx - 1] > 1) result.push('...')
      result.push(p)
    })
    return result
  }

  changePage(p: number | '...') {
    if (typeof p === 'number') this.pageChange.emit(p)
  }

  isNumber(p: number | '...'): boolean {
    return typeof p === 'number'
  }
}
