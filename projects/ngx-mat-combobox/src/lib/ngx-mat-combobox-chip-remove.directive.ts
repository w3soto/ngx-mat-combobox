import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from "rxjs";

@Directive({
  selector: '[ngxMatComboboxChipRemove]',
  host: {
    'class': 'ngx-mat-combobox-chip-remove',
    '(click)': '_handleClick($event)'
  }
})
export class NgxMatComboboxChipRemoveDirective implements OnDestroy {

  @Input('ngxMatComboboxChipRemove')
  set option(option: any) {
    this._option = option;
  }
  private _option?: any;

  @Output()
  readonly removeClick: EventEmitter<any> = new EventEmitter<any>();

  private _destroyed: Subject<void> = new Subject<void>();

  constructor(
    public _elementRef: ElementRef<any>
  ) {}

  ngOnDestroy(): void {
    this.removeClick.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  _handleClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.removeClick.emit(this._option);
  }

}
