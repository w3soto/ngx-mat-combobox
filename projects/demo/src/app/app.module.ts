import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";

import { NgxMatComboboxModule } from "../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.module";
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';

import { SingleSelectionComponent } from './examples/single-selection/single-selection.component';
import { MultipleSelectionComponent } from "./examples/multiple-selection/multiple-selection.component";
import { SingleSelectionWithAutocompleteComponent } from './examples/single-selection-with-autocomplete/single-selection-with-autocomplete.component';
import { WithChipsComponent } from './examples/with-chips/with-chips.component';
import { RemoteDataDemoComponent } from "./examples/remote-data-demo/remote-data-demo.component";
import { WithObjectOptionsComponent } from "./examples/with-object-options/with-object-options.component";
import { DropdownPositionAndStyleComponent } from './examples/dropdown-position-and-style/dropdown-position-and-style.component';
import { WithInputInDropdownComponent } from "./examples/with-input-in-dropdown/with-input-in-dropdown.component";
import { ErrorStateComponent } from './examples/error-state/error-state.component';
import { MultipleSelectionWithAutocompleteComponent } from './examples/multiple-selection-with-autocomplete/multiple-selection-with-autocomplete.component';
import { CustomContentTemplatesComponent } from './examples/custom-content-templates/custom-content-templates.component';

import {
  NGX_MAT_COMBOBOX_DEFAULT_OPTIONS,
  NgxMatComboboxDefaultOptions
} from "../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.model";


// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    ExampleViewerComponent,
    SingleSelectionComponent,
    SingleSelectionWithAutocompleteComponent,
    MultipleSelectionComponent,
    MultipleSelectionWithAutocompleteComponent,
    ErrorStateComponent,
    WithChipsComponent,
    WithObjectOptionsComponent,
    DropdownPositionAndStyleComponent,
    WithInputInDropdownComponent,
    RemoteDataDemoComponent,
    CustomContentTemplatesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    HighlightModule,

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatChipsModule,
    MatListModule,

    NgxMatComboboxModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        // @ts-ignore
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, verticalPosition: 'top'}
    },
    // {
    //   provide: NGX_MAT_COMBOBOX_DEFAULT_OPTIONS, useValue: {
    //     autocompleteMinChars: 3,
    //     autocompleteDebounceInterval: 250,
    //     loadingSpinnerStrokeWidth: 4,
    //     loadingSpinnerColor: 'accent',
    //     showToggleTrigger: false,
    //     dropdownMatchFieldWidth: false
    //   } as NgxMatComboboxDefaultOptions
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    iconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer) {

    iconRegistry.addSvgIcon('github',
      domSanitizer.bypassSecurityTrustResourceUrl(`./assets/github.svg`));
  }

}
