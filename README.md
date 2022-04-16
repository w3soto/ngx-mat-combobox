# NgxMatCombobox

Customizable Combobox component for Angular Material

![Screenshot](./readme.png "Screenshot")

## Features
* Single & Multiple selection :)
* Autocomplete
* Chips
* Custom templates for options, header, footer etc..

## Installation
```shell
npm -i ngx-mat-combobox
```

## Example

For more details see *projects/demo* application

## Components
 
* **ngx-mat-combobox**

| @Input | Type | Description |
| ------ | ---- | ----------- |
| **options** | any[] | List of strings or complex objects. Default []. |
| **valueAccessor** | string or Function | Property of option's object which holds the 'value' or *NgxMatComboboxAccessorFn*. |
| **labelAccessor** | string or Function | Property of option's object which holds the 'label' or *NgxMatComboboxAccessorFn*. |
| **displayAccessor** | or Function | Property of option's object which holds the 'selected label' or *NgxMatComboboxAccessorFn*. If not defined **labelAccessor** will be used. |
| **disabledAccessor** |  or Function | Property of option's object which holds the 'disabled state' or *NgxMatComboboxAccessorFn*. |
| **autoSelect** | boolean | If set, value model is updated when option is activated (e.g. focused by key navigation). Default false. |
| **fillInput** | boolean | If set, search input is updated using *selectedLabelAccessor* value. Works only in single selection mode. Default false. |
| **multiple** | boolean | Multiple selection mode. Default false. |
| **maxValues** | number | Limit maximum selected options. Default 0 (no limit). |
| **autocomplete** | boolean | Autocomplete mode. Default false. |
| **autocompleteMinChars** | number | Default 0. |
| **autocompleteDebounceInterval** | number | Default 400. |
| **useChips** | boolean | Default false. |
| **disableChipsRipple** | boolean | Default false. |
| **disableChipsRemove**| boolean | Default false. |
| **dropdownOffsetX** | number | Default 0. |
| **dropdownOffsetY** | number | Default 0. |
| **dropdownAutoFocus** | boolean | Default false. |
| **dropdownTrapFocus** | boolean | Default false. |
| **noOptionText** | string | Default 'No Results'. |
| **mapOptionsFn** | NgxMatComboboxMapOptionsFn | Default undefined. |
| **filterOptionsFn** | NgxMatComboboxFilterOptionsFn | Default undefined. |


| @Output | Type | Description |
| ------- | ---- | ----------- |


| Property | Type | Description |
| -------- | ---- | ----------- |
| **opened** | boolean | |
| **openedChange** | Observable<boolean> | |
| **selectedOptions** | Observable<any[]> | |
| **filteredOptions** | Observable<any[]> | |
| **selectionChange** | Observable<any[]> | |
| **input?** | NgxMatComboboxInput | |


| Method | type | Description |
| ------ | ---- | ----------- |
| **openDropdown()** | |
| **closeDropdown()** | |
| **toggleDropdown()** | |
| **selectOption(option: any)** | |
| **deselectOption(option: any)** | |
| **toggleOption(option: any)** | |
| **clear()** | |
| **filter(query: string)** | |
| **alignDropdown()** | |

Exported as **ngxMatCombobox**


## Directives

* **ngxMatComboboxInput** or **ngx-mat-combobox-input**

Exported as **ngxMatComboboxInput**


## Custom content templates

* **ngxMatComboboxOption** or **ngx-mat-combobox-option**

* **ngxMatComboboxNoOption** or **ngx-mat-combobox-no-option**

* **ngxMatComboboxDisplay** or **ngx-mat-combobox-display**

* **ngxMatComboboxHeader** or **ngx-mat-combobox-header**

* **ngxMatComboboxFooter** or **ngx-mat-combobox-footer**

* **ngxMatComboboxLoading** or **ngx-mat-combobox-loading**

