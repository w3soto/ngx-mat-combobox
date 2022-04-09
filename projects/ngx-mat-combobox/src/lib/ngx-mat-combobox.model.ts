import { Observable, of } from "rxjs";
import { InjectionToken } from "@angular/core";
import { BehaviorSubject } from "rxjs";


export const NGX_MAT_COMBOBOX_DEFAULT_OPTIONS: InjectionToken<NgxMatComboboxDefaultOptions>
  = new InjectionToken('NGX_MAT_COMBOBOX_DEFAULT_OPTIONS');


export interface NgxMatComboboxDefaultOptions {
  noOptionText?: string;

  loadingSpinnerDiameter?: number,
  loadingSpinnerStrokeWidth?: number,
  loadingSpinnerColor?: string,

  dropdownMinHeight?: number,
  dropdownMaxHeight?: number,
  dropdownClass?: string,

  disableRipple?: boolean,
}


export interface NgxMatComboboxDataSource {

  loading?: Observable<boolean>;
  selectedOptions?: Observable<any[]>;
  filteredOptions?: Observable<any[]>;

  //select(value: any)
  //deselect(value: any)
  //toggle(value: any)
  //filter(query: string)
  //create(text: string)

  // loadSelectedOptions(value: any): void
  // loadFilteredOptions(query: string): void

  // get display options
  loadByValue(value: any): Observable<any[]>,
  // get filtered options
  loadByQuery(query: string): Observable<any[]>

  //addNew(text: string): Observable<any>
}

export class NgxMatComboboxArrayDataSource implements NgxMatComboboxDataSource {

  get selectedOptions(): Observable<any[]> {
    return this._selectedOptions as Observable<any[]>;
  }
  private _selectedOptions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  get filteredOptions(): Observable<any[]> {
    return this._selectedOptions as Observable<any[]>;
  }
  private _filteredOptions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    public data: any[],
    public displayOptionPredicate?: (option: any, value: any) => boolean,
    public filterOptionPredicate?: (option: any, query: string) => boolean,
  ) {
  }

  loadByValue(value: any) {
    if (!Array.isArray(value)) {
      value = [value];
    }
    if (this.displayOptionPredicate) {
      const data = this.data.filter(o => {
        return value.filter((v: any) => this.displayOptionPredicate!(o, v)).length > 0
      });
      this._selectedOptions.next([...data]);
      return of([...data]);
    }
    this._selectedOptions.next([...value]);
    return of([...value]);
  }

  loadByQuery(query: string) {
    if (typeof query === 'undefined' && query === null) {
      query = '';
    }
    query = ('' + query).toLowerCase();
    if (this.filterOptionPredicate) {
      const data = this.data.filter(o => this.filterOptionPredicate!(o, query));
      this._filteredOptions.next([...data]);
      return of([...data]);
    }
    else {
      this._filteredOptions.next([...this.data]);
    }
    return of([...this.data]);
  }

}

