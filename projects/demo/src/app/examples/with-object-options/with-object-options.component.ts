import { Component, OnInit } from '@angular/core';


interface Movie {
  id: number,
  title: string
}


@Component({
  selector: 'app-with-object-options',
  templateUrl: './with-object-options.component.html',
  styleUrls: ['./with-object-options.component.scss']
})
export class WithObjectOptionsComponent implements OnInit {

  options: Movie[] = [
    {id: 1, title: 'Drive My Car'},
    {id: 2, title: 'Dune'},
    {id: 3, title: 'Paris, 13th District'},
    {id: 4, title: 'Twin Peaks'},
    {id: 5, title: 'Being John Malkovich'},
    {id: 6, title: '2001: A Space Odyssey'},
    {id: 7, title: 'Star Wars'},
    {id: 8, title: 'Play Time'},
    {id: 9, title: 'American Beauty'},
    {id: 10, title: 'Big Lebowski'},
  ].sort((a, b) => a.title.localeCompare(b.title));

  singleModel: Movie | null = null;

  multiModel: Movie[] = [];

  valueMultiModel: number[] = [];

  readonly: boolean = false;

  disabled: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  setRandomValue() {
    this.singleModel = this.options[Math.floor(Math.random() * this.options.length)];

    const options: Movie[] = [];
    const values: number[] = [];
    while(values.length < 3){
      let o: Movie = this.options[Math.floor(Math.random() * this.options.length)];
      options.indexOf(o) == -1 && options.push(o);
      values.indexOf(o.id) == -1 && values.push(o.id);
    }
    this.multiModel = options;
    this.valueMultiModel = values;
  }

  clearValue() {
    this.singleModel = null;
    this.multiModel = [];
    this.valueMultiModel = [];
  }

}
