import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { Highlightable, ListKeyManagerOption } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";


@Component({
  selector: 'ngx-mat-combobox-option',
  templateUrl: './ngx-mat-combobox-option.component.html',
  styleUrls: ['./ngx-mat-combobox-option.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ngx-mat-combobox-option'
  }
})
export class NgxMatComboboxOption implements OnInit, Highlightable, ListKeyManagerOption {

  @Input()
  set active(val: BooleanInput) {
    this._active = coerceBooleanProperty(val);
  }
  get active(): boolean {
    return this._active;
  }
  private _active: boolean = false;

  @Input()
  set selected(val: BooleanInput) {
    this._selected = coerceBooleanProperty(val);
  }
  get selected(): boolean {
    return this._selected;
  }
  private _selected: boolean = false;

  @Input()
  disabled: boolean | undefined;

  @HostBinding('class.ngx-mat-combobox-option-selected')
  get _applySelectedClass(): boolean {
    return this._selected;
  }

  @HostBinding('class.ngx-mat-combobox-option-active')
  get _applyActiveClass(): boolean {
    return this._active;
  }

  get nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  constructor(
    private _elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  setActiveStyles(): void {
    this._active = true;
  }

  setInactiveStyles(): void {
    this._active = false;
  }

  getLabel(): string {
    return this._elementRef.nativeElement.textContent || '';
  }


}
