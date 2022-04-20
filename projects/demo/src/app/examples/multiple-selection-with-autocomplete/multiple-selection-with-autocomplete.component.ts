import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiple-selection-with-autocomplete',
  templateUrl: './multiple-selection-with-autocomplete.component.html',
  styleUrls: ['./multiple-selection-with-autocomplete.component.scss']
})
export class MultipleSelectionWithAutocompleteComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'John Malkovich', 'Robin Williams', 'Kyle MacLachlan'
  ].sort((a, b) => a.localeCompare(b));

  model: string[] = [];

  maxValues: number = 0;

  noWrap: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  setRandomValue() {
    const value: string[] = [];
    while(value.length < 3){
      let o = this.options[Math.floor(Math.random() * this.options.length)];
      value.indexOf(o) == -1 && value.push(o);
    }
    this.model = value;
  }

  clearValue() {
    this.model = [];
  }

}
