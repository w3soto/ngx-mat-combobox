import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-with-chips',
  templateUrl: './with-chips.component.html',
  styleUrls: ['./with-chips.component.scss']
})
export class WithChipsComponent implements OnInit {

  options: string[] = ['Drive My Car', 'Dune', 'Paris, 13th District', 'Twin Peaks', 'Being John Malkovich',
    '2001: A Space Odyssey', 'Star Wars', 'Play Time', 'American Beauty', 'Big Lebowski'
  ].sort((a, b) => a.localeCompare(b));

  singleModel: string | null = null;
  multiModel: string[] | null = null;

  useChips: boolean = true;
  disableChipsRipple: boolean = false;
  disableChipsRemove: boolean = false;

  readonly: boolean = false;
  disabled: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  setRandomValue() {
    this.singleModel = this.options[Math.floor(Math.random() * this.options.length)];

    const values: string[] = [];
    while(values.length < 3){
      let o = this.options[Math.floor(Math.random() * this.options.length)];
      values.indexOf(o) == -1 && values.push(o);
    }
    this.multiModel = values;
  }

  clearValue() {
    this.singleModel = null;
    this.multiModel = null;
  }

}
