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

  scrollTo(e: MouseEvent) {

    const anchor = (e.target as HTMLElement).closest('a')!.getAttribute('href')!;
    //console.log(e.target, anchor);
    window.scrollTo({
      top: (document.querySelector(anchor)! as HTMLElement).offsetTop - 64,
      behavior: 'smooth'
    });
    history.pushState(anchor, '', anchor);

    e.preventDefault();
  }

}
