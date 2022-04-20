import { isDevMode } from "@angular/core";
import { isObservable, Observable, of } from "rxjs";


export function createOptionPropertyAccessorFn(key: string) {
  return (option: any) => {
    if (key in option) {
      return option[key];
    }
    return undefined;
  }
}


export function asObservable<T>(value: T | Observable<T>): Observable<T> {
  if (isObservable(value)) {
    return value;
  }
  return of(value);
}


export function isEqual(a: any, b: any) {
  // TODO better/faster implementation !!!
  return JSON.stringify(a) == JSON.stringify(b);
}


export function devLog(...data: any) {
  if (isDevMode()) {
    console.warn('%c[NgxMatCombobox]', 'background: #F5BD00; color: #fff; font-weight: bold; ', ...data);
  }
}
