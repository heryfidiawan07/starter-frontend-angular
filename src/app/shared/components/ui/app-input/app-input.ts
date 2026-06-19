import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms'
import { LucideAngularModule, LucideIconData } from 'lucide-angular'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './app-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInput),
      multi: true,
    },
  ],
})
export class AppInput implements ControlValueAccessor {
  @Input() label = ''
  @Input() error = ''
  @Input() hint = ''
  @Input() leftIcon: LucideIconData | null = null
  @Input() required = false
  @Input() type = 'text'
  @Input() placeholder = ''
  @Input() disabled = false

  value = ''
  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  writeValue(val: string): void { this.value = val ?? '' }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn }
  registerOnTouched(fn: () => void): void { this.onTouched = fn }
  setDisabledState(disabled: boolean): void { this.disabled = disabled }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value
    this.value = val
    this.onChange(val)
  }

  onBlur() { this.onTouched() }

  get inputClass(): string {
    return [
      'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      'disabled:bg-gray-50 disabled:cursor-not-allowed',
      this.error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
      this.leftIcon ? 'pl-10' : 'pl-3',
      'pr-3 py-2 h-9',
    ].join(' ')
  }
}
