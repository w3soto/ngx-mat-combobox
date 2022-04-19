import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithInputInDropdownComponent } from './with-input-in-dropdown.component';

describe('withInputInDropdownComponent', () => {
  let component: WithInputInDropdownComponent;
  let fixture: ComponentFixture<WithInputInDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithInputInDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithInputInDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
