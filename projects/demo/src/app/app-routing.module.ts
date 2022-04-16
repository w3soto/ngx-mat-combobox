import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleSelectionComponent } from "./examples/single-selection/single-selection.component";
import { SingleSelectionWithAutocompleteComponent } from "./examples/single-selection-with-autocomplete/single-selection-with-autocomplete.component";

export const routes: Routes = [
  {
    path: 'single-selection',
    component: SingleSelectionComponent,
    data: {
      title: 'Single Selection'
    }
  },
  {
    path: 'single-selection-with-autocomplete',
    component: SingleSelectionWithAutocompleteComponent,
    data: {
      title: 'Single Selection with Autocomplete'
    }
  },
  {
    path: '**',
    redirectTo: 'single-selection'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {paramsInheritanceStrategy: 'always'} )],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
