import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomContentTemplatesComponent } from './custom-content-templates.component';

describe('CustomContentTemplatesComponent', () => {
  let component: CustomContentTemplatesComponent;
  let fixture: ComponentFixture<CustomContentTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomContentTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomContentTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
