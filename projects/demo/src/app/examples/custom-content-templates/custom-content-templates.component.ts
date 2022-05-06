import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxMatCombobox } from "../../../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.component";

@Component({
  selector: 'app-custom-content-templates',
  templateUrl: './custom-content-templates.component.html',
  styleUrls: ['./custom-content-templates.component.scss']
})
export class CustomContentTemplatesComponent implements OnInit {

  options: string[] = [
    'Tom Hanks', 'Jack Nicholson', 'Anthony Hopkins', 'Morgan Freeman', 'Al Pacino',
    'Samuel L. Jackson', 'Dustin Hoffman', 'John Malkovich', 'Robin Williams', 'Kyle MacLachlan'
  ].sort((a, b) => a.localeCompare(b));

  model: string[] = [];

  @ViewChild('combo', {static: true})
  combo!: NgxMatCombobox;

  allSelected: boolean = false;

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

  toggleAll() {
    this.allSelected ? this.combo.clear() : this.combo.selectAllOptions();
  }

  selectionChanged(val: any[]) {
    this.allSelected = val.length == this.options.length;
  }

  getFooterText() {
    const count = this.combo.selectedOptions.value.length;
    return `You have selected ${count} actor${ count == 0 || count > 1 ? 's' : ''}`;
  }

}
