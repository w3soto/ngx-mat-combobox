import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-selection-with-autocomplete',
  templateUrl: './single-selection-with-autocomplete.component.html',
  styleUrls: ['./single-selection-with-autocomplete.component.scss']
})
export class SingleSelectionWithAutocompleteComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'John Malkovich', 'Robin Williams', 'Kyle MacLachlan'
  ].sort((a, b) => a.localeCompare(b));

  model: string | null = null;

  readonly: boolean = false;

  disabled: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  setRandomValue() {
    this.model = this.options[Math.floor(Math.random() * this.options.length)];
  }

  clearValue() {
    this.model = null;
  }

}
