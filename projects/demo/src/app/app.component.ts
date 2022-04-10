import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import {
  NgxMatComboboxArrayDataSource,
  NgxMatComboboxDataSource
} from "../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.model";
import { NgxMatCombobox } from "../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.component";


const USERS: object[] = [
  {id: 13, name:"Annie Lennox", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 16, name:"Billy Corgan", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 8, name:"Bill Murray", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 6, name:"Bono Vox", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 12, name:"Dave Gahan", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 14, name:"James Hetfield", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 10, name:"Jimmy Hendrix", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 7, name:"Jimmy Page", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 9, name:"John Lennon", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 1, name:"John Travolta", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 20, name:"Keith Richards", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 4, name:"Martin Luther", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 5, name:"Michael Jackson", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 19, name:"Mick Jagger", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 15, name:"Patti Smith", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 2, name:"Peter Gabriel", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 3, name:"Peter Jackson", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 11, name:"Robert Plant", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 18, name:"Sinead O'Connor", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
  {id: 17, name:"Stuart Staples", image: "https://i1.sndcdn.com/artworks-8xGhRvr1FRzSASZ6-eCjEnA-t500x500.jpg"},
];

class RemoteUsersDataSource implements NgxMatComboboxDataSource {

  constructor(private data: any[]) {
  }

  loadByValue(value: any) {
    if (!Array.isArray(value)) {
      value = [value];
    }
    return of([...this.data.filter(o => {
      return value.filter((v: any) => o.id == v).length > 0
    })]).pipe(delay(1000));
  }

  loadByQuery(query: string) {
    if (typeof query === 'undefined' && query === null) {
      query = '';
    }
    query = ('' + query).toLowerCase();
    return of([...this.data.filter(o => o.name.toLowerCase().indexOf(query) > -1)])
      .pipe(delay(1000));
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'demo';

  example1?: number[] = [1,2,3,4];
  example2?: number = 4;

  example3?: number[] = [9,11];
  example4?: number[] = [3,7];

  example5?: number[] = [8,12,16,18,14,10,6,4,1,3];
  example6?: number[] = [5,9,13,19,17,3,11,7];

  datasourceType: string = 'local';

  localDatasource = USERS;

  remoteDatasource = new RemoteUsersDataSource(USERS);

  @ViewChild('customSearchInput')
  searchInput?: ElementRef;

  @ViewChild('example1Combo', {static: true})
  example1Combo!: NgxMatCombobox;

  constructor(
  ) {
  }

  ngOnInit() {
  }

  getDatasource() {
    return this.datasourceType == 'local' ? this.localDatasource : this.remoteDatasource;
  }

  dropdownOpened(opened: boolean) {

  }

  typeAhead(e: Event){
    console.log('typeahead')
    //this.example1Datasource.loadFilteredOptions(query);
  }

}
