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
    'class': 'mat-primary ngx-mat-combobox-option',
    'tabindex': '-1',
    'role': 'list-item',
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
  set disabled(val: BooleanInput) {
    this._disabled = coerceBooleanProperty(val);
  }
  get disabled(): boolean {
    return  this._disabled;
  }
  private _disabled: boolean = false;

  @Input()
  set multiple(val: BooleanInput) {
    this._multiple = coerceBooleanProperty(val);
  }
  get multiple(): boolean {
    return  this._multiple;
  }
  private _multiple: boolean = false;

  @HostBinding('class.ngx-mat-combobox-option-selected')
  get _applySelectedClass(): boolean {
    return this._selected;
  }

  @HostBinding('class.ngx-mat-combobox-option-active')
  get _applyActiveClass(): boolean {
    return this._active;
  }

  @HostBinding('class.ngx-mat-combobox-option-multiple')
  get _applyMultipleClass(): boolean {
    return this._multiple;
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
