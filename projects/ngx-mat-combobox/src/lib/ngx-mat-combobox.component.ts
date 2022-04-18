import {
  Attribute, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild, ContentChildren,
  Directive,
  ElementRef, EventEmitter, HostBinding,
  Inject,
  Input, isDevMode,
  NgZone, OnChanges,
  OnDestroy,
  OnInit,
  Optional, Output,
  QueryList,
  Self, SimpleChanges,
  TemplateRef, TrackByFunction,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from "@angular/forms";

import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from "@angular/cdk/coercion";
import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import {
  ActiveDescendantKeyManager,
  ConfigurableFocusTrap,
  ConfigurableFocusTrapFactory,
  FocusMonitor, InteractivityChecker
} from "@angular/cdk/a11y";
import { TemplatePortal } from "@angular/cdk/portal";

import {
  BehaviorSubject,
  debounceTime,
  first,
  fromEvent,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
  tap
} from "rxjs";
import { delay, finalize, map } from "rxjs/operators";

import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from "@angular/material/form-field";

import {
  NGX_MAT_COMBOBOX_DEFAULT_OPTIONS,
  NgxMatComboboxMapOptionsFn,
  NgxMatComboboxDefaultOptions,
  NgxMatComboboxFilterOptionsFn,
  NgxMatComboboxAccessorFn,
  NgxMatComboboxCompareOptionsFn
} from "./ngx-mat-combobox.model";
import { NgxMatComboboxOption } from "./ngx-mat-combobox-option.component";
import { asObservable, createOptionPropertyAccessorFn, devLog, isEqual } from "./ngx-mat-combobox.utils";
import { NgxMatComboboxInputDirective } from "./ngx-mat-combobox-input.directive";
import { ErrorStateMatcher } from "@angular/material/core";
import { NgxMatComboboxChipRemoveDirective } from "./ngx-mat-combobox-chip-remove.directive";


@Directive({
  selector: 'ng-template[ngxMatComboboxDisplay]',
})
export class NgxMatComboboxDisplayDirective {
}


@Directive({
  selector: 'ng-template[ngxMatComboboxOption]',
})
export class NgxMatComboboxOptionDirective {
}


@Directive({
  selector: '[ngxMatComboboxHeader],[ngx-mat-combobox-header]',
})
export class NgxMatComboboxHeaderDirective {
}


@Directive({
  selector: '[ngxMatComboboxFooter],[ngx-mat-combobox-footer]',
})
export class NgxMatComboboxFooterDirective {
}


@Directive({
  selector: '[ngxMatComboboxNoOption],[ngx-mat-combobox-no-option]',
})
export class NgxMatComboboxNoOptionDirective {
}


@Component({
  selector: 'ngx-mat-combobox',
  templateUrl: './ngx-mat-combobox.component.html',
  styleUrls: ['./ngx-mat-combobox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ngx-mat-combobox',
    'role': 'combobox',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-controls]': 'opened ? (id + "-dropdown") : null',
    '[attr.aria-expanded]': 'opened',
    '[attr.aria-describedby]': 'ariaDescribedby',
    //'[attr.aria-label]': 'ariaLabel || null',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[class.ngx-mat-combobox-disabled]': 'disabled',
    '[class.ngx-mat-combobox-invalid]': 'errorState',
    '[class.ngx-mat-combobox-required]': 'required',
    '[class.ngx-mat-combobox-empty]': 'empty',
    '[class.ngx-mat-combobox-multiple]': 'multiple',
    '(click)': 'onClick($event)', // handled by onContainerClick() from MatFormFieldControl interface
    '(focus)': 'onFocus($event)',
    '(blur)': 'onBlur($event)',
    '(keydown)': 'onKeydown($event)',
  },
  providers: [{
    provide: MatFormFieldControl, useExisting: NgxMatCombobox
  }],
  exportAs: 'ngxMatCombobox'
})
export class NgxMatCombobox implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, MatFormFieldControl<any> {

  //
  // MatFormFieldControl interface
  //

  static nextId = 0;

  @HostBinding('attr.id')
  id: string = `ngx-mat-combobox-${NgxMatCombobox.nextId++}`;

  controlType: string = 'ngx-mat-combobox';

  setDescribedByIds(ids: string[]): void {
    this.ariaDescribedby = ids.join(' ');
  }

  ariaDescribedby: string | null = null;

  onContainerClick(e: MouseEvent): void {
    this.onClick(e);
  }

  errorState: boolean = false;

  autofilled?: boolean;

  @Input()
  set placeholder(value: string) {
    this._placeholder = value
    this._stateChanges.next();;
  }
  get placeholder(): string {
    return this._placeholder;
  }
  private _placeholder: string = '';

