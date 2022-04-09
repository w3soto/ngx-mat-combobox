import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import {
  NgxMatComboboxArrayDataSource,
  NgxMatComboboxDataSource
} from "../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.model";


const USERS: object[] = [
  {id: 13, name:"Annie Lennox"},
  {id: 16, name:"Billy Corgan"},
  {id: 8, name:"Bill Murray"},
  {id: 6, name:"Bono Vox"},
  {id: 12, name:"Dave Gahan"},
  {id: 14, name:"James Hetfield"},
  {id: 10, name:"Jimmy Hendrix"},
  {id: 7, name:"Jimmy Page"},
  {id: 9, name:"John Lennon"},
  {id: 1, name:"John Travolta"},
  {id: 20, name:"Keith Richards"},
  {id: 4, name:"Martin Luther"},
  {id: 5, name:"Michael Jackson"},
  {id: 19, name:"Mick Jagger"},
  {id: 15, name:"Patti Smith"},
  {id: 2, name:"Peter Gabriel"},
  {id: 3, name:"Peter Jackson"},
  {id: 11, name:"Robert Plant"},
  {id: 18, name:"Sinead O'Connor"},
  {id: 17, name:"Stuart Staples"},
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

  example1?: number | null = 2;
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

  ngOnInit() {
  }

  getDatasource() {
    return this.datasourceType == 'local' ? this.localDatasource : this.remoteDatasource;
  }

  dropdownOpened(state: boolean) {
    this.searchInput?.nativeElement.focus()
  }

  typeAhead(e: Event){
    console.log('typeahead')
    //this.example1Datasource.loadFilteredOptions(query);
  }

}
