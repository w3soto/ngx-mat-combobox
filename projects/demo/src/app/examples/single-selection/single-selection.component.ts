import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-selection',
  templateUrl: './single-selection.component.html',
  styleUrls: ['./single-selection.component.scss']
})
export class SingleSelectionComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'Robin Williams', 'Kyle MacLachlan'
  ];

  model: string | null = null;

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
