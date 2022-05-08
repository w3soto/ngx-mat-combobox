# NgxMatCombobox

Customizable Combobox component for Angular Material

[Demo + code examples](https://ngx-mat-combobox.web.app/)

![Screenshot](https://raw.githubusercontent.com/w3soto/ngx-mat-combobox/master/readme.png "Screenshot")

## Features
* Single & Multiple selection :)
* Autocomplete
* Chips
* Custom templates for options, header, footer, no data etc..

## TODO
* Tests
* Documentation 
* Dropdown animations
* Theming support

## Installation
```shell
npm -i ngx-mat-combobox
```

## Example

For more details see [examples](https://ngx-mat-combobox.web.app/) or *projects/demo* application

## Components
 
### NgxMatCombobox 

Selector: **ngx-mat-combobox**<br>
Exported as: **ngxMatCombobox**

#### Properties

| Name | Description |
| :--- | :---------- |
| @Input()<br>options: any[] | List of strings or objects. Default []. |
| @Input()<br>valueAccessor: string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'value' or *NgxMatComboboxAccessorFn*. |
| @Input()<br>labelAccessor: string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'label' or *NgxMatComboboxAccessorFn*. |
| @Input()<br>displayAccessor: string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'selected label' or *NgxMatComboboxAccessorFn*. If not defined *labelAccessor* will be used. |
| @Input()<br>disabledAccessor: string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'disabled state' or *NgxMatComboboxAccessorFn*. |
| @Input()<br>mapOptionsFn: NgxMatComboboxMapOptionsFn | Default undefined. |
| @Input()<br>filterOptionsFn: NgxMatComboboxFilterOptionsFn | Default undefined. |
| @Input()<br>compareOptionsFn: NgxMatComboboxCompareOptionsFn | |
| @Input()<br>trackOptionByFn: TrackByFunction | |
| @Input()<br>multiple: boolean | Multiple selection mode. Default false. |
| @Input()<br>maxValues: number | Limit maximum selected options. Default 0 (no limit). |
| @Input()<br>useValue: boolean | If set, component will emit option's value using provided *valueAccessor*. Default false. |
| @Input()<br>autoActivate: boolean | If set, first available option id dropdown will be activated. Default false. |
| @Input()<br>autoOpen: boolean | If set, dropdown will open when form field is focused. Default false. |
| @Input()<br>autoSelect: boolean | If set, value model is updated when option is activated (e.g. focused by key navigation). Default false. |
| @Input()<br>fillInput: boolean | If set, search input is updated using *displayAccessor* value. Works only in single selection mode. Default false. |
| @Input()<br>autocomplete: boolean | Autocomplete mode. Default false. |
| @Input()<br>autocompleteMinChars: number | Default 0. |
| @Input()<br>autocompleteDebounceInterval: number | Default 400. |
| @Input()<br>noWrap: boolean | If set,selected options list will wrap. Default false. |
| @Input()<br>showToggleTrigger: boolean | Default true. |
| @Input()<br>showLoadingSpinner: boolean | Default true. |
| @Input()<br>loadingSpinnerDiameter: number | Default undefined. |
| @Input()<br>loadingSpinnerStrokeWidth: number | Default 2. |
| @Input()<br>loadingSpinnerColor: string | Default 'primary'. |
| @Input()<br>disableOptionsRipple: boolean | Default false.
| @Input()<br>useChips: boolean | Default false. |
| @Input()<br>disableChipsRipple: boolean | Default false. |
| @Input()<br>disableChipsRemove: boolean | Default false. |
| @Input()<br>dropdownAlign: 'start' &#124; 'center' &#124; 'end' | Dropdown align. Default 'start'. |
| @Input()<br>dropdownBehavior: 'standard' &#124; 'cover' &#124; 'dialog' | Define how dropdown is displayed. Default 'standard. |
| @Input()<br>dropdownPush: boolean | Whether the dropdown can be pushed on-screen if combobox is outside viewport. Default true. |
| @Input()<br>dropdownOffsetX: number | Dropdown X axis offset. Default 0. |
| @Input()<br>dropdownOffsetY: number | Dropdown Y axis offset. Default 0. |
| @Input()<br>dropdownAutoFocus: boolean | Autofocus first element in custom dropdown template. Default false. |
| @Input()<br>dropdownTrapFocus: boolean |  Trap focus in custom dropdown template. Default false. |
| @Input()<br>dropdownClass: string | Custom dropdown's CSS class. Default undefined. |
| @Input()<br>dropdownMatchFieldWidth: boolean | Stretch minimal dropdown's width to form's field width. Default true. |
| @Input()<br>dropdownKeyNavWrap: boolean | Dropdown key navigation wrap. Default true. |
| @Input()<br>dropdownKeyNavHomeAndEnd: boolean | Dropdown key navigation HOME and END keys. Ignored in autocomplete mode. Default true. |
| @Input()<br>dropdownKeyNavTypeAhead: boolean | Dropdown key navigation type ahead. Ignored in autocomplete mode. Default true. |
| @Input()<br>dropdownBackdrop: boolean | Add backdrop overlay and disable scroll. Default false. |
| @Input()<br>dropdownBackdropClass: string | Custom backdrop CSS class. Default undefined. |
| @Input()<br>noOptionText: string | Default 'No Results'. |
| @Output()<br>openedChange: boolean | |
| @Output()<br>selectionChange: any[] | |
| opened: boolean | Whether dropdown is opened. |
| selectedOptions: Observable<any[]> | |
| filteredOptions: Observable<any[]> | |
| input?: NgxMatComboboxInput | Inner input (autocomplete) field. |

#### Methods

| Method | Description |
| ------ | ----------- |
| focus(): void | |
| closeDropdown(): void | |
| toggleDropdown(): void | |
| selectOption(option: any): void | |
| selectOptions(option: any[]): void | |
| deselectOption(option: any): void | |
| deselectOptions(option: any[]): void | |
| toggleOption(option: any): void | |
| clear(): void | |
| isOptionSelected(option: any): boolean | |
| getSelectedOptionIndex(option: any): number | |
| getFilteredOptionIndex(option: any): number | |
| filter(query: string): void |  |
| alignDropdown(): void | |
| scrollToOption(index: number): void | |
| startLoading(): void | |
| stopLoading(): void | |


## Directives

### NgxMatComboboxInput 

Selector: **ngxMatComboboxInput** or **ngx-mat-combobox-input**<br>
Exported as **ngxMatComboboxInput**

### NgxMatComboboxRemove
Selector: **ngxMatComboboxRemove** or **ngx-mat-combobox-remove**<br>
Exported as **ngxMatComboboxRemove**.


## Custom content templates

* **ngxMatComboboxOption** or **ngx-mat-combobox-option**

* **ngxMatComboboxNoOption** or **ngx-mat-combobox-no-option**

* **ngxMatComboboxDisplay** or **ngx-mat-combobox-display**

* **ngxMatComboboxHeader** or **ngx-mat-combobox-header**

* **ngxMatComboboxFooter** or **ngx-mat-combobox-footer**

* **ngxMatComboboxLoading** or **ngx-mat-combobox-loading**


## Interfaces

Function to access object options properties.
```typescript
export type NgxMatComboboxAccessorFn = (option: any) => any;
```

Function to map model values to the option objects. 
```typescript
export type NgxMatComboboxMapOptionsFn = (value: any[], options: any[]) => Observable<any[]> | any[];
```

Autocomplete filter function.
```typescript
export type NgxMatComboboxFilterOptionsFn = (query: string, options: any[]) => Observable<any[]> | any[];
```

Function to compare two options. By default *[valueAccessor]* is used internally.
```typescript
export type NgxMatComboboxCompareOptionsFn = (o1: any, o2: any) => boolean;
```

Defaults
```typescript
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
```

## Global configuration
```typescript
  providers: [
    //...
    {
      provide: NGX_MAT_COMBOBOX_DEFAULT_OPTIONS, useValue: {
            autocompleteMinChars: 3,
            autocompleteDebounceInterval: 250,
            loadingSpinnerStrokeWidth: 4,
            loadingSpinnerColor: 'accent',
            showToggleTrigger: false,
            dropdownMatchFieldWidth: false,
          } as NgxMatComboboxDefaultOptions
    },
    //...
  ]
```

