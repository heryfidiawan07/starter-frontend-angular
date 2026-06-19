import { Component, Input, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms'
import { LucideAngularModule, ChevronDown, LucideIconData } from 'lucide-angular'

export interface SelectOption {
  value: string
  label: string
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './app-select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelect),
      multi: true,
    },
  ],
})
export class AppSelect implements ControlValueAccessor {
  @Input() label = ''
  @Input() error = ''
  @Input() options: SelectOption[] = []
  @Input() placeholder = ''
  @Input() leftIcon: LucideIconData | null = null
  @Input() required = false
  @Input() disabled = false

  readonly ChevronDown = ChevronDown

  value = ''
  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  writeValue(val: string): void { this.value = val ?? '' }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn }
  registerOnTouched(fn: () => void): void { this.onTouched = fn }
  setDisabledState(disabled: boolean): void { this.disabled = disabled }

  onNgModelChange(val: string) {
    this.onChange(val)
    this.onTouched()
  }

  get selectClass(): string {
    return [
      'w-full h-9 pr-8 rounded-lg border text-sm text-gray-900 bg-white',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      'appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed',
      this.leftIcon ? 'pl-8' : 'pl-3',
      this.error ? 'border-red-400' : 'border-gray-300',
    ].join(' ')
  }
}
