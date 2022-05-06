import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss']
})
export class ErrorStateComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'John Malkovich', 'Robin Williams', 'Kyle MacLachlan'
  ].sort((a, b) => a.localeCompare(b));

  formControl: FormControl = new FormControl(null, Validators.required);

  constructor() { }

  ngOnInit(): void {
  }

  setRandomValue() {
    const value = this.options[Math.floor(Math.random() * this.options.length)];
    this.formControl.setValue(value);
  }

  clearValue() {
    this.formControl.setValue(null);
  }

}
