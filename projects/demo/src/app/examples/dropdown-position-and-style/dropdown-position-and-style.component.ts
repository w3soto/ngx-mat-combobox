import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-position-and-style',
  templateUrl: './dropdown-position-and-style.component.html',
  styleUrls: ['./dropdown-position-and-style.component.scss']
})
export class DropdownPositionAndStyleComponent implements OnInit {

  // options
  colors: string[] = [
    'crimson',
    'orangered',
    'darkorange',
    'orange',
    'gold',
    'yellow',
    'greenyellow',
    'mediumseagreen',
    'lightseagreen',
    'steelblue',
    'mediumslateblue',
    'blueviolet',
    'indigo'
  ];

  // model
  preferredColor?: string;

  // config
  dropdownMatchFieldWidth: boolean = true;
  dropdownAlign = 'start';
  dropdownBehavior = 'standard';
  dropdownOffsetX: number = 0;
  dropdownOffsetY: number = 0;

  applyDropdownClass: boolean = false;
  dropdownBackdrop: boolean = false;
  applyDropdownBackdropClass: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  setRandomValue() {
    this.preferredColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  clearValue() {
    this.preferredColor = '';
  }

}
