import { Component, ViewChild } from '@angular/core';
import { filter, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { NgxMatCombobox } from "../../../../../ngx-mat-combobox/src/lib/ngx-mat-combobox.component";


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}


@Component({
  selector: 'app-remote-data-demo',
  templateUrl: './remote-data-demo.component.html',
  styleUrls: ['./remote-data-demo.component.scss']
})
export class RemoteDataDemoComponent {

  options: User[] = [];
  model: number[] | null = null;

  // remote filtering and pagination
  query: string = '';
  page: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  hasNextPage: boolean = true;

  @ViewChild('combo', {static: true})
  combo!: NgxMatCombobox;

  private _baseUrl = 'https://dummyjson.com/users/search?select=firstName,lastName,email,image,id';

  constructor(
    private _http: HttpClient
  ) {
  }

  setRandomValue() {
    const values: number[] = [];
    while(values.length < 3){
      let o = Math.floor(Math.random() * 100);
      values.indexOf(o) == -1 && values.push(o);
    }
    this.model = values;
  }

  clearValue() {
    this.model = null;
  }

  getUserName(option: User) {
    return option.firstName + ' ' + option.lastName;
  }

  mapUsers(userIds: number[]) {
    // in real world, here we should filter by ID, but such filter is not provided by dummyjson.com
    return this._http.get(`${this._baseUrl}&skip=0&limit=100&q=`)
      .pipe(
        map((resp: any) => userIds.map(id => resp.users.find((u: any) => u.id == id)))
      );
  }

  filterUsers(query: string) {
    query = query.toLowerCase();

    // reset page on new query
    if (this.query != query) {
      this.page = 0;
    }
    this.query = query;

    const skip = this.page * this.pageSize;
    return this._http.get(`${this._baseUrl}&q=${query}&skip=${skip}&limit=${this.pageSize}`)
      .pipe(
        tap((resp: any) => {
          this.totalPages = Math.floor(resp.total / this.pageSize) + (resp.total % this.pageSize > 0 ? 1 : 0);
          this.hasNextPage = resp.total > this.pageSize * (this.page + 1);
          this.hasPrevPage = this.page > 0;
        }),
        map((resp: any) => resp.users)
      );
  }

  onOpenedChange(opened: boolean) {
    // reset page when dropdown is closed
    if (!opened) {
      this.page = 0;
    }
  }

  prevPage(e: Event) {
    this.page = Math.max(--this.page, 0);
    this.combo.filter(this.query);
  }

  nextPage(e: Event) {
    this.page++;
    this.combo.filter(this.query);
  }

  addNewUser() {
    alert('Add new user [' + this.query + ']...')
  }

}
