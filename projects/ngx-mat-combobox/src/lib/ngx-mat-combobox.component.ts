import {
  AfterViewChecked,
  AfterViewInit, Attribute,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef, EventEmitter, HostBinding,
  Inject,
  Input, isDevMode,
  NgZone, OnChanges,
  OnDestroy,
  OnInit,
  Optional, Output,
  QueryList,
  Self,
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
  distinctUntilChanged,
  first,
  fromEvent,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap
} from "rxjs";

import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from "@angular/material/form-field";

import {
  NGX_MAT_COMBOBOX_DEFAULT_OPTIONS,
  NgxMatComboboxArrayDataSource,
  NgxMatComboboxDataSource, NgxMatComboboxDefaultOptions
} from "./ngx-mat-combobox.model";
import { NgxMatComboboxOption } from "./ngx-mat-combobox-option.component";
import { delay, finalize, map, skip  } from "rxjs/operators";


const LOG_TAG = '[NgxMatCombobox]';


@Directive({
  selector: 'input[ngxMatComboboxInput]',
  host: {
    'class': 'ngx-mat-combobox-input mat-input-element'
  }
})
export class NgxMatComboboxInputDirective implements AfterViewInit, OnDestroy{

  get nativeElement(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  isInitialized: boolean = false;

  constructor(
    public _elementRef: ElementRef<HTMLInputElement>,
    public _combo: NgxMatCombobox
  ) {
  }

  ngAfterViewInit(): void {
    // take focus from combobox element
    this._combo._elementRef.nativeElement.tabIndex = -1;
    this._elementRef.nativeElement.tabIndex = this._combo.tabIndex;

    // initialize listeners
    // TODO
  }

  ngOnDestroy(): void {
    // renew focus
    this._combo._elementRef.nativeElement.tabIndex = this._combo.tabIndex;
  }

  focus() {
    this._elementRef.nativeElement.focus();
  }

  select(text?: string) {
    this._elementRef.nativeElement.select();
  }

  setValue(val: string) {
    this._elementRef.nativeElement.value = val || '';
  }

  getValue(): string {
    return this._elementRef.nativeElement.value || '';
  }

  hasValue(): boolean {
    return this.getValue().trim() != '';
  }

}


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


@Component({
  selector: 'ngx-mat-combobox',
  templateUrl: './ngx-mat-combobox.component.html',
  styleUrls: ['./ngx-mat-combobox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-combobox',
    'role': 'combobox',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
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
export class NgxMatCombobox implements OnInit, OnChanges, OnDestroy, AfterViewChecked,
  ControlValueAccessor, MatFormFieldControl<any> {

  //
  // MatFormFieldControl interface
  //

  static nextId = 0;

  @HostBinding('attr.id')
  id: string = `ngx-mat-combobox-${NgxMatCombobox.nextId++}`;

  controlType: string = 'ngx-mat-combobox';

  @Input('aria-describedby')
  userAriaDescribedBy?: string;

  errorState: boolean = false;

  autofilled?: boolean;

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
  }
  get placeholder(): string {
    return this._placeholder;
  }
  private _placeholder: string = '';

  @Input()
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  get required(): boolean {
    return this._required || !!this.ngControl?.control?.hasValidator(Validators.required);
  }
  private _required = false;

  @Input()
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
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
    return this._valueModel.value.length === 0;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty || !!this.searchInput?.hasValue();
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
    if (!this.multiple && value.length > 1) {
      value.splice(1, value.length - 1);
    }
    else if (this.multiple && this.maxValues > 0) {
      value.splice(this.maxValues, value.length - this.maxValues);
    }
    // !!! update only on changes !!!
    if (JSON.stringify(value) != JSON.stringify(this._valueModel.value)) {
      this._valueModel.next([...value]);
    }
  }
  get value(): any {
    return this.multiple ? this._valueModel.value : (this._valueModel.value.length ? this._valueModel.value[0] : null);
  }
  private _valueModel: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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

  get tabIndex(): number {
    return this._tabIndex;
  }
  readonly _tabIndex: number = 0;

  @Input()
  set readonly(val: BooleanInput) {
    this._readonly = coerceBooleanProperty(val);
  }
  get readonly(): boolean {
    return this._readonly;
  }
  private _readonly: boolean = false;

  /**
   * Options dataSource
   */
  @Input()
  set dataSource(dataSource: NgxMatComboboxDataSource | any[] | undefined) {
    this._dataSourceLoadSub?.unsubscribe();
    this._dataSourceAutocompleteSub?.unsubscribe();
    if (Array.isArray(dataSource)) {
      // create default data source from array
      const defaultDataSource: NgxMatComboboxArrayDataSource = new NgxMatComboboxArrayDataSource(dataSource);
      defaultDataSource.displayOptionPredicate = (option, value) => this.readOptionValue(option) == value;
      defaultDataSource.filterOptionPredicate = (option, query) => {
        const label = ('' + this.readOptionLabel(option)).toLowerCase();
        return label.indexOf(('' + query).toLowerCase()) > -1;
      };
      this._dataSource = defaultDataSource;
    }
    else {
      this._dataSource = dataSource;
    }
  }
  get dataSource(): NgxMatComboboxDataSource | undefined {
    return this._dataSource;
  }
  private _dataSource?: NgxMatComboboxDataSource;
  private _dataSourceLoadSub?: Subscription;
  private _dataSourceAutocompleteSub?: Subscription;

  /**
   * Property of option which holds the 'value' or Function
   */
  @Input()
  optionValue?: string | Function;

  /**
   * Property of option which holds the 'label' or Function
   */
  @Input()
  optionLabel?: string | Function;

  /**
   * Property of option which holds the 'disabled' status or Function
   */
  @Input()
  optionDisable?: string | Function;

  /**
   * Property of option which holds the 'disabled' status or Function
   */
  @Input()
  optionDisplay?: string | Function;

  /**
   * Property of option used for inner trackBy function
   */
  @Input()
  optionTrackBy?: string | Function;

  @Input()
  set autoExpand(val: BooleanInput) {
    this._autoExpand = coerceBooleanProperty(val);
  }
  get autoExpand(): boolean {
    return this._autoExpand;
  }
  private _autoExpand: boolean = false;

  /**
   * Define single/multiple selection
   */
  @Input()
  set multiple(val: BooleanInput) {
    this._multiple = coerceBooleanProperty(val);
    this._stateChanges.next();
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
   * Wrap displayed options
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
    this._autocompleteMinChars = Math.max(coerceNumberProperty(val, 1), 1);
  }
  get autocompleteMinChars(): number {
    return this._autocompleteMinChars;
  }
  private _autocompleteMinChars: number = 1;

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
  chipColor?: string;

  // allowChipDelete: boolean = false;
  //
  // allowChipDeleteFocus: boolean = false;
  //
  // disableChipRipple:boolean = false;

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

  /**
   * Disable ripple
   */
  @Input()
  set disableRipple(val: BooleanInput) {
    this._disableRipple = coerceBooleanProperty(val);
  }
  get disableRipple(): boolean {
    return this._disableRipple;
  }
  private _disableRipple: boolean = false;

  @Input()
  set dropdownMinHeight(val: NumberInput) {
    this._dropdownMinHeight = coerceNumberProperty(val, undefined);
  }
  private _dropdownMinHeight?: number;

  @Input()
  set dropdownMaxHeight(val: NumberInput) {
    this._dropdownMaxHeight = coerceNumberProperty(val, undefined);
  }
  private _dropdownMaxHeight?: number;

  @Input()
  dropdownClass?: string;

  @Input()
  set dropdownOffsetX(val: NumberInput) {
    this._dropdownOffsetX = coerceNumberProperty(val);
  }
  private _dropdownOffsetX?: number;

  @Input()
  set dropdownOffsetY(val: NumberInput) {
    this._dropdownOffsetY = coerceNumberProperty(val);
  }
  private _dropdownOffsetY?: number;

  @Input()
  set dropdownTrapFocus(val: BooleanInput) {
    this._dropdownTrapFocus = coerceBooleanProperty(val);
  }
  get dropdownTrapFocus(): boolean {
    return this._dropdownTrapFocus;
  }
  private _dropdownTrapFocus: boolean = false;

  @Input()
  set noOptionText(val: string) {
    this._noOptionText = val;
  }
  get noOptionText(): string {
    return this._noOptionText
  }
  private _noOptionText: string;

  /**
   * Whether loading data from dataSource
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

  @Output()
  readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

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
   * Search/autocomplete input reference
   */
  get searchInput(): NgxMatComboboxInputDirective | undefined {
    return this._customSearchInput || this._searchInput;
  }

  @ViewChild(NgxMatComboboxInputDirective)
  private _searchInput?: NgxMatComboboxInputDirective;

  @ContentChild(NgxMatComboboxInputDirective)
  private _customSearchInput?: NgxMatComboboxInputDirective;

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
   * Dropdown HTMLElement reference
   */
  get dropdown(): ElementRef | undefined {
    return this._dropdown;
  }

  @ViewChild('dropdown')
  private _dropdown?: ElementRef;

  /**
   * Rendered dropdown's options list
   */
  @ViewChildren(NgxMatComboboxOption)
  readonly dropdownOptions: QueryList<NgxMatComboboxOption> = new QueryList<NgxMatComboboxOption>();

  /**
   * Dropdown's overlay
   */
  get dropdownOverlay(): OverlayRef | undefined {
    return this._dropdownOverlay;
  }
  private _dropdownOverlay?: OverlayRef;

  /**
   * Dropdown's key manager
   */
  get dropdownKeyManager(): ActiveDescendantKeyManager<NgxMatComboboxOption> | undefined {
    return this._dropdownKeyManager;
  }
  private _dropdownKeyManager?: ActiveDescendantKeyManager<NgxMatComboboxOption>;

  /**
   * Dropdown's focus trap manager
   */
  get dropdownFocusTrap() : ConfigurableFocusTrap | undefined {
    return this._dropdownFocusTrap;
  }
  private _dropdownFocusTrap?: ConfigurableFocusTrap;

  @ViewChild('dropdownTpl', {static: true})
  private _dropdownTpl!: TemplateRef<any>;

  @ViewChild('dropdownBody')
  private _dropdownBody?: ElementRef;

  private _dropdownOverlayDestroyed?: Subject<void>;

  // current & last used search query
  private _searchQuery: string = '';
  private _lastSearchQuery: string | null = null;

  // keep last focused element, it will gain focus when user close dropdown
  private _lastFocusedElement?: HTMLElement | null;

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
    @Optional() @Inject(NGX_MAT_COMBOBOX_DEFAULT_OPTIONS) private _defaults: NgxMatComboboxDefaultOptions,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(MAT_FORM_FIELD) public formField?: MatFormField,
  ) {

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this._tabIndex = parseInt(tabIndex) || 0;

    this._disableRipple = this._defaults?.disableRipple ?? false;
    this._noOptionText = this._defaults?.noOptionText || 'No Results';
  }

  ngOnChanges() {
    this._stateChanges.next();
  }

  ngOnInit(): void {

    // calculate spinner size
    if (typeof this._loadingSpinnerDiameter == 'undefined') {
      const computedStyle = window.getComputedStyle(this._elementRef.nativeElement);
      this._loadingSpinnerDiameter = Number.parseInt(computedStyle.lineHeight);
    }

    // initialize value model and listen for changes
    this._valueModel.pipe(
      skip(1), // skip initial value emission
      tap((values: any) => {
        this._updateSelectedOptionsModel();
        this._stateChanges.next();
        this._onChange(this.value);
      }),
      takeUntil(this._destroyed)
    ).subscribe();

    // initialize selection model and listen for changes
    this._selectedOptionsModel.pipe(
      tap((values: any) => {
        this._updateSearchInput();
        this.selectionChange.next(values);
      }),
      takeUntil(this._destroyed)
    ).subscribe();

    // monitor enter/leave state
    this._focusMonitor.monitor(this._elementRef, true).pipe(
      tap((origin) => {
        this._ngZone.run(() => {
          const focused = !!origin || this._opened;
          if (this._focused != focused) {
            this._focused = focused;
            this._focused ? this.onEnter() : this.onLeave();
            this._stateChanges.next();
          }
        });
      }),
      takeUntil(this._destroyed),
      finalize(() => this._focusMonitor.stopMonitoring(this._elementRef))
    ).subscribe();

  }

  ngAfterViewChecked() {
    // if found, initialize search input
    if (this.searchInput && !this.searchInput.isInitialized) {

      fromEvent<string | KeyboardEvent>(this.searchInput!.nativeElement, 'input').pipe(
        map(_ => this.searchInput!.getValue().trim()),
        debounceTime(400),
        tap((query: string) => this._onSearchInputQuery(query)),
        takeUntil(this._destroyed)
      ).subscribe();

      fromEvent<Event>(this.searchInput!.nativeElement, 'focus').pipe(
        tap((e: Event) => this.onFocus(e)),
        takeUntil(this._destroyed)
      ).subscribe();

      fromEvent<Event>(this.searchInput!.nativeElement, 'blur').pipe(
        tap((e: Event) => this.onBlur(e)),
        takeUntil(this._destroyed)
      ).subscribe();

      this.searchInput.isInitialized = true;
    }
  }

  ngOnDestroy(): void {
    this.closeDropdown();
    this._destroyed.next();
    this._destroyed.complete();
    this._dataSourceLoadSub?.unsubscribe();
    this._dataSourceAutocompleteSub?.unsubscribe();
    this._stateChanges.complete();

    this.openedChange.complete();
    this.selectionChange.complete();
  }

  // MatFormFieldControl interface
  setDescribedByIds(ids: string[]): void {
  }

  // MatFormFieldControl interface
  // note: _onFocus() is always called before this
  onContainerClick(e: MouseEvent): void {
    this.onClick(e);
  }

  //
  // Listeners
  //

  onEnter() {
    console.log('onEnter');
    //this._stateChanges.next();
    //if (this.autocomplete) {
      // focus first focusable
    // const focusable = (Array.from(this._elementRef.nativeElement.querySelectorAll(
    //   'a[href], button, input, [tabindex]:not([tabindex="-1"])'
    // )) as HTMLElement[]).filter(
    //   el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    // );
    // focusable[0]?.focus();
    //}
    //this._elementRef.nativeElement.tabIndex = -1;
  }

  onLeave() {
    console.log('onLeave');

    // this.searchInput?.setValue('');
    // this._searchQuery = '';
    // this._lastSearchQuery = null;
    // this._loaded = false;
    // this._dataSourceLoadSub?.unsubscribe();
    // this._dataSourceAutocompleteSub?.unsubscribe();
    //
    // //this._stateChanges.next();
    // if (!this.disabled) {
    //   this._onTouched();
    // }

    //this._stateChanges.next();
    //this._elementRef.nativeElement.tabIndex = this.tabIndex;
  }

  onFocus(e: Event) {
    //console.log('onFocus', e.target, e);
    if (!this.disabled) {
      this._keepFocusedState();
    }
  }

  onBlur(e: Event) {
    if (this._opened) {
      return;
    }
    //console.log('onBlur', e.target);
    if (!this.disabled) {
      this._onTouched();
    }
  }

  onClick(e: MouseEvent) {
    //console.log('onClick', e.target);
    if (!this.disabled) {
      //this._focused = true;
      this._keepLastActiveElement(e.target as HTMLElement);
      if (this._loaded) {
        this.openDropdown();
      } else {
        this.search();
      }
    }

    //this._setFocusedState();

    // when deleting selected options (chips) using mouse (or ENTER key)
    // we are loosing focus (DOM node is removed) so this will gain focus back
    this._ngZone.onStable.pipe(
      tap(() => document.activeElement === document.body && this.focus()),
      first()
    ).subscribe();
  }

  onKeydown(e: KeyboardEvent) {
    //console.log('onKeydown', e.code);

    this._keepLastActiveElement(e.target as HTMLElement);

    // open on arrow down key
    if (e.code == 'ArrowDown') {
      if (!this._opened) {
        e.preventDefault();
      }
      if (this._loaded) {
        this.openDropdown();
      } else {
        this.search();
      }
    }

    if (e.code == 'Backspace') {
      // when single selection mode without autocomplete input => clear value
      if (!this.autocomplete && !this.multiple) {
        this._valueModel.next([]);
      }
    }

    //this._setFocusedState();
  }

  onDropdownKeydown(e: KeyboardEvent): void {
    //console.log('onDropdownKeydown', e.code);

    const index = this._dropdownKeyManager?.activeItemIndex;

    if (e.code == 'Escape') {
      this._closeDropdownAndFocus(true);
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if (e.code == 'Tab') {
      if (!this.dropdownTrapFocus) {
        this._closeDropdownAndFocus(true);
        e.stopPropagation();
        e.preventDefault();
        return;
      }
    }

    if ((e.code == 'Enter' || e.code == 'Space') && index != null && index > -1) {
      if (this.multiple) {
        this.toggleOption(this._filteredOptionsModel.value[index]);
      }
      else {
        this.selectOption(this._filteredOptionsModel.value[index]);
      }
      // close on single selection mode
      // focus host/or input element (can not focus last active element because list was re-rendered)
      // must be called after filteredOptionsModel changes are propagated to view/DOM
      if (!this.multiple) {
        this._ngZone.onStable.pipe(first()).subscribe(() => {
          this._closeDropdownAndFocus(false);
        });
      }
      // keep focused host/or input element
      else {
        this._ngZone.onStable.pipe(first()).subscribe(() => {
          this.focus();
          this._updateDropdownLayout();
        });
      }

      if (e.code == 'Enter') {
        e.preventDefault(); // prevent focused chip deletion
      }
      if (e.code == 'Space') {
        //e.stopImmediatePropagation(); // prevent search/typeahead for "space" character
        e.preventDefault();
      }
    }

    // handle default keydown action
    this._dropdownKeyManager?.onKeydown(e);
  }

  onDropdownOptionClick(option: any, e?: MouseEvent) {
    //console.log('onDropdownOptionClick', option);
    this.multiple ? this.toggleOption(option) : this.selectOption(option);
    this._dropdownKeyManager?.setActiveItem(this.getFilteredOptionIndex(option));
    // single selection
    if (!this.multiple) {
      // must be called after filteredOptionsModel changes are propagated to view/DOM
      this._ngZone.onStable.pipe(first()).subscribe(() => {
        this._closeDropdownAndFocus(true);
      });
      return;
    }

    this._ngZone.onStable.pipe(first()).subscribe(() => {
      this._focusLastActiveElement();
      this._updateDropdownLayout()
    });
  }

  /**
   * Handle click outside dropdown & form field
   */
  onOutsideClick(e: MouseEvent) {
    //console.log('onOutsideClick', e.target);
    const el = e.target as HTMLElement;
    const hostEl = this._elementRef.nativeElement;
    const formFieldEl = this.formField?._elementRef.nativeElement;
    const dropdownEl = this._dropdown?.nativeElement;

    const isInside = hostEl.contains(el) || formFieldEl?.contains(el) || dropdownEl?.contains(el);

    if (!isInside) {
      this.closeDropdown();
      this._updateSearchInput();
      this._focused = false;
      this._stateChanges.next();
    }
  }

  //
  // API methods
  //

  focus() {
    //console.log('focus')
    if (this.searchInput) {
      //console.log('focus -> searchInput')
      this.searchInput.focus();
    }
    else {
      //console.log('focus -> host')
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

  selectOption(option: any) {
    this.selectValue(this.readOptionValue(option));
  }

  deselectOption(option: any) {
    this.deselectValue(this.readOptionValue(option));
  }

  toggleOption(option: any) {
    this.toggleValue(this.readOptionValue(option));
  }

  selectValue(value: any) {
    if (this.multiple) {
      this._valueModel.next([...this._valueModel.value, value]);
    }
    else {
      this._valueModel.next([value]);
    }
  }

  deselectValue(value: any) {
    const values = this._valueModel.value;
    const index = values.indexOf(value);
    if (index > -1) {
      values.splice(index, 1);
      this._valueModel.next([...values]);
    }
  }

  toggleValue(value: any) {
    const values = this._valueModel.value;
    const index = values.indexOf(value);
    if (index > -1) {
      values.splice(index, 1);
      this._valueModel.next([...values]);
    }
    else {
      if (this.multiple) {
        this._valueModel.next([...values, value]);
      }
      else {
        this._valueModel.next([value]);
      }
    }
  }

  clear() {
    this._valueModel.next([]);
  }

  isOptionSelected(option: any): boolean {
    //console.log(this._valueModel.value);
    return this._selectedOptionsModel.value.includes(option);
    //return this._valueModel.value.includes(this._useValue ? this.readOptionValue(option) : option);
  }

  getSelectedOptionIndex(option: any): number {
    return this._selectedOptionsModel.value.indexOf(option);
  }

  getFilteredOptionIndex(option: any): number {
    return this._filteredOptionsModel.value.indexOf(option);
  }

  scrollToOption(index: number) {
    const panelEl = this._dropdownBody?.nativeElement;
    const optionEl = this.dropdownOptions.get(index)?.nativeElement;

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

  setQuery(query: string) {
    this._searchQuery = query;
  }

  resetSearch() {
    this._searchQuery = '';
    this._lastSearchQuery = null;
  }

  pushLoading() {
    this._loading = Math.max(1, this._loading + 1);
  }

  popLoading() {
    this._loading = Math.max(0, this._loading - 1);
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

  private _updateSelectedOptionsModel() {
    if (this._dataSource) {

      // check if we have all options available
      // calculate missing options
      const requiredValues = this._valueModel.value;
      const missingValues: any[] = [];

      const availableOptions = Array.from(
        new Set([...this._selectedOptionsModel.value, ...this._filteredOptionsModel.value])
      );
      const requiredOptions: any[] = [];

      requiredValues.forEach(val => {
        let options = availableOptions.filter(o => this.readOptionValue(o) == val);
        if (options.length) {
          requiredOptions.push(options[0]);
        }
        else {
          missingValues.push(val);
        }
      });

      // load missing options
      this._dataSourceLoadSub?.unsubscribe();
      if (missingValues.length) {
        this._loading++;
        this._dataSourceLoadSub = this._dataSource.loadByValue(missingValues).pipe(
          tap((missingOptions: any[]) => {
            // sort by required values
            const options = [...requiredOptions, ...missingOptions];
            const optionsSorted: any[] = [];
            requiredValues.forEach(val => {
              let idx = options.findIndex(o => this.readOptionValue(o) == val);
              optionsSorted.push(options[idx]);
            });
            this._selectedOptionsModel.next(optionsSorted);
          }),
          first(),
          finalize(() => this._loading--)
        ).subscribe();
      }
      // update selection
      else {
        this._selectedOptionsModel.next([...requiredOptions]);
      }
    }
  }

  // handle autocomplete search input
  _onSearchInputQuery(query: string) {
    console.log('_onSearchInputQuery', query);
    this._searchQuery = query;
    this.search();
  }

  _loaded: boolean = false;

  /**
   * Search
   */
  search() {
    if (this._lastSearchQuery == this._searchQuery) {
      return;
    }

    this._dataSourceAutocompleteSub?.unsubscribe();
    this._loading++;
    this._dataSourceAutocompleteSub = this._dataSource?.loadByQuery(this._searchQuery).pipe(
      tap(options => {
        this._filteredOptionsModel.next(options);
        if (this._opened) {
          this._updateDropdownLayout(true);
          this._activateDropdownOption();
        }
        else {
          this.openDropdown();
        }
        this._loaded = true;
      }),
      first(),
      finalize(() => this._loading--)
    ).subscribe();

    this._lastSearchQuery = this._searchQuery;
  }

  /**
   * Update search input value
   */
  private _updateSearchInput() {
    // multi selection
    if (this.multiple) {
      // ???
      if (this.searchInput) {
        if (this._selectedOptionsModel.value.length == 0 || !this._focused) {
          this.searchInput!.setValue('');
        }
      }
    }
    // single selection
    else {
      if (this.searchInput) {
        let value = '';
        if (this._selectedOptionsModel.value.length) {
          value = this.readOptionDisplay(this._selectedOptionsModel.value[0])
        }
        this.searchInput!.setValue(value);
        // if (this._focused) {
        //   this.searchInput!.select();
        // }
      }
    }

    if (this.searchInput) {
      this._searchQuery = this.searchInput!.getValue();
    }
  }

  //
  // Option parsing
  //

  /**
   * Parse option value
   */
  readOptionValue(option: any): any {
    return this._readOption(option, this.optionValue);
  }

  /**
   * Parse option label
   */
  readOptionLabel(option: any): any {
    return this._readOption(option, this.optionLabel);
  }

  /**
   * Parse option display text
   */
  readOptionDisplay(option: any): any {
    return this._readOption(option, this.optionDisplay || this.optionLabel);
  }

  /**
   * Parse option disabled state
   */
  readOptionDisabled(option: any): boolean {
    return coerceBooleanProperty(this._readOption(option, this.optionDisable));
  }

  private _readOption(option: any, keyOrFn?: string | Function): any {
    if (keyOrFn) {
      if (typeof keyOrFn == 'function') {
        return keyOrFn.apply(this, [option]);
      }
      else if (typeof option == 'object') {
        const key = '' + keyOrFn;
        if (key in option) {
          return option[key];
        }
        if (isDevMode()) {
          console.warn(LOG_TAG, 'property [' + key + '] not found in option', option);
        }
        return undefined;
      }
    }
    return option;
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
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top"
        },
        // top position
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom"
        }
      ]);
    if (this._dropdownOffsetX) {
      strategy.withDefaultOffsetX(this._dropdownOffsetX);
    }
    if (this._dropdownOffsetY) {
      strategy.withDefaultOffsetY(this._dropdownOffsetY);
    }
    return strategy;
  }

  private _createDropdown() {
    const positionStrategy = this._createOverlayPositionStrategy();
    const scrollStrategy = this._overlay.scrollStrategies.reposition();
    const config: OverlayConfig = {
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      panelClass: this.dropdownClass,
      minHeight: this._dropdownMinHeight,
      maxHeight: this._dropdownMaxHeight
    };

    // render
    this._dropdownOverlay = this._overlay.create(config);
    this._dropdownOverlay.attach(new TemplatePortal(this._dropdownTpl, this._viewContainerRef));
    this._changeDetectorRef.detectChanges();

    this._dropdownOverlayDestroyed = new Subject<void>();

    // trap focus
    this._dropdownFocusTrap = this._focusTrapFactory.create(this._dropdown!.nativeElement);
    if (this._dropdownTrapFocus) {
      this._dropdownFocusTrap._enable();
    }
    this._dropdownFocusTrap.focusInitialElement();

    // key manager
    this._dropdownKeyManager = new ActiveDescendantKeyManager<NgxMatComboboxOption>(this.dropdownOptions).withWrap();
    if (!this.autocomplete) {
      this._dropdownKeyManager.withTypeAhead();
    }

    this._dropdownKeyManager.change.pipe(
      tap((index: number) => this.scrollToOption(index)),
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
      tap(() => this._updateDropdownLayout()),
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
    // activate option representing last value from valueModel
    if (this._valueModel.value.length) {
      const lastValue = this._valueModel.value[this._valueModel.value.length - 1];
      index = this._filteredOptionsModel.value.findIndex(o => this.readOptionValue(o) == lastValue);
      this._dropdownKeyManager?.setActiveItem(index);
    }
    // or activate first available option
    if (index == -1 && this._filteredOptionsModel.value.length) {
      this._dropdownKeyManager?.setFirstItemActive();
      index = this._dropdownKeyManager?.activeItemIndex || -1;
    }

    this._ngZone.onStable.pipe(
      tap(() => this.scrollToOption(index)),
      first()
    ).subscribe();
  }

  private _updateDropdownLayout(reattach?: boolean) {
    const originElement: HTMLElement = this.formField?._elementRef.nativeElement || this._elementRef.nativeElement;
    this._dropdownOverlay?.updateSize({minWidth: originElement.offsetWidth});
    this._dropdownOverlay?.updatePosition();
  }

  private _destroyDropdown() {
    this._dropdownFocusTrap?.destroy();
    this._dropdownOverlayDestroyed?.next();
    this._dropdownOverlayDestroyed?.complete();
    this._dropdownOverlay?.dispose();

    this._ngZone.onStable.pipe(
      delay(1),
      tap(() => this.openedChange.next(false)),
      first()
    ).subscribe();
  }

  trackOptionFn: TrackByFunction<any> = (index: number, option: any) => {
    return 'ngx-combobox-option-' + this._readOption(option, this.optionTrackBy || this.optionValue || this.optionLabel);
  }

}
