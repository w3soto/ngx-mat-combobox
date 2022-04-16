import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: 'input[ngxMatComboboxInput]',
  host: {
    'class': 'ngx-mat-combobox-input mat-input-element',
    // use keyup instead of input (input does not fire when deleting last character by backspace)
    '(keyup)': '_handleChanges($event)'
  }
})
export class NgxMatComboboxInputDirective implements OnDestroy{

  get nativeElement(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  get length(): number {
    return this.getValue().trim().length;
  }

  @Output()
  readonly valueChanges: EventEmitter<string> = new EventEmitter<string>();

  _initialized: boolean = false;

  private _value: string = '';

  constructor(
    public _elementRef: ElementRef<HTMLInputElement>
  ) {
  }

  ngOnDestroy(): void {
    this.valueChanges.complete();
  }

  focus() {
    this._elementRef.nativeElement.focus();
  }

  setValue(val: string) {
    this._elementRef.nativeElement.value = val || '';
  }

  getValue(): string {
    return this._elementRef.nativeElement.value || '';
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  hasValue(): boolean {
    return this.length > 0;
  }

  _handleChanges(event: InputEvent) {
    const value = this._elementRef.nativeElement.value;
    if (this._value != value) {
      this.valueChanges.emit(value);
      this._value = value;
    }
  }

}
