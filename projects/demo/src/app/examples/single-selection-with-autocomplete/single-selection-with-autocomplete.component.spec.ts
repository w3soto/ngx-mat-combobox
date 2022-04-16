import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectionWithAutocompleteComponent } from './single-selection-with-autocomplete.component';

describe('SingleSelectionWithAutocompleteComponent', () => {
  let component: SingleSelectionWithAutocompleteComponent;
  let fixture: ComponentFixture<SingleSelectionWithAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSelectionWithAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectionWithAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
