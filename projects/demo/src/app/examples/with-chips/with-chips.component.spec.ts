import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithChipsComponent } from './with-chips.component';

describe('WithChipsComponent', () => {
  let component: WithChipsComponent;
  let fixture: ComponentFixture<WithChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
