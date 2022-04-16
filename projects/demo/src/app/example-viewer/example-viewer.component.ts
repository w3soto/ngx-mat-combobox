import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
})
export class ExampleViewerComponent implements OnInit {

  readonly baseDir: string = './app/examples';

  @Input()
  id: string = '';

  @Input()
  title: string = '';

  @Input()
  set forComponent(cmp: string) {
    this._cmp = cmp.replace('app-', '');
  }
  private _cmp: string = '';

  @ContentChild(TemplateRef)
  descriptionTpl?: TemplateRef<any>;

  tsCode: string = '';
  htmlCode: string = '';
  scssCode: string = '';

  showCode: boolean = false;

  constructor(
    private _http: HttpClient,
    private _snachBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCode('ts');
    this.loadCode('scss');
    this.loadCode('html');
  }

  loadCode(type: string) {
    this._http.get(
      `${this.baseDir}/${this._cmp}/${this._cmp}.component.${type}`,
      {responseType: 'text'})
      .subscribe(code => {
        switch (type) {
          case 'ts': this.tsCode = code.trim(); break;
          case 'html': this.htmlCode = code.trim(); break;
          case 'scss': this.scssCode = code.trim(); break;
        }
      });
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code)
      .then(() => this._snachBar.open('Code copied!'))
      .catch(() => this._snachBar.open('Whoooops! Something goes wrong :( ...'));
  }

}
