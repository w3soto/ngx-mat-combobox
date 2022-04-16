import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";


export const NGX_MAT_COMBOBOX_DEFAULT_OPTIONS: InjectionToken<NgxMatComboboxDefaultOptions>
  = new InjectionToken('NGX_MAT_COMBOBOX_DEFAULT_OPTIONS');


export type NgxMatComboboxAccessorFn = (option: any) => any;


export type NgxMatComboboxMapOptionsFn = (value: any[], options: any[]) => Observable<any[]> | any[];


export type NgxMatComboboxFilterOptionsFn = (query: string, options: any[]) => Observable<any[]> | any[];


export type NgxMatComboboxCompareOptionsFn = (o1: any, o2: any) => boolean;


export interface NgxMatComboboxDefaultOptions {

  valueAccessor?: string | NgxMatComboboxAccessorFn,
  labelAccessor?: string | NgxMatComboboxAccessorFn,
  selectedLabelAccessor?: string | NgxMatComboboxAccessorFn,
  disabledAccessor?: string | NgxMatComboboxAccessorFn,

  noOptionText?: string;

  loadingSpinnerDiameter?: number,
  loadingSpinnerStrokeWidth?: number,
  loadingSpinnerColor?: string,

  dropdownClass?: string,

  disableOptionsRipple?: boolean,
  // chips
  useChips: false,
  chipsColor?: string,
  disableChipsRemove?: boolean,
  disableChipsRipple?: boolean,
}


