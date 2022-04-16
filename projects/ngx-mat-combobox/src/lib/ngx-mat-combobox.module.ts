import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { OverlayModule } from "@angular/cdk/overlay";
import { A11yModule } from "@angular/cdk/a11y";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPseudoCheckboxModule, MatRippleModule } from "@angular/material/core";


import {
  NgxMatCombobox,
  NgxMatComboboxDisplayDirective,
  NgxMatComboboxFooterDirective,
  NgxMatComboboxHeaderDirective, NgxMatComboboxNoOptionDirective,
  NgxMatComboboxOptionDirective,
} from './ngx-mat-combobox.component';
import { NgxMatComboboxOption } from "./ngx-mat-combobox-option.component";
import { NgxMatComboboxInputDirective } from "./ngx-mat-combobox-input.directive";
import { NgxMatComboboxChipRemoveDirective } from "./ngx-mat-combobox-chip-remove.directive";


@NgModule({
  declarations: [
    NgxMatCombobox,
    NgxMatComboboxOption,
    NgxMatComboboxInputDirective,
    NgxMatComboboxChipRemoveDirective,
    NgxMatComboboxDisplayDirective,
    NgxMatComboboxOptionDirective,
    NgxMatComboboxHeaderDirective,
    NgxMatComboboxFooterDirective,
    NgxMatComboboxNoOptionDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    OverlayModule,
    A11yModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPseudoCheckboxModule,
    MatRippleModule
  ],
  exports: [
    NgxMatCombobox,
    NgxMatComboboxOption,
    NgxMatComboboxInputDirective,
    NgxMatComboboxChipRemoveDirective,
    NgxMatComboboxDisplayDirective,
    NgxMatComboboxOptionDirective,
    NgxMatComboboxHeaderDirective,
    NgxMatComboboxFooterDirective,
    NgxMatComboboxNoOptionDirective
  ]
})
export class NgxMatComboboxModule {
}
