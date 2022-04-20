import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSelectionWithAutocompleteComponent } from './multiple-selection-with-autocomplete.component';

describe('MultipleSelectionWithAutocompleteComponent', () => {
  let component: MultipleSelectionWithAutocompleteComponent;
  let fixture: ComponentFixture<MultipleSelectionWithAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleSelectionWithAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleSelectionWithAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