  @Input()
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this._stateChanges.next();
  }
  get required(): boolean {
    return this._required || !!this.ngControl?.control?.hasValidator(Validators.required);
  }
  private _required = false;

  @Input()
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._stateChanges.next();
  }
  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled = false;

  get stateChanges(): Observable<void> {
    return this._stateChanges.asObservable();
  }
  private _stateChanges: Subject<void> = new Subject<void>();

  get focused(): boolean {
    return this._focused;
  };
  private _focused: boolean = false;

  get empty() {
    return this._value.length === 0;
  }

  get shouldLabelFloat() {
    return this._focused || this._value.length > 0 || !!this.input?.hasValue();
  }

  set value(value: any) {
    if (typeof value === 'undefined' || value === null || value === '') {
      value = [];
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
    // unique values
    value = Array.from(new Set(value));
    // limit
    if (!this._multiple && value.getLength > 1) {
      value.splice(1, value.getLength - 1);
    }
    else if (this._multiple && this._maxValues > 0) {
      value.splice(this._maxValues, value.getLength - this._maxValues);
    }
    // check
    if (isDevMode() && this._useValue) {
      if ((value as Array<any>).find(o => typeof o == 'object')) {
        devLog('Option [useValue] is set, but objects(s) were provided!');
      }
    }
    // !!! update only on changes !!!
    if (!isEqual(this._value, value)) {
      this._value = [...value];
      this._updateSelectedOptionsModel();
    }
  }
  get value(): any {
    return this._multiple ? this._value : (this._value.length ? this._value[0] : null);
  }
  private _value: any[] = [];

  //
  // ControlValueAccessor interface
  //

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  private _onChange: any = (val: any) => {};

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  private _onTouched: any = () => {};

  //
  // Custom functionality
  //

  readonly tabIndex!: number;

  @Input()
  set readonly(val: BooleanInput) {
    this._readonly = coerceBooleanProperty(val);
    this._stateChanges.next();
  }
  get readonly(): boolean {
    return this._readonly;
  }
  private _readonly: boolean = false;

  @Input()
  set mapOptionsFn(mapOptionsFn: NgxMatComboboxMapOptionsFn) {
    this._mapOptionsFn = mapOptionsFn;
  }
  private _mapOptionsFn?: NgxMatComboboxMapOptionsFn;

  @Input()
  set filterOptionsFn(filterOptionsFn: NgxMatComboboxFilterOptionsFn) {
    this._filterOptionsFn = filterOptionsFn;
  }
  private _filterOptionsFn?: NgxMatComboboxFilterOptionsFn;

  @Input()
  set compareOptionsFn(compareOptionsFn: NgxMatComboboxCompareOptionsFn) {
    this._compareOptionsFn = compareOptionsFn;
  }
  private _compareOptionsFn: NgxMatComboboxCompareOptionsFn = (o1: any, o2: any): boolean => {
    return this._valueAccessor ? (this._valueAccessor(o1) == this._valueAccessor(o2)) : isEqual(o1, o2);
  };

  /**
   * Static options
   */
  @Input()
  set options(options: any[]) {
    this._options = options;
    this._filteredOptionsModel.next(options);
  }
  private _options: any[] = [];

  /**
   * Property of option which holds the 'value' or accessor function
   */
  @Input()
  set valueAccessor(accessor: string | NgxMatComboboxAccessorFn) {
    this._valueAccessor = typeof accessor == 'string' ? createOptionPropertyAccessorFn(accessor) : accessor;
  }
  private _valueAccessor?: NgxMatComboboxAccessorFn;

  /**
   * Property of option which holds the 'label' or accessor function
   */
  @Input()
  set labelAccessor(accessor: string | NgxMatComboboxAccessorFn) {
    this._labelAccessor = typeof accessor == 'string' ? createOptionPropertyAccessorFn(accessor) : accessor;
  }
  private _labelAccessor?: NgxMatComboboxAccessorFn;

  /**
   * Property of option which holds the 'selection label' or accessor function
   */
  @Input()
  set displayAccessor(accessor: string | NgxMatComboboxAccessorFn) {
    this._displayAccessor = typeof accessor == 'string' ? createOptionPropertyAccessorFn(accessor) : accessor;
  }
  private _displayAccessor?: NgxMatComboboxAccessorFn;

  /**
   * Property of option's object which holds the 'disabled' status or accessor function
   */
  @Input()
  set disabledAccessor(accessor: string | NgxMatComboboxAccessorFn) {
    this._disabledAccessor = typeof accessor == 'string' ? createOptionPropertyAccessorFn(accessor) : accessor;
  }
  private _disabledAccessor?: NgxMatComboboxAccessorFn;

  /**
   * TrackByFunction
   */
  @Input()
  set trackOptionByFn(fn: TrackByFunction<any>) {
    this._trackOptionByFn = fn;
  }
  _trackOptionByFn: TrackByFunction<any> = (index: number, option: any) => {
    return 'ngx-combobox-option-' + (this._valueAccessor ? this._valueAccessor(option) : JSON.stringify(option));
  };

  /**
   * If set, component will emit option's value using provided valueAccessor.
   */
  @Input()
  set useValue(val: BooleanInput) {
    this._useValue = coerceBooleanProperty(val);
  }
  get useValue(): boolean {
    return this._useValue;
  }
  private _useValue: boolean = false;

  /**
   * If set, autocomplete input will be filled with option's display or label value.
   */
  @Input()
  set fillInput(val: BooleanInput) {
    this._fillInput = coerceBooleanProperty(val);
  }
  get fillInput(): boolean {
    return this._fillInput;
  }
  private _fillInput: boolean = false;

  /**
   * If set, dropdown will be automatically opened when focused
   */
  @Input()
  set autoOpen(val: BooleanInput) {
    this._autoOpen = coerceBooleanProperty(val);
  }
  get autoOpen(): boolean {
    return this._autoOpen;
  }
  private _autoOpen: boolean = false;

  /**
   * If set, first option in dropdown will be automatically activated (if no option is selected). Works only in
   * single selection mode without autocomplete mode.
   */
  @Input()
  set autoActivate(val: BooleanInput) {
    this._autoActivate = coerceBooleanProperty(val);
  }
  get autoActivate(): boolean {
    return this._autoActivate;
  }
  _autoActivate = false;

  /**
   * If set, value will be updated (selected) as users moves with up/down arrows through dropdown list.
   * Works only in single selection without autocomplete mode. In multiple selection/autocomplete mode user has to
   * click or hit enter/space to select active option.
   */
  @Input()
  set autoSelect(val: BooleanInput) {
    this._autoSelect = coerceBooleanProperty(val);
  }
  get autoSelect(): boolean {
    return this._autoSelect;
  }
  private _autoSelect: boolean = false;

  /**
   * Define single/multiple selection
   */
  @Input()
  set multiple(val: BooleanInput) {
    this._multiple = coerceBooleanProperty(val);
  }
  get multiple(): boolean {
    return this._multiple;
  }
  private _multiple: boolean = false;

  /**
   * Limit multiple selection values
   */
  @Input()
  set maxValues(val: NumberInput) {
    this._maxValues = Math.max(coerceNumberProperty(val, 0), 0);
  }
  get maxValues(): number {
    return this._maxValues;
  }
  private _maxValues: number = 0;

  /**
   * Wrap selected options list
   */
  @Input()
  set noWrap(val: BooleanInput) {
    this._noWrap = coerceBooleanProperty(val);
  }
  get noWrap(): boolean {
    return this._noWrap;
  }
  private _noWrap: boolean = false;

  /**
   * Enable autocomplete
   */
  @Input()
  set autocomplete(val: BooleanInput) {
    this._autocomplete = coerceBooleanProperty(val);
  }
  get autocomplete(): boolean {
    return this._autocomplete;
  }
  private _autocomplete: boolean = false;

  /**
   * Autocomplete delay
   */
  @Input()
  set autocompleteDebounceInterval(val: NumberInput) {
    this._autocompleteDebounceInterval = Math.max(coerceNumberProperty(val, 400), 0);
    this._initializeInput(this.input);
  }
  get autocompleteDebounceInterval(): number {
    return this._autocompleteDebounceInterval;
  }
  private _autocompleteDebounceInterval: number = 400;

  /**
   * Autocomplete min chars
   */
  @Input()
  set autocompleteMinChars(val: NumberInput) {
    this._autocompleteMinChars = Math.max(coerceNumberProperty(val, 0), 0);
    this._initializeInput(this.input);
  }
  get autocompleteMinChars(): number {
    return this._autocompleteMinChars;
  }
  private _autocompleteMinChars: number = 0;

  /**
   * Use chips instead of comma-separated text values
   */
  @Input()
  set useChips(val: BooleanInput) {
    this._useChips = coerceBooleanProperty(val);
  }
  get useChips(): boolean {
    return this._useChips;
  }
  private _useChips: boolean = false;

  @Input()
  chipsColor?: string;

  @Input()
  set disableChipsRemove(val: BooleanInput) {
    this._disableChipsRemove = coerceBooleanProperty(val);
  }
  get disableChipsRemove(): boolean {
    return this._disableChipsRemove;
  }
  private _disableChipsRemove: boolean = false;

  @Input()
  set disableChipsRipple(val: BooleanInput) {
    this._disableChipsRipple = coerceBooleanProperty(val);
  }
  get disableChipsRipple():boolean {
    return this._disableChipsRipple;
  }
  private _disableChipsRipple:boolean = false;

  /**
   * Show toggle indicator
   */
  @Input()
  set showToggleTrigger(val: BooleanInput) {
    this._showToggleTrigger = coerceBooleanProperty(val);
  }
  get showToggleTrigger(): boolean {
    return this._showToggleTrigger;
  }
  private _showToggleTrigger: boolean = true;

  /**
   * Show loading indicator
   */
  @Input()
  set showLoadingSpinner(val: BooleanInput) {
    this._showLoadingSpinner = coerceBooleanProperty(val);
  }
  get showLoadingSpinner(): boolean {
    return this._showLoadingSpinner;
  }
  private _showLoadingSpinner: boolean = true;

  @Input()
  set loadingSpinnerDiameter(val: NumberInput) {
    this._loadingSpinnerDiameter = coerceNumberProperty(val);
  }
  get loadingSpinnerDiameter(): number {
    return this._loadingSpinnerDiameter;
  }
  private _loadingSpinnerDiameter!: number;

  @Input()
  set loadingSpinnerStrokeWidth(val: NumberInput) {
    this._loadingSpinnerStrokeWidth = coerceNumberProperty(val);
  }
  get loadingSpinnerStrokeWidth(): number {
    return this._loadingSpinnerStrokeWidth;
  }
  private _loadingSpinnerStrokeWidth: number = 2;

  @Input()
  loadingSpinnerColor: string = 'primary';

  /**
   * Disable options ripple
   */
  @Input()
  set disableOptionsRipple(val: BooleanInput) {
    this._disableOptionsRipple = coerceBooleanProperty(val);
  }
  get disableOptionsRipple(): boolean {
    return this._disableOptionsRipple;
  }
  private _disableOptionsRipple: boolean = false;

  @Input()
  optionsCheckboxColor?: string;

  /**
   * Dropdown panel class
   */
  @Input()
  dropdownClass?: string;

  /**
   * Dropdown width based on field width
   */
  @Input()
  set dropdownMatchFieldWidth(val: BooleanInput) {
      this._dropdownMatchFieldWidth = coerceBooleanProperty(val);
  }
  private _dropdownMatchFieldWidth: boolean = true;

  /**
   * Dropdown align
   */
  @Input()
  set dropdownAlign(align: 'start' | 'center' | 'end') {
    this._dropdownAlign = align;
  }
  private _dropdownAlign: 'start' | 'center' | 'end' = 'start';

  /**
   * Dropdown X offset
   */
  @Input()
  set dropdownOffsetX(val: NumberInput) {
    this._dropdownOffsetX = coerceNumberProperty(val);
  }
  private _dropdownOffsetX: number = 0;

  /**
   * Dropdown Y offset
   */
  @Input()
  set dropdownOffsetY(val: NumberInput) {
    this._dropdownOffsetY = coerceNumberProperty(val);
  }
  private _dropdownOffsetY: number = 0;

  /**
   * Autofocus first element in custom dropdown template
   */
  @Input()
  set dropdownAutoFocus(val: BooleanInput) {
    this._dropdownAutoFocus = coerceBooleanProperty(val);
  }
  private _dropdownAutoFocus: boolean = false;

  /**
   * Trap focus in custom dropdown template
   */
  @Input()
  set dropdownTrapFocus(val: BooleanInput) {
    this._dropdownTrapFocus = coerceBooleanProperty(val);
  }
  private _dropdownTrapFocus: boolean = false;

  /**
   * Dropdown key navigation wrap
   */
  @Input()
  set dropdownKeyNavWrap(val: BooleanInput) {
    this._dropdownKeyNavWrap = coerceBooleanProperty(val);
  }
  private _dropdownKeyNavWrap: boolean = true;

  /**
   * Dropdown key navigation HOME and END keys. Ignored in autocomplete mode.
   */
  @Input()
  set dropdownKeyNavHomeAndEnd(val: BooleanInput) {
    this._dropdownKeyNavHomeAndEnd = coerceBooleanProperty(val);
  }
  private _dropdownKeyNavHomeAndEnd?: boolean;

  /**
   * Dropdown key navigation HOME and END keys. Ignored in autocomplete mode.
   */
  @Input()
  set dropdownKeyNavTypeAhead(val: BooleanInput) {
    this._dropdownKeyNavTypeAhead = coerceBooleanProperty(val);
  }
  private _dropdownKeyNavTypeAhead: boolean = true;

  /**
   * Custom no option text
   */
  @Input()
  set noOptionText(val: string) {
    this._noOptionText = val;
  }
  get noOptionText(): string {
    return this._noOptionText
  }
  private _noOptionText: string = 'No Results';

  /**
   * Whether waiting for data from mapOptionsFn's or filterOptionsFn's observable
   */
  get loading(): boolean {
    return this._loading > 0;
  }
  private _loading: number = 0;

  /**
   * Whether dropdown is opened
   */
  get opened(): boolean {
    return this._opened;
  }
  private _opened: boolean = false;

  /**
   * Event emitted when the dropdown has been opened or closed
   */
  @Output()
  readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Event emitted when the selected value has been changed
   */
  @Output()
  readonly selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  /**
   * Selected/displayed options
   */
  get selectedOptions(): BehaviorSubject<any[]> {
    return this._selectedOptionsModel;
  }
  private _selectedOptionsModel: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /**
   * Filtered/dropdown options
   */
  get filteredOptions(): BehaviorSubject<any[]> {
    return this._filteredOptionsModel;
  }
  private _filteredOptionsModel: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /**
   * Autocomplete input reference
   */
  get input(): NgxMatComboboxInputDirective | undefined {
    return this._input;
  }

  @ViewChild(NgxMatComboboxInputDirective)
  set _viewInput(val: NgxMatComboboxInputDirective) {
    this._initializeInput(val);
  }

  @ContentChild(NgxMatComboboxInputDirective)
  set _contentInput(val: NgxMatComboboxInputDirective) {
    this._initializeInput(val);
  }

  private _input?: NgxMatComboboxInputDirective;

  private _inputValueChangeSub?: Subscription;

  /**
   * Remove chips buttons
   */
  @ViewChildren(NgxMatComboboxChipRemoveDirective)
  private _viewChipsRemove?: QueryList<NgxMatComboboxChipRemoveDirective>;

  @ContentChildren(NgxMatComboboxChipRemoveDirective, {descendants: true})
  private _contentChipsRemove?: QueryList<NgxMatComboboxChipRemoveDirective>;

  /**
   * Custom display/selection block template
   */
  @ContentChild(NgxMatComboboxDisplayDirective, {read: TemplateRef})
  readonly _customDisplayTpl?: TemplateRef<any>;

  /**
   * Custom dropdown's option template
   */
  @ContentChild(NgxMatComboboxOptionDirective, {read: TemplateRef})
  readonly _customOptionTpl?: TemplateRef<any>;

  /**
   * Custom dropdown's header template
   */
  @ContentChild(NgxMatComboboxHeaderDirective, {read: TemplateRef})
  readonly _customDropdownHeaderTpl?: TemplateRef<any>;

  /**
   * Custom dropdown's footer template
   */
  @ContentChild(NgxMatComboboxFooterDirective, {read: TemplateRef})
  readonly _customDropdownFooterTpl?: TemplateRef<any>;

  /**
   * Custom dropdown's no option template
   */
  @ContentChild(NgxMatComboboxNoOptionDirective, {read: TemplateRef})
  readonly _customNoOptionTpl?: TemplateRef<any>;

  /**
   * Rendered dropdown's options list
   */
  @ViewChildren(NgxMatComboboxOption)
  readonly _dropdownOptions: QueryList<NgxMatComboboxOption> = new QueryList<NgxMatComboboxOption>();

  @ViewChild('dropdown')
  private _dropdown?: ElementRef;

  @ViewChild('dropdownHeader')
  private _dropdownHeader?: ElementRef;

  @ViewChild('dropdownBody')
  private _dropdownBody?: ElementRef;

  @ViewChild('dropdownFooter')
  private _dropdownFooter?: ElementRef;

  @ViewChild('dropdownTpl')
  private _dropdownTpl!: TemplateRef<any>;

  private _dropdownOverlay?: OverlayRef;

  private _dropdownKeyManager?: ActiveDescendantKeyManager<NgxMatComboboxOption>;

  private _dropdownFocusTrap?: ConfigurableFocusTrap;

  private _dropdownOverlayDestroyed?: Subject<void>;

  // keep last focused element, it will gain focus when user close dropdown
  private _lastFocusedElement?: HTMLElement | null;

  private _mapOptionsSub?: Subscription;

  private _filterOptionsSub?: Subscription;

  private _destroyed: Subject<void> = new Subject<void>();

  constructor(
    public _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _overlay: Overlay,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _focusMonitor: FocusMonitor,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    private _interactivityChecker: InteractivityChecker,
    private _defaultErrorStateMatcher: ErrorStateMatcher,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(NGX_MAT_COMBOBOX_DEFAULT_OPTIONS) private _defaults: NgxMatComboboxDefaultOptions,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(MAT_FORM_FIELD) public formField?: MatFormField,
  ) {

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex) || 0;

    // defaults
    this._disableOptionsRipple = this._defaults?.disableOptionsRipple ?? false;
    this._useChips = this._defaults?.useChips ?? false;
    this._disableChipsRipple = this._defaults?.disableChipsRipple ?? false;
    this._disableChipsRemove = this._defaults?.disableChipsRemove ?? false;
    this._noOptionText = this._defaults?.noOptionText || 'No Results';
  }

  ngOnChanges(changes: SimpleChanges) {
    //this._stateChanges.next();
  }

  ngOnInit(): void {

    // check settings
    if (isDevMode()) {
      if (this._useValue && !this._valueAccessor) {
        devLog('Option [useValue] is set, but no [valueAccessor] is provided!')
      }
      if (this._useValue && this._options.length == 0 && !this._mapOptionsFn) {
        devLog('Option [useValue] is set, but no [options] or [mapOptionsFn] are provided! ')
      }
      // check static options
      this._configCheckOptions(this._options);
    }

    // calculate auto spinner size
    if (typeof this._loadingSpinnerDiameter == 'undefined') {
      const computedStyle = window.getComputedStyle(this._elementRef.nativeElement);
      this._loadingSpinnerDiameter = Number.parseInt(computedStyle.lineHeight);
    }

    // initialize selection model and listen for changes
    this._selectedOptionsModel.pipe(
      tap((options: any[]) => {
        this._configCheckOptions(options);
        const value = options.map(o => this._useValue ? this.readOptionValue(o) : o).slice();
        if (!isEqual(this._value, value)) {
          this._value = value;
          this._onChange(this.value);
        }
        this._updateSearchInput();
        this.selectionChange.next(options);
      }),
      takeUntil(this._destroyed)
    ).subscribe();

    // monitor enter/leave state
    this._focusMonitor.monitor(this._elementRef, true).pipe(
      tap((origin) => {
        if (!this._disabled) {
          this._ngZone.run(() => {
            const focused = !!origin || this._opened;
            if (this._focused != focused) {
              this._focused = focused;
              this._focused ? this.onEnter() : this.onLeave();
              this._stateChanges.next();
            }
          });
        }
      }),
      takeUntil(this._destroyed),
      finalize(() => this._focusMonitor.stopMonitoring(this._elementRef))
    ).subscribe();

    // handle outside click
    fromEvent<MouseEvent>(document.body, 'click').pipe(
      tap((e: any) => this.onOutsideClick(e)),
      takeUntil(this._destroyed)
    ).subscribe();

  }

  ngAfterViewInit() {
    this._viewChipsRemove?.changes.pipe(
      tap(changes => changes.forEach((o: NgxMatComboboxChipRemoveDirective) => this._initializeChipRemove(o))),
      takeUntil(this._destroyed)
    ).subscribe();
  }

  ngAfterContentInit() {
    this._contentChipsRemove?.changes.pipe(
      tap(changes => changes.forEach((o: NgxMatComboboxChipRemoveDirective) => this._initializeChipRemove(o))),
      takeUntil(this._destroyed)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.closeDropdown();
    this._destroyed.next();
    this._destroyed.complete();
    this._mapOptionsSub?.unsubscribe();
    this._filterOptionsSub?.unsubscribe();
    this._stateChanges.complete();

    this.openedChange.complete();
    this.selectionChange.complete();
  }

  /**
   * Initialize search InputDirective provided by @ViewChild or @ContentChild
   */
  private _initializeInput(el?: NgxMatComboboxInputDirective) {
    this._input = el;
    this._inputValueChangeSub?.unsubscribe();
    if (el) {
      this._inputValueChangeSub = el.valueChanges.pipe(
        map(val => val || ''),
        debounceTime(this._autocompleteDebounceInterval),
        tap((query: string) => {
          if (query.length >= this._autocompleteMinChars) {
            this.filter(query)
          }
        }),
        takeUntil(this._destroyed)
      ).subscribe();
    }
    this._elementRef.nativeElement.tabIndex = el ? -1 : this.tabIndex;
  }

  /**
   * Initialize ChipRemoveDirective provided by @ViewChildren or @ContentChildren
   */
  private _initializeChipRemove(el: NgxMatComboboxChipRemoveDirective) {
    el.removeClick.subscribe((option) => {
      if (option) {
        this.deselectOption(option);
        this._ngZone.onStable.pipe(first()).subscribe(() => this.alignDropdown());
      }
      this._ngZone.runTask(() => this.focus());
    });
  }

  //
  // Listeners
  //

  onEnter() {
    if (this._autoOpen) {
      this.filter();
    }
  }

  onLeave() {
    this._updateSearchInput();
    if (!this._fillInput) {
      this.input?.setValue('');
    }
    this._mapOptionsSub?.unsubscribe();
    this._filterOptionsSub?.unsubscribe();
    this._stateChanges.next();
  }

  onFocus(e: Event) {
    if (!this._disabled) {
      this._keepFocusedState();
    }
  }

  onBlur(e: Event) {
    if (this._opened) {
      return;
    }
    if (!this._disabled) {
      this._onTouched();
    }
  }

  onClick(e: MouseEvent) {
    if (this._disabled || this._readonly) {
      return;
    }

    this._keepLastActiveElement(e.target as HTMLElement);
    if (!this._autocomplete || this._autocomplete && this._autocompleteMinChars == 0) {
      if (!this._opened) {
        this.filter();
      }
    }

    // when deleting selected options (chips) using mouse (or ENTER key)
    // we are loosing focus (DOM node is removed) so this will gain focus back
    this._ngZone.onStable.pipe(
      tap(() => document.activeElement === document.body && this.focus()),
      first()
    ).subscribe();

    // do not propagate to formField's onContainerClick() handler
    if (this.formField) {
      e.stopPropagation();
    }
  }

  onKeydown(e: KeyboardEvent) {

    if (this._disabled || this._readonly) {
      return;
    }

    this._keepLastActiveElement(e.target as HTMLElement);

    if (e.code == 'ArrowDown') {
      // open dropdown
      if (!this._opened) {
        this.filter();
        e.preventDefault();
        e.stopPropagation();
      }
    }

    if (e.code == 'Enter') {
      // toggle dropdown
      if (!this._opened) {
        this.filter();
        e.preventDefault();
        e.stopPropagation();
      }
      // close only if no option is activated
      else if (this._dropdownKeyManager?.activeItemIndex == -1) {
        this.closeDropdown();
      }
    }

    if (e.code == 'Backspace') {
      // with autocomplete and empty input
      if (this._autocomplete &&
        (this.input?.isEmpty() || this._fillInput && this.input?.length == 1)) {
        // remove last value
        if (this._multiple) {
          const selection = this._selectedOptionsModel.value;
          this.deselectOption(selection[selection.length - 1]);
        }
        // clear
        else {
          this.clear();
        }
      }
    }

  }

  /**
   * Handle dropdown keyboard navigation
   */
  onDropdownKeydown(e: KeyboardEvent): void {

    const index = this._dropdownKeyManager?.activeItemIndex;

    if (e.code == 'Escape' || e.code == 'Tab' && !this._dropdownTrapFocus) {
      if (!this._fillInput) {
        this.input?.setValue('');
      }
      this._closeDropdownAndFocus(true);
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.code == 'Enter' || e.code == 'Space') && index != null && index > -1) {

      const option = this._filteredOptionsModel.value[index];

      this.multiple ? this.toggleOption(option) : this.selectOption(option);

      // keep focused host/or input element
      if (this.multiple) {
        this._ngZone.onStable.pipe(first()).subscribe(() => {
          this.focus();
          this.alignDropdown();
        });
      }
      // close on single selection mode
      // focus host/or input element (can not focus last active element because list was re-rendered)
      // must be called after filteredOptionsModel changes are propagated to view/DOM
      else {
        this._ngZone.onStable.pipe(first()).subscribe(() => {
          this._closeDropdownAndFocus(false);
        });
      }

      e.preventDefault();
    }

    // handle default keydown action by onDropdownOptionActiveStateChanged()
    this._dropdownKeyManager?.onKeydown(e);
  }

  onDropdownOptionClick(option: any, e: MouseEvent) {

    this._multiple ? this.toggleOption(option) : this.selectOption(option);
    this._dropdownKeyManager?.setActiveItem(this.getFilteredOptionIndex(option));
    // single selection
    if (!this._multiple) {
      // must be called after filteredOptionsModel changes are propagated to view/DOM
      this._ngZone.onStable.pipe(first()).subscribe(() => {
        this._closeDropdownAndFocus(true);
      });
      return;
    }

    this._ngZone.onStable.pipe(first()).subscribe(() => {
      this._focusLastActiveElement();
      this.alignDropdown()
    });

    e.stopPropagation();
  }

  onDropdownOptionActiveStateChanged(index: number) {
    // select in single mode without autocomplete
    // - in autocomplete user has to confirm selection by hitting Enter key
    if (!this._multiple && !this._autocomplete) {

      if (this._autoSelect) {
        this.selectOption(this._filteredOptionsModel.value[index]);
      }
    }

    this.scrollToOption(index);
  }

  /**
   * Handle click outside dropdown & form field
   */
  onOutsideClick(e: MouseEvent) {
    const el = e.target as HTMLElement;
    const hostEl = this._elementRef.nativeElement;
    const formFieldEl = this.formField?._elementRef.nativeElement;
    const dropdownEl = this._dropdown?.nativeElement;

    const isInside = !!hostEl.contains(el) || !!formFieldEl?.contains(el) || !!dropdownEl?.contains(el);

    if (!isInside) {
      this.closeDropdown();
      this._updateSearchInput();
      if (this._focused) {
        this._focused = false;
        this.onLeave();
      }
      this._stateChanges.next();
    }
  }

  //
  // API methods
  //

  focus() {
    if (this._disabled) {
      return
    }
    if (this.input) {
      this.input.focus();
    }
    else {
      this._elementRef.nativeElement.focus();
    }
    this._keepFocusedState();
  }

  openDropdown() {
    if (!this._opened) {
      this._opened = true;
      this._createDropdown();
    }
  }

  closeDropdown() {
    if (this._opened) {
      this._opened = false;
      this._destroyDropdown();
    }
  }

  toggleDropdown() {
    this._opened ? this.closeDropdown() : this.openDropdown();
  }

  /**
   * Add provided option to selection (with respect to maxValues setting)
   */
  selectOption(option: any) {
    if (this._multiple) {
      if (this._maxValues > 0 && this._selectedOptionsModel.value.length < this._maxValues) {
        if (!this.isOptionSelected(option)) {
          this._selectedOptionsModel.next([...this._selectedOptionsModel.value, option]);
        }
      }
    }
    else {
      this._selectedOptionsModel.next([option]);
    }
  }

  /**
   * Add provided options to selection (with respect to maxValues setting)
   */
  selectOptions(options: any[]) {
    if (options.length) {
      if (this._multiple) {
        let newOptions = Array.from(new Set([...this._selectedOptionsModel.value, ...options]));
        if (this._maxValues > 0) {
          newOptions.splice(this._maxValues - 1, newOptions.length - this._maxValues);
        }
        this._selectedOptionsModel.next(newOptions);
      }
      else {
        this._selectedOptionsModel.next([options[0]]);
      }
    }
  }

  /**
   * Remove provided option from selection
   */
  deselectOption(option: any) {
    const options = this._selectedOptionsModel.value;
    const index = this.getSelectedOptionIndex(option);
    if (index > -1) {
      options.splice(index, 1);
      this._selectedOptionsModel.next([...options]);
    }
  }

  /**
   * Remove provided options from selection
   */
  deselectOptions(options: any[]) {
    const newOptions = this._selectedOptionsModel.value
      .filter(a => options.find(b => !this._compareOptionsFn(a, b))).slice();
    this._selectedOptionsModel.next(newOptions);
  }

  toggleOption(option: any) {
    const options = this._selectedOptionsModel.value;
    const index = this.getSelectedOptionIndex(option);
    if (index > -1) {
      options.splice(index, 1);
      this._selectedOptionsModel.next([...options]);
    }
    else {
      if (this._multiple) {
        this._selectedOptionsModel.next([...options, option]);
      }
      else {
        this._selectedOptionsModel.next([option]);
      }
    }
  }

  selectAllFilteredOptions() {
    this.selectOptions(this._filteredOptionsModel.value);
  }

  deselectAllFilteredOptions() {
    this.deselectOptions(this._filteredOptionsModel.value);
  }

  selectAllOptions() {
    this.selectOptions(this._options);
  }

  clear() {
    this._selectedOptionsModel.next([]);
  }

  isOptionSelected(option: any): boolean {
    return this.getSelectedOptionIndex(option) > -1;
  }

  getSelectedOptionIndex(option: any): number {
    return this._selectedOptionsModel.value
      .findIndex(o => this._compareOptionsFn(o, option));
  }

  getFilteredOptionIndex(option: any): number {
    return this._filteredOptionsModel.value
      .findIndex(o => this._compareOptionsFn(o, option));
  }

  scrollToOption(index: number) {
    const panelEl = this._dropdownBody?.nativeElement;
    const optionEl = this._dropdownOptions.get(index)?.nativeElement;

    if (panelEl && index < 0) {
      panelEl.scrollTop = 0;
      return;
    }

    if (!panelEl || !optionEl) {
      return;
    }

    const panelHeight = panelEl.offsetHeight;
    const scrollTop = panelEl.scrollTop;
    const optionHeight = optionEl.offsetHeight;
    const optionTop = optionEl.offsetTop;

    // top
    if (optionTop < scrollTop) {
      panelEl.scrollTop = optionTop;
    }
    // bottom
    else if (optionTop + optionHeight > scrollTop + panelHeight) {
      panelEl.scrollTop = optionTop + optionHeight - panelHeight;
    }
  }

  /**
   * Filter options ba calling filterOptionsFn (then open dropdown if not already opened)
   */
  filter(query?: string) {
    query = query || '';

    this._filterOptionsSub?.unsubscribe();
    this._loading++;
    this._changeDetectorRef.markForCheck();
    this._filterOptionsSub = this._filterOptions(query, this._options).pipe(
      first(),
      finalize(() => {
        this._loading--;
        this._changeDetectorRef.markForCheck();
      })
    ).subscribe(options => {
      this._configCheckOptions(options);
      this._filteredOptionsModel.next(options);
      if (!this._opened) {
        this.openDropdown();
      }
      this._ngZone.onStable.pipe(first()).subscribe(() => this.alignDropdown());
      this._activateDropdownOption();
    });
  }

  private _mapOptions(value: any[], options: any[]): Observable<any[]> {
    if (this._mapOptionsFn) {
      return asObservable(this._mapOptionsFn(value, options));
    }
    if (isDevMode() && options.length == 0) {
      devLog('Option [useValue] is set. Please provide [options] or [mapOptionsFn]! Can not map value', value);
    }
    return of(value.map(v => options.find(o => this.readOptionValue(o) == v))
      .filter(o => o !== undefined).slice());
  }

  private _filterOptions(query: string, options: any[]): Observable<any[]> {
    if (this._filterOptionsFn) {
      return asObservable(this._filterOptionsFn(query, options));
    }
    query = query.toLowerCase();
    return of(options.filter(o => ('' + this.readOptionLabel(o)).toLowerCase().startsWith(query)).slice());
  }

  private _keepLastActiveElement(e?: HTMLElement) {
    let el = (e || document.activeElement) as HTMLElement;
    this._lastFocusedElement = null;
    if (el && this._elementRef.nativeElement.contains(el) && this._interactivityChecker.isFocusable(el)) {
      this._lastFocusedElement = el;
    }
  }

  private _focusLastActiveElement() {
    if (this._lastFocusedElement) {
      // can throw error if lastActiveElement was removed from DOM
      try {
        this._lastFocusedElement?.focus();
        this._lastFocusedElement = null;
      } catch (e) {
        this.focus();
      }
    }
    else {
      this.focus();
    }
  }

  private _keepFocusedState() {
    if (!this._focused) {
      this._focused = true;
      this._stateChanges.next();
    }
  }

  private _closeDropdownAndFocus(focusLastActiveElement: boolean) {
    this.closeDropdown();
    // refocus after dropdown is closed, so it will not re-focus input element inside dropdown if any
    this._ngZone.onStable.pipe(first()).subscribe(() => {
      focusLastActiveElement ? this._focusLastActiveElement() : this.focus();
      this._keepFocusedState();
    });
  }

  private _configCheckOptions(options: any[]) {
    if (options.find(o => typeof o == 'object') && !this._valueAccessor) {
      devLog('When using object type options, always provide [valueAccessor]!')
    }
  }

  private _updateSelectedOptionsModel() {
    if (this._useValue) {
      this._mapOptionsSub?.unsubscribe();
      // map only non empty value
      if (this._value.length) {
        this._loading++;
        this._mapOptionsSub = this._mapOptions(this._value, this._options).pipe(
          first(),
          finalize(() => {
            this._loading--;
            this._changeDetectorRef.markForCheck();
          })
        ).subscribe(options => this._selectedOptionsModel.next(options));
      }
      else {
        this._selectedOptionsModel.next([]);
        this._changeDetectorRef.markForCheck();
      }
    }
    else {
      this._selectedOptionsModel.next(this._value.slice());
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Update search input value
   */
  private _updateSearchInput() {
    // only in single selection + fillInput settings
    if (!this._multiple && this._fillInput) {
      const options = this._selectedOptionsModel.value;
      this.input?.setValue(options.length ? this.readOptionDisplay(options[0]) : '')
    }
    // always clear when selection changed
    else {
      this.input?.setValue('');
    }
  }

  //
  // Option parsing
  //

  /**
   * Parse option value
   */
  readOptionValue(option: any): any {
    if (this._valueAccessor) {
      return this._valueAccessor(option);
    }
    return option;
  }

  /**
   * Parse option label
   */
  readOptionLabel(option: any): any {
    if (this._labelAccessor) {
      return this._labelAccessor(option);
    }
    return option;
  }

  /**
   * Parse option display text
   */
  readOptionDisplay(option: any): any {
    if (this._displayAccessor) {
      return this._displayAccessor(option);
    }
    else if (this._labelAccessor) {
      return this._labelAccessor(option);
    }
    return option;
  }

  /**
   * Parse option disabled state
   */
  readOptionDisabled(option: any): boolean {
    if (this._disabledAccessor) {
      return !!this._disabledAccessor(option);
    }
    return false;
  }

  //
  // Dropdown
  //

  private _createOverlayPositionStrategy() {
    const origin: ElementRef = this.formField?.getConnectedOverlayOrigin() || this._elementRef;
    const strategy = this._overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        // bottom position
        {
          originX: this._dropdownAlign,
          originY: "bottom",
          overlayX: this._dropdownAlign,
          overlayY: "top",
          offsetX: this._dropdownOffsetX,
          offsetY: this._dropdownOffsetY
        },
        // top position
        {
          originX: this._dropdownAlign,
          originY: "top",
          overlayX: this._dropdownAlign,
          overlayY: "bottom",
          offsetX: this._dropdownOffsetX,
          offsetY: -1 * this._dropdownOffsetY
        }
      ]);
    return strategy;
  }

  private _createDropdown() {
    const positionStrategy = this._createOverlayPositionStrategy();
    const scrollStrategy = this._overlay.scrollStrategies.reposition();
    const config: OverlayConfig = {
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      panelClass: this.dropdownClass
    };

    // render
    this._dropdownOverlay = this._overlay.create(config);
    this._dropdownOverlay.attach(new TemplatePortal(this._dropdownTpl, this._viewContainerRef));
    this._changeDetectorRef.detectChanges();

    this._dropdownOverlayDestroyed = new Subject<void>();

    // focus & trap
    this._dropdownFocusTrap = this._focusTrapFactory.create(this._dropdown!.nativeElement);
    if (this._dropdownTrapFocus) {
      this._dropdownFocusTrap._enable();
    }
    if (this._dropdownFocusTrap || this._dropdownAutoFocus) {
      this._dropdownFocusTrap.focusInitialElement();
    }

    // key manager
    this._dropdownKeyManager = new ActiveDescendantKeyManager<NgxMatComboboxOption>(this._dropdownOptions);
    if (this._dropdownKeyNavWrap) {
      this._dropdownKeyManager.withWrap();
    }
    if (!this._autocomplete && this._dropdownKeyNavHomeAndEnd) {
      this._dropdownKeyManager.withHomeAndEnd();
    }
    if (!this._autocomplete && this._dropdownKeyNavTypeAhead) {
      this._dropdownKeyManager.withTypeAhead();
    }

    this._dropdownKeyManager.change.pipe(
      tap((index: number) => this.onDropdownOptionActiveStateChanged(index)),
      takeUntil(this._dropdownOverlayDestroyed)
    ).subscribe();

    // activate first option (must be called after KeyManager is initialized
    this._activateDropdownOption();

    // key events
    this._dropdownOverlay.keydownEvents().pipe(
      tap((e: KeyboardEvent) => this.onDropdownKeydown(e)),
      takeUntil(this._dropdownOverlayDestroyed)
    ).subscribe();

    // handle outside click, note that outsidePointerEvents() works with body element (why?)
    this._dropdownOverlay.outsidePointerEvents().pipe(
      tap((e: MouseEvent) => this.onOutsideClick(e)),
      takeUntil(this._dropdownOverlayDestroyed)
    ).subscribe();

    // handle overlay resize
    new Observable(subscriber => {
      const ro = new ResizeObserver(entries => subscriber.next(entries));
      ro.observe(this._elementRef.nativeElement as HTMLElement);
      return () => {
        ro.unobserve(this._viewContainerRef.element.nativeElement as HTMLElement);
        ro.disconnect();
      }
    }).pipe(
      tap(() => this.alignDropdown()),
      takeUntil(this._dropdownOverlayDestroyed!)
    ).subscribe();

    // emit changes
    this._ngZone.onStable.pipe(
      delay(1),
      tap(() => this.openedChange.next(true)),
      first()
    ).subscribe();
  }

  private _activateDropdownOption() {
    let index = -1;
    let options = this._selectedOptionsModel.value;
    // activate option representing last value from selectionModel
    if (options.length) {
      index = this.getFilteredOptionIndex(options[options.length - 1]);
      this._dropdownKeyManager?.setActiveItem(index);
    }
    // or activate first available option
    else if (this._autoActivate && index == -1 && this._filteredOptionsModel.value.length) {
      this._dropdownKeyManager?.setFirstItemActive();
      index = this._dropdownKeyManager?.activeItemIndex || -1;
    }
    // no option is active
    else {
      this._dropdownKeyManager?.setActiveItem(-1);
    }

    this._ngZone.onStable.pipe(
      tap(() => this.scrollToOption(index)),
      first()
    ).subscribe();
  }

  /**
   * Align dropdown
   */
  public alignDropdown() {
    const originElement: HTMLElement = this.formField?._elementRef.nativeElement || this._elementRef.nativeElement;
    this._dropdownOverlay?.updateSize({
      minWidth: this._dropdownMatchFieldWidth ? originElement.offsetWidth : 'auto'
    });
    this._dropdownOverlay?.updatePosition();
    this._changeDetectorRef.markForCheck();
  }

  private _destroyDropdown() {
    this._dropdownFocusTrap?.destroy();
    this._dropdownOverlayDestroyed?.next();
    this._dropdownOverlayDestroyed?.complete();
    this._dropdownOverlay?.dispose();
    this._changeDetectorRef.markForCheck();

    this._ngZone.onStable.pipe(
      delay(1),
      tap(() => this.openedChange.next(false)),
      first()
    ).subscribe();
  }

}
