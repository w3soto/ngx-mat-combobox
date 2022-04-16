import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithObjectOptionsComponent } from './with-object-options.component';

describe('WithObjectsAsOptionsComponent', () => {
  let component: WithObjectOptionsComponent;
  let fixture: ComponentFixture<WithObjectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithObjectOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithObjectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
