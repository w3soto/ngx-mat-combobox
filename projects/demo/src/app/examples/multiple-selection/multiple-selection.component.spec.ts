import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectionAutocompleteComponent } from './single-selection-autocomplete.component';

describe('SingleSelectionAutocompleteComponent', () => {
  let component: SingleSelectionAutocompleteComponent;
  let fixture: ComponentFixture<SingleSelectionAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSelectionAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectionAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
