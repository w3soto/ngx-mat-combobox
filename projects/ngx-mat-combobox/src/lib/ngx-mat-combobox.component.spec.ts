import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatComboboxComponent } from './ngx-mat-combobox.component';

describe('NgxMatComboboxComponent', () => {
  let component: NgxMatComboboxComponent;
  let fixture: ComponentFixture<NgxMatComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxMatComboboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMatComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
