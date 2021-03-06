import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";


@Component({
  selector: 'app-single-selection',
  templateUrl: './single-selection.component.html',
  styleUrls: ['./single-selection.component.scss']
})
export class SingleSelectionComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'John Malkovich', 'Robin Williams', 'Kyle MacLachlan'
  ].sort((a, b) => a.localeCompare(b));

  model: string | null = null;

  autoActivate: boolean = false;

  autoSelect: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  setRandomValue() {
    const value = this.options[Math.floor(Math.random() * this.options.length)]
    this.model = value;
  }

  clearValue() {
    this.model = null;;
  }

}
