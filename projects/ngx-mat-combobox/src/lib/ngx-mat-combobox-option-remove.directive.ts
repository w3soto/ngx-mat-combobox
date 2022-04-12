import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { NgxMatCombobox } from "./ngx-mat-combobox.component";
import { fromEvent, Subject, takeUntil, tap } from "rxjs";
import { first } from "rxjs/operators";

@Directive({
  selector: '[ngxMatComboboxOptionRemove]',
  host: {
    'class': 'ngx-mat-combobox-option-remove'
  }
})
export class NgxMatComboboxOptionRemoveDirective implements OnDestroy, AfterViewInit{

  @Input('ngxMatComboboxOptionRemove')
  set option(option: any) {
    this._option = option;
  }
  private _option?: any;

  private _destroyed: Subject<void> = new Subject<void>();

  constructor(
    public _elementRef: ElementRef,
    public _combo: NgxMatCombobox,
    private _ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {

    // TODO - process in combobox !!!
    // emit events via @Output() and handle inside combobox component
    // using @ContentChildren + @ViewChildren

    fromEvent<any>(this._elementRef.nativeElement, 'click', {capture: true}).pipe(
      tap(e => {
        e.stopPropagation();
        e.preventDefault();
        if (this._option) {
          this._combo.deselectOption(this._option);
          this._ngZone.onStable.pipe(first()).subscribe(() => this._combo.alignDropdown());
        }
        this._ngZone.runTask(() => {
          this._combo.focus()
        });
      }),
      takeUntil(this._destroyed)
    ).subscribe();

    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'focus').pipe(
      tap(e => this._combo.onFocus(e)),
      takeUntil(this._destroyed)
    ).subscribe();

    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'blur').pipe(
      tap(e => this._combo.onBlur(e)),
      takeUntil(this._destroyed)
    ).subscribe();

  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

}
