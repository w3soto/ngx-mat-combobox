import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";


export const NGX_MAT_COMBOBOX_DEFAULT_OPTIONS: InjectionToken<NgxMatComboboxDefaultOptions>
  = new InjectionToken('NGX_MAT_COMBOBOX_DEFAULT_OPTIONS');


export type NgxMatComboboxAccessorFn = (option: any) => any;


export type NgxMatComboboxMapOptionsFn = (value: any[], options: any[]) => Observable<any[]> | any[];


export type NgxMatComboboxFilterOptionsFn = (query: string, options: any[]) => Observable<any[]> | any[];


export type NgxMatComboboxCompareOptionsFn = (o1: any, o2: any) => boolean;


export interface NgxMatComboboxDefaultOptions {
  valueAccessor?: string | NgxMatComboboxAccessorFn;
  labelAccessor?: string | NgxMatComboboxAccessorFn;
  displayAccessor?: string | NgxMatComboboxAccessorFn;
  disabledAccessor?: string | NgxMatComboboxAccessorFn;

  showToggleTrigger?: boolean;

  showLoadingSpinner?: boolean;
  loadingSpinnerDiameter?: number;
  loadingSpinnerStrokeWidth?: number;
  loadingSpinnerColor?: string;

  autocompleteMinChars?: number;
  autocompleteDebounceInterval?: number;

  noWrap?: boolean;
  noOptionText?: string;

  dropdownClass?: string,
  dropdownAlign?: 'start' | 'center' | 'end',
  dropdownPush?: boolean,
  dropdownMatchFieldWidth?: boolean;
  dropdownOffsetX?: number;
  dropdownOffsetY?: number;

  dropdownKeyNavWrap?: boolean;
  dropdownKeyNavHomeAndEnd?: boolean;
  dropdownKeyNavTypeAhead?: boolean;

  dropdownBehavior?: 'standard' | 'cover' | 'dialog',
  dropdownBackdrop?: boolean,
  dropdownBackdropClass?: string;

  disableOptionsRipple?: boolean;
  disableChipsRipple?: boolean;
  disableChipsRemove?: boolean;
}


