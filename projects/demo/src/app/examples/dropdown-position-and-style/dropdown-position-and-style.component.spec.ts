import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPositionAndStyleComponent } from './dropdown-position-and-style.component';

describe('DropdownPositionAndStyleComponent', () => {
  let component: DropdownPositionAndStyleComponent;
  let fixture: ComponentFixture<DropdownPositionAndStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownPositionAndStyleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownPositionAndStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
