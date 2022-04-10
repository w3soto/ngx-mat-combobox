import { NgModule } from '@angular/core';
import {
  NgxMatCombobox,
  NgxMatComboboxDisplayDirective,
  NgxMatComboboxFooterDirective,
  NgxMatComboboxHeaderDirective,
  NgxMatComboboxInputDirective,
  NgxMatComboboxOptionDirective, NgxMatComboboxOptionRemoveDirective,
} from './ngx-mat-combobox.component';
import { NgxMatComboboxOption } from "./ngx-mat-combobox-option.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPseudoCheckboxModule, MatRippleModule } from "@angular/material/core";
import { A11yModule } from "@angular/cdk/a11y";


@NgModule({
  declarations: [
    NgxMatCombobox,
    NgxMatComboboxOption,
    NgxMatComboboxInputDirective,
    NgxMatComboboxDisplayDirective,
    NgxMatComboboxOptionDirective,
    NgxMatComboboxHeaderDirective,
    NgxMatComboboxFooterDirective,
    NgxMatComboboxOptionRemoveDirective
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
    NgxMatComboboxDisplayDirective,
    NgxMatComboboxOptionDirective,
    NgxMatComboboxHeaderDirective,
    NgxMatComboboxFooterDirective,
    NgxMatComboboxOptionRemoveDirective
  ]
})
export class NgxMatComboboxModule {
}
