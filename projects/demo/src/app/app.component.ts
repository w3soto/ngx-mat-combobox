import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import * as pkg from '../../../../projects/ngx-mat-combobox/package.json';
import { ExampleViewerComponent } from "./example-viewer/example-viewer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('content', {static: true})
  content!: ElementRef;

  @ViewChildren(ExampleViewerComponent)
  examples!: QueryList<ExampleViewerComponent>;

  pkg: object = pkg;

  constructor() {
  }

  ngOnInit(): void {
  }

}
