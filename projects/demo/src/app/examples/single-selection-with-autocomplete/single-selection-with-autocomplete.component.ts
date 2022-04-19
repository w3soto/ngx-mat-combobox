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

  fillInput: boolean = false;

  autocompleteMinChars: number = 0;

  autocompleteDebounceInterval: number = 400;

  get placeholder() {
    const c = this.autocompleteMinChars;
    if (c > 0) {
      return `Type at least ${c} character${c > 1 ? 's' : ''}...`;
    }
    return 'Search...';
  }

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
