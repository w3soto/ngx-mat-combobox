# NgxMatCombobox

Customizable Combobox component for Angular Material

[Demo + code examples](https://ngx-mat-combobox.web.app/)

![Screenshot](https://raw.githubusercontent.com/w3soto/ngx-mat-combobox/master/readme.png "Screenshot")

## Features
* Single & Multiple selection :)
* Autocomplete
* Chips
* Custom templates for options, header, footer, loading overlay, no options etc..

## TODO
* Tests
* Documentation 
* Theming support

## Installation
```shell
npm -i ngx-mat-combobox
```

## Example

For more details see [examples](https://ngx-mat-combobox.web.app/) or *projects/demo* application

## Components
 
* **ngx-mat-combobox**

| @Input | Type | Description |
| ------ | ---- | ----------- |
| **options** | any[] | List of strings or complex objects. Default []. |
| **valueAccessor** | string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'value' or *NgxMatComboboxAccessorFn*. |
| **labelAccessor** | string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'label' or *NgxMatComboboxAccessorFn*. |
| **displayAccessor** | string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'selected label' or *NgxMatComboboxAccessorFn*. If not defined *labelAccessor* will be used. |
| **disabledAccessor** | string &#124; NgxMatComboboxAccessorFn | Property of option's object which holds the 'disabled state' or *NgxMatComboboxAccessorFn*. |
| **mapOptionsFn** | NgxMatComboboxMapOptionsFn | Default undefined. |
| **filterOptionsFn** | NgxMatComboboxFilterOptionsFn | Default undefined. |
| **compareOptionsFn** | NgxMatComboboxCompareOptionsFn | |
| **trackOptionByFn** | TrackByFunction | |
| **multiple** | boolean | Multiple selection mode. Default false. |
| **maxValues** | number | Limit maximum selected options. Default 0 (no limit). |
| **useValue** | boolean | If set, component will emit option's value using provided *valueAccessor*. Default false. |
| **autoActivate** | boolean | If set, first available option id dropdown will be activated. Default false. |
| **autoOpen** | boolean | If set, dropdown will open when form field is focused. Default false. |
| **autoSelect** | boolean | If set, value model is updated when option is activated (e.g. focused by key navigation). Default false. |
| **fillInput** | boolean | If set, search input is updated using *displayAccessor* value. Works only in single selection mode. Default false. |
| **autocomplete** | boolean | Autocomplete mode. Default false. |
| **autocompleteMinChars** | number | Default 0. |
| **autocompleteDebounceInterval** | number | Default 400. |
| **noWrap** | boolean | If set,selected options list will wrap. Default false. |
| **showToggleTrigger** | boolean | Default true. |
| **showLoadingSpinner** | boolean | Default true. |
| **loadingSpinnerDiameter** | number | Default undefined. |
| **loadingSpinnerStrokeWidth** | number | Default 2. |
| **loadingSpinnerColor** | string | Default 'primary'. |
| **disableOptionsRipple** | boolean | Default false.
| **useChips** | boolean | Default false. |
| **disableChipsRipple** | boolean | Default false. |
| **disableChipsRemove**| boolean | Default false. |
| **dropdownAlign** | 'start' &#124; 'center' &#124; 'end' | Dropdown align. Default 'start'. |
| **dropdownOffsetX** | number | Default 0. |
| **dropdownOffsetY** | number | Default 0. |
| **dropdownAutoFocus** | boolean | Autofocus first element in custom dropdown template. Default false. |
| **dropdownTrapFocus** | boolean |  Trap focus in custom dropdown template. Default false. |
| **dropdownClass** | string | Default undefined. |
| **dropdownMatchFieldWidth** | boolean | Dropdown width based on parent form field width. Default true. |
| **dropdownKeyNavWrap** | boolean | Dropdown key navigation wrap. Default true. |
| **dropdownKeyNavHomeAndEnd** | boolean | Dropdown key navigation HOME and END keys. Ignored in autocomplete mode. Default true. |
| **dropdownKeyNavTypeAhead** | boolean | Dropdown key navigation type ahead. Ignored in autocomplete mode. Default true. |
| **noOptionText** | string | Default 'No Results'. |


| @Output | Type | Description |
| ------- | ---- | ----------- |
| **openedChange** | boolean | |
| **selectionChange** | any[] | |


| Property | Type | Description |
| -------- | ---- | ----------- |
| **opened** | boolean | |
| **selectedOptions** | Observable<any[]> | |
| **filteredOptions** | Observable<any[]> | |
| **input?** | NgxMatComboboxInput | |


| Method | Returns | Description |
| ------ | ---- | ----------- |
| **focus()** | void | |
| **closeDropdown()** | void | |
| **toggleDropdown()** | void | |
| **selectOption(option: any)** | void | |
| **selectOptions(option: any[])** | void | |
| **deselectOption(option: any)** | void | |
| **deselectOptions(option: any[])** | void | |
| **toggleOption(option: any)** | void | |
| **clear()** | void | |
| **isOptionSelected(option: any)** | boolean | |
| **getSelectedOptionIndex(option: any)** | number | |
| **getFilteredOptionIndex(option: any)** | number | |
| **filter(query: string)** | void |  |
| **alignDropdown()** | void | |
| **scrollToOption(index: number)** | void | |
| **startLoading()** | void | |
| **stopLoading()** | void | |

Exported as **ngxMatCombobox**


## Directives

* **ngxMatComboboxInput** or **ngx-mat-combobox-input**

Exported as **ngxMatComboboxInput**

* **ngxMatComboboxRemove** or **ngx-mat-combobox-remove**

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
  dropdownMatchFieldWidth?: boolean;
  dropdownOffsetX?: number;
  dropdownOffsetY?: number;

  dropdownKeyNavWrap?: boolean;
  dropdownKeyNavHomeAndEnd?: boolean;
  dropdownKeyNavTypeAhead?: boolean;

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

