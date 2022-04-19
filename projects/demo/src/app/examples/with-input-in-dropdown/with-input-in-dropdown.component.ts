import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-with-input-in-dropdown',
  templateUrl: './with-input-in-dropdown.component.html',
  styleUrls: ['./with-input-in-dropdown.component.scss']
})
export class WithInputInDropdownComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'John Malkovich', 'Robin Williams', 'Kyle MacLachlan'
  ].sort((a, b) => a.localeCompare(b));

  model: string | null = null;

  autoOpen: boolean = false;

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
