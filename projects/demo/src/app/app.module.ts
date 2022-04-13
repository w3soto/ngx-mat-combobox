import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
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

import { NgxMatComboboxModule } from "../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.module";
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';

import { SingleSelectionComponent } from './examples/single-selection/single-selection.component';
import { MultipleSelectionComponent } from "./examples/multiple-selection/multiple-selection.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";


// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    ExampleViewerComponent,

    SingleSelectionComponent,
    MultipleSelectionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    HighlightModule,

    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
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
    }
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
